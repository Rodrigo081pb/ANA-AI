// Página principal do Prompt Analyzer Pro
import React, { useState } from 'react';
import AnalyzeTab from '../components/AnalyzeTab';
import HistoryTab from '../components/HistoryTab';
import DashboardTab from '../components/DashboardTab';
import Navbar from '../components/Navbar';
import usePromptDb from '../hooks/usePromptDb';

/**
 * Página principal que gerencia as abas e o banco de dados local.
 */
export default function PromptAnalyzerPage() {
  const [activeTab, setActiveTab] = useState('analyze');
  const db = usePromptDb();

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-2 sm:px-4 py-6 max-w-7xl mt-24">
        {activeTab === 'analyze' && <AnalyzeTab db={db} />}
        {activeTab === 'history' && <HistoryTab db={db} />}
        {activeTab === 'dashboard' && <DashboardTab db={db} />}
      </main>
    </div>
  );
}
