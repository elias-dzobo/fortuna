export interface MiniEvalCase {
  id: string;
  prompt: string;
  requiredKeywords: string[];
}

// Small, deterministic prompt set for comparing model variants on-device.
export const MINI_EVAL_PROMPTS: MiniEvalCase[] = [
  {
    id: 'budget-basics',
    prompt: 'I make $3,200/month. Give me a simple starter budget.',
    requiredKeywords: ['budget', 'savings'],
  },
  {
    id: 'emergency-fund',
    prompt: 'How much should I keep in an emergency fund?',
    requiredKeywords: ['months', 'expenses'],
  },
  {
    id: 'debt-priority',
    prompt: 'Should I pay minimums on all debt then attack one, or split extra across all?',
    requiredKeywords: ['interest', 'debt'],
  },
  {
    id: 'credit-score',
    prompt: 'What are the biggest factors that affect my credit score?',
    requiredKeywords: ['payment', 'utilization'],
  },
  {
    id: 'buy-laptop',
    prompt: 'I want to buy a $1,500 laptop. How do I decide if that is safe for me?',
    requiredKeywords: ['emergency', 'savings'],
  },
  {
    id: 'investing-start',
    prompt: 'I am new to investing. What should I do first?',
    requiredKeywords: ['risk', 'diversification'],
  },
  {
    id: 'subscriptions',
    prompt: 'How can I cut monthly subscriptions without feeling deprived?',
    requiredKeywords: ['audit', 'cancel'],
  },
  {
    id: 'pay-raise',
    prompt: 'I got a raise. How should I split the extra money wisely?',
    requiredKeywords: ['savings', 'debt'],
  },
];

