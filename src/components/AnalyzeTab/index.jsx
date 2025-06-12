// Componente responsável pela análise de prompts
import React, { useState, useRef } from 'react';
import { X, ClipboardPaste, FileText } from 'lucide-react';
import { analyzePrompt } from '../../utils/analyzePrompt';
import MetricCard from '../MetricCard';
import Suggestions from '../Suggestions';

/**
 * Componente de análise de prompt com UI e integração com banco local.
 */
export default function AnalyzeTab({ db }) {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const textareaRef = useRef();

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzePrompt(prompt);
    setAnalysis(result);
    db.saveToDatabase(result);
    setIsAnalyzing(false);
  };

  // Função para colar exemplo
  const pasteExample = () => {
    setPrompt('Explique o conceito de aprendizado de máquina para um estudante do ensino médio, usando exemplos práticos e linguagem simples.');
  };
  // Função para limpar
  const clearPrompt = () => setPrompt('');

  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 shadow-lg border border-[#3B4252] bg-[rgba(46,52,64,0.8)] backdrop-blur-lg transition-colors duration-300 max-w-2xl mx-auto mt-8 md:mt-12">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-7 h-7 text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-100 tracking-tight drop-shadow">Digite seu Prompt</h2>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ex: Gere um resumo objetivo sobre a Revolução Francesa para alunos do 9º ano. Seja didático e use exemplos."
            className="w-full min-h-[120px] max-h-[320px] p-4 pr-16 rounded-xl resize-none focus:ring-2 focus:ring-[#5E81AC] focus:border-[#5E81AC] border border-[#3B4252] bg-[#2A2D3A] text-[#E5E9F0] placeholder:text-[#6B7280] text-base transition-all duration-300 shadow-inner outline-none hover:border-blue-400"
            style={{overflowY: 'auto'}}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            maxLength={400}
            aria-label="Área de digitação do prompt"
          />
          {/* Limpar texto */}
          {prompt && (
            <button
              onClick={clearPrompt}
              className="absolute top-3 right-12 text-gray-400 hover:text-red-500 transition-colors"
              title="Limpar texto"
              tabIndex={0}
              aria-label="Limpar texto"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Colar exemplo */}
          <button
            onClick={pasteExample}
            className="absolute top-3 right-4 text-gray-400 hover:text-blue-400 transition-colors"
            title="Colar exemplo"
            tabIndex={0}
            aria-label="Colar exemplo"
          >
            <ClipboardPaste className="w-5 h-5" />
          </button>
        </div>
        {/* Indicador de limite de caracteres com barra de progresso */}
        <div className="mt-2 flex items-center gap-2 text-xs">
          <div className="flex-1 h-2 bg-[#3B4252] rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${prompt.length < 300 ? 'bg-blue-400' : prompt.length < 390 ? 'bg-yellow-400' : 'bg-red-500 animate-pulse'}`}
              style={{ width: `${(prompt.length / 400) * 100}%` }}
            />
          </div>
          <span className={`ml-2 font-semibold ${prompt.length > 390 ? 'text-red-400' : prompt.length > 300 ? 'text-yellow-400' : 'text-[#D8DEE9]'}`}>{prompt.length}/400</span>
        </div>
        {/* Métricas de status com destaque */}
        <div className="flex flex-wrap gap-2 text-base text-[#D8DEE9] font-medium mt-4 justify-between animate-fade-in">
          <span><b>{prompt.length}</b> caracteres</span>
          <span className="mx-1">|</span>
          <span><b>{prompt.trim().split(/\s+/).filter(w => w).length}</b> palavras</span>
          <span className="mx-1">|</span>
          <span>~<b>{Math.ceil(prompt.trim().split(/\s+/).filter(w => w).length * 1.3)}</b> tokens</span>
        </div>
        {/* Botão de análise */}
        <button
          onClick={handleAnalyze}
          disabled={!prompt.trim() || isAnalyzing}
          className={`w-full mt-6 bg-gradient-to-r from-[#5E81AC] to-[#88C0D0] hover:scale-[1.02] active:scale-100 focus:ring-2 focus:ring-blue-400 shadow-lg shadow-blue-900/30 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isAnalyzing ? 'animate-pulse' : ''}`}
          style={{ boxShadow: '0 4px 12px rgba(94,129,172,0.3)' }}
          aria-busy={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Analisando IA...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Analisar com IA
            </>
          )}
        </button>
      </div>
      {/* Resultados e sugestões */}
      {analysis && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl text-center">
            <div className="text-6xl sm:text-7xl font-bold mb-4">
              {analysis.overallScore}<span className="text-3xl sm:text-4xl">%</span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold mb-2">
              {analysis.overallScore >= 80 ? '🚀 Excelente Prompt!' : analysis.overallScore >= 60 ? '👍 Bom Prompt' : '⚡ Pode Melhorar'}
            </div>
            <div className="text-blue-100">Análise realizada em {analysis.timestamp}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Clareza" subtitle="Estrutura e legibilidade" score={analysis.metrics.clareza} metric="clareza" />
            <MetricCard title="Contexto" subtitle="Informações de fundo" score={analysis.metrics.contexto} metric="contexto" />
            <MetricCard title="Comprimento" subtitle="Tamanho otimizado" score={analysis.metrics.comprimento} metric="comprimento" />
            <MetricCard title="Foco" subtitle="Objetivos claros" score={analysis.metrics.foco} metric="foco" />
            <MetricCard title="Tom" subtitle={analysis.metrics.tom.tom} score={analysis.metrics.tom.score} metric="tom" />
          </div>
          <Suggestions suggestions={analysis.suggestions} />
        </div>
      )}
    </div>
  );
}
