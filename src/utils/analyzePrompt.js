// Funções de análise e geração de sugestões

const MAX_HISTORY = 50;

function analyzeClareza(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.reduce((acc, s) => acc + s.trim().split(' ').length, 0) / sentences.length || 0;
  const hasPunctuation = /[.!?,:;]/.test(text);
  const hasConnectives = /\b(porque|pois|então|assim|portanto|contudo|entretanto|além disso|por exemplo|ou seja|mas|porém|todavia)\b/i.test(text);
  const hasStructure = /\b(primeiro|segundo|terceiro|inicialmente|finalmente|por fim)\b/i.test(text);
  let score = 0;
  if (avgWordsPerSentence > 5 && avgWordsPerSentence < 25) score += 25;
  if (hasPunctuation) score += 30;
  if (hasConnectives) score += 25;
  if (hasStructure) score += 20;
  return Math.min(100, score);
}

function analyzeContexto(text) {
  const contextIndicators = ['contexto', 'cenário', 'situação', 'público', 'objetivo', 'meta', 'propósito', 'quando', 'onde', 'como', 'por que', 'para que'];
  const foundIndicators = contextIndicators.filter(indicator => text.toLowerCase().includes(indicator)).length;
  const hasSpecifics = /\b(específico|detalhado|preciso|exato|particular|claro|definido)\b/i.test(text);
  const hasExamples = /\b(exemplo|por exemplo|como|tal como|similar a|tipo|igual a)\b/i.test(text);
  const hasConstraints = /\b(deve|não deve|evite|inclua|formato|estilo|limite)\b/i.test(text);
  let score = (foundIndicators * 12);
  if (hasSpecifics) score += 25;
  if (hasExamples) score += 20;
  if (hasConstraints) score += 15;
  return Math.min(100, score);
}

function analyzeComprimento(text) {
  const words = text.trim().split(/\s+/).length;
  const tokens = Math.ceil(words * 1.3);
  if (tokens >= 30 && tokens <= 150) return 100;
  if (tokens >= 20 && tokens < 30) return 85;
  if (tokens > 150 && tokens <= 250) return 80;
  if (tokens > 250 && tokens <= 400) return 65;
  if (tokens < 20) return 50;
  return 40;
}

function analyzeFoco(text) {
  const actionVerbs = ['crie', 'gere', 'faça', 'escreva', 'desenvolva', 'analise', 'explique', 'liste', 'descreva', 'compare', 'sugira', 'recomende', 'elabore', 'construa'];
  const foundVerbs = actionVerbs.filter(verb => text.toLowerCase().includes(verb)).length;
  const hasImperatives = /\b(deve|precisa|quero que|solicito|peço para|gostaria que)\b/i.test(text);
  const hasQuestions = text.split('?').length - 1;
  const hasClearGoal = /\b(objetivo|meta|finalidade|propósito|resultado)\b/i.test(text);
  let score = foundVerbs * 15;
  if (hasImperatives) score += 25;
  if (hasQuestions > 0 && hasQuestions <= 3) score += 20;
  if (hasClearGoal) score += 20;
  return Math.min(100, score);
}

function analyzeTom(text) {
  const patterns = {
    objetivo: /\b(analise|compare|liste|descreva|explique|defina|identifique)\b/i,
    persuasivo: /\b(convença|persuada|argumente|defenda|justifique|prove)\b/i,
    interrogativo: /\?/, 
    criativo: /\b(crie|imagine|invente|inove|original|criativo|único)\b/i,
    técnico: /\b(implemente|desenvolva|code|programa|algoritmo|função)\b/i,
    educativo: /\b(ensine|explique|demonstre|tutorial|passo a passo)\b/i
  };
  for (const [tom, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      const scores = { objetivo: 85, persuasivo: 80, interrogativo: 75, criativo: 90, técnico: 88, educativo: 82 };
      return { tom: tom.charAt(0).toUpperCase() + tom.slice(1), score: scores[tom] };
    }
  }
  return { tom: 'Neutro', score: 60 };
}

function generateSuggestions(metrics) {
  const suggestions = [];
  if (metrics.clareza < 70) {
    suggestions.push({
      icon: '✏️',
      title: 'Melhore a Clareza',
      description: "Use pontuação adequada e conectivos como 'porque', 'então', 'portanto'"
    });
  }
  if (metrics.contexto < 70) {
    suggestions.push({
      icon: '🎯',
      title: 'Adicione Contexto',
      description: 'Especifique público-alvo, cenário ou objetivo. Use exemplos práticos'
    });
  }
  if (metrics.comprimento < 70) {
    suggestions.push({
      icon: '📏',
      title: 'Ajuste o Tamanho',
      description: 'Prompts ideais têm 30-150 tokens. Seja conciso mas completo'
    });
  }
  if (metrics.foco < 70) {
    suggestions.push({
      icon: '🎪',
      title: 'Defina Ações Claras',
      description: "Use verbos imperativos: 'crie', 'analise', 'explique', 'desenvolva'"
    });
  }
  if (metrics.tom.score < 70) {
    suggestions.push({
      icon: '🗣️',
      title: 'Melhore o Tom',
      description: 'Seja mais específico sobre o estilo de resposta desejado'
    });
  }
  return suggestions;
}

export async function analyzePrompt(prompt) {
  if (!prompt.trim()) return null;
  await new Promise(resolve => setTimeout(resolve, 1200));
  const metrics = {
    clareza: analyzeClareza(prompt),
    contexto: analyzeContexto(prompt),
    comprimento: analyzeComprimento(prompt),
    foco: analyzeFoco(prompt),
    tom: analyzeTom(prompt)
  };
  const overallScore = Math.round(
    (metrics.clareza + metrics.contexto + metrics.comprimento + metrics.foco + metrics.tom.score) / 5
  );
  const newAnalysis = {
    id: Date.now(),
    prompt: prompt.substring(0, 80) + (prompt.length > 80 ? '...' : ''),
    fullPrompt: prompt,
    metrics,
    overallScore,
    suggestions: generateSuggestions(metrics),
    timestamp: new Date().toLocaleString('pt-BR'),
    date: new Date().toISOString(),
    wordCount: prompt.trim().split(/\s+/).length,
    tokenCount: Math.ceil(prompt.trim().split(/\s+/).length * 1.3),
    category: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'needs_work'
  };
  return newAnalysis;
}
