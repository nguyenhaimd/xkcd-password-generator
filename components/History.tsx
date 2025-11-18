import React from 'react';
import { HistoryItem, PasswordType } from '../types';
import { History as HistoryIcon, Copy, Sparkles, Lock } from 'lucide-react';
import { copyToClipboard } from '../utils/passwordUtils';

interface HistoryProps {
  items: HistoryItem[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ items, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-500">
                <HistoryIcon className="w-5 h-5" />
                <h3 className="font-semibold uppercase tracking-wider text-sm">Recently Generated</h3>
            </div>
            <button 
                onClick={onClear}
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
            >
                Clear History
            </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`p-2 rounded-full ${item.type === PasswordType.MEMORABLE ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                            {item.type === PasswordType.MEMORABLE ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="font-mono font-medium text-gray-800 truncate pr-4 text-lg">{item.password}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-2">
                                <span>{new Date(item.generatedAt).toLocaleTimeString()}</span>
                                {item.strength && (
                                    <>
                                        <span>•</span>
                                        <span className={`${
                                            item.strength === 'Strong' ? 'text-green-600' : 
                                            item.strength === 'Good' ? 'text-yellow-600' : 'text-red-500'
                                        }`}>{item.strength}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => copyToClipboard(item.password)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default History;