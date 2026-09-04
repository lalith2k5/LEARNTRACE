import { GoogleGenAI } from '@google/genai';
import { CognitiveState, OpenEndedEvaluationResponse } from '../../src/types.js';
import { callGeminiWithFallback } from './ollamaService.js';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

interface GradeParams {
  skillName: string;
  skillDomain: string;
  prompt: string;
  studentResponse: string;
  selfConfidence?: number;
}

export async function gradeOpenEndedResponse(params: GradeParams): Promise<OpenEndedEvaluationResponse> {
  const { skillName, skillDomain, prompt, studentResponse, selfConfidence = 3 } = params;

  const trimmedResponse = studentResponse.trim();
  if (trimmedResponse.length < 5) {
    return {
      score: 0.0,
      grade: 'INCORRECT',
      feedback: 'Response was too brief to demonstrate conceptual understanding. Please provide a more detailed explanation.',
      conceptsIdentified: [],
      conceptsMissed: ['Core explanation of the concept'],
      misconceptionsDetected: ['Incomplete / Empty answer'],
      cognitiveState: 'UNCERTAIN_MISTAKE',
      suggestedAction: 'Review foundational definitions and practice explaining the mechanism in 2-3 sentences.',
    };
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const systemInstruction = `You are a world-class AI Learning Sciences Professor specializing in ${skillDomain} and ${skillName}.
Your job is to evaluate student free-text responses using an evidence-based cognitive rubric.
Analyze the student's conceptual reasoning, identify correct concepts, diagnose specific misconceptions, and assign a calibrated score from 0.0 to 1.0.

Return STRICT JSON with the following structure:
{
  "score": number (0.0 to 1.0),
  "grade": "EXEMPLARY" | "PROFICIENT" | "DEVELOPING" | "INCORRECT",
  "feedback": "Concise 2-3 sentence personalized feedback explaining what was correct and what was missing or misunderstood",
  "conceptsIdentified": ["concept 1", "concept 2"],
  "conceptsMissed": ["missing concept 1"],
  "misconceptionsDetected": ["specific misconception if any, otherwise empty array"],
  "suggestedAction": "One actionable recommendation for what to study next"
}`;

      const userPrompt = `
Topic: ${skillName} (${skillDomain})
Conceptual Question: "${prompt}"
Student's Response: "${trimmedResponse}"
Student Self-Reported Confidence (1-5): ${selfConfidence}

Evaluate the response accurately and output JSON only.`;

      const response = await callGeminiWithFallback(async (model, aiClient) => {
        return await aiClient.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
      });

      const responseText = response?.text || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);

        const score = Math.max(0.0, Math.min(1.0, Number(parsed.score) || 0.0));
        const isCorrect = score >= 0.65;

        let cognitiveState: CognitiveState = 'NORMAL_MASTERY';
        if (!isCorrect) {
          cognitiveState = selfConfidence >= 4 ? 'CONFIDENT_MISCONCEPTION' : 'UNCERTAIN_MISTAKE';
        } else {
          if (selfConfidence <= 2) {
            cognitiveState = 'FRAGILE_KNOWLEDGE';
          } else if (selfConfidence >= 4 && score >= 0.85) {
            cognitiveState = 'SOLID_MASTERY';
          }
        }

        return {
          score: Math.round(score * 100) / 100,
          grade: parsed.grade || (score >= 0.85 ? 'EXEMPLARY' : score >= 0.65 ? 'PROFICIENT' : score >= 0.4 ? 'DEVELOPING' : 'INCORRECT'),
          feedback: parsed.feedback || 'Good attempt. Continue refining key terminology.',
          conceptsIdentified: Array.isArray(parsed.conceptsIdentified) ? parsed.conceptsIdentified : [],
          conceptsMissed: Array.isArray(parsed.conceptsMissed) ? parsed.conceptsMissed : [],
          misconceptionsDetected: Array.isArray(parsed.misconceptionsDetected) ? parsed.misconceptionsDetected : [],
          cognitiveState,
          suggestedAction: parsed.suggestedAction || `Review the prerequisite concepts for ${skillName}.`,
        };
      }
    } catch (err) {
      console.warn('Gemini semantic grading error, using robust algorithmic fallback:', err);
    }
  }

  // Robust algorithmic pedagogical rubric fallback
  const keywordsBySkill: Record<string, string[]> = {
    Python: ['vectorization', 'list comprehension', 'numpy', 'broadcasting', 'loop', 'time complexity', 'mutable'],
    Probability: ['sample space', 'independent', 'bayes', 'conditional', 'prior', 'posterior', 'uncertainty', 'likelihood'],
    'Conditional Probability': ['given', 'joint', 'marginal', 'bayes', 'intersection', 'independence', 'evidence'],
    'Probability Distributions': ['discrete', 'continuous', 'normal', 'binomial', 'poisson', 'variance', 'mean', 'pdf', 'cdf'],
    Statistics: ['p-value', 'hypothesis', 'null', 'central limit', 'clt', 'standard deviation', 'confidence interval'],
    'Linear Algebra': ['vector', 'matrix', 'eigenvalue', 'eigenvector', 'dot product', 'transformation', 'dimension'],
    'Model Evaluation': ['precision', 'recall', 'f1', 'roc', 'auc', 'confusion matrix', 'imbalance', 'tradeoff'],
    'Machine Learning': ['gradient descent', 'loss', 'overfitting', 'bias', 'variance', 'weights', 'regularization', 'epoch'],
  };

  const domainKeywords = keywordsBySkill[skillName] || ['concept', 'principle', 'calculation'];
  const lowerText = trimmedResponse.toLowerCase();
  const matched = domainKeywords.filter((k) => lowerText.includes(k.toLowerCase()));
  const matchRatio = matched.length / Math.max(2, domainKeywords.length * 0.4);
  const score = Math.min(0.95, Math.max(0.2, matchRatio * 0.8 + (trimmedResponse.length > 50 ? 0.2 : 0.05)));
  const isCorrect = score >= 0.6;

  let cognitiveState: CognitiveState = 'NORMAL_MASTERY';
  if (!isCorrect) {
    cognitiveState = selfConfidence >= 4 ? 'CONFIDENT_MISCONCEPTION' : 'UNCERTAIN_MISTAKE';
  } else {
    cognitiveState = selfConfidence >= 4 ? 'SOLID_MASTERY' : 'FRAGILE_KNOWLEDGE';
  }

  return {
    score: Math.round(score * 100) / 100,
    grade: score >= 0.8 ? 'EXEMPLARY' : score >= 0.6 ? 'PROFICIENT' : score >= 0.4 ? 'DEVELOPING' : 'INCORRECT',
    feedback: `Your response highlighted ${matched.length > 0 ? matched.join(', ') : 'initial intuition'}. To demonstrate full mastery of ${skillName}, make sure to explicitly connect the underlying mathematical formulas with practical data science implications.`,
    conceptsIdentified: matched.length > 0 ? matched : ['Initial reasoning'],
    conceptsMissed: domainKeywords.filter((k) => !lowerText.includes(k.toLowerCase())).slice(0, 3),
    misconceptionsDetected: !isCorrect && selfConfidence >= 4 ? ['Potential confusion of terminology or causality'] : [],
    cognitiveState,
    suggestedAction: `Practice linking ${skillName} principles to concrete code and calculation steps.`,
  };
}
