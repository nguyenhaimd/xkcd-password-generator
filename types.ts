
export enum PasswordType {
  RANDOM = 'RANDOM',
  MEMORABLE = 'MEMORABLE' // AI Powered
}

export interface PasswordConfig {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  easyToSay: boolean;   // Avoid numbers and symbols
  easyToRead: boolean;  // Avoid ambiguous characters like l, 1, O, 0
}

export interface HistoryItem {
  id: string;
  password: string;
  generatedAt: number;
  type: PasswordType;
  strength?: string;
}

export interface AIPassphraseConfig {
  wordCount: number;
  separator: string;
  theme: string;
  includeNumber: boolean;
  capitalize: boolean;
}

export interface QuizCard {
  id: string;
  chapter: string; // e.g., "Chapter 1: Foundations"
  category: string; // e.g., "The DOM"
  question: string;
  answer: string;
  codeSnippet?: string; // Optional code example
}
