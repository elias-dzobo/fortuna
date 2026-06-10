# ExecuTorch Guide for Fortuna

> A comprehensive guide to understanding and using ExecuTorch for deploying AI models on iOS

---

## Table of Contents

1. [What is ExecuTorch?](#1-what-is-executorch)
2. [Why ExecuTorch for Fortuna?](#2-why-executorch-for-fortuna)
3. [How ExecuTorch Works](#3-how-executorch-works)
4. [Key Concepts](#4-key-concepts)
5. [Deployment Workflow](#5-deployment-workflow)
6. [iOS Integration](#6-ios-integration)
7. [Best Practices](#7-best-practices)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. What is ExecuTorch?

**ExecuTorch** is PyTorch's official framework for deploying machine learning models directly on edge devices (mobile phones, tablets, embedded systems, wearables). It's part of PyTorch Edge and was designed to replace older approaches like PyTorch Mobile.

### Key Characteristics

- **End-to-end solution**: From PyTorch model to on-device inference
- **Lightweight runtime**: ~50KB base footprint (only includes needed operators)
- **Hardware acceleration**: Supports NPUs, GPUs, DSPs through backend delegates
- **Production-ready**: Version 1.0 released in October 2024
- **No cloud dependency**: All inference happens locally on device

### Why Not PyTorch Mobile?

| Feature | PyTorch Mobile | ExecuTorch |
|---------|---------------|------------|
| **Model Format** | TorchScript/JIT | Native PyTorch export (`.pte`) |
| **Runtime Size** | Larger (~500KB+) | Smaller (~50KB base) |
| **Hardware Support** | Limited | Extensive (CoreML, MPS, NPUs) |
| **LLM Support** | Challenging | Designed for LLMs |
| **Dynamic Shapes** | Limited | Better support |
| **Quantization** | Basic | Advanced (4-bit, 8-bit) |

---

## 2. Why ExecuTorch for Fortuna?

### Our Requirements

Based on the PRD and INIT docs:

1. **Privacy-first**: All inference must happen on-device
2. **Model**: Qwen3-0.6B (600M parameters)
3. **Target**: iOS (iPhone 12+)
4. **Quantization**: 4-bit and 8-bit versions
5. **Use Cases**: 
   - Financial Vibe generation
   - AI chatbot for financial advice
   - Purchase decision assistance

### Why ExecuTorch Fits Perfectly

✅ **On-device inference** - No data leaves the device  
✅ **LLM optimized** - Built for language models like Qwen3  
✅ **iOS support** - Native Swift/Objective-C APIs  
✅ **Quantization** - Supports 4-bit and 8-bit quantization  
✅ **Hardware acceleration** - Can leverage Apple Neural Engine (ANE) via CoreML  
✅ **Small runtime** - Minimal app size impact  

---

## 3. How ExecuTorch Works

ExecuTorch follows a **3-stage pipeline**:

```
PyTorch Model → Export → Lower/Compile → Execute on Device
```

### Stage 1: Export

**What happens:**
- Use `torch.export()` to capture the model's computation graph
- Creates a portable representation that preserves model semantics
- Requires example inputs to shape the graph

**Code example:**
```python
import torch

model = MyModel().eval()
example_inputs = (torch.randn(1, 3, 224, 224),)

# Export the model
exported_program = torch.export.export(model, example_inputs)
```

**Key points:**
- Model must be in evaluation mode (`model.eval()`)
- Example inputs define input shapes (can be dynamic with bounds)
- No TorchScript needed - uses modern PyTorch compiler

### Stage 2: Lower/Compile

**What happens:**
- Transform the exported model for target hardware
- Apply optimizations (quantization, operator fusion, memory planning)
- Assign subgraphs to hardware delegates (CoreML, MPS, CPU)
- Output a `.pte` file (ExecuTorch program)

**Code example:**
```python
from executorch.backends.xnnpack.partition.xnnpack_partitioner import XnnpackPartitioner
from executorch.exir import to_edge_transform_and_lower

# Lower for CPU (XNNPACK)
edge_program = to_edge_transform_and_lower(
    exported_program,
    partitioner=[XnnpackPartitioner()]
)

# Or for CoreML (iOS Neural Engine)
from executorch.backends.coreml.partition.coreml_partitioner import CoreMLPartitioner
edge_program = to_edge_transform_and_lower(
    exported_program,
    partitioner=[CoreMLPartitioner()]
)

# Convert to ExecuTorch format
et_program = edge_program.to_executorch()

# Save as .pte file
with open("model.pte", "wb") as f:
    f.write(et_program.buffer)
```

**Backend options for iOS:**
- **CoreML**: Uses Apple Neural Engine (ANE) - best performance
- **MPS**: Metal Performance Shaders (GPU) - good for larger models
- **XNNPACK**: CPU fallback - most compatible

### Stage 3: Execute on Device

**What happens:**
- Lightweight C++ runtime loads `.pte` file
- Runtime executes the program
- Delegates operations to hardware accelerators when available
- Returns outputs to the app

**Swift example:**
```swift
import ExecuTorch

// Load model
let modelPath = Bundle.main.path(forResource: "model", ofType: "pte")!
let module = Module(filePath: modelPath)

// Prepare input
let inputTensor = Tensor<Float>(shape: [1, 3, 224, 224], ...)

// Run inference
let outputTensor = try module.forward(inputTensor)
```

---

## 4. Key Concepts

### 4.1 Quantization

**What it is:**
Reducing model precision from 32-bit floats to lower precision (8-bit, 4-bit) to reduce size and improve performance.

**Types:**

1. **Post-Training Quantization (PTQ)**
   - Quantize after training
   - Faster, no retraining
   - Good for less aggressive quantization (8-bit)

2. **Quantization-Aware Training (QAT)**
   - Simulate quantization during training
   - Model learns to be robust to quantization
   - Better for aggressive quantization (4-bit)
   - **What we used for Fortuna**

**ExecuTorch quantization:**
```python
# 8-bit dynamic quantization
--pt2e_quantize xnnpack_dynamic

# 4-bit quantization
--pt2e_quantize xnnpack_dynamic_qc4
```

### 4.2 Backends & Delegates

**Backend**: Hardware-specific implementation (CoreML, MPS, XNNPACK)  
**Delegate**: Runtime mechanism that routes operations to backends

**For Fortuna on iOS:**
- **Primary**: CoreML (uses Neural Engine)
- **Fallback**: XNNPACK (CPU)
- **Optional**: MPS (GPU for larger models)

### 4.3 .pte Files

**What is a .pte file?**
- ExecuTorch program format
- Contains model graph, weights, metadata
- Optimized for on-device loading
- Can be memory-mapped for efficiency

**File structure:**
```
model.pte
├── Program (computation graph)
├── Weights (quantized parameters)
├── Metadata (input/output shapes, types)
└── Backend info (which ops use which backend)
```

### 4.4 Dynamic Shapes

**What it is:**
Models that can handle variable input sizes (e.g., different sequence lengths for text).

**For LLMs like Qwen3:**
- Input tokens can vary (1 to 1024 tokens)
- ExecuTorch supports this with shape bounds

**Example:**
```python
# Define dynamic shape bounds
constraints = [
    {"batch": 1, "seq_len": (1, 1024)}  # seq_len can be 1-1024
]

exported_program = torch.export.export(
    model, 
    example_inputs,
    dynamic_shapes=constraints
)
```

---

## 5. Deployment Workflow

### Complete Pipeline for Fortuna

```
1. Train Model (PyTorch)
   ├── Use QAT (qat_scheme="phone-deployment")
   ├── Train on Fortuna dataset
   └── Save with save_pretrained_torchao()

2. Convert Weights
   ├── convert_weights to ExecuTorch format
   └── Output: pytorch_model_converted.bin

3. Export to .pte
   ├── export_llama with INT8 quantization
   ├── export_llama with INT4 quantization
   └── Output: fortuna_int8.pte, fortuna_int4.pte

4. Validate (Optional)
   ├── Load .pte in Python
   ├── Compare outputs with original model
   └── Verify accuracy

5. Integrate in iOS
   ├── Add .pte files to Xcode project
   ├── Add ExecuTorch Swift package
   ├── Create model service
   └── Use in app
```

### Export Commands (from INIT.md)

```bash
# Convert weights
python -m executorch.examples.models.qwen3.convert_weights \
    "fortuna_phone_model" pytorch_model_converted.bin

# Export INT8 version
python -m executorch.examples.models.qwen3.export_llama \
    --model_path pytorch_model_converted.bin \
    --tokenizer_path fortuna_phone_model \
    --output_path fortuna_int8.pte \
    --pt2e_quantize xnnpack_dynamic

# Export INT4 version
python -m executorch.examples.models.qwen3.export_llama \
    --model_path pytorch_model_converted.bin \
    --tokenizer_path fortuna_phone_model \
    --output_path fortuna_int4.pte \
    --pt2e_quantize xnnpack_dynamic_qc4
```

---

## 6. iOS Integration

### 6.1 Adding ExecuTorch to Xcode

**Using Swift Package Manager:**

1. In Xcode: File → Add Package Dependencies
2. Enter URL: `https://github.com/pytorch/executorch`
3. Select version: `swiftpm-1.0.0` (or latest stable)
4. Choose products:
   - `executorch` (core runtime)
   - `backend_coreml` (for Neural Engine)
   - `backend_mps` (optional, for GPU)
   - `kernels_quantized` (for quantized models)
   - `kernels_optimized` (optimized CPU kernels)

### 6.2 Adding .pte Files

1. Drag `.pte` files into Xcode project
2. Ensure they're added to target
3. Check "Copy items if needed"
4. Verify in Build Phases → Copy Bundle Resources

**Recommended structure:**
```
Fortuna/
├── Models/
│   ├── fortuna_int8.pte (~600MB)
│   ├── fortuna_int4.pte (~300MB)
│   └── tokenizer.json (from training)
```

### 6.3 Loading Models in Swift

**Basic example:**
```swift
import ExecuTorch

class FortunaModelService {
    private var module: Module?
    
    func loadModel(quantization: Quantization = .int8) throws {
        let modelName = quantization == .int8 ? "fortuna_int8" : "fortuna_int4"
        guard let modelPath = Bundle.main.path(
            forResource: modelName, 
            ofType: "pte"
        ) else {
            throw ModelError.modelNotFound
        }
        
        // Load with memory mapping for efficiency
        module = Module(filePath: modelPath, loadMode: .mmap)
        try module?.load("forward")
    }
    
    enum Quantization {
        case int8, int4
    }
    
    enum ModelError: Error {
        case modelNotFound
        case modelNotLoaded
    }
}
```

### 6.4 Running Inference for LLMs

**For text generation (Qwen3):**

```swift
import ExecuTorch

class FortunaLLMService {
    private var runner: TextLLMRunner?
    
    func initialize() throws {
        // Load model
        let modelPath = Bundle.main.path(forResource: "fortuna_int8", ofType: "pte")!
        
        // Load tokenizer
        let tokenizerPath = Bundle.main.path(forResource: "tokenizer", ofType: "json")!
        
        // Create runner
        runner = try TextLLMRunner(
            modelPath: modelPath,
            tokenizerPath: tokenizerPath
        )
    }
    
    func generate(prompt: String, maxTokens: Int = 256) async throws -> String {
        guard let runner = runner else {
            throw ModelError.modelNotLoaded
        }
        
        // Generate tokens
        let tokens = try await runner.generate(
            prompt: prompt,
            maxTokens: maxTokens,
            temperature: 0.7
        )
        
        // Decode to text
        return runner.decode(tokens: tokens)
    }
}
```

### 6.5 Integration with App

**Example usage in SwiftUI:**

```swift
import SwiftUI

struct ChatView: View {
    @StateObject private var modelService = FortunaLLMService()
    @State private var response: String = ""
    
    var body: some View {
        VStack {
            Text(response)
            Button("Generate") {
                Task {
                    do {
                        let prompt = "Should I buy a PS5?"
                        response = try await modelService.generate(prompt: prompt)
                    } catch {
                        print("Error: \(error)")
                    }
                }
            }
        }
        .onAppear {
            try? modelService.initialize()
        }
    }
}
```

---

## 7. Best Practices

### 7.1 Model Selection

- **Use INT8 for newer devices** (iPhone 13+) - better quality
- **Use INT4 for older devices** (iPhone 12) - smaller size
- **Test both** and let app choose based on device capability

### 7.2 Memory Management

- **Use memory mapping** (`.mmap`) to reduce RAM usage
- **Lazy loading**: Only load model when needed
- **Unload when not in use**: Release model from memory when app backgrounds

### 7.3 Performance Optimization

- **Prefer CoreML backend** for Neural Engine acceleration
- **Batch requests** when possible
- **Cache tokenizer** to avoid reloading
- **Profile with Instruments** to find bottlenecks

### 7.4 Error Handling

```swift
enum ModelError: Error {
    case modelNotFound
    case modelNotLoaded
    case inferenceFailed(String)
    case tokenizationFailed
}

// Always wrap inference in try-catch
do {
    let result = try await modelService.generate(prompt: prompt)
} catch ModelError.modelNotLoaded {
    // Handle gracefully
    showError("Model not ready. Please try again.")
} catch {
    // Log and handle
    print("Unexpected error: \(error)")
}
```

### 7.5 Testing

- **Validate .pte files** in Python before iOS integration
- **Test on real devices** (not just simulator)
- **Test on different iPhone models** (12, 13, 14, 15)
- **Monitor memory usage** during inference
- **Test with various input lengths**

---

## 8. Troubleshooting

### Common Issues

#### Issue: Model not found
**Solution:**
- Verify `.pte` file is in bundle
- Check file name matches exactly (case-sensitive)
- Ensure file is added to target in Xcode

#### Issue: Out of memory
**Solution:**
- Use INT4 model instead of INT8
- Enable memory mapping
- Reduce max sequence length
- Close other apps

#### Issue: Slow inference
**Solution:**
- Ensure CoreML backend is being used
- Check if Neural Engine is available
- Profile with Instruments
- Consider reducing model size

#### Issue: Incorrect outputs
**Solution:**
- Validate .pte file in Python first
- Check tokenizer matches training
- Verify input preprocessing
- Compare with original PyTorch model

### Debugging Tips

1. **Enable logging:**
```swift
// Set log level
ExecuTorch.setLogLevel(.debug)
```

2. **Check backend usage:**
```swift
// Verify which backend is active
let backend = module?.activeBackend
print("Using backend: \(backend)")
```

3. **Profile memory:**
```swift
// Check memory usage
let memoryUsage = module?.memoryUsage
print("Memory: \(memoryUsage)")
```

---

## Resources

- [ExecuTorch Documentation](https://pytorch.org/executorch/)
- [iOS Integration Guide](https://pytorch.org/executorch/stable/using-executorch-ios.html)
- [LLM Deployment Guide](https://pytorch.org/executorch/1.0/llm/run-on-ios.html)
- [CoreML Backend](https://pytorch.org/executorch/1.0/backends-coreml.html)
- [GitHub Repository](https://github.com/pytorch/executorch)

---

## Summary for Fortuna

**What we're using:**
- ✅ Qwen3-0.6B model with QAT
- ✅ INT8 and INT4 quantized versions
- ✅ ExecuTorch for iOS deployment
- ✅ CoreML backend for Neural Engine

**Next steps:**
1. Export models to `.pte` format (from training notebook)
2. Add ExecuTorch Swift package to Xcode
3. Create `FortunaModelService` class
4. Integrate with chat and vibe generation features
5. Test on real devices

---

*Last Updated: January 2026*
