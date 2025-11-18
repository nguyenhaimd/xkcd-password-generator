import React, { useState, useEffect, useCallback } from 'react';
import { PasswordConfig, AIPassphraseConfig, HistoryItem, PasswordType } from './types';
import { generateClientSidePassword, calculateStrength } from './utils/passwordUtils';
import { generateAIPassphrase } from './services/geminiService';
import PasswordDisplay from './components/PasswordDisplay';
import Controls from './components/Controls';
import AIControls from './components/AIControls';
import History from './components/History';
import { Lock, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Standard Generator State
  const [config, setConfig] = useState<PasswordConfig>({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    easyToSay: false,
    easyToRead: false,
  });

  // AI Generator State
  const [aiConfig, setAiConfig] = useState<AIPassphraseConfig>({
    wordCount: 4,
    separator: '-',
    theme: '',
    includeNumber: true,
    capitalize: true,
  });

  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<'standard' | 'ai'>('standard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize
  useEffect(() => {
    generateStandard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToHistory = (pwd: string, type: PasswordType) => {
    const strength = calculateStrength(pwd);
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random(),
      password: pwd,
      generatedAt: Date.now(),
      type,
      strength: strength.label
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
  };

  const generateStandard = useCallback(() => {
    setLoading(true);
    // Small timeout to allow UI to show loading state if operation was heavy (it's not, but for UX consistency)
    setTimeout(() => {
        const newPassword = generateClientSidePassword(config);
        setPassword(newPassword);
        addToHistory(newPassword, PasswordType.RANDOM);
        setLoading(false);
    }, 100);
  }, [config]);

  const generateAI = async () => {
    setLoading(true);
    try {
        const newPassword = await generateAIPassphrase(aiConfig);
        setPassword(newPassword);
        addToHistory(newPassword, PasswordType.MEMORABLE);
    } catch (error) {
        console.error(error);
        alert("Failed to generate password. Please check your configuration and connection.");
    } finally {
        setLoading(false);
    }
  };

  // Effect to auto-regenerate standard password when config changes
  // Debounce slightly to avoid rapid re-renders on slider drag
  useEffect(() => {
    if (mode === 'standard') {
        const timer = setTimeout(() => {
            const newPassword = generateClientSidePassword(config);
            setPassword(newPassword);
            // Don't add to history on every slide, only manual or final
        }, 50);
        return () => clearTimeout(timer);
    }
  }, [config, mode]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                    <Lock className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-gray-900 truncate">
                  HighWind's Fabulous <span className="text-red-600">Password Generator</span>
                </span>
            </div>
            <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-shrink-0">
                <button 
                    onClick={() => setMode('standard')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'standard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Standard
                </button>
                 <button 
                    onClick={() => setMode('ai')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${mode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    XKCD Mode
                </button>
            </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* Display Section */}
        <div className="mb-8">
            <PasswordDisplay 
                password={password} 
                loading={loading}
                onRefresh={mode === 'standard' ? generateStandard : generateAI}
            />
        </div>

        {/* Controls Section */}
        <div className="transition-all duration-300 ease-in-out">
            {mode === 'standard' ? (
                <Controls config={config} onChange={setConfig} />
            ) : (
                <AIControls 
                    config={aiConfig} 
                    onChange={setAiConfig} 
                    onGenerate={generateAI} 
                    loading={loading} 
                />
            )}
        </div>

        {/* History Section */}
        <History items={history} onClear={() => setHistory([])} />

      </main>
    </div>
  );
};

export default App;