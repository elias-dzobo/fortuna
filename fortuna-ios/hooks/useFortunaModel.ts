import { useState, useEffect } from 'react';
import { useLLM } from 'react-native-executorch';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const ENV = (globalThis as any)?.process?.env ?? {};
const DEFAULT_MODEL_FILENAME =
  ENV.EXPO_PUBLIC_MODEL_FILENAME || 'qwen3_0_6b_8da4w.pte';
const DEFAULT_EXPECTED_MODEL_SIZE_BYTES = Number(
  ENV.EXPO_PUBLIC_EXPECTED_MODEL_SIZE_BYTES || '944034688'
);
const DEFAULT_MODEL_SERVER_BASE_URL =
  ENV.EXPO_PUBLIC_MODEL_SERVER_BASE_URL || 'http://172.20.10.9:8000/model_server';
const DEFAULT_TEMPERATURE = Number(ENV.EXPO_PUBLIC_TEMPERATURE || '0.6');
const DEFAULT_TOP_P = Number(ENV.EXPO_PUBLIC_TOP_P || '0.95');
const DEFAULT_MAX_NEW_TOKENS = Number(ENV.EXPO_PUBLIC_MAX_NEW_TOKENS || '32768');
const DEFAULT_REPETITION_PENALTY = Number(
  ENV.EXPO_PUBLIC_REPETITION_PENALTY || '1.1'
);

interface UseFortunaModelOptions {
  modelFilename?: string;
  expectedModelSizeBytes?: number;
  modelServerBaseUrl?: string;
  temperature?: number;
  topP?: number;
  maxNewTokens?: number;
  repetitionPenalty?: number;
}

// Helper to ensure file:// prefix is present for local paths (required by swmansion library)
const ensureFileUri = (path: string) => path.startsWith('file://') ? path : `file://${path}`;

export function useFortunaModel(options: UseFortunaModelOptions = {}) {
  const modelFilename = options.modelFilename ?? DEFAULT_MODEL_FILENAME;
  const expectedModelSizeBytes =
    options.expectedModelSizeBytes ?? DEFAULT_EXPECTED_MODEL_SIZE_BYTES;
  const modelServerBaseUrl =
    options.modelServerBaseUrl ?? DEFAULT_MODEL_SERVER_BASE_URL;
  const temperature = options.temperature ?? DEFAULT_TEMPERATURE;
  const topP = options.topP ?? DEFAULT_TOP_P;
  const maxNewTokens = options.maxNewTokens ?? DEFAULT_MAX_NEW_TOKENS;
  const repetitionPenalty =
    options.repetitionPenalty ?? DEFAULT_REPETITION_PENALTY;
  const remoteModelUrl = `${modelServerBaseUrl}/${modelFilename}`;

  const [modelConfig, setModelConfig] = useState<{
    modelSource: string;
    tokenizerSource: string;
    tokenizerConfigSource: string;
  } | null>(null);

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        setDownloading(true);
        const localModelPath = `${FileSystem.documentDirectory}${modelFilename}`;
        const fileInfo = await FileSystem.getInfoAsync(localModelPath);

        // 1. Check if model is already downloaded
        if (!fileInfo.exists) {
          console.log("Model not found locally, starting download from:", remoteModelUrl);
          const downloadResumable = FileSystem.createDownloadResumable(
            remoteModelUrl,
            localModelPath,
            {},
            (progress) => {
              const p = progress.totalBytesWritten / (progress.totalBytesExpectedToWrite || expectedModelSizeBytes);
              setDownloadProgress(p);
            }
          );

          const result = await downloadResumable.downloadAsync();
          if (!result) throw new Error("Download failed");
          console.log("Download complete:", result.uri);
        } else {
          console.log("Model found locally at:", localModelPath);
          setDownloadProgress(1);
        }

        // 2. Load tokenizer assets
        // Handle cases where require returns { default: ID } instead of just ID
        const tokenizerAssetid = require('../assets/fortuna_tokenizer/tokenizer.json_asset');
        const configAssetid = require('../assets/fortuna_tokenizer/tokenizer_config.json_asset');

        const tokenizerId = tokenizerAssetid.default || tokenizerAssetid;
        const configId = configAssetid.default || configAssetid;

        console.log("Loading tokenizer assets with IDs:", tokenizerId, configId);

        const tokenizerSource = Asset.fromModule(tokenizerId);
        const configSource = Asset.fromModule(configId);

        await Promise.all([
          tokenizerSource.downloadAsync(),
          configSource.downloadAsync(),
        ]);

        if (tokenizerSource.localUri && configSource.localUri) {
          const modelUri = ensureFileUri(localModelPath);
          const tokenizerUri = ensureFileUri(tokenizerSource.localUri);
          const configUri = ensureFileUri(configSource.localUri);

          // Verify model size
          const finalModelInfo = await FileSystem.getInfoAsync(localModelPath);
          const actualSize = finalModelInfo.exists ? (finalModelInfo as any).size : 0;

          console.log("-----------------------------------------");
          console.log(`📂 FILE INTEGRITY CHECK:`);
          console.log(`Actual:   ${actualSize} bytes`);
          console.log(`Expected: ${expectedModelSizeBytes} bytes`);
          console.log("-----------------------------------------");

          if (actualSize !== expectedModelSizeBytes) {
            console.error("❌ SIZE MISMATCH! Deleting corrupted file...");
            await FileSystem.deleteAsync(localModelPath);
            throw new Error(`Size mismatch: ${actualSize} vs ${expectedModelSizeBytes}. Redownloading...`);
          }

          setModelConfig({
            modelSource: modelUri,
            tokenizerSource: tokenizerUri,
            tokenizerConfigSource: configUri,
          });
        }
        else {
          console.warn("Assets downloaded but localUri is missing");
        }
        setDownloading(false);
      } catch (e) {
        setDownloading(false);
        console.error("Failed to set up LLM model:", e);
      }
    };
    setup();
  }, [modelFilename, expectedModelSizeBytes, modelServerBaseUrl]);

  const llm = useLLM({
    model: {
      modelSource: modelConfig?.modelSource || '',
      tokenizerSource: modelConfig?.tokenizerSource || '',
      tokenizerConfigSource: modelConfig?.tokenizerConfigSource || '',
    },
    preventLoad: !modelConfig,
  });

  const { isReady: llmIsReady, configure } = llm;

  useEffect(() => {
    if (!llmIsReady) return;

    // react-native-executorch@0.6.0 currently supports temperature and top-p.
    configure({
      generationConfig: {
        temperature,
        topp: topP,
      },
    });

    // These are requested tuning knobs, but this runtime version does not expose them.
    if (maxNewTokens !== DEFAULT_MAX_NEW_TOKENS) {
      console.warn(
        'max_new_tokens is not supported by react-native-executorch@0.6.0 generationConfig; value was ignored:',
        maxNewTokens
      );
    }
    if (repetitionPenalty !== DEFAULT_REPETITION_PENALTY) {
      console.warn(
        'repetition_penalty is not supported by react-native-executorch@0.6.0 generationConfig; value was ignored:',
        repetitionPenalty
      );
    }
  }, [
    llmIsReady,
    configure,
    temperature,
    topP,
    maxNewTokens,
    repetitionPenalty,
  ]);

  return {
    ...llm,
    activeModelFilename: modelFilename,
    activeGenerationConfig: {
      temperature,
      topP,
      maxNewTokens,
      repetitionPenalty,
    },
    isReady: llm.isReady && !downloading,
    downloading,
    downloadProgress,
  };
}
