/**
 * FortunaModel Native Module
 * 
 * TypeScript interface for the native ExecuTorch model service.
 * This module bridges React Native with the Swift FortunaModelService.
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Type definitions
export interface GenerateResult {
  response: string;
}

export interface LoadResult {
  success: boolean;
  message?: string;
}

export interface ModelLoadedResult {
  loaded: boolean;
}

export interface VibeResult {
  vibe: string;
}

export interface UserData {
  age?: number;
  monthlyIncome?: number;
  savings?: number;
  debts?: Array<{
    name: string;
    balance: number;
    apr: number;
    minimumPayment: number;
  }>;
}

export interface TokenEvent {
  token: string;
}

export interface GenerationCompleteEvent {
  response: string;
}

export interface ErrorEvent {
  error: string;
}

// Native module interface
interface FortunaModelInterface {
  loadModel(quantization: 'int8' | 'int4'): Promise<LoadResult>;
  generate(prompt: string, maxTokens: number, temperature: number): Promise<GenerateResult>;
  chat(message: string, context: string): Promise<GenerateResult>;
  generateFinancialVibe(userData: UserData): Promise<VibeResult>;
  isModelLoaded(): Promise<ModelLoadedResult>;
  unloadModel(): Promise<{ success: boolean }>;
  generateStreaming(prompt: string, maxTokens: number, temperature: number): Promise<GenerateResult>;
}

// Get the native module
const { FortunaModel: NativeFortunaModel } = NativeModules;

// Check if native module is available
const isNativeModuleAvailable = Platform.OS === 'ios' && NativeFortunaModel != null;

// Create event emitter for streaming events
const eventEmitter = isNativeModuleAvailable 
  ? new NativeEventEmitter(NativeFortunaModel)
  : null;

/**
 * FortunaModel - On-device LLM interface
 * 
 * This class provides methods to interact with the Fortuna AI model
 * running locally on the device via ExecuTorch.
 */
class FortunaModelClass {
  private isLoaded = false;

  /**
   * Check if native module is available
   */
  get isAvailable(): boolean {
    return isNativeModuleAvailable;
  }

  /**
   * Load the model with specified quantization
   * @param quantization - 'int8' for better quality, 'int4' for smaller size
   */
  async loadModel(quantization: 'int8' | 'int4' = 'int8'): Promise<LoadResult> {
    if (!isNativeModuleAvailable) {
      console.warn('FortunaModel: Native module not available, using mock mode');
      this.isLoaded = true;
      return { success: true, message: 'Mock mode - native module not available' };
    }

    try {
      const result = await (NativeFortunaModel as FortunaModelInterface).loadModel(quantization);
      this.isLoaded = result.success;
      return result;
    } catch (error) {
      console.error('FortunaModel: Failed to load model', error);
      throw error;
    }
  }

  /**
   * Generate a response for a given prompt
   * @param prompt - The input prompt
   * @param maxTokens - Maximum tokens to generate (default: 256)
   * @param temperature - Sampling temperature 0-1 (default: 0.7)
   */
  async generate(
    prompt: string,
    maxTokens: number = 256,
    temperature: number = 0.7
  ): Promise<string> {
    if (!isNativeModuleAvailable) {
      return this.mockGenerate(prompt);
    }

    try {
      const result = await (NativeFortunaModel as FortunaModelInterface).generate(
        prompt,
        maxTokens,
        temperature
      );
      return result.response;
    } catch (error) {
      console.error('FortunaModel: Generation failed', error);
      throw error;
    }
  }

  /**
   * Chat with the model using financial context
   * @param message - User's message
   * @param context - Financial context string
   */
  async chat(message: string, context: string): Promise<string> {
    if (!isNativeModuleAvailable) {
      return this.mockChat(message, context);
    }

    try {
      const result = await (NativeFortunaModel as FortunaModelInterface).chat(message, context);
      return result.response;
    } catch (error) {
      console.error('FortunaModel: Chat failed', error);
      throw error;
    }
  }

  /**
   * Generate a Financial Vibe profile
   * @param userData - User's financial data
   */
  async generateFinancialVibe(userData: UserData): Promise<string> {
    if (!isNativeModuleAvailable) {
      return this.mockGenerateVibe(userData);
    }

    try {
      const result = await (NativeFortunaModel as FortunaModelInterface).generateFinancialVibe(userData);
      return result.vibe;
    } catch (error) {
      console.error('FortunaModel: Vibe generation failed', error);
      throw error;
    }
  }

