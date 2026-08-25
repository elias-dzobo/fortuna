# Fortuna

A privacy-first personal finance app for iOS that runs its language model **on the device**. No
financial data is sent anywhere — the model that answers your questions about debt, savings, and
spending is loaded from local storage and runs on the phone's own silicon.

That constraint is the whole design. Financial details are exactly the kind of data people should
not have to hand to a third-party API, so the interesting engineering here is getting a language
model small and fast enough to live on a phone at all.

## How it works

Qwen3-0.6B is exported to [ExecuTorch](https://pytorch.org/executorch/), PyTorch's runtime for edge
devices, and quantized before it ever ships:

| Build | Scheme | Notes |
| --- | --- | --- |
| `fortuna_q8.pte` | 8-bit weights | Larger, higher fidelity |
| `qwen3_0_6b_8da4w.pte` | 8-bit dynamic activations, 4-bit weights | The size/quality trade-off that actually fits comfortably |

The `.pte` files are the deployable artifact — a serialized, ahead-of-time-compiled program rather
than a checkpoint the app has to interpret at runtime. ExecuTorch dispatches to CoreML so inference
can use the Apple Neural Engine instead of pinning the CPU.

Model files are gitignored; they are built from the export notebook rather than committed.

## Repository layout

```
Qwen3_(0_6B)_Phone_Deployment.ipynb   — export and quantization pipeline
notebooks/                            — training pipeline experiments
docs/
  EXECUTORCH_GUIDE.md                 — how ExecuTorch works and why it was chosen
  EXECUTORCH_INTEGRATION_SUMMARY.md   — integration quick reference
  PRD.md                              — product requirements
  DESIGN_SYSTEM.md                    — visual language
fortuna-ios/
  screens/                            — onboarding, dashboard, chat, debt, savings
  hooks/useFortunaModel.ts            — React hook wrapping model load and inference
  native/FortunaModel.ts              — native module bridge
  Swift/FortunaModelService.swift     — Swift service handling model loading and generation
  Models/                             — where .pte files and the tokenizer are placed
  eval/                               — prompt set for sanity-checking model output
```

## The app

Onboarding asks conversational questions instead of presenting a spreadsheet, then generates a
"financial vibe" profile locally. From there the user gets a chat interface for ongoing questions,
plus dedicated debt and savings views. There is an `ExecuTorchTestScreen` for exercising the model
directly during development.

Built with React Native and Expo, with a Swift layer underneath for the parts that need to talk to
ExecuTorch.

## Running it

```bash
cd fortuna-ios
npm install
npm run dev
```

To get inference working you also need a `.pte` model and tokenizer in `fortuna-ios/Models/` —
`Qwen3_(0_6B)_Phone_Deployment.ipynb` produces both. See `docs/EXECUTORCH_GUIDE.md` for the full
export and integration walkthrough.

## Why this was worth building

Shipping a language model to a phone forces questions that a hosted API hides: how much memory the
model actually needs, what quantization costs in answer quality, how long a cold model load takes,
and whether the Neural Engine is being used or whether everything quietly fell back to CPU. Those
are the same questions that matter when serving models anywhere — they are just harder to ignore
when the budget is one handset.
