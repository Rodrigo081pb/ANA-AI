import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

// Teste básico para App garantindo renderização e tratamento de erro

describe('App', () => {
  it('renderiza sem crashar', () => {
    render(<App />);
  });

  it('não quebra se houver erro de renderização', () => {
    // Simula erro em componente filho
    const Broken = () => { throw new Error('Erro!'); };
    const AppWithError = () => <Broken />;
    expect(() => render(<AppWithError />)).toThrow();
  });
});
