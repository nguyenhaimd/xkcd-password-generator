import React, { useState } from 'react';
import { AIPassphraseConfig } from '../types';
import { Sparkles, BrainCircuit, Dice5, CheckCircle2, ExternalLink } from 'lucide-react';

interface AIControlsProps {
  config: AIPassphraseConfig;
  onChange: (newConfig: AIPassphraseConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}

const AIControls: React.FC<AIControlsProps> = ({ config, onChange, onGenerate, loading }) => {
  const [customTheme, setCustomTheme] = useState(config.theme);

  const handleThemeBlur = () => {
    onChange({ ...config, theme: customTheme });
  };

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-900">
                 <Sparkles className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-bold text-lg">XKCD Password Generator</h3>
              </div>
              <a 
                href="https://xkcd.com/936/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1 rounded-full border border-indigo-100 shadow-sm transition-all hover:shadow-md"
              >
                <span>Reference: XKCD 936</span>
                <ExternalLink className="w-3 h-3" />
              </a>
          </div>
          <p className="text-sm text-indigo-700/80 mb-6 leading-relaxed">
             Uses Google's Gemini 2.5 Flash model to generate high-entropy passphrases based on the logic from the popular <a href="https://xkcd.com/936/" target="_blank" rel="noopener noreferrer" className="underline decoration-indigo-300 underline-offset-2 hover:text-indigo-900 font-semibold">XKCD Comic #936</a>. These passwords ("Correct Horse Battery Staple") are easier for humans to remember but mathematically difficult for computers to guess.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Word Count */}
              <div>
                  <label className="block text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">Word Count</label>
                  <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="3" 
                        max="8" 
                        value={config.wordCount} 
                        onChange={(e) => onChange({...config, wordCount: parseInt(e.target.value)})}
                        className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="w-8 text-center font-mono font-bold text-indigo-900 text-lg">{config.wordCount}</span>
                  </div>
              </div>

              {/* Separator */}
              <div>
                  <label className="block text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">Separator</label>
                  <div className="flex gap-2">
                      {['-', '_', '.', 'Space'].map((sep) => (
                          <button
                            key={sep}
                            onClick={() => onChange({...config, separator: sep === 'Space' ? ' ' : sep})}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                                (config.separator === (sep === 'Space' ? ' ' : sep))
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                : 'bg-white text-gray-600 border border-indigo-100 hover:bg-indigo-50'
                            }`}
                          >
                              {sep}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Theme Input */}
              <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-2">Context / Theme (Optional)</label>
                  <div className="relative">
                    <BrainCircuit className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input 
                        type="text" 
                        placeholder="e.g., 'Space exploration', 'Medieval fantasy', or leave blank for random"
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        onBlur={handleThemeBlur}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-indigo-300/70 text-indigo-900"
                    />
                  </div>
              </div>

              {/* Toggles */}
              <div className="md:col-span-2 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.capitalize ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-indigo-200 group-hover:border-indigo-300'}`}>
                          {config.capitalize && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={config.capitalize} onChange={() => onChange({...config, capitalize: !config.capitalize})} />
                      <span className="text-indigo-900 font-medium text-sm">Capitalize Words</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.includeNumber ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-indigo-200 group-hover:border-indigo-300'}`}>
                          {config.includeNumber && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={config.includeNumber} onChange={() => onChange({...config, includeNumber: !config.includeNumber})} />
                      <span className="text-indigo-900 font-medium text-sm">Include Number</span>
                  </label>
              </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={loading}
            className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
              {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                  <Dice5 className="w-5 h-5" />
              )}
              <span>Generate XKCD Passphrase</span>
          </button>
       </div>
    </div>
  );
};

export default AIControls;