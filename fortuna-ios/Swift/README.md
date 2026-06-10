# Swift Integration Files

This directory contains Swift code for integrating ExecuTorch models into a native iOS app.

## Current Status

⚠️ **Note**: The current `fortuna-ios` app is built with React/TypeScript. These Swift files are prepared for when you convert to native Swift/SwiftUI as specified in the PRD.

## Files

- `FortunaModelService.swift` - Service class for loading and running ExecuTorch models

## Integration Steps

### 1. Convert to Native Swift (Future)

When ready to convert from React to native Swift:

1. Create new Xcode project (iOS 17+, SwiftUI)
2. Copy these Swift files into the project
3. Follow the ExecuTorch integration guide in `docs/EXECUTORCH_GUIDE.md`

### 2. Add ExecuTorch Dependency

In Xcode:
1. File → Add Package Dependencies
2. URL: `https://github.com/pytorch/executorch`
3. Version: `swiftpm-1.0.0`
4. Select products:
   - `executorch`
   - `backend_coreml`
   - `kernels_quantized`

### 3. Add Model Files

1. Copy `.pte` files from `Models/` directory
2. Add to Xcode project
3. Ensure "Copy items if needed" is checked

### 4. Use in App

```swift
import SwiftUI

@main
struct FortunaApp: App {
    @StateObject private var modelService = FortunaModelService()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(modelService)
                .onAppear {
                    Task {
                        try? await modelService.loadModel()
                    }
                }
        }
    }
}
```

## Alternative: React Native Bridge

If you want to keep React but add native model inference:

1. Create a React Native bridge module
2. Expose `FortunaModelService` to JavaScript
3. Call from React components

See React Native documentation for creating native modules.

## Testing

Before full integration:

1. Test model loading in a simple Swift test app
2. Verify inference works correctly
3. Check memory usage
4. Test on real devices (iPhone 12+)
