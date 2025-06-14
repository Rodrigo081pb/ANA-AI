import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';

// Testes unitários para o componente Navbar
// Cobre navegação, menu hambúrguer, dark mode e casos de erro/interação inesperada

describe('Navbar', () => {
  it('renderiza tabs e muda de aba', () => {
    const setActiveTab = jest.fn();
    const { getAllByText } = render(
      <Navbar activeTab="analyze" setActiveTab={setActiveTab} />
    );
    // Clica nas abas pelo texto, pegando sempre o primeiro visível (navbar desktop)
    fireEvent.click(getAllByText('Histórico')[0]);
    expect(setActiveTab).toHaveBeenCalledWith('history');
    fireEvent.click(getAllByText('Dashboard')[0]);
    expect(setActiveTab).toHaveBeenCalledWith('dashboard');
    fireEvent.click(getAllByText('Analisar')[0]);
    expect(setActiveTab).toHaveBeenCalledWith('analyze');
  });

  it('abre e fecha o menu hambúrguer no mobile', () => {
    const setActiveTab = jest.fn();
    global.innerWidth = 400;
    const { getByLabelText, getAllByText, queryByRole } = render(
      <Navbar activeTab="analyze" setActiveTab={setActiveTab} />
    );
    // Abre o menu hambúrguer
    fireEvent.click(getByLabelText('Abrir menu'));
    // Clica na opção "Histórico" do drawer (pega o segundo, pois o primeiro é da navbar oculta)
    fireEvent.click(getAllByText('Histórico')[1]);
    expect(setActiveTab).toHaveBeenCalledWith('history');
    // Abre o menu novamente
    fireEvent.click(getByLabelText('Abrir menu'));
    // Fecha o menu clicando no botão de fechar
    fireEvent.click(getByLabelText('Fechar menu'));
    // Verifica se o drawer não está mais presente
    expect(queryByRole('complementary')).toBeNull();
  });

  it('não quebra se clicar fora do menu', () => {
    const setActiveTab = jest.fn();
    render(
      <Navbar activeTab="analyze" setActiveTab={setActiveTab} />
    );
    // Simula clique fora do menu (não deve quebrar nem lançar erro)
    fireEvent.click(document.body);
  });

  it('alterna dark mode sem erro', () => {
    const setActiveTab = jest.fn();
    const { getAllByTitle } = render(
      <Navbar activeTab="analyze" setActiveTab={setActiveTab} />
    );
    // Clica no botão de dark mode (pode haver mais de um, pega o primeiro)
    fireEvent.click(getAllByTitle(/modo/i)[0]);
  });
});
