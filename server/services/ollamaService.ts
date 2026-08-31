import { GoogleGenAI, Type } from '@google/genai';
import { AiExplainResponse, Question } from '../../src/types.js';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch {
      geminiClient = null;
    }
  }
  return geminiClient;
}

export async function explainQuestion(params: {
  questionText: string;
  skillName: string;
  options: { id: string; text: string }[];
  selectedOptionText?: string;
  correctOptionText?: string;
  defaultExplanation?: string;
  confidence?: number;
  isCorrect?: boolean;
}): Promise<AiExplainResponse> {
  const { questionText, skillName, selectedOptionText, correctOptionText, defaultExplanation, confidence, isCorrect } = params;

  const isConfidentMisconception = !isCorrect && (confidence ?? 3) >= 4;
  const isUncertainMistake = !isCorrect && (confidence ?? 3) <= 2;

  const cognitiveContext = isConfidentMisconception
    ? `IMPORTANT: The learner answered INCORRECTLY with HIGH confidence (${confidence}/5). This is a CONFIDENT MISCONCEPTION. Specifically address why their mental model or intuition misled them.`
    : isUncertainMistake
    ? `NOTE: The learner was uncertain (${confidence}/5) and got this wrong. Provide a clear, gentle foundational intuition.`
    : '';

  const prompt = `You are LearnTrace's AI Diagnostic Tutor specializing in ${skillName}.
A learner attempted a diagnostic multiple-choice question.

Question: "${questionText}"
${selectedOptionText ? `Learner's Choice: "${selectedOptionText}"` : ''}
Correct Answer: "${correctOptionText || 'Refer to knowledge base'}"
${cognitiveContext}

Provide a concise, highly educational 2-3 sentence diagnostic explanation:
1. Validate why the correct answer is logically and mathematically accurate.
2. Clarify the subtle conceptual misconception behind the incorrect options.
Keep the tone supportive, direct, and rigorous.`;

  // 1. Try Gemini API
  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      if (response.text && response.text.trim().length > 0) {
        return {
          source: 'gemini',
          available: true,
          explanation: response.text.trim(),
          correctAnswer: correctOptionText,
          keyConcept: skillName,
          cognitiveDiagnosis: isConfidentMisconception ? 'Addressed Confident Misconception' : undefined,
        };
      }
    }
  } catch (err) {
    console.error('Gemini API call failed:', err);
  }

  // 2. Try local Ollama if configured
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as { response?: string };
      if (data.response && data.response.trim().length > 0) {
        return {
          source: 'ollama',
          available: true,
          explanation: data.response.trim(),
          correctAnswer: correctOptionText,
          keyConcept: skillName,
        };
      }
    }
  } catch {
    // Ollama not running or timed out
  }

  // 3. Robust Pedagogical Fallback
  const fallbackExplanation = defaultExplanation || 
    `The correct answer is "${correctOptionText}". In ${skillName}, mastering this concept resolves foundational ambiguity and prepares you for subsequent prerequisite dependencies in your learning path.`;

  return {
    source: 'fallback',
    available: false,
    explanation: fallbackExplanation,
    correctAnswer: correctOptionText,
    keyConcept: skillName,
  };
}

export async function generateAdaptiveQuestion(skillId: string, skillName: string, domain: string): Promise<Question | null> {
  const prompt = `Generate a rigorous, original multiple-choice diagnostic question testing the concept "${skillName}" in the domain of "${domain}".
Format the response strictly as JSON with:
- "text": The question prompt
- "difficulty": Integer 1 to 4
- "options": Array of 4 objects with { "id": "opt_1", "text": "..." }, { "id": "opt_2", "text": "..." }, etc.
- "correctAnswer": The id of the correct option (e.g. "opt_1")
- "explanation": Concise 2-sentence explanation of why the correct answer is right and common distractor pitfalls.`;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              difficulty: { type: Type.INTEGER },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                  required: ['id', 'text'],
                },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['text', 'difficulty', 'options', 'correctAnswer', 'explanation'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const newQuestion: Question = {
          id: `q_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          skillId,
          skillName,
          skillsTested: [skillId],
          text: parsed.text,
          difficulty: parsed.difficulty || 2,
          options: parsed.options,
          correctAnswer: parsed.correctAnswer,
          explanation: parsed.explanation,
          questionType: 'MULTIPLE_CHOICE',
        };
        return newQuestion;
      }
    }
  } catch (err) {
    console.error('AI question generation error:', err);
  }

  return null;
}
