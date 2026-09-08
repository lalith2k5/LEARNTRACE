import { GoogleGenAI, Type } from '@google/genai';
import { AiExplainResponse, Question, CognitiveCategory } from '../../src/types.js';

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

/**
 * Resilient Gemini invocation with automatic retry on 503/429 and model fallback
 * to handle temporary high demand spikes gracefully without throwing unhandled exceptions.
 */
export async function callGeminiWithFallback<T>(
  fn: (model: string, ai: GoogleGenAI) => Promise<T>
): Promise<T | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  // Supported model hierarchy: default fast model -> lightweight flash model -> latest alias
  const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // Race with a 5-second per-attempt timeout to ensure zero latency freeze for learner
        const callPromise = fn(model, ai);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timed out after 5000ms')), 5000)
        );

        return await Promise.race([callPromise, timeoutPromise]);
      } catch (err: any) {
        const errorMsg = String(err?.message || err || '');
        const statusCode = err?.status || err?.code || (errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE') ? 503 : 0);
        const isQuota = errorMsg.includes('resource_exhausted') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota');
        const isTransient = statusCode === 503 || statusCode === 429 || errorMsg.includes('high demand') || errorMsg.includes('UNAVAILABLE') || errorMsg.includes('timed out');

        if (isQuota) {
          console.warn(`[LearnTrace AI] Quota/resource exhausted for ${model}. Falling back to pedagogical algorithmic rubric.`);
          return null; // Don't burn through other models when quota is exhausted
        }

        if (isTransient && attempt === 0) {
          // Brief backoff before retry on same model
          await new Promise((resolve) => setTimeout(resolve, 300));
          continue;
        }

        if (isTransient) {
          console.warn(`[LearnTrace AI] Model ${model} is experiencing temporary high demand (${statusCode || '503'}). Switching to fallback model...`);
          break; // Try next candidate model
        }

        console.warn(`[LearnTrace AI] Non-transient generation error with ${model}:`, errorMsg);
        break;
      }
    }
  }

  return null;
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

  // 1. Try Gemini API with automatic model fallback & retry
  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
      });
    });

    if (response && response.text && response.text.trim().length > 0) {
      return {
        source: 'gemini',
        available: true,
        explanation: response.text.trim(),
        correctAnswer: correctOptionText,
        keyConcept: skillName,
        cognitiveDiagnosis: isConfidentMisconception ? 'Addressed Confident Misconception' : undefined,
      };
    }
  } catch (err) {
    console.warn('Gemini explanation fallback activated:', err);
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
- "difficulty": Integer 1 to 5
- "options": Array of 4 objects with { "id": "A", "text": "..." }, { "id": "B", "text": "..." }, etc.
- "correctAnswer": The id of the correct option (e.g. "A")
- "explanation": Concise 2-sentence explanation of why the correct answer is right and common distractor pitfalls.
- "cognitiveCategory": One of "Recall", "Comprehension", "Application", "Analysis", "Synthesis"`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              difficulty: { type: Type.INTEGER },
              cognitiveCategory: { type: Type.STRING },
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
    });

    if (response?.text) {
      const parsed = JSON.parse(response.text);
      const newQuestion: Question = {
        id: `q_ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        skillId,
        skillName,
        skillsTested: [skillId],
        text: parsed.text,
        difficulty: Math.min(5, Math.max(1, parsed.difficulty || 3)),
        cognitiveCategory: (parsed.cognitiveCategory as CognitiveCategory) || 'Application',
        options: parsed.options,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        questionType: 'MULTIPLE_CHOICE',
      };
      return newQuestion;
    }
  } catch (err) {
    console.warn('AI question generation used fallback due to:', err);
  }

  // Gracefully fallback to high-quality psychometric template item instead of failing
  const fallbacks = await generateBankEnrichmentQuestions({ skillId, skillName, domain, count: 1 });
  if (fallbacks.length > 0) {
    return fallbacks[0];
  }

  return null;
}

export interface BankEnrichmentParams {
  skillId: string;
  skillName: string;
  domain: string;
  count?: number;
  difficulty?: number;
  cognitiveCategory?: CognitiveCategory;
}

/**
 * On-demand question bank enrichment using Gemini with structured generation and robust fallback
 */
