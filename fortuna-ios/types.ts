
export enum AppState {
  WELCOME = 'WELCOME',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  SAVINGS = 'SAVINGS',
  DEBT = 'DEBT',
  PROFILE = 'PROFILE',
  EXECUTORCH_TEST = 'EXECUTORCH_TEST'
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  apr: number;
  type: 'credit_card' | 'student_loan' | 'car_loan';
  minimumPayment?: number;
}

export interface UserData {
  name: string;
  age: number;
  workSituation: string;
  monthlyIncome: number;
  debts: Debt[];
  savings: number;
  vibe: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: Date;
  insight?: FinancialInsight;
}

export interface FinancialInsight {
  savings: number;
  impact: string;
  recommendation: string;
}
