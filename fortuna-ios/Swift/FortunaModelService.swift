//
//  FortunaModelService.swift
//  Fortuna
//
//  ExecuTorch model service for loading and running Qwen3-0.6B model
//  Updated for actual ExecuTorch LLM integration
//

import Foundation
// REQUIRED: add the ExecuTorch Swift package via SPM, then these resolve.
// The LLaMA text runner ships in ExecuTorch's `extension/llm/apple` target.
// (Symbol names track the upstream LLaMA demo app; if your ExecuTorch version
//  renamed `Runner`, adjust the typealias below — that's the only touch point.)
import ExecuTorchLLM

/// The ExecuTorch text-generation runner. Aliased so the rest of this file is
/// insulated from upstream renames across ExecuTorch versions.
private typealias LLMRunner = TextRunner

/// Service for managing Fortuna's on-device LLM model
class FortunaModelService {

    // MARK: - Properties

    private var runner: LLMRunner?
    private var isLoaded = false

    /// How long the last `loadModel` took (ms). Feeds the benchmark harness.
    private(set) var lastLoadTimeMs: Double = 0
    /// Size on disk of the currently loaded model (MB) — eq. 1 input.
    private(set) var loadedModelSizeMB: Double = 0
    /// Metrics from the most recent generation. Read this after `generate(...)`.
    private(set) var lastBenchmark: BenchmarkResult?
    
    /// Model quantization level
    enum Quantization: String {
        case int8 = "q8"    // Maps to fortuna_q8.pte
        case int4 = "q4"    // Maps to fortuna_q4.pte (if available)
        
        var modelFileName: String {
            return "fortuna_\(rawValue)"
        }
    }
    
    /// Errors that can occur during model operations
    enum ModelError: LocalizedError {
        case modelNotFound
        case modelNotLoaded
        case tokenizerNotFound
        case inferenceFailed(String)
        case tokenizationFailed
        case resourceNotFound(String)
        
        var errorDescription: String? {
            switch self {
            case .modelNotFound:
                return "Model file not found in bundle"
            case .modelNotLoaded:
                return "Model is not loaded. Call loadModel() first."
            case .tokenizerNotFound:
                return "Tokenizer file not found in bundle"
            case .inferenceFailed(let reason):
                return "Inference failed: \(reason)"
            case .tokenizationFailed:
                return "Failed to tokenize input text"
            case .resourceNotFound(let name):
                return "Resource not found: \(name)"
            }
        }
    }
    
    // MARK: - Model Loading
    
    /// Loads the model with specified quantization level
    /// - Parameter quantization: .int8 for better quality, .int4 for smaller size
    /// - Throws: ModelError if loading fails
    func loadModel(quantization: Quantization = .int8) throws {
        // Determine which model to use based on device capabilities
        let selectedQuantization = selectOptimalQuantization(quantization)
        
        // Find model path in bundle
        guard let modelPath = Bundle.main.path(
            forResource: selectedQuantization.modelFileName,
            ofType: "pte"
        ) else {
            // Try alternate naming convention
            if let altPath = Bundle.main.path(forResource: "fortuna_\(selectedQuantization.rawValue)", ofType: "pte") {
                try loadModelFromPath(altPath)
                return
            }
            throw ModelError.modelNotFound
        }
        
        try loadModelFromPath(modelPath)
    }
    
    /// Load model from a specific file path
    private func loadModelFromPath(_ path: String) throws {
        print("📱 Loading Fortuna model from: \(path)")

        // Qwen3 ships a HF BPE tokenizer (tokenizer.json). Older SentencePiece
        // exports use tokenizer.model — try json first, fall back to model.
        let tokenizerPath = Bundle.main.path(forResource: "tokenizer", ofType: "json")
            ?? Bundle.main.path(forResource: "tokenizer", ofType: "model")
        guard let tokenizerPath else { throw ModelError.tokenizerNotFound }
        print("📝 Loading tokenizer from: \(tokenizerPath)")

        // --- Construct + load the runner, timing the load. ---
        // Load time is mostly mmap + backend init; we record it so startup cost
        // is a tracked metric, not a mystery.
        let t0 = DispatchTime.now()
        let runner = LLMRunner(modelPath: path, tokenizerPath: tokenizerPath)
        try runner.load()
        let t1 = DispatchTime.now()

        self.runner = runner
        self.lastLoadTimeMs = Double(t1.uptimeNanoseconds &- t0.uptimeNanoseconds) / 1_000_000.0
        self.loadedModelSizeMB = (try? FileManager.default
            .attributesOfItem(atPath: path)[.size] as? NSNumber)?.doubleValue
            .map { $0 / 1_048_576.0 } ?? 0
        self.isLoaded = true
        print(String(format: "✅ Model loaded in %.0f ms (%.0f MB)", lastLoadTimeMs, loadedModelSizeMB))
    }
    
