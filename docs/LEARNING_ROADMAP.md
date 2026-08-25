# Fortuna — On-Device Inference Learning Roadmap

Project-based, first-principles study of deploying LLMs on constrained devices.
Vehicle: Qwen3-0.6B running locally inside the Fortuna iOS app.
Device: A17/M-class iPhone (has a real Neural Engine — matters from Phase 2 on).

## The two equations that drive every decision

1. **Decode is memory-bandwidth-bound.** Each generated token streams the *whole*
   model from RAM. So `tokens/sec ≈ memory_bandwidth / model_size_bytes`.
   → Shrinking the model (quantization) is the biggest decode-speed lever.
2. **Prefill ≠ decode.** Prefill (processing the prompt) is parallel/compute-bound
   and sets **TTFT**. Decode (generating) is serial/bandwidth-bound and sets **tok/s**.
   Different bottlenecks, different fixes, different metrics.

## Method: measure first, optimize second

Every change is an experiment: change ONE thing, rerun the harness, explain the
delta from the two equations above. Metrics tracked for every build:

| Metric | What it measures | First-principles meaning |
|---|---|---|
| Model size (MB) | bytes on disk / in RAM | sets decode ceiling (eq. 1) |
| Load time (ms) | mmap + init | startup UX |
| TTFT (ms) | submit → first token | prefill latency (eq. 2) |
| Decode tok/s | steady-state generation | bandwidth utilization (eq. 1) |
| Peak memory (MB) | RSS during gen | fits-in-budget? OOM risk |
| Energy | Instruments Energy Log | battery cost per response |
| Quality | perplexity + Fortuna task evals | did optimization break it? |

## Phases (each = one concept + one measurable artifact)

- **Phase 0 — Baseline + harness** ← WE ARE HERE
  Get the current `.pte` onto the device, wire in `Benchmark.swift`, produce the
  first full metrics row. Deliverable: a results table with one honest baseline.

- **Phase 1 — Quantization**
  Produce a *true* FP16 baseline, then INT8, then INT4 groupwise. Plot
  size/latency/perplexity. Explain why INT4 ≈ 4× decode speed and what quality costs.
  NOTE: current notebook hides quantization inside `save_pretrained_torchao` — the
  472MB `.pte` is already ~INT8. Phase 1 makes the quantization explicit and varied.

- **Phase 2 — Compilation / backends**
  Current export uses `-X` (XNNPACK = CPU only). Add a CoreML lowering to put the
  Neural Engine to work. Compare CPU vs ANE on identical weights.

- **Phase 3 — Systems squeeze**
  KV cache sizing (`max_context_length`), prefill chunking, thread count, mmap.
  Each win traced to TTFT or tok/s.

- **Phase 4 — Agentic loop**
  Local model → tool call → iOS App Intents (reminders, notes, email). Tool-calling
  as a control loop; measure end-to-end latency of a tool-using turn.

- **Phase 5 — Runtime comparison (capstone)**
  Same model on ExecuTorch vs llama.cpp vs MLX. Explain the divergence.

## Current export command (reference baseline)

```
python -m executorch.examples.models.llama.export_llama \
  --model qwen3_0_6b --checkpoint pytorch_model_converted.bin --params 0.6B_config.json \
  --output_name qwen3_0.6B_model.pte \
  -kv --use_sdpa_with_kv_cache -X --xnnpack-extended-ops \
  --max_context_length 1024 --max_seq_length 128 --dtype fp32
```
Levers visible here for later phases: backend (`-X` → CoreML), context length (KV
cache), seq length (prefill), dtype/quantization (hidden in torchao save step).

## Results log

| Date | Build | Backend | Size MB | Load ms | TTFT ms | tok/s | Peak MB | PPL | Notes |
|---|---|---|---|---|---|---|---|---|---|
| _baseline pending_ | | | | | | | | | |
