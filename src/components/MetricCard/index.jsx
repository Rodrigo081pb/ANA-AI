// Componente para exibir uma métrica individual do prompt
import React from 'react';
import { CheckCircle, Info, FileText, Target, AlertCircle } from 'lucide-react';

/**
 * Exibe uma métrica (clareza, contexto, etc) com barra de progresso.
 */
export default function MetricCard({ title, score, metric, subtitle }) {
  const icons = {
    clareza: CheckCircle,
    contexto: Info,
    comprimento: FileText,
    foco: Target,
    tom: AlertCircle
  };

  const colors = {
    clareza: 'text-blue-500',
    contexto: 'text-green-500',
    comprimento: 'text-purple-500',
    foco: 'text-orange-500',
    tom: 'text-red-500'
  };

  const Icon = icons[metric] || CheckCircle;
  const color = colors[metric] || 'text-blue-500';
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">{title}</span>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          </div>
        </div>
        <div className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
          {score}
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
            score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
            'bg-gradient-to-r from-red-400 to-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
