import { useState, useEffect } from 'react';

const STORAGE_KEY = 'promptAnalyzerDB';
const MAX_HISTORY = 50;

export default function usePromptDB() {
  const [database, setDatabase] = useState({
    analyses: [],
    stats: {
      totalAnalyses: 0,
      avgScore: 0,
      bestScore: 0,
      worstScore: 100,
      lastAnalysis: null
    }
  });

  useEffect(() => {
    const savedDB = localStorage.getItem(STORAGE_KEY);
    if (savedDB) setDatabase(JSON.parse(savedDB));
  }, []);

  const saveToDatabase = (newAnalysis) => {
    const updatedAnalyses = [newAnalysis, ...database.analyses.slice(0, MAX_HISTORY - 1)];
    const scores = updatedAnalyses.map(a => a.overallScore);
    const newStats = {
      totalAnalyses: updatedAnalyses.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores),
      worstScore: Math.min(...scores),
      lastAnalysis: new Date().toISOString()
    };
    const newDB = { analyses: updatedAnalyses, stats: newStats };
    setDatabase(newDB);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDB));
  };

  const clearHistory = () => {
    const emptyDB = {
      analyses: [],
      stats: {
        totalAnalyses: 0,
        avgScore: 0,
        bestScore: 0,
        worstScore: 100,
        lastAnalysis: null
      }
    };
    setDatabase(emptyDB);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyDB));
  };

  return { database, saveToDatabase, clearHistory };
}
