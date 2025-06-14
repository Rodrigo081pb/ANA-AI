import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AnalyzeTab from '../components/AnalyzeTab';

// Testes unitários para o componente AnalyzeTab
// Cobre digitação, colar exemplo, limpar, botão desabilitado e casos de erro/interação inesperada

describe('AnalyzeTab', () => {
  it('permite digitar, colar exemplo e limpar', () => {
    const db = { saveToDatabase: jest.fn() };
    const { getByLabelText, getByTitle, queryByTitle } = render(<AnalyzeTab db={db} />);
    const textarea = getByLabelText('Área de digitação do prompt');
    // Digita texto
    fireEvent.change(textarea, { target: { value: 'Teste prompt' } });
    expect(textarea.value).toBe('Teste prompt');
    // Cola exemplo
    fireEvent.click(getByTitle('Colar exemplo'));
    expect(textarea.value).toMatch(/aprendizado de máquina/);
    // Limpa texto (só clica se o botão existir)
    const btnLimpar = queryByTitle('Limpar texto');
    if (btnLimpar) fireEvent.click(btnLimpar);
    expect(textarea.value).toBe('');
  });

  it('desabilita botão se prompt vazio', () => {
    const db = { saveToDatabase: jest.fn() };
    const { getByText } = render(<AnalyzeTab db={db} />);
    const btn = getByText('Analisar com IA');
    expect(btn).toBeDisabled();
  });

  it('não quebra ao clicar em limpar sem texto', () => {
    const db = { saveToDatabase: jest.fn() };
    const { queryByTitle } = render(<AnalyzeTab db={db} />);
    // Só tenta clicar se o botão existir
    const btnLimpar = queryByTitle('Limpar texto');
    if (btnLimpar) fireEvent.click(btnLimpar);
    // Não deve lançar erro
  });

  it('não quebra ao clicar em colar exemplo várias vezes', () => {
    const db = { saveToDatabase: jest.fn() };
    const { getByTitle } = render(<AnalyzeTab db={db} />);
    // Clica várias vezes no botão de colar exemplo
    for (let i = 0; i < 3; i++) fireEvent.click(getByTitle('Colar exemplo'));
  });
});
