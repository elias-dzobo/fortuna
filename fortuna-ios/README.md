# fortuna-ios

The iOS client for [Fortuna](../README.md) — a privacy-first finance app whose language model runs
on the device rather than behind an API.

Built with React Native and Expo, with a Swift layer that loads and runs the quantized Qwen3 model
through ExecuTorch.

## Layout

```
screens/      — onboarding, dashboard, chat, debt, savings, and an ExecuTorch test screen
hooks/        — useFortunaModel: model load, generation, and loading state
native/       — TypeScript side of the native module bridge
Swift/        — FortunaModelService.swift, which owns model loading and inference
Models/       — drop the .pte model and tokenizer here (gitignored)
eval/         — prompt set for sanity-checking model responses
```

## Running locally

```bash
npm install
npm run dev
```

Inference needs a model present. Export one with `Qwen3_(0_6B)_Phone_Deployment.ipynb` at the
repository root, then place the resulting `.pte` file and `tokenizer.json` in `Models/`.
`Models/README.md` covers the expected filenames, and `../docs/EXECUTORCH_GUIDE.md` walks through
the full export and integration path.

The app runs without a model — screens and navigation work — but anything that calls the model will
fail until one is in place.

## Note on configuration

There is no API key to set. All generation happens locally; the app does not send financial data to
a remote service.
