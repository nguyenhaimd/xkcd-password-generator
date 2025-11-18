import React from 'react';
import { PasswordConfig } from '../types';
import { Settings2, CheckCircle2, Circle } from 'lucide-react';

interface ControlsProps {
  config: PasswordConfig;
  onChange: (newConfig: PasswordConfig) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  
  const update = (key: keyof PasswordConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  // Helper to enforce at least one checkbox is checked or handle dependencies
  const toggleOption = (key: keyof PasswordConfig) => {
    // Prevent unchecking the last remaining character set option if in "All characters" mode
    if (!config.easyToSay && 
        ['useUppercase', 'useLowercase', 'useNumbers', 'useSymbols'].includes(key)) {
        const activeCount = [config.useUppercase, config.useLowercase, config.useNumbers, config.useSymbols].filter(Boolean).length;
        // @ts-ignore
        if (activeCount === 1 && config[key]) return; 
    }
    // @ts-ignore
    update(key, !config[key]);
  };

  return (
    <div className="space-y-8">
      
      {/* Length Slider */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Password Length</label>
          <span className="text-3xl font-bold text-gray-800 font-mono">{config.length}</span>
        </div>
        <input
          type="range"
          min="4"
          max="50"
          value={config.length}
          onChange={(e) => update('length', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
          <span>4</span>
          <span>50</span>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Radio Options (Password Types) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-gray-900">Requirement Mode</h3>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                <div className={`mt-0.5 ${!config.easyToSay && !config.easyToRead ? 'text-red-600' : 'text-gray-300'}`}>
                    {!config.easyToSay && !config.easyToRead ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={!config.easyToSay && !config.easyToRead}
                    onChange={() => onChange({...config, easyToSay: false, easyToRead: false})}
                />
                <div>
                    <span className="block font-medium text-gray-900">All Characters</span>
                    <span className="text-xs text-gray-500">Any character combination. Most secure.</span>
                </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                <div className={`mt-0.5 ${config.easyToSay ? 'text-red-600' : 'text-gray-300'}`}>
                    {config.easyToSay ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={config.easyToSay}
                    onChange={() => onChange({...config, easyToSay: true, easyToRead: false, useNumbers: false, useSymbols: false})}
                />
                <div>
                    <span className="block font-medium text-gray-900">Easy to say</span>
                    <span className="text-xs text-gray-500">Avoids numbers and special characters.</span>
                </div>
            </label>

             <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                <div className={`mt-0.5 ${config.easyToRead ? 'text-red-600' : 'text-gray-300'}`}>
                    {config.easyToRead ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <input 
                    type="radio" 
                    className="hidden" 
                    checked={config.easyToRead}
                    onChange={() => onChange({...config, easyToRead: true, easyToSay: false})}
                />
                <div>
                    <span className="block font-medium text-gray-900">Easy to read</span>
                    <span className="text-xs text-gray-500">Avoids ambiguous characters like l, 1, O, 0.</span>
                </div>
            </label>
        </div>

        {/* Checkbox Options */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-semibold text-gray-900">Character Sets</h3>
            </div>
            
            <div className="space-y-1">
                <OptionCheckbox 
                    label="Uppercase" 
                    checked={config.useUppercase} 
                    onChange={() => toggleOption('useUppercase')}
                    sample="ABC"
                />
                <OptionCheckbox 
                    label="Lowercase" 
                    checked={config.useLowercase} 
                    onChange={() => toggleOption('useLowercase')}
                    sample="abc"
                />
                <OptionCheckbox 
                    label="Numbers" 
                    checked={config.useNumbers} 
                    onChange={() => toggleOption('useNumbers')}
                    disabled={config.easyToSay}
                    sample="123"
                />
                <OptionCheckbox 
                    label="Symbols" 
                    checked={config.useSymbols} 
                    onChange={() => toggleOption('useSymbols')}
                    disabled={config.easyToSay}
                    sample="!@#"
                />
            </div>
        </div>

      </div>
    </div>
  );
};

const OptionCheckbox = ({ label, checked, onChange, disabled, sample }: { label: string, checked: boolean, onChange: () => void, disabled?: boolean, sample: string }) => (
    <label className={`flex items-center justify-between p-3 rounded-lg transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked && !disabled ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300 bg-white text-transparent'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <input type="checkbox" className="hidden" checked={checked} onChange={onChange} disabled={disabled} />
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{sample}</span>
    </label>
);

export default Controls;