  /**
   * Check if the model is loaded
   */
  async checkIsLoaded(): Promise<boolean> {
    if (!isNativeModuleAvailable) {
      return this.isLoaded;
    }

    try {
      const result = await (NativeFortunaModel as FortunaModelInterface).isModelLoaded();
      this.isLoaded = result.loaded;
      return result.loaded;
    } catch (error) {
      console.error('FortunaModel: Failed to check model status', error);
      return false;
    }
  }

  /**
   * Unload the model from memory
   */
  async unload(): Promise<void> {
    if (!isNativeModuleAvailable) {
      this.isLoaded = false;
      return;
    }

    try {
      await (NativeFortunaModel as FortunaModelInterface).unloadModel();
      this.isLoaded = false;
    } catch (error) {
      console.error('FortunaModel: Failed to unload model', error);
      throw error;
    }
  }

  /**
   * Subscribe to token generation events (for streaming)
   * @param callback - Function called for each generated token
   */
  onTokenGenerated(callback: (token: string) => void): () => void {
    if (!eventEmitter) {
      return () => {};
    }

    const subscription = eventEmitter.addListener('onTokenGenerated', (event: TokenEvent) => {
      callback(event.token);
    });

    return () => subscription.remove();
  }

  /**
   * Subscribe to generation completion events
   * @param callback - Function called when generation completes
   */
  onGenerationComplete(callback: (response: string) => void): () => void {
    if (!eventEmitter) {
      return () => {};
    }

    const subscription = eventEmitter.addListener('onGenerationComplete', (event: GenerationCompleteEvent) => {
      callback(event.response);
    });

    return () => subscription.remove();
  }

  /**
   * Subscribe to error events
   * @param callback - Function called on error
   */
  onError(callback: (error: string) => void): () => void {
    if (!eventEmitter) {
      return () => {};
    }

    const subscription = eventEmitter.addListener('onError', (event: ErrorEvent) => {
      callback(event.error);
    });

    return () => subscription.remove();
  }

  // MARK: - Mock implementations for web/testing

  private mockGenerate(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockResponse(prompt));
      }, 500);
    });
  }

  private mockChat(message: string, _context: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockResponse(message));
      }, 500);
    });
  }

  private mockGenerateVibe(userData: UserData): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savings = userData.savings ?? 0;
        const debt = userData.debts?.reduce((sum, d) => sum + d.balance, 0) ?? 0;
        
        let vibe = 'Glow Up in Progress';
        if (savings > 10000 && debt < 1000) vibe = 'Main Character Energy';
        else if (debt > savings * 2) vibe = 'Debt Slayer Mode';
        else if (savings < 1000) vibe = 'Planting Seeds';
        
        resolve(JSON.stringify({
          primaryVibe: vibe,
          riskProfile: 'Calculated Risk-Taker',
          summary: "You're building something great! Keep that momentum going and watch your wealth grow. 💚",
          priorities: ['Build emergency fund', 'Pay off high-interest debt', 'Start investing basics']
        }));
      }, 500);
    });
  }

  private getMockResponse(input: string): string {
    const lower = input.toLowerCase();
    
    if (lower.includes('laptop') || lower.includes('buy') || lower.includes('purchase')) {
      return "Before making that purchase, let's make sure your emergency fund is solid! Do you have at least 3 months of expenses saved? 💰";
    } else if (lower.includes('debt') || lower.includes('pay off') || lower.includes('credit card')) {
      return "Smart thinking on tackling debt! Focus on the highest interest rate first - that's usually credit cards. Even small extra payments make a big difference! 📈";
    } else if (lower.includes('save') || lower.includes('saving')) {
      return "Building your savings is a great move! Try the 50/30/20 rule - 50% needs, 30% wants, 20% savings. Start small and stay consistent! 🎯";
    } else if (lower.includes('invest')) {
      return "Love the investing mindset! But first, make sure you have an emergency fund. Then consider starting with low-cost index funds. 📊";
    } else if (lower.includes('budget')) {
      return "Budgeting doesn't have to be boring! Track your spending for a week first, then set realistic limits. Apps can help automate this! 📱";
    }
    
    return "I'm here to help with your money questions! Ask me about budgeting, saving, debt, or any financial decisions. 💚";
  }
}

// Export singleton instance
export const FortunaModel = new FortunaModelClass();

// Export default
export default FortunaModel;
