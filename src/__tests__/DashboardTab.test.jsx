import React from 'react';
import { render } from '@testing-library/react';
import DashboardTab from '../components/DashboardTab';

// Testes unitários para DashboardTab cobrindo KPIs, gráfico e ausência de dados

describe('DashboardTab', () => {
  it('exibe KPIs e gráfico', () => {
    const db = {
      database: {
        stats: {
          avgScore: 75,
          bestScore: 98,
          lastAnalysis: new Date().toISOString(),
          totalAnalyses: 5,
        },
        analyses: [
          { id: 1, overallScore: 80 },
          { id: 2, overallScore: 60 },
          { id: 3, overallScore: 90 },
        ],
      },
    };
    const { getByText } = render(<DashboardTab db={db} />);
    expect(getByText('Pontuação Média')).toBeInTheDocument();
    expect(getByText('Melhor Score')).toBeInTheDocument();
    expect(getByText('Histórico de Pontuação (últimas 10 análises)')).toBeInTheDocument();
  });

  it('exibe mensagem se não houver análises', () => {
    const db = {
      database: {
        stats: {
          avgScore: 0,
          bestScore: 0,
          lastAnalysis: null,
          totalAnalyses: 0,
        },
        analyses: [],
      },
    };
    const { getByText } = render(<DashboardTab db={db} />);
    expect(getByText('Nenhuma análise para exibir.')).toBeInTheDocument();
  });
});
