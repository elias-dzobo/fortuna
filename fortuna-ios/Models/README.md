# Fortuna Model Files

This directory contains the ExecuTorch `.pte` model files for the Fortuna iOS app.

## Expected Files

After training and export, you should have:

- `fortuna_int8.pte` (~600MB) - 8-bit quantized model for better quality
- `fortuna_int4.pte` (~300MB) - 4-bit quantized model for smaller size
- `tokenizer.json` - Tokenizer configuration from training

## How to Add Models

1. **After training completes** (from `notebooks/Fortuna_Training_Pipeline.ipynb`):
   - Download `fortuna_int8.pte` and `fortuna_int4.pte`
   - Download `fortuna_tokenizer.zip` and extract `tokenizer.json`

2. **Place files here:**
   ```
   fortuna-ios/Models/
   ├── fortuna_int8.pte
   ├── fortuna_int4.pte
   └── tokenizer.json
   ```

3. **Add to Xcode project:**
   - Drag files into Xcode
   - Ensure "Copy items if needed" is checked
   - Verify in Build Phases → Copy Bundle Resources

## Model Selection

The app will automatically select the appropriate model based on device capabilities:
- **INT8**: iPhone 13+ (better quality, more memory)
- **INT4**: iPhone 12 (smaller size, less memory)

## File Sizes

- `fortuna_int8.pte`: ~600MB
- `fortuna_int4.pte`: ~300MB
- `tokenizer.json`: ~1MB

**Note**: These files are large and should be added to `.gitignore` to avoid bloating the repository. Use Git LFS if version control is needed.

## Current Status

✅ **Model available**: `fortuna_q8.pte` (~1.3GB) - Located in `fortuna-ios/` root directory

### Model File Location
The trained model is at:
```
/Users/eliasdzobo/Desktop/2026/fortuna/fortuna-ios/fortuna_q8.pte
```

### Tokenizer Location
The tokenizer files are at:
```
fortuna-ios/fortuna_tokenizer/
├── tokenizer.model
├── tokenizer.json
├── tokenizer_config.json
├── special_tokens_map.json
└── chat_template.jinja
```

### For iOS Bundle
Copy these files to the iOS project bundle:
1. `fortuna_q8.pte` → `ios/Fortuna/fortuna_q8.pte`
2. `fortuna_tokenizer/tokenizer.model` → `ios/Fortuna/tokenizer.model`
