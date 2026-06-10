# Fortuna Model Integration Guide

This guide walks you through integrating the on-device Fortuna AI model into the iOS app.

## Overview

The integration uses ExecuTorch to run a quantized Qwen3-0.6B model directly on the user's iPhone. This enables:
- **Privacy**: All inference happens on-device
- **Speed**: No network latency
- **Offline**: Works without internet

## Prerequisites

- Xcode 15+ installed
- iPhone 12+ for testing (iOS 17+)
- Model file: `fortuna_q8.pte`
- Tokenizer files in `fortuna_tokenizer/`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native App                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ChatScreen.tsx                          │   │
│  │                    │                                 │   │
│  │                    ▼                                 │   │
│  │         useFortunaModel() hook                       │   │
│  │                    │                                 │   │
│  │                    ▼                                 │   │
│  │          FortunaModel.ts (JS)                        │   │
│  └─────────────────────│────────────────────────────────┘   │
│                        │ Native Module Bridge                │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │          FortunaModel.swift (Native Module)          │   │
│  │                    │                                 │   │
│  │                    ▼                                 │   │
│  │        FortunaModelService.swift (ExecuTorch)        │   │
│  │                    │                                 │   │
│  │                    ▼                                 │   │
│  │    fortuna_q8.pte + tokenizer.model (Model Files)    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Generate Native iOS Project

Since you're using Expo, you need to generate the native iOS project files:

```bash
cd fortuna-ios

# Install dependencies
bun install

# Generate native projects (iOS and Android)
npx expo prebuild --platform ios
```

This creates an `ios/` folder with the native Xcode project.

## Step 2: Add ExecuTorch to Xcode

1. Open `ios/Fortuna.xcworkspace` in Xcode

2. Add ExecuTorch Swift Package:
   - File → Add Package Dependencies
   - Enter URL: `https://github.com/pytorch/executorch`
   - Version: `1.0.0` or later
   - Select these products:
     - `executorch`
     - `backend_coreml`
     - `kernels_quantized`
     - `kernels_optimized`

3. Click "Add Package"

## Step 3: Add Model Files to Bundle

1. Copy model file to iOS project:
   ```bash
   cp /Users/eliasdzobo/Desktop/2026/fortuna/fortuna-ios/fortuna_q8.pte ios/Fortuna/
   ```

2. Copy tokenizer files:
   ```bash
   cp fortuna_tokenizer/tokenizer.model ios/Fortuna/
   cp fortuna_tokenizer/tokenizer.json ios/Fortuna/
   ```

3. In Xcode, drag these files into the Fortuna target:
   - `fortuna_q8.pte`
   - `tokenizer.model`
   - `tokenizer.json`

4. Ensure "Copy items if needed" is checked

5. Verify files are in Build Phases → Copy Bundle Resources

## Step 4: Add Native Module Files

The native module bridge files are located in `ios/FortunaModel/`. Copy them to the iOS project:

```bash
# Create directory
mkdir -p ios/Fortuna/FortunaModel

# Copy bridge files (these are in ios/FortunaModel/ after running prebuild)
cp ios/FortunaModel/FortunaModelBridge.m ios/Fortuna/FortunaModel/
cp ios/FortunaModel/FortunaModel.swift ios/Fortuna/FortunaModel/

# Copy service file (from Swift/ directory)
cp Swift/FortunaModelService.swift ios/Fortuna/FortunaModel/
```

**Note**: The bridge files (`FortunaModelBridge.m` and `FortunaModel.swift`) are created in `ios/FortunaModel/` when you set up the native module. If they don't exist yet, they've been created for you in that location.

Then in Xcode:
1. Right-click on the Fortuna folder
2. Select "Add Files to Fortuna"
3. Add the `FortunaModel` folder
4. Ensure "Create groups" is selected

## Step 5: Create Bridging Header

If prompted to create a bridging header, click "Create".

If not prompted, create manually:

1. Create file: `ios/Fortuna/Fortuna-Bridging-Header.h`

2. Add content:
   ```objc
   //
   //  Fortuna-Bridging-Header.h
   //
   
   #import <React/RCTBridgeModule.h>
   #import <React/RCTEventEmitter.h>
   ```

3. In Build Settings, set "Objective-C Bridging Header" to:
   ```
   $(SRCROOT)/Fortuna/Fortuna-Bridging-Header.h
   ```

## Step 6: Update FortunaModelService for ExecuTorch

Once ExecuTorch is added, uncomment the actual implementation in `FortunaModelService.swift`:

```swift
// Change this:
// import ExecuTorch
// import LLaMARunner

// To this:
import ExecuTorch
import LLaMARunner

// And uncomment the actual runner initialization and inference code
```

## Step 7: Build and Test

1. Select a real device (iPhone 12+) as the build target
   - Simulator doesn't support Neural Engine

2. Build the project: `Cmd + B`

3. Run the app: `Cmd + R`

4. Test the chat:
   - Navigate to the Chat screen
   - Send a message
   - The model should respond using on-device inference

## File Structure After Integration

```
fortuna-ios/
├── ios/
│   ├── Fortuna/
│   │   ├── FortunaModel/
│   │   │   ├── FortunaModel.swift        # Native module
│   │   │   ├── FortunaModelBridge.m      # Obj-C bridge
│   │   │   └── FortunaModelService.swift # ExecuTorch service
│   │   ├── fortuna_q8.pte                # Model file (~600MB)
│   │   ├── tokenizer.model               # Tokenizer
│   │   └── tokenizer.json                # Tokenizer config
│   └── Fortuna.xcworkspace
├── native/
│   └── FortunaModel.ts                   # JS interface
├── hooks/
│   └── useFortunaModel.ts                # React hook
├── screens/
│   └── ChatScreen.tsx                    # Updated chat UI
└── fortuna_tokenizer/                    # Tokenizer source files
```

## Troubleshooting

### Model Not Found
- Verify `.pte` file is in the bundle (Build Phases → Copy Bundle Resources)
- Check file name matches exactly: `fortuna_q8.pte`

### Out of Memory
- Use INT4 quantization instead of INT8
- Model uses ~600MB RAM for INT8, ~300MB for INT4
- Close other apps before testing

### Slow Inference
- Ensure CoreML backend is active (uses Neural Engine)
- First inference is slower due to model loading
- Subsequent inferences should be faster

### Native Module Not Found
- Clean build: `Cmd + Shift + K`
- Delete Derived Data
- Rebuild: `Cmd + B`

### ExecuTorch Build Errors
- Ensure Xcode 15+ is installed
- Check Swift version compatibility
- Verify all ExecuTorch products are added

## Performance Expectations

On iPhone 14:
- Model load time: ~2-3 seconds
- First token: ~500ms
- Token generation: ~30-50 tokens/second
- Memory usage: ~600MB (INT8) / ~300MB (INT4)

## Mock Mode

When the native module isn't available (web, simulator), the app falls back to mock responses. This is useful for:
- Development on web
- Testing UI without the model
- CI/CD testing

The mock mode is automatically detected via `FortunaModel.isAvailable`.

## Next Steps

1. **Test on device** - Neural Engine only works on real hardware
2. **Profile performance** - Use Instruments to monitor memory/CPU
3. **Fine-tune prompts** - Adjust system prompts for better responses
4. **Add streaming** - Implement token-by-token streaming for better UX

## Resources

- [ExecuTorch iOS Guide](https://pytorch.org/executorch/stable/using-executorch-ios.html)
- [LLM on iOS](https://pytorch.org/executorch/1.0/llm/run-on-ios.html)
- [Expo Prebuild](https://docs.expo.dev/workflow/prebuild/)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-ios)
