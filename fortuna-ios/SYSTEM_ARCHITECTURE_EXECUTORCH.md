# System Architecture: High-Performance ExecuTorch Integration for Mobile

This document outlines the architectural decisions, trade-offs, and implementation strategies used to integrate a **1.2GB ExecuTorch model** into a React Native (Expo) application.

---

## 1. The Core Challenge: Asset Scale
Modern LLMs, even when quantized (INT8/INT4), often exceed 1GB. Integrating these into a mobile development workflow presents three primary bottlenecks:

| Bottleneck | Problem |
| :--- | :--- |
| **Asset Bundling** | Metro (React Native's bundler) is optimized for JavaScript, not 1GB binary blobs. Large assets cause OOM errors during bundling. |
| **Deployment Limits** | EAS (Expo Application Services) and traditional tunneling services (ngrok) have strict payload limits (often 100MB-500MB). |
| **Hot Reloading** | Including a 1GB file in the bundle makes every "Fast Refresh" or app reload extremely slow as the asset-link is verified. |

---

## 2. Architectural Decisions

### A. The "Download & Cache" Strategy (Development & Production)
Instead of bundling the `.pte` model directly in the app binary, we treat the model as a **remote resource** that is hydrated at runtime.

**System Flow:**
1.  **Check Local Store**: App looks for the model in `FileSystem.documentDirectory` (persistent storage).
2.  **On-Demand Download**: If missing, it downloads the model from a high-speed local server (Dev) or a CDN (Prod).
3.  **Atomic Swap**: Once downloaded, the local file path is passed to the native ExecuTorch runner.

### B. Decoupled Tokenizer vs. Heavy Weights
**Trade-off**: The tokenizer (`tokenizer.model` and `config.json`) is small (~1-5MB).
- **Decision**: Keep the tokenizer as a **bundled Expo Asset**. This ensures the app can always initialize the LLM interface and UI state without waiting for the massive weight file to download.

### C. Dedicated Static File Server
**Trade-off**: Using Metro to serve 1.2GB via `http://localhost:8081/assets/...`
- **Problem**: Metro's overhead and the complex tunneling logic significantly reduce transfer speeds.
- **Solution**: Use a dedicated Python/Node static server on port `8000`. This provides raw socket performance, maximizing the throughput of your local Wi-Fi/Hotspot.

---

## 3. Implementation Process

### Phase 1: Local Infrastructure
To bypass tunnel limits, we establish a **Direct-to-Device (D2D)** link:
```bash
# On the Mac (Development Host)
python3 -m http.server 8000
```
This serves the `assets/` directory directly to any device on the same subnet (IP `172.20.10.9`).

### Phase 2: React Native Hook Strategy
The logic is encapsulated in a custom hook `useFortunaModel`.

```typescript
// Pseudo-logic for the "Hydration" process
const localPath = `${FileSystem.documentDirectory}model.pte`;
const info = await FileSystem.getInfoAsync(localPath);

if (!info.exists) {
  // Transfer via resumable download with progress tracking
  const download = FileSystem.createDownloadResumable(REMOTE_URL, localPath, {}, onProgress);
  await download.downloadAsync();
}

// Pass direct filesystem path to native layer
llm.loadModel(localPath);
```

### Phase 3: Native ExecuTorch Integration
The native layer (Swift/C++) must be configured to accept **External File Paths**. 
- **Production**: Files are typically pre-shipped in the app bundle (Resources).
- **Development**: Files are loaded from the `Documents` directory to allow for rapid model iteration without re-building the `.ipa`.

---

## 4. Performance & Systems Analysis

### Runtime Memory (RAM)
- **Model Size (1.2GB)**: This is the disk size. 
- **Peak RAM Usage**: ExecuTorch uses memory mapping (`mmap`). This allows the system to load parts of the model weights on demand. 
- **Observation**: While the file is 1.2GB, system RAM might only spike by 400-600MB if the model is heavily quantized and mmap-optimized.

### Neural Engine (ANE) Optimization
Using the `CoreML` backend in ExecuTorch is critical. 
- **CPU Inference**: ~1-2 tokens/sec (High heat, high battery drain).
- **NPU Inference**: ~30-50 tokens/sec (Efficient, low heat).
- **Trade-off**: CoreML requires the `.pte` model to be specifically compiled for ANE targets.

### Storage I/O
- Downloading 1.2GB to `documentDirectory` is an expensive write operation.
- **Tip**: Use `FileSystem.createDownloadResumable` to handle network interruptions. If the user closes the app during the 1.2GB download, we can resume rather than restart.

---

## 5. Replication Guide

1.  **Preparation**: Quantize your model to INT8 `.pte` format using the ExecuTorch toolchain.
2.  **Host**: Start a local server (`python3 -m http.server`).
3.  **Network**: Connect iPhone to Mac via Hotspot (more stable than local Wi-Fi).
4.  **Identification**: Find Mac IP (`ifconfig`) and hardcode or dynamically inject as a `DEV_URL`.
5.  **Integration**: Use the `useFortunaModel` hook pattern to manage the download-first lifecycle.
6.  **Persistence**: The model persists across app restarts, making the 1.2GB cost a "one-time" setup fee for the user.

---

## 6. Trade-offs Summary

| Feature | Bundled Approach | Download-on-Start (Current) |
| :--- | :--- | :--- |
| **Initial App Size** | ~1.3GB (Bad for App Store) | ~50MB (Great for App Store) |
| **First Use Experience** | Instant load | 1-2 minute wait (for 1GB) |
| **Development Speed** | Slow (Build times +++) | Fast (Over-the-air model updates) |
| **Tunnel Compatibility** | Fails (Limit exceeded) | Works (Bypasses tunnel) |

This architecture prioritize **Development Velocity** and **EAS compatibility** while maintaining high-performance native inference.
