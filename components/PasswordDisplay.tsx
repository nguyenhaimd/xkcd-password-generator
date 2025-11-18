import React, { useState, useEffect } from 'react';
import { Copy, RotateCw, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { calculateStrength } from '../utils/passwordUtils';

interface PasswordDisplayProps {
  password: string;
  onRefresh: () => void;
  loading?: boolean;
}

const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ password, onRefresh, loading }) => {
  const [copied, setCopied] = useState(false);
  const strength = calculateStrength(password);

  useEffect(() => {
    setCopied(false);
  }, [password]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full">
        {/* Main Display Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[200px]">
                
                {/* Password Text */}
                <div className="relative w-full text-center group mb-6">
                    <div className={`text-3xl md:text-5xl font-bold tracking-tight break-words font-mono transition-opacity duration-200 ${loading ? 'opacity-50 blur-sm' : 'text-gray-800'}`}>
                        {password}
                    </div>
                </div>

                {/* Strength Badge - Moved below password to avoid overlap */}
                <div className="flex justify-center mb-8">
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                         strength.score >= 3 ? 'bg-green-50 text-green-700 border-green-100' :
                         strength.score === 2 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                         'bg-red-50 text-red-700 border-red-100'
                     }`}>
                        {strength.score >= 3 ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {strength.label}
                     </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all hover:rotate-180 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/20 border border-gray-200"
                        title="Generate New"
                    >
                        <RotateCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    
                    <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold tracking-wide transition-all active:scale-95 shadow-sm
                            ${copied 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
                            }`}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                    </button>
                </div>
            </div>

            {/* Strength Bar Meter */}
            <div className="h-1.5 w-full bg-gray-100 flex">
                <div 
                    className={`h-full transition-all duration-500 ease-out ${strength.color}`} 
                    style={{ width: password ? '25%' : '0%' }}
                />
                <div 
                    className={`h-full transition-all duration-500 ease-out delay-75 ${strength.color}`} 
                    style={{ width: strength.score >= 2 ? '25%' : '0%' }}
                />
                <div 
                    className={`h-full transition-all duration-500 ease-out delay-100 ${strength.color}`} 
                    style={{ width: strength.score >= 3 ? '25%' : '0%' }}
                />
                <div 
                    className={`h-full transition-all duration-500 ease-out delay-150 ${strength.color}`} 
                    style={{ width: strength.score >= 4 ? '25%' : '0%' }}
                />
            </div>
        </div>
    </div>
  );
};

export default PasswordDisplay;