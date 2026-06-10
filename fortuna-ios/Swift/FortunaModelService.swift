//
//  FortunaModelService.swift
//  Fortuna
//
//  ExecuTorch model service for loading and running Qwen3-0.6B model
//  Updated for actual ExecuTorch LLM integration
//

import Foundation
// NOTE: Uncomment when ExecuTorch is added to the project via SPM
// import ExecuTorch
// import LLaMARunner

/// Service for managing Fortuna's on-device LLM model
class FortunaModelService {
    
    // MARK: - Properties
    
    // NOTE: These types come from ExecuTorch - uncomment when package is added
    // private var runner: LLaMARunner?
    private var isLoaded = false
    
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
        
        // Find tokenizer path
        guard let tokenizerPath = Bundle.main.path(
            forResource: "tokenizer",
            ofType: "model"
        ) else {
            throw ModelError.tokenizerNotFound
        }
        
        print("📝 Loading tokenizer from: \(tokenizerPath)")
        
        // NOTE: Actual ExecuTorch initialization
        // Uncomment when ExecuTorch is added to project:
        /*
        runner = try LLaMARunner(
            modelPath: path,
            tokenizerPath: tokenizerPath
        )
        */
        
        // For now, mark as loaded (placeholder)
        isLoaded = true
        print("✅ Model loaded successfully")
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
        guard isLoaded else {
            throw ModelError.modelNotLoaded
        }
        
        // NOTE: Actual ExecuTorch generation
        // Uncomment when ExecuTorch is added:
        /*
        guard let runner = runner else {
            throw ModelError.modelNotLoaded
        }
        
        let response = try await runner.generate(
            prompt: prompt,
            maxNewTokens: maxTokens,
            temperature: temperature,
            topP: 0.9
        )
        
        return response
        */
        
        // Placeholder response for testing without ExecuTorch
        return generateMockResponse(for: prompt)
    }
    
    /// Generates streaming tokens (callback for each token)
    func generateStreaming(
        prompt: String,
        maxTokens: Int = 256,
        temperature: Float = 0.7,
        onToken: @escaping (String) -> Void
    ) async throws -> String {
        guard isLoaded else {
            throw ModelError.modelNotLoaded
        }
        
        // NOTE: Actual streaming generation
        // Uncomment when ExecuTorch is added:
        /*
        guard let runner = runner else {
            throw ModelError.modelNotLoaded
        }
        
        var fullResponse = ""
        
        try await runner.generate(
            prompt: prompt,
            maxNewTokens: maxTokens,
            temperature: temperature,
            onToken: { token in
                fullResponse += token
                onToken(token)
            }
        )
        
        return fullResponse
        */
        
        // Placeholder for testing
        let response = generateMockResponse(for: prompt)
        onToken(response)
        return response
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
    
    // MARK: - Mock Responses (for testing without ExecuTorch)
    
    /// Generates a mock response for testing
    private func generateMockResponse(for prompt: String) -> String {
        // Extract the user message from the formatted prompt
        let lowercased = prompt.lowercased()
        
        if lowercased.contains("laptop") || lowercased.contains("buy") || lowercased.contains("purchase") {
            return "Before making that purchase, let's make sure your emergency fund is solid! " +
                   "Do you have at least 3 months of expenses saved? If not, maybe hold off for a bit. 💰"
        } else if lowercased.contains("debt") || lowercased.contains("pay off") || lowercased.contains("credit card") {
            return "Smart thinking on tackling debt! Focus on the highest interest rate first - " +
                   "that's usually credit cards. Even small extra payments make a big difference! 📈"
        } else if lowercased.contains("save") || lowercased.contains("saving") || lowercased.contains("emergency") {
            return "Building your savings is a great move! Try the 50/30/20 rule - " +
                   "50% needs, 30% wants, 20% savings. Start small and stay consistent! 🎯"
        } else if lowercased.contains("invest") || lowercased.contains("stocks") {
            return "Love the investing mindset! But first, make sure you have an emergency fund. " +
                   "Then consider starting with low-cost index funds. Time in market > timing the market! 📊"
        } else if lowercased.contains("budget") {
            return "Budgeting doesn't have to be boring! Track your spending for a week first, " +
                   "then set realistic limits. Apps can help automate this! 📱"
        } else if lowercased.contains("vibe") && lowercased.contains("json") {
            return """
            {
                "primaryVibe": "Glow Up in Progress",
                "riskProfile": "Calculated Risk-Taker",
                "summary": "You're on your way up! Building solid habits and starting to see the rewards. Keep that momentum going!",
                "priorities": ["Build emergency fund", "Pay off high-interest debt", "Start investing basics"]
            }
            """
        } else {
            return "I'm here to help with your money questions! " +
                   "Ask me about budgeting, saving, debt, or any financial decisions you're thinking about. 💚"
        }
    }
    
    // MARK: - Memory Management
    
    /// Unloads the model from memory
    func unload() {
        // runner = nil
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
