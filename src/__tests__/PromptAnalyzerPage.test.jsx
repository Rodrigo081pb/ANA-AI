import React from 'react';
import { render } from '@testing-library/react';
import PromptAnalyzerPage from '../pages/PromptAnalyzerPage';

describe('PromptAnalyzerPage', () => {
  it('renderiza sem crashar', () => {
    render(<PromptAnalyzerPage />);
  });
});