    /// Automatically selects optimal quantization based on device
    private func selectOptimalQuantization(_ preferred: Quantization) -> Quantization {
        // For iPhone 13 and newer (>4GB RAM), prefer INT8 for better quality
        // For iPhone 12 and older, use INT4 to save memory
        if ProcessInfo.processInfo.physicalMemory > 4_000_000_000 {
            return .int8
        }
        return .int4
    }
    
    // MARK: - Inference
    
    /// Generates a response for the given prompt
    /// - Parameters:
    ///   - prompt: Input text prompt
    ///   - maxTokens: Maximum number of tokens to generate
    ///   - temperature: Sampling temperature (0.0-1.0)
    /// - Returns: Generated text response
    /// - Throws: ModelError if inference fails
    func generate(
        prompt: String,
        maxTokens: Int = 256,
        temperature: Float = 0.7
    ) async throws -> String {
        try await runGenerate(prompt: prompt, maxTokens: maxTokens, onToken: { _ in })
    }

    /// Generates streaming tokens (callback for each token)
    func generateStreaming(
        prompt: String,
        maxTokens: Int = 256,
        temperature: Float = 0.7,
        onToken: @escaping (String) -> Void
    ) async throws -> String {
        try await runGenerate(prompt: prompt, maxTokens: maxTokens, onToken: onToken)
    }

    // MARK: - Instrumented generation (the one real code path)

