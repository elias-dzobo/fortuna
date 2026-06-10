# Fortuna - LLM Training & Deployment Guide

> A comprehensive guide for training and deploying the Fortuna financial assistant LLM on iOS.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Model Architecture Decisions](#2-model-architecture-decisions)
3. [Quantization & Conversion](#3-quantization--conversion)
4. [Training Approaches](#4-training-approaches)
5. [Dataset Strategy](#5-dataset-strategy)
6. [MLOps & Tracking](#6-mlops--tracking)
7. [Training Pipeline](#7-training-pipeline)
8. [File Structure](#8-file-structure)
9. [Quick Start](#9-quick-start)

---

## 1. Project Overview

**Fortuna** is a privacy-first iOS financial planning app that uses on-device AI to help users:
- Understand their financial health through "Financial Vibes"
- Get personalized advice in casual, Gen Z language
- Make purchase decisions ("Should I buy X?")
- Plan financial goals
- Learn financial concepts simply

**Target Model:** Qwen3-0.6B  
**Deployment:** ExecuTorch on iOS (iPhone 12+)  
**Quantization:** 4-bit and 8-bit versions

---

## 2. Model Architecture Decisions

### Why Qwen3-0.6B?

| Factor | Reason |
|--------|--------|
| **Size** | 600M parameters - small enough for mobile |
| **Quality** | Strong performance for its size |
| **License** | Permissive for commercial use |
| **ExecuTorch Support** | Official conversion scripts available |

### Deployment Targets

| Version | Size (approx) | Use Case |
|---------|---------------|----------|
| **INT8** | ~600MB | Better quality, newer iPhones |
| **INT4** | ~300MB | Smaller size, older iPhones |

---

## 3. Quantization & Conversion

### Key Concepts

#### Quantization-Aware Training (QAT)
- **What:** Simulates quantization during training
- **Why:** Model learns to be robust to quantization effects
- **When:** Best for mobile deployment where you'll quantize aggressively

#### Post-Training Quantization (PTQ)
- **What:** Quantize after training is complete
- **Why:** Faster, no retraining needed
- **When:** Quick deployment, less aggressive quantization

#### ExecuTorch Quantization Options

```bash
# 8-bit dynamic quantization
--pt2e_quantize xnnpack_dynamic

# 4-bit quantization
--pt2e_quantize xnnpack_dynamic_qc4
```

### Conversion Flow

```
Trained Model (PyTorch)
    ↓
save_pretrained_torchao()
    ↓
convert_weights (ExecuTorch format)
    ↓
export_llama (with quantization flags)
    ↓
.pte file (deployable on iOS)
```

### Important Findings from Reference Notebook

The original `Qwen3_(0_6B)_Phone_Deployment.ipynb` shows:
- Model was trained with `qat_scheme = "phone-deployment"` (QAT)
- Exported with `--dtype fp32` (full precision checkpoint)
- `XnnpackDynamicallyQuantizedPartitioner` handles runtime quantization
- Log showed: `Applying quantizers: []` and `No quantizer provided, passing...`

This means the model was **not statically quantized** - dynamic quantization happens at inference time on device.

---

## 4. Training Approaches

### Option A: Full Finetuning + QAT (Recommended for Fortuna)

```python
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen3-0.6B",
    max_seq_length=1024,
    full_finetuning=True,
    qat_scheme="phone-deployment",
)
```

**Pros:**
- Best quality for aggressive quantization
- Clean single model output
- Direct ExecuTorch compatibility

**Cons:**
- Higher memory (~10-12GB for 0.6B)
- Slower training

**Best for:** Mobile deployment with 4-bit quantization

### Option B: QLoRA (NOT recommended for this use case)

```python
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen3-0.6B",
    load_in_4bit=True,
)
model = FastLanguageModel.get_peft_model(model, r=16, ...)
```

**Pros:**
- Very low memory (~4-6GB)
- Fast training

**Cons:**
- Need to merge adapters before export
- Potential compatibility issues with ExecuTorch
- Double quantization risk

**Best for:** Server deployment, quick experimentation

### Comparison Table

| Factor | Full Finetuning + QAT | QLoRA |
|--------|----------------------|-------|
| Memory | ~10-12GB | ~4-6GB |
| Training Speed | Slower | Faster |
| Output | Single model | Base + adapters |
| Quantization Quality | Excellent | Good |
| ExecuTorch Compatibility | Direct | Requires merge |
| **Recommendation for Fortuna** | ✅ Yes | ❌ No |

---

## 5. Dataset Strategy

### Dataset Sources

1. **Fortuna Synthetic Dataset** (3,330 examples)
   - Custom-generated for this use case
   - Covers all app features
   - Gen Z tone and Financial Vibes

2. **Finance-Alpaca** (68,912 examples)
   - General financial Q&A
   - Broader coverage
   - [HuggingFace Link](https://huggingface.co/datasets/gbharti/finance-alpaca)

### Fortuna Dataset Categories

| Category | Count | Description |
|----------|-------|-------------|
| Vibe Profile Generation | 400 | Onboarding → Financial Vibe |
| Purchase Decisions | 600 | "Should I buy X?" |
| Financial Concepts | 350 | Compound interest, 401k, etc. |
| Goal Planning | 500 | Savings goals, timelines |
| Debt Strategies | 350 | Avalanche vs snowball |
| Investment Advice | 400 | Where/how to invest |
| Budget Help | 350 | Budgeting tips |
| General Q&A | 700 | Misc financial questions |

### Dataset Format

**Raw format (for merging):**
```json
{
  "instruction": "Should I buy a PS5?",
  "input": "User Profile:\n- Age: 25, works as software engineer...",
  "output": "Let's vibe check this purchase! 🎮\n\nLooking at your numbers..."
}
```

**Training format (with conversations):**
```json
{
  "conversations": [
    {"role": "system", "content": "You are Fortuna..."},
    {"role": "user", "content": "Should I buy a PS5?\n\nUser Profile:..."},
    {"role": "assistant", "content": "Let's vibe check this purchase!..."}
  ]
}
```

### Files in `data/`

| File | Records | Use |
|------|---------|-----|
| `fortuna_synthetic_dataset.json` | 3,330 | Raw synthetic data |
| `fortuna_train.json` | 2,997 | Training split (90%) |
| `fortuna_val.json` | 333 | Validation split (10%) |
| `generate_fortuna_dataset.py` | - | Generator script |
| `merge_datasets.py` | - | Merge with finance-alpaca |

---

## 6. MLOps & Tracking

### Weights & Biases (Recommended)

**Why W&B:**
- Native TRL/Transformers integration (`report_to="wandb"`)
- Great LLM-specific features (prompt tables, response comparison)
- Easy setup, generous free tier
- Excellent collaboration tools

**Setup:**
```python
import wandb

wandb.login()
run = wandb.init(
    project="fortuna-llm",
    name="fortuna-qwen3-v1",
    config=CONFIG,
    tags=["finetuning", "qat", "production"],
)
```

**What to Log:**
- Dataset statistics and samples
- Model parameters
- Training metrics (loss, learning rate)
- Sample model outputs during training
- Final model as artifact
- Export file sizes

### MLflow Alternative

**When to use:**
- Self-hosted requirement
- Databricks integration
- More control over infrastructure

**Setup:**
```python
import mlflow

mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("fortuna-llm-training")

with mlflow.start_run():
    mlflow.log_params(CONFIG)
    # ... training ...
    mlflow.log_artifact(model_path)
```

---

## 7. Training Pipeline

### Recommended Flow

```
1. Prepare Dataset
   ├── Generate Fortuna synthetic data (3,330 examples)
   ├── Download finance-alpaca from HuggingFace
   ├── Merge and shuffle
   └── Create train/val splits

2. Initialize Tracking
   ├── W&B login and init
   ├── Log config and dataset info
   └── Log sample examples

3. Load Model
   ├── FastLanguageModel.from_pretrained()
   ├── full_finetuning=True
   └── qat_scheme="phone-deployment"

4. Train
   ├── SFTTrainer with conversations format
   ├── 3 epochs
   ├── Learning rate 5e-5
   └── Gradient accumulation 4

5. Export
   ├── save_pretrained_torchao()
   ├── convert_weights to ExecuTorch format
   ├── export_llama with INT8 quantization
   └── export_llama with INT4 quantization

6. Deploy
   ├── Download .pte files
   ├── Add to Xcode project
   └── Integrate with ExecuTorch runtime
```

### Training Arguments

```python
TrainingArguments(
    output_dir="./fortuna_output",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=5e-5,
    logging_steps=10,
    save_steps=200,
    optim="adamw_8bit",
    weight_decay=0.001,
    lr_scheduler_type="linear",
    warmup_steps=50,
    report_to="wandb",
)
```

---

## 8. File Structure

```
fortuna/
├── data/
│   ├── generate_fortuna_dataset.py    # Dataset generator
│   ├── merge_datasets.py              # Merge with finance-alpaca
│   ├── fortuna_synthetic_dataset.json # 3,330 synthetic examples
│   ├── fortuna_train.json             # Training split
│   └── fortuna_val.json               # Validation split
│
├── notebooks/
│   └── Fortuna_Training_Pipeline.ipynb # Complete Colab notebook
│
├── docs/
│   ├── PRD.md                         # Product requirements
│   ├── DESIGN_SYSTEM.md               # UI/UX specifications
│   └── INIT.md                        # This file
│
└── Qwen3_(0_6B)_Phone_Deployment.ipynb # Reference notebook
```

---

## 9. Quick Start

### Step 1: Generate Dataset (already done)
```bash
cd /path/to/fortuna
python3 data/generate_fortuna_dataset.py
```

### Step 2: Open Training Notebook
1. Upload `notebooks/Fortuna_Training_Pipeline.ipynb` to Google Colab
2. Select T4 GPU runtime
3. Run all cells

### Step 3: Upload Dataset
When prompted, upload `data/fortuna_synthetic_dataset.json`

### Step 4: Monitor Training
- Check W&B dashboard for metrics
- Review sample outputs during training

### Step 5: Download Models
After training completes:
- `fortuna_int8.pte` (~600MB)
- `fortuna_int4.pte` (~300MB)
- `fortuna_tokenizer.zip`

### Step 6: iOS Integration
1. Add `.pte` files to Xcode project
2. Add ExecuTorch framework
3. Load model in Swift:
```swift
import ExecuTorch
let module = try Module(modelPath: "fortuna_int8.pte")
```

---

## Key Takeaways

1. **Use Full Finetuning + QAT** for mobile deployment (not QLoRA)
2. **Qwen3-0.6B** is ideal size for on-device inference
3. **Export both INT4 and INT8** versions for flexibility
4. **W&B tracking** is essential for production ML
5. **Custom dataset + finance-alpaca** gives best coverage
6. **The reference notebook used QAT** but exported as fp32 (dynamic quantization at runtime)

---

## Resources

- [ExecuTorch Documentation](https://pytorch.org/executorch/)
- [Unsloth Documentation](https://docs.unsloth.ai/)
- [Finance-Alpaca Dataset](https://huggingface.co/datasets/gbharti/finance-alpaca)
- [W&B Documentation](https://docs.wandb.ai/)
- [Qwen3 Model Card](https://huggingface.co/Qwen/Qwen3-0.6B)

---

*Last Updated: January 2026*
