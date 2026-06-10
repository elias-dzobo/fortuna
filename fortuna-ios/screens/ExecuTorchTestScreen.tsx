import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useFortunaModel } from '../hooks/useFortunaModel';
import { MINI_EVAL_PROMPTS } from '../eval/miniEvalPrompts';
import { AppState } from '../types';

interface Props {
    onNavigate: (state: AppState) => void;
}

interface EvalCaseResult {
  id: string;
  prompt: string;
  response: string;
  latencyMs: number;
  generatedTokenCount: number;
  keywordHitRate: number;
  missingKeywords: string[];
}

interface EvalSummary {
  cases: number;
  avgLatencyMs: number;
  avgGeneratedTokens: number;
  avgKeywordHitRate: number;
}

const EVAL_RUNS_DIR = 'eval_runs';

export const ExecuTorchTestScreen: React.FC<Props> = ({ onNavigate }) => {
  const {
    isReady,
    isGenerating,
    sendMessage,
    response,
    token,
    error,
    downloading,
    downloadProgress,
    configure,
    getGeneratedTokenCount,
    activeModelFilename,
  } = useFortunaModel();

  const [input, setInput] = useState('');
  const [evalRunning, setEvalRunning] = useState(false);
  const [evalProgressText, setEvalProgressText] = useState('');
  const [evalSummary, setEvalSummary] = useState<EvalSummary | null>(null);
  const [lastEvalPath, setLastEvalPath] = useState('');
  const [ttftMs, setTtftMs] = useState<number | null>(null);
  const [awaitingFirstToken, setAwaitingFirstToken] = useState(false);
  const responseRef = useRef('');
  const generationStartMsRef = useRef<number | null>(null);

  useEffect(() => {
    responseRef.current = response || '';
  }, [response]);

  useEffect(() => {
    if (!awaitingFirstToken || !token || generationStartMsRef.current == null) return;
    const measuredTtftMs = Date.now() - generationStartMsRef.current;
    setTtftMs(measuredTtftMs);
    setAwaitingFirstToken(false);
  }, [token, awaitingFirstToken]);

  const generate = async () => {
    if (!isReady || !sendMessage) return;
    try {
      Keyboard.dismiss();
      setTtftMs(null);
      generationStartMsRef.current = Date.now();
      setAwaitingFirstToken(true);
      await sendMessage(input);
    } catch (e: any) {
      console.error(e);
      setAwaitingFirstToken(false);
    } finally {
      generationStartMsRef.current = null;
      setAwaitingFirstToken(false);
    }
  };

  const runMiniEval = async () => {
    if (!isReady || !sendMessage) return;

    Keyboard.dismiss();
    setEvalRunning(true);
    setEvalProgressText('');
    setEvalSummary(null);
    setLastEvalPath('');

    const results: EvalCaseResult[] = [];
    const suiteSize = MINI_EVAL_PROMPTS.length;

    try {
      for (let i = 0; i < suiteSize; i += 1) {
        const testCase = MINI_EVAL_PROMPTS[i];
        setEvalProgressText(`Running ${i + 1}/${suiteSize}: ${testCase.id}`);

        // Reset history between cases so each prompt is measured independently.
        configure({
          chatConfig: {
            initialMessageHistory: [],
            contextWindowLength: 5,
          },
          generationConfig: {
            temperature: 0.2,
          },
        });

        const startedAt = Date.now();
        await sendMessage(testCase.prompt);
        const latencyMs = Date.now() - startedAt;
        const generatedTokenCount = getGeneratedTokenCount();
        const responseText = responseRef.current.trim();
        const responseLower = responseText.toLowerCase();

        const missingKeywords = testCase.requiredKeywords.filter(
          (keyword) => !responseLower.includes(keyword.toLowerCase())
        );
        const keywordHitRate =
          testCase.requiredKeywords.length === 0
            ? 1
            : (testCase.requiredKeywords.length - missingKeywords.length) /
              testCase.requiredKeywords.length;

        results.push({
          id: testCase.id,
          prompt: testCase.prompt,
          response: responseText,
          latencyMs,
          generatedTokenCount,
          keywordHitRate,
          missingKeywords,
        });
      }

      const summary: EvalSummary = {
        cases: results.length,
        avgLatencyMs:
          results.reduce((sum, row) => sum + row.latencyMs, 0) /
          Math.max(results.length, 1),
        avgGeneratedTokens:
          results.reduce((sum, row) => sum + row.generatedTokenCount, 0) /
          Math.max(results.length, 1),
        avgKeywordHitRate:
          results.reduce((sum, row) => sum + row.keywordHitRate, 0) /
          Math.max(results.length, 1),
      };

      const runReport = {
        modelFilename: activeModelFilename,
        generatedAt: new Date().toISOString(),
        summary,
        cases: results,
      };

      const evalDirectory = `${FileSystem.documentDirectory}${EVAL_RUNS_DIR}/`;
      await FileSystem.makeDirectoryAsync(evalDirectory, { intermediates: true });
      const safeModelName = activeModelFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const outputPath = `${evalDirectory}${safeModelName}_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(outputPath, JSON.stringify(runReport, null, 2));

      setEvalSummary(summary);
      setLastEvalPath(outputPath);
      setEvalProgressText(`Complete: ${suiteSize}/${suiteSize}`);
    } catch (e: any) {
      console.error('Mini eval failed:', e);
      setEvalProgressText(`Eval failed: ${String(e?.message || e)}`);
    } finally {
      setEvalRunning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
            <Button title="Back to Welcome" onPress={() => onNavigate(AppState.WELCOME)} />
            <Text style={styles.title}>Fortuna ExecuTorch Test</Text>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                Status: {downloading ? `Downloading Model (${(downloadProgress * 100).toFixed(1)}%)` : (isReady ? 'Ready' : 'Loading Model...')}
              </Text>
              <Text style={styles.statusSubText}>Model: {activeModelFilename}</Text>
              {downloading && (
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarForeground, { width: `${downloadProgress * 100}%` }]} />
                </View>
              )}
              {isGenerating && <Text style={styles.generatingText}>Generating...</Text>}
              {awaitingFirstToken && <Text style={styles.statusSubText}>Measuring TTFT...</Text>}
              {ttftMs != null && (
                <Text style={styles.statusSubText}>TTFT: {ttftMs} ms</Text>
              )}
              {evalRunning && <Text style={styles.generatingText}>Mini Eval Running...</Text>}
              {!!evalProgressText && <Text style={styles.statusSubText}>{evalProgressText}</Text>}
              {error && <Text style={styles.errorText}>Error: {String(error)}</Text>}
            </View>

            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Enter input here..."
              multiline
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={Keyboard.dismiss}
            />

            <Button
              title="Generate"
              onPress={generate}
              disabled={!isReady || isGenerating || !input.trim()}
            />
            <View style={styles.evalButton}>
              <Button
                title={evalRunning ? 'Running Mini Eval...' : 'Run Mini Eval Suite'}
                onPress={runMiniEval}
                disabled={!isReady || isGenerating || evalRunning}
              />
            </View>

            <View style={styles.outputContainer}>
              <Text style={styles.outputLabel}>Output:</Text>
              <Text style={styles.outputText}>{response}</Text>
              {evalSummary && (
                <View style={styles.evalSummaryContainer}>
                  <Text style={styles.evalSummaryTitle}>Mini Eval Summary</Text>
                  <Text style={styles.outputText}>Cases: {evalSummary.cases}</Text>
                  <Text style={styles.outputText}>Avg latency: {evalSummary.avgLatencyMs.toFixed(0)} ms</Text>
                  <Text style={styles.outputText}>Avg generated tokens: {evalSummary.avgGeneratedTokens.toFixed(1)}</Text>
                  <Text style={styles.outputText}>Avg keyword hit rate: {(evalSummary.avgKeywordHitRate * 100).toFixed(1)}%</Text>
                  {!!lastEvalPath && (
                    <Text style={styles.evalPathText}>Saved run: {lastEvalPath}</Text>
                  )}
                </View>
              )}
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  statusContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
  },
  statusSubText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  generatingText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 5,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  evalButton: {
    marginTop: 10,
  },
  outputContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  outputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  outputText: {
    fontSize: 16,
    lineHeight: 22,
  },
  evalSummaryContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  evalSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  evalPathText: {
    marginTop: 6,
    fontSize: 12,
    color: '#444',
  },
});
