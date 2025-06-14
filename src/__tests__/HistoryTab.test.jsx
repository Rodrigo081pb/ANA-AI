import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HistoryTab from '../components/HistoryTab';

// Testes unitários para HistoryTab cobrindo exibição, limpeza e casos de histórico vazio/interações inesperadas

describe('HistoryTab', () => {
  const db = {
    database: {
      analyses: [
        {
          id: 1,
          prompt: 'Prompt 1',
          overallScore: 85,
          metrics: { clareza: 90, contexto: 80, comprimento: 85, foco: 80, tom: { score: 90 } },
          timestamp: '2024-06-14',
          category: 'excellent',
        },
      ],
    },
    clearHistory: jest.fn(),
  };

  it('exibe histórico e permite limpar', () => {
    const { getByText } = render(<HistoryTab db={db} />);
    expect(getByText('Histórico de Análises')).toBeInTheDocument();
    // Clica no botão Limpar se existir
    const btnLimpar = getByText('Limpar');
    fireEvent.click(btnLimpar);
    expect(db.clearHistory).toHaveBeenCalled();
  });

  it('exibe mensagem se não houver análises', () => {
    const dbEmpty = { database: { analyses: [] }, clearHistory: jest.fn() };
    const { getByText } = render(<HistoryTab db={dbEmpty} />);
    expect(getByText('Nenhuma análise ainda')).toBeInTheDocument();
  });

  it('não quebra ao clicar em limpar sem histórico', () => {
    const dbEmpty = { database: { analyses: [] }, clearHistory: jest.fn() };
    const { queryByText } = render(<HistoryTab db={dbEmpty} />);
    // Só tenta clicar se o botão existir
    const btnLimpar = queryByText('Limpar');
    if (btnLimpar) fireEvent.click(btnLimpar);
    // Não deve lançar erro
  });
});
