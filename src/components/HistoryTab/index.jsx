// Componente responsável pelo histórico de análises
import React, { useState } from 'react';
import { History, Trash2 } from 'lucide-react';

/**
 * Exibe o histórico de análises realizadas, com filtros e ordenação.
 */
export default function HistoryTab({ db }) {
  const [filterScore, setFilterScore] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const getFilteredAnalyses = () => {
    let filtered = db.database.analyses;
    if (filterScore !== 'all') {
      if (filterScore === 'excellent') filtered = filtered.filter(a => a.overallScore >= 80);
      if (filterScore === 'good') filtered = filtered.filter(a => a.overallScore >= 60 && a.overallScore < 80);
      if (filterScore === 'needs_work') filtered = filtered.filter(a => a.overallScore < 60);
    }
    if (sortBy === 'recent') {
      filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'score_high') {
      filtered = [...filtered].sort((a, b) => b.overallScore - a.overallScore);
    } else if (sortBy === 'score_low') {
      filtered = [...filtered].sort((a, b) => a.overallScore - b.overallScore);
    }
    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Histórico de Análises</h2>
              <p className="text-sm text-gray-500">{db.database.analyses.length} análises salvas</p>
            </div>
          </div>
          {db.database.analyses.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <select value={filterScore} onChange={e => setFilterScore(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="all">Todas as pontuações</option>
                <option value="excellent">Excelente (80%+)</option>
                <option value="good">Bom (60-79%)</option>
                <option value="needs_work">Precisa melhorar (&lt;60%)</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <option value="recent">Mais recentes</option>
                <option value="score_high">Maior pontuação</option>
                <option value="score_low">Menor pontuação</option>
              </select>
              <button onClick={db.clearHistory} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm">
                <Trash2 className="w-4 h-4" />
                Limpar
              </button>
            </div>
          )}
        </div>
      </div>
      {getFilteredAnalyses().length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {db.database.analyses.length === 0 ? 'Nenhuma análise ainda' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-gray-500">
            {db.database.analyses.length === 0
              ? 'Analise seu primeiro prompt para começar a construir seu histórico!'
              : 'Tente ajustar os filtros para encontrar suas análises.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredAnalyses().map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{db.database.analyses.length - index}</span>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                  </div>
                  <div className="font-medium text-gray-800 mb-2 text-sm sm:text-base">{item.prompt}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Clareza</span>
                      <span className="font-semibold">{item.metrics.clareza}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Contexto</span>
                      <span className="font-semibold">{item.metrics.contexto}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Comprimento</span>
                      <span className="font-semibold">{item.metrics.comprimento}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Foco</span>
                      <span className="font-semibold">{item.metrics.foco}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Tom</span>
                      <span className="font-semibold">{item.metrics.tom.score}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[80px]">
                  <span className={`text-lg font-bold ${item.overallScore >= 80 ? 'text-green-500' : item.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{item.overallScore}%</span>
                  <span className="text-xs text-gray-400">{item.category === 'excellent' ? 'Excelente' : item.category === 'good' ? 'Bom' : 'Precisa melhorar'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