export async function generateBankEnrichmentQuestions(params: BankEnrichmentParams): Promise<Question[]> {
  const { skillId, skillName, domain, count = 2, difficulty, cognitiveCategory } = params;
  const numToGen = Math.max(1, Math.min(5, count));

  const prompt = `You are an expert psychometrician and AI curriculum architect for LearnTrace.
Generate ${numToGen} high-quality, scientifically sound multiple-choice diagnostic assessment questions for the skill "${skillName}" (Domain: ${domain}).
${difficulty ? `Target Difficulty Level: ${difficulty}/5 (${difficulty === 1 ? 'Foundational/Recall' : difficulty === 2 ? 'Elementary' : difficulty === 3 ? 'Intermediate Application' : difficulty === 4 ? 'Advanced Analysis' : 'Synthesis & Edge Cases'})` : 'Target varied difficulty levels (from 1 to 5).'}
${cognitiveCategory ? `Target Cognitive Category: ${cognitiveCategory}` : 'Use appropriate cognitive categories such as Recall, Comprehension, Application, Analysis, or Synthesis.'}

Each question MUST include:
1. "text": Clear, unambiguous problem prompt with realistic code snippets, mathematical definitions, or diagnostic engineering dilemmas.
2. "difficulty": Integer from 1 to 5.
3. "cognitiveCategory": Exactly one of "Recall", "Comprehension", "Application", "Analysis", "Synthesis".
4. "options": Exactly 4 distinct options with ids "A", "B", "C", "D".
5. "correctAnswer": The correct option id ("A", "B", "C", or "D").
6. "explanation": Rigorous explanation explaining why the correct option is true and what underlying conceptual principle it tests.
7. "distractorRationales": Object mapping each distractor key ("A", "B", "C", "D") to a 1-sentence diagnostic note of what student misconception or calculation mistake leads to picking it.
8. "skillsTested": Array containing "${skillId}".`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                difficulty: { type: Type.INTEGER },
                cognitiveCategory: { type: Type.STRING },
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
                distractorRationales: {
                  type: Type.OBJECT,
                  properties: {
                    A: { type: Type.STRING },
                    B: { type: Type.STRING },
                    C: { type: Type.STRING },
                    D: { type: Type.STRING },
                  },
                },
                skillsTested: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['text', 'difficulty', 'options', 'correctAnswer', 'explanation'],
            },
          },
        },
      });
    });

    if (response?.text) {
      const parsed = JSON.parse(response.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const generatedQuestions: Question[] = parsed.map((item, idx) => ({
          id: `q_gemini_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          skillId,
          skillName,
          skillsTested: Array.isArray(item.skillsTested) && item.skillsTested.length > 0 ? item.skillsTested : [skillId],
          text: item.text,
          difficulty: Math.min(5, Math.max(1, item.difficulty || difficulty || 3)),
          cognitiveCategory: (item.cognitiveCategory as CognitiveCategory) || cognitiveCategory || 'Application',
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          distractorRationales: item.distractorRationales || {},
          questionType: 'MULTIPLE_CHOICE',
        }));
        return generatedQuestions;
      }
    }
  } catch (err) {
    console.warn('Gemini enrichment generation failed, utilizing robust domain fallback:', err);
  }

  // Domain fallback generator
  const fallbackQuestions: Question[] = [];
  const templates: Record<string, Array<{ text: string; options: Array<{ id: string; text: string }>; correct: string; expl: string; diff: number; cat: CognitiveCategory }>> = {
    skill_python: [
      {
        text: 'In Python, what is the computational complexity of checking if a key exists in a standard dict `k in my_dict` versus in a list `k in my_list` of size N?',
        options: [
          { id: 'A', text: 'Dict is O(1) average; List is O(N) linear scan.' },
          { id: 'B', text: 'Dict is O(log N) binary search; List is O(1).' },
          { id: 'C', text: 'Both require O(N) operations in memory.' },
          { id: 'D', text: 'Dict is O(N) average; List is O(log N).' },
        ],
        correct: 'A',
        expl: 'Python dictionaries utilize a hash table layout providing O(1) average lookup complexity, while list membership checks require an exhaustive O(N) sequential search.',
        diff: 2,
        cat: 'Comprehension',
      },
      {
        text: 'Consider the snippet: `res = [x * 2 for x in range(5) if x % 2 == 0]`. What is the evaluated output and memory characteristic?',
        options: [
          { id: 'A', text: '[0, 4, 8] evaluated eagerly as a concrete list' },
          { id: 'B', text: '[0, 2, 4] evaluated lazily as a generator' },
          { id: 'C', text: '[2, 6] evaluated eagerly' },
          { id: 'D', text: 'SyntaxError due to misplaced if-clause' },
        ],
        correct: 'A',
        expl: 'Range(5) yields 0, 1, 2, 3, 4. Even values are 0, 2, 4. Multiplying by 2 produces [0, 4, 8]. Brackets denote an eager list comprehension.',
        diff: 2,
        cat: 'Application',
      },
    ],
    skill_prob: [
      {
        text: 'Two independent events A and B have P(A) = 0.4 and P(B) = 0.5. What is the probability that at least one of the events occurs, P(A ∪ B)?',
        options: [
          { id: 'A', text: '0.70' },
          { id: 'B', text: '0.90' },
          { id: 'C', text: '0.20' },
          { id: 'D', text: '0.60' },
        ],
        correct: 'A',
        expl: 'By inclusion-exclusion: P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Independence means P(A ∩ B) = 0.4 * 0.5 = 0.20. Hence, 0.40 + 0.50 - 0.20 = 0.70.',
        diff: 3,
        cat: 'Application',
      },
    ],
    skill_cond_prob: [
      {
        text: 'A diagnostic medical test has 98% sensitivity and 95% specificity. If disease prevalence is 1%, what is P(Disease | Positive Test)?',
        options: [
          { id: 'A', text: 'Approximately 16.5%' },
          { id: 'B', text: '98.0%' },
          { id: 'C', text: '95.0%' },
          { id: 'D', text: '50.0%' },
        ],
        correct: 'A',
        expl: 'Applying Bayes Theorem: P(D|+) = (0.98 * 0.01) / [(0.98 * 0.01) + (0.05 * 0.99)] = 0.0098 / 0.0593 ≈ 0.165 (16.5%). Low prevalence dominates false positives.',
        diff: 4,
        cat: 'Analysis',
      },
    ],
    skill_prob_dist: [
      {
        text: 'For a continuous random variable X following an exponential distribution with rate parameter λ = 2, what is the expected value E[X] and variance Var(X)?',
        options: [
          { id: 'A', text: 'E[X] = 0.5, Var(X) = 0.25' },
          { id: 'B', text: 'E[X] = 2.0, Var(X) = 4.0' },
          { id: 'C', text: 'E[X] = 0.5, Var(X) = 0.5' },
          { id: 'D', text: 'E[X] = 1.0, Var(X) = 2.0' },
        ],
        correct: 'A',
        expl: 'The exponential distribution has mean 1/λ and variance 1/(λ^2). For λ = 2: mean = 1/2 = 0.5, variance = 1/4 = 0.25.',
        diff: 3,
        cat: 'Comprehension',
      },
    ],
    skill_stats: [
      {
        text: 'In hypothesis testing, a p-value of 0.03 at significance level α = 0.05 indicates:',
        options: [
          { id: 'A', text: 'Reject H0; observed data is unlikely under the null hypothesis.' },
          { id: 'B', text: 'Fail to reject H0; the null hypothesis is proven true.' },
          { id: 'C', text: 'There is a 3% chance that the alternate hypothesis is false.' },
          { id: 'D', text: 'Effect size is guaranteed to be clinically substantial.' },
        ],
        correct: 'A',
        expl: 'When p < α (0.03 < 0.05), we reject the null hypothesis because the likelihood of observing results at least as extreme under H0 is below threshold.',
        diff: 2,
        cat: 'Comprehension',
      },
    ],
    skill_linalg: [
      {
        text: 'If square matrix A has an eigenvalue λ = 0, what does this mathematically imply regarding its determinant and invertibility?',
        options: [
          { id: 'A', text: 'det(A) = 0, and A is singular (non-invertible).' },
          { id: 'B', text: 'det(A) = 1, and A is orthogonal.' },
          { id: 'C', text: 'A is positive definite with full column rank.' },
          { id: 'D', text: 'det(A) is undefined for zero eigenvalues.' },
        ],
        correct: 'A',
        expl: 'The determinant of a matrix equals the product of all its eigenvalues. If any λ = 0, det(A) = 0, proving non-trivial null space and non-invertibility.',
        diff: 3,
        cat: 'Analysis',
      },
    ],
    skill_model_eval: [
      {
        text: 'In a medical cancer detection task where missing a positive case is catastrophic, which metric should be prioritized to minimize False Negatives?',
        options: [
          { id: 'A', text: 'Recall (Sensitivity)' },
          { id: 'B', text: 'Precision' },
          { id: 'C', text: 'Specificity' },
          { id: 'D', text: 'Raw Accuracy' },
        ],
        correct: 'A',
        expl: 'Recall = TP / (TP + FN). Maximizing recall directly drives False Negatives toward zero, ensuring high sensitivity to critical conditions.',
        diff: 2,
        cat: 'Comprehension',
      },
    ],
    skill_ml: [
      {
        text: 'What diagnostic signature on training versus validation loss curves indicates high variance (overfitting)?',
        options: [
          { id: 'A', text: 'Very low training loss with a wide gap to steadily increasing validation loss.' },
          { id: 'B', text: 'Both training and validation loss remain high and plateau together.' },
          { id: 'C', text: 'Validation loss decreases lower than training loss throughout training.' },
          { id: 'D', text: 'Gradient values vanish to zero on the first epoch.' },
        ],
        correct: 'A',
        expl: 'Overfitting occurs when a model memorizes training samples (low training loss) but fails to generalize to unseen test samples (large validation divergence).',
        diff: 3,
        cat: 'Analysis',
      },
    ],
  };

  const pool = templates[skillId] || templates['skill_python'];
  for (let i = 0; i < numToGen; i++) {
    const t = pool[i % pool.length];
    fallbackQuestions.push({
      id: `q_gemini_fallback_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      skillId,
      skillName,
      skillsTested: [skillId],
      text: `${t.text} (Diagnostic Item #${i + 1})`,
      difficulty: difficulty || t.diff,
      cognitiveCategory: cognitiveCategory || t.cat,
      options: t.options,
      correctAnswer: t.correct,
      explanation: t.expl,
      distractorRationales: {
        A: 'Plausible distractor based on standard linear approximation.',
        B: 'Confuses notation with inverse transformation.',
        C: 'Incomplete calculation omission.',
        D: 'Boundary condition misunderstanding.',
      },
      questionType: 'MULTIPLE_CHOICE',
    });
  }

  return fallbackQuestions;
}