    /// The single place generation actually happens. Every call is measured by
    /// the BenchmarkRecorder, so you can never run inference without metrics.
    ///
    /// The key first-principles move is in the token callback: the FIRST token
    /// marks the prefill→decode boundary (TTFT). Everything after is decode,
    /// which is bandwidth-bound. The recorder keeps those windows separate.
    private func runGenerate(
        prompt: String,
        maxTokens: Int,
        onToken: @escaping (String) -> Void
    ) async throws -> String {
        guard isLoaded, let runner else { throw ModelError.modelNotLoaded }

        let rec = BenchmarkRecorder(
            label: "qwen3-0.6b",
            modelSizeMB: loadedModelSizeMB,
            loadTimeMs: lastLoadTimeMs
        )
        // We don't have a cheap token count for the prompt here; prefill latency
        // (TTFT) is still measured correctly. Fill promptTokens from runner stats
        // in Phase 1 once we expose the tokenizer. For now report characters→0.
        rec.start(promptTokens: 0)

        // ExecuTorch's runner is synchronous and blocks the calling thread while
        // it streams tokens. Run it off the main actor and bridge back via a
        // continuation so callers keep their async/await ergonomics.
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                var full = ""
                do {
                    // VERSION-SENSITIVE TOUCH POINT (the only other one besides the
                    // typealias): match this signature to your ExecuTorch version.
                    // Classic demo shape: generate(_:sequenceLength:tokenCallback:).
                    try runner.generate(prompt, sequenceLength: maxTokens) { token in
                        rec.recordToken()          // first call = TTFT; rest = decode
                        full += token
                        onToken(token)
                    }
                    let result = rec.finish()
                    self.lastBenchmark = result
                    print(result.markdownRow)      // paste into LEARNING_ROADMAP.md
                    continuation.resume(returning: full)
                } catch {
                    continuation.resume(throwing: ModelError.inferenceFailed("\(error)"))
                }
            }
        }
    }

    /// Convenience: run a fixed prompt and return just the metrics. Use this to
    /// produce a clean, comparable benchmark row across builds (Phase 0+).
    func benchmark(
        prompt: String = "Give me one quick tip to start saving money.",
        maxTokens: Int = 128
    ) async throws -> BenchmarkResult {
        _ = try await generate(prompt: prompt, maxTokens: maxTokens)
        guard let result = lastBenchmark else {
            throw ModelError.inferenceFailed("no benchmark captured")
        }
        return result
    }
    
    /// Generates a Financial Vibe profile based on user data
    /// - Parameter userData: Dictionary containing user financial information
    /// - Returns: Generated Financial Vibe profile
    func generateFinancialVibe(userData: [String: Any]) async throws -> String {
        let prompt = formatVibePrompt(userData: userData)
        
        return try await generate(
            prompt: prompt,
            maxTokens: 512,
            temperature: 0.8
        )
    }
    
    /// Generates a chat response with financial context
    /// - Parameters:
    ///   - message: User's message
    ///   - context: Financial context summary
    /// - Returns: AI response
    func chat(message: String, context: String) async throws -> String {
        let prompt = formatChatPrompt(message: message, context: context)
        
        return try await generate(
            prompt: prompt,
            maxTokens: 256,
            temperature: 0.7
        )
    }
    
    // MARK: - Prompt Formatting
    
    /// Formats a chat prompt with the Qwen3 chat template
    private func formatChatPrompt(message: String, context: String) -> String {
        // Qwen3 uses a specific chat template format
        // This matches the chat_template.jinja in the tokenizer
        return """
        <|im_start|>system
        You are Fortuna, a friendly and supportive AI financial advisor for Gen Z users. \
        You help users understand their money and make better financial decisions. \
        Be casual, use simple language, and be encouraging. Keep responses concise (2-3 sentences max).
        
        User's Financial Context:
        \(context)
        <|im_end|>
        <|im_start|>user
        \(message)
        <|im_end|>
        <|im_start|>assistant
        """
    }
    
    /// Formats user data into a prompt for vibe generation
    private func formatVibePrompt(userData: [String: Any]) -> String {
        let age = userData["age"] as? Int ?? 0
        let income = userData["monthlyIncome"] as? Double ?? 0
        let savings = userData["savings"] as? Double ?? 0
        let debts = userData["debts"] as? [[String: Any]] ?? []
        let totalDebt = debts.reduce(0.0) { sum, debt in
            sum + (debt["balance"] as? Double ?? 0)
        }
        
        return """
        <|im_start|>system
        You are Fortuna, a financial advisor that creates personalized "Financial Vibe" profiles. \
        Respond in JSON format only.
        <|im_end|>
        <|im_start|>user
        Based on this data, create a Financial Vibe profile:
        - Age: \(age)
        - Monthly Income: $\(Int(income))
        - Savings: $\(Int(savings))
        - Total Debt: $\(Int(totalDebt))
        
        Assign:
        1. Primary Vibe (from: Main Character Energy, Glow Up in Progress, The Balancer, Planting Seeds, Debt Slayer Mode, Living on the Edge)
        2. Risk Profile (from: Steady Eddie, Calculated Risk-Taker, Bold Moves Only, Mood Dependent)
        3. A 2-3 sentence personalized summary in casual, encouraging Gen Z tone
        4. Top 3 financial priorities
        
        Respond in JSON format.
        <|im_end|>
        <|im_start|>assistant
        """
    }
    
    // MARK: - Memory Management
    
    /// Unloads the model from memory
    func unload() {
        runner = nil
        isLoaded = false
        print("🗑️ Model unloaded")
    }
    
    /// Checks if model is currently loaded
    var isModelLoaded: Bool {
        return isLoaded
    }
    
    // MARK: - Device Info
    
    /// Returns device capability info for debugging
    func getDeviceInfo() -> [String: Any] {
        return [
            "physicalMemory": ProcessInfo.processInfo.physicalMemory,
            "processorCount": ProcessInfo.processInfo.processorCount,
            "isLowPowerModeEnabled": ProcessInfo.processInfo.isLowPowerModeEnabled,
            "recommendedQuantization": selectOptimalQuantization(.int8).rawValue
        ]
    }
}
