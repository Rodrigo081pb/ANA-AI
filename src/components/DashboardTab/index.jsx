// Componente responsável pelo dashboard de KPIs e gráfico
import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';

/**
 * Exibe KPIs e gráfico de barras do histórico de análises.
 */
export default function DashboardTab({ db }) {
  const { stats, analyses } = db.database;
  // KPIs
  const kpis = [
    { icon: TrendingUp, label: 'Pontuação Média', value: `${stats.avgScore}%`, color: 'text-green-500' },
    { icon: CheckCircle, label: 'Melhor Score', value: `${stats.bestScore}%`, color: 'text-purple-500' },
    { icon: Clock, label: 'Última Análise', value: stats.lastAnalysis ? new Date(stats.lastAnalysis).toLocaleDateString('pt-BR') : 'N/A', color: 'text-orange-500' },
  ];
  // Gráfico de barras simples (histórico)
  const barData = analyses.slice(0, 10).reverse();
  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-600 mb-1">{stats.totalAnalyses}</span>
          <span className="text-gray-500">Análises Realizadas</span>
        </div>
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center">
            <kpi.icon className={`w-6 h-6 mb-1 ${kpi.color}`} />
            <span className="text-xl font-bold text-gray-800">{kpi.value}</span>
            <span className="text-gray-500 text-sm">{kpi.label}</span>
          </div>
        ))}
      </div>
      {/* Gráfico de barras custom simples */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Histórico de Pontuação (últimas 10 análises)
        </h3>
        {barData.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Nenhuma análise para exibir.</div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {barData.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center w-6">
                <div
                  className={`rounded-t-lg ${item.overallScore >= 80 ? 'bg-green-400' : item.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ height: `${item.overallScore * 1.2}px`, minHeight: '10px', width: '100%' }}
                  title={`Score: ${item.overallScore}%`}
                />
                <span className="text-xs text-gray-500 mt-1">{item.overallScore}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
