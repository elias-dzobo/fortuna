# ExecuTorch Integration Summary

> Quick reference guide for integrating ExecuTorch models into Fortuna iOS app

---

## What We've Set Up

### ✅ Documentation
- **`docs/EXECUTORCH_GUIDE.md`** - Comprehensive guide explaining ExecuTorch, how it works, and integration steps
- **`docs/EXECUTORCH_INTEGRATION_SUMMARY.md`** - This file (quick reference)

### ✅ Directory Structure
```
fortuna-ios/
├── Models/
│   ├── README.md          # Instructions for adding .pte files
│   ├── fortuna_int8.pte   # (to be added after training)
│   ├── fortuna_int4.pte   # (to be added after training)
│   └── tokenizer.json     # (to be added after training)
└── Swift/
    ├── README.md              # Integration instructions
    └── FortunaModelService.swift  # Swift service class
```

### ✅ Code Files
- **`Swift/FortunaModelService.swift`** - Ready-to-use Swift service for model loading and inference
- **`.gitignore`** - Updated to exclude large `.pte` files

---

## Understanding ExecuTorch

### What It Is
ExecuTorch is PyTorch's framework for deploying ML models directly on edge devices (mobile, embedded). It's the modern replacement for PyTorch Mobile.

### Key Benefits for Fortuna
1. **On-device inference** - All AI runs locally, no cloud needed
2. **LLM optimized** - Built specifically for language models like Qwen3
3. **Hardware acceleration** - Uses Apple Neural Engine via CoreML
4. **Small runtime** - ~50KB base footprint
5. **Quantization support** - 4-bit and 8-bit models

### How It Works (3 Steps)
```
1. Export: PyTorch model → torch.export() → Portable graph
2. Lower: Graph → Backend optimization → .pte file
3. Execute: .pte file → Runtime → Inference on device
```

**See `docs/EXECUTORCH_GUIDE.md` for detailed explanation.**

---

## Next Steps

### Step 1: Complete Model Training & Export

If you haven't already:

1. **Run training notebook**: `notebooks/Fortuna_Training_Pipeline.ipynb`
2. **Export models**:
   ```bash
   # This should create:
   # - fortuna_int8.pte (~600MB)
   # - fortuna_int4.pte (~300MB)
   # - fortuna_tokenizer.zip
   ```

### Step 2: Add Models to iOS Project

1. **Download exported files** from training (Colab/notebook)
2. **Extract tokenizer**: Unzip `fortuna_tokenizer.zip` to get `tokenizer.json`
3. **Place files**:
   ```
   fortuna-ios/Models/
   ├── fortuna_int8.pte
   ├── fortuna_int4.pte
   └── tokenizer.json
   ```

### Step 3: Choose Integration Path

You have two options:

#### Option A: Native Swift (Recommended per PRD)

1. **Create new Xcode project** (iOS 17+, SwiftUI)
2. **Add ExecuTorch package**:
   - File → Add Package Dependencies
   - URL: `https://github.com/pytorch/executorch`
   - Version: `swiftpm-1.0.0`
   - Select: `executorch`, `backend_coreml`, `kernels_quantized`
3. **Copy Swift files**:
   - Copy `Swift/FortunaModelService.swift` to Xcode project
   - Copy `.pte` files to Xcode project
4. **Use in app**:
   ```swift
   let modelService = FortunaModelService()
   try await modelService.loadModel()
   let response = try await modelService.generate(prompt: "Should I buy a PS5?")
   ```

#### Option B: React Native Bridge (If keeping React)

1. **Create React Native project** (or convert existing)
2. **Create native module** that wraps `FortunaModelService`
3. **Expose to JavaScript**:
   ```javascript
   import { NativeModules } from 'react-native';
   const { FortunaModel } = NativeModules;
   
   await FortunaModel.loadModel();
   const response = await FortunaModel.generate("Should I buy a PS5?");
   ```

**Note**: Current app is React/TypeScript web app. PRD specifies native Swift, so Option A is recommended.

### Step 4: Test Integration

1. **Test model loading**:
   ```swift
   let service = FortunaModelService()
   try await service.loadModel()
   print("Model loaded: \(service.isModelLoaded)")
   ```

2. **Test inference**:
   ```swift
   let response = try await service.generate(
       prompt: "Hello, Fortuna!",
       maxTokens: 50
   )
   print("Response: \(response)")
   ```

3. **Test on real device** (iPhone 12+)
4. **Monitor memory usage** (Instruments)

### Step 5: Integrate with App Features

Use `FortunaModelService` in:

1. **Onboarding** → `generateFinancialVibe(userData:)`
2. **Chat Screen** → `chat(message:context:)`
3. **Dashboard** → Generate daily insights

---

## Quick Reference

### Model Files Location
```
fortuna-ios/Models/
```

### Swift Service Location
```
fortuna-ios/Swift/FortunaModelService.swift
```

### Key Methods

```swift
// Load model
try await modelService.loadModel(quantization: .int8)

// Generate text
let response = try await modelService.generate(
    prompt: "Your prompt here",
    maxTokens: 256,
    temperature: 0.7
)

// Generate Financial Vibe
let vibe = try await modelService.generateFinancialVibe(userData: data)

// Chat with context
let chatResponse = try await modelService.chat(
    message: "Should I buy this?",
    context: financialContextSummary
)

// Unload when done
modelService.unload()
```

---

## File Sizes

- `fortuna_int8.pte`: ~600MB
- `fortuna_int4.pte`: ~300MB
- `tokenizer.json`: ~1MB

**Total**: ~900MB (both models) or ~300MB (INT4 only)

---

## Troubleshooting

### Model not found
- Check file names match exactly (case-sensitive)
- Verify files are in bundle (Build Phases → Copy Bundle Resources)

### Out of memory
- Use INT4 model instead of INT8
- Enable memory mapping (already in code)
- Reduce max sequence length

### Slow inference
- Ensure CoreML backend is active
- Check Neural Engine availability
- Profile with Instruments

**See `docs/EXECUTORCH_GUIDE.md` section 8 for more troubleshooting.**

---

## Resources

- **Full Guide**: `docs/EXECUTORCH_GUIDE.md`
- **ExecuTorch Docs**: https://pytorch.org/executorch/
- **iOS Integration**: https://pytorch.org/executorch/stable/using-executorch-ios.html
- **LLM Guide**: https://pytorch.org/executorch/1.0/llm/run-on-ios.html

---

## Summary

✅ **ExecuTorch understood** - Comprehensive guide created  
✅ **Directory structure ready** - Models folder prepared  
✅ **Swift integration code** - Service class ready to use  
✅ **Documentation complete** - Full guide and quick reference  

**Next**: Complete training, export models, add to project, integrate!

---

*Last Updated: January 2026*
