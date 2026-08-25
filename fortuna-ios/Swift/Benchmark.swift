//
//  Benchmark.swift
//  Fortuna — Phase 0 measurement harness
//
//  The whole learning method rests on this file: before optimizing anything,
//  you must be able to MEASURE it. Every later experiment (quantization,
//  CoreML backend, KV cache tuning) is judged by the numbers this produces.
//
//  Runner-agnostic by design: it wraps whatever generation API you use
//  (ExecuTorch LLaMARunner today, llama.cpp later). You feed it timing signals;
//  it computes the metrics and prints a row you paste into LEARNING_ROADMAP.md.
//

import Foundation

/// One measured generation run.
struct BenchmarkResult {
    let label: String          // e.g. "qwen3-0.6b int8 xnnpack"
    let modelSizeMB: Double
    let loadTimeMs: Double
    let ttftMs: Double         // prefill latency: submit -> first token
    let decodeTokPerSec: Double// steady-state generation (eq. 1)
    let promptTokens: Int
    let genTokens: Int
    let peakMemoryMB: Double

    /// Markdown table row matching the Results log in LEARNING_ROADMAP.md.
    var markdownRow: String {
        let f = { (v: Double) in String(format: "%.1f", v) }
        return "| \(label) | \(f(modelSizeMB)) | \(f(loadTimeMs)) | \(f(ttftMs)) "
             + "| \(f(decodeTokPerSec)) | \(f(peakMemoryMB)) | prompt=\(promptTokens) gen=\(genTokens) |"
    }
}

/// Records timing signals during a single generation and computes metrics.
///
/// Usage pattern (inside whatever streaming callback your runner exposes):
///
///   let rec = BenchmarkRecorder(label: "...", modelSizeMB: size, loadTimeMs: load)
///   rec.start(promptTokens: promptCount)        // call right before submitting
///   // ...in the per-token callback:
///   rec.recordToken()                            // call once per generated token
///   // ...after generation finishes:
///   let result = rec.finish()
///   print(result.markdownRow)
///
final class BenchmarkRecorder {
    private let label: String
    private let modelSizeMB: Double
    private let loadTimeMs: Double

    private var startTime: DispatchTime?
    private var firstTokenTime: DispatchTime?
    private var lastTokenTime: DispatchTime?
    private var promptTokens = 0
    private var genTokens = 0
    private var peakMemoryMB = 0.0

    init(label: String, modelSizeMB: Double, loadTimeMs: Double) {
        self.label = label
        self.modelSizeMB = modelSizeMB
        self.loadTimeMs = loadTimeMs
    }

    /// Call immediately before you submit the prompt to the runner.
    func start(promptTokens: Int) {
        self.promptTokens = promptTokens
        self.startTime = .now()
        sampleMemory()
    }

    /// Call once for every token the runner emits.
    /// The FIRST call marks TTFT (prefill done). Subsequent calls feed throughput.
    func recordToken() {
        let now = DispatchTime.now()
        if firstTokenTime == nil { firstTokenTime = now }   // prefill boundary
        lastTokenTime = now
        genTokens += 1
        sampleMemory()
    }

    /// Call after generation completes. Returns the computed result.
    func finish() -> BenchmarkResult {
        let ttft = ms(from: startTime, to: firstTokenTime)
        // Throughput is measured over the DECODE window only (first->last token),
        // excluding prefill, so it isolates eq. 1's bandwidth-bound behavior.
        let decodeWindowMs = ms(from: firstTokenTime, to: lastTokenTime)
        let decodeTokens = max(genTokens - 1, 0)   // intervals between tokens
        let tokPerSec = decodeWindowMs > 0 ? Double(decodeTokens) / (decodeWindowMs / 1000.0) : 0

        return BenchmarkResult(
            label: label,
            modelSizeMB: modelSizeMB,
            loadTimeMs: loadTimeMs,
            ttftMs: ttft,
            decodeTokPerSec: tokPerSec,
            promptTokens: promptTokens,
            genTokens: genTokens,
            peakMemoryMB: peakMemoryMB
        )
    }

    // MARK: - Helpers

    private func ms(from a: DispatchTime?, to b: DispatchTime?) -> Double {
        guard let a = a, let b = b else { return 0 }
        return Double(b.uptimeNanoseconds &- a.uptimeNanoseconds) / 1_000_000.0
    }

    /// Resident memory of THIS process, in MB. We poll it across the run and keep
    /// the max — that peak is what determines whether a bigger model OOMs on device.
    private func sampleMemory() {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(
            MemoryLayout<mach_task_basic_info>.size / MemoryLayout<natural_t>.size)
        let kerr = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: Int(count)) {
                task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
            }
        }
        guard kerr == KERN_SUCCESS else { return }
        let mb = Double(info.resident_size) / 1_048_576.0
        peakMemoryMB = max(peakMemoryMB, mb)
    }
}

/// Reads a bundled model file's size on disk (MB) — the eq. 1 input.
func modelSizeMB(resource: String, ext: String = "pte") -> Double {
    guard let path = Bundle.main.path(forResource: resource, ofType: ext),
          let attrs = try? FileManager.default.attributesOfItem(atPath: path),
          let bytes = attrs[.size] as? NSNumber else { return 0 }
    return bytes.doubleValue / 1_048_576.0
}
