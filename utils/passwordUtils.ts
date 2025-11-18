import { PasswordConfig } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const AMBIGUOUS = 'l1O0';

export const calculateStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (!password) return { score: 0, label: 'Empty', color: 'bg-gray-200' };

  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: 'Very Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Weak', color: 'bg-orange-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
  if (score >= 4) return { score: 4, label: 'Strong', color: 'bg-green-500' };
  return { score: 0, label: 'Too Short', color: 'bg-red-500' };
};

export const generateClientSidePassword = (config: PasswordConfig): string => {
  let charset = '';
  let excluded = '';

  if (config.easyToRead) {
    excluded += AMBIGUOUS;
  }

  if (config.easyToSay) {
    // Easy to say implies avoiding numbers and symbols mostly, keeping it vocal
    // LastPass definition: Avoid numbers and special characters.
    if (config.useUppercase) charset += UPPERCASE;
    if (config.useLowercase) charset += LOWERCASE;
  } else {
    // "All characters" or normal mode
    if (config.useUppercase) charset += UPPERCASE;
    if (config.useLowercase) charset += LOWERCASE;
    if (config.useNumbers) charset += NUMBERS;
    if (config.useSymbols) charset += SYMBOLS;
  }

  // Filter out ambiguous if requested
  if (config.easyToRead) {
    charset = charset.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
  }

  // Fallback to avoid empty charset
  if (charset.length === 0) {
    charset = LOWERCASE; // Default safety
  }

  let password = '';
  const array = new Uint32Array(config.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < config.length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};