/**
 * ============================================================================
 * OLLAMA AI EXPLANATION SERVICE
 * ============================================================================
 * 
 * Local-First AI Integration:
 * - Calls local Ollama server at http://localhost:11434/api/generate
 * - Configurable model through OLLAMA_MODEL (default: llama3.2)
 * - Returns friendly fallback explanation if Ollama is unreachable.
 * - NEVER crashes the backend.
 * ============================================================================
 */

async function getAiExplanation(questionText, skillName, correctAnswerText, defaultExplanation) {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';

  const prompt = `You are an AI Tutor for the skill "${skillName}".
A learner needs an explanation for the following multiple-choice question:
Question: "${questionText}"
Correct Answer: "${correctAnswerText}"

Provide a clear, pedagogical 2-3 sentence explanation of why this answer is correct and clarify the core intuition.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.response) {
        return {
          source: 'ollama',
          available: true,
          explanation: data.response.trim()
        };
      }
    }
  } catch (err) {
    // Ollama not reachable or offline — expected in standard environments
  }

  // Graceful Fallback Response
  return {
    source: 'fallback',
    available: false,
    explanation: defaultExplanation || `The correct answer is "${correctAnswerText}". In ${skillName}, this principle forms an essential foundation for subsequent modeling and analysis tasks.`
  };
}

module.exports = {
  getAiExplanation
};
