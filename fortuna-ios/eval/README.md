# Mini Evaluation Suite (Quantized vs FP32)

This suite compares two `.pte` model variants on-device:
- Quantized (for example `qwen3_0_6b_8da4w.pte`)
- Full precision FP32 export

## What it measures
- End-to-end latency per prompt (`latencyMs`)
- Generated token count (`generatedTokenCount`)
- Simple quality proxy (`keywordHitRate`) based on required keywords per test prompt

Prompt set lives in:
- `eval/miniEvalPrompts.ts`

## Run a model evaluation on device
1. Start your model file server and Expo dev server.
2. Set model env vars before starting Expo:

```bash
export EXPO_PUBLIC_MODEL_FILENAME="qwen3_0_6b_8da4w.pte"
export EXPO_PUBLIC_EXPECTED_MODEL_SIZE_BYTES="944034688"
export EXPO_PUBLIC_MODEL_SERVER_BASE_URL="http://<YOUR_MAC_IP>:8000/model_server"
```

3. Open `ExecuTorchTestScreen` and tap `Run Mini Eval Suite`.
4. The run JSON is saved under app documents:
   - `.../eval_runs/<model>_<timestamp>.json`

Repeat with your FP32 `.pte` by changing env vars.

## Compare quantized vs fp32 runs
From `fortuna-ios/`:

```bash
npm run eval:compare -- <quantized_run.json> <fp32_run.json>
```

Example:

```bash
npm run eval:compare -- /path/to/q_run.json /path/to/fp32_run.json
```

The script prints aggregate and per-case comparison:
- average latency
- average token count
- keyword hit-rate delta
