import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <div className="rounded-2xl p-6 shadow-lg border border-gray-800 bg-black/70 backdrop-blur-md transition-colors duration-300">
      {/* Header minimalista */}
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 bg-yellow-900 rounded-lg">
          <TrendingUp className="w-5 h-5 text-yellow-300" />
        </span>
        <h3 className="text-xl font-semibold text-gray-100">Sugestões Inteligentes de Melhoria</h3>
      </div>
      <div className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-yellow-800 bg-yellow-900/60 hover:shadow-md transition-all">
            <div className="text-2xl">{suggestion.icon}</div>
            <div className="flex-1">
              <div className="font-semibold mb-1 text-gray-100">{suggestion.title}</div>
              <div className="text-sm text-gray-300">{suggestion.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
