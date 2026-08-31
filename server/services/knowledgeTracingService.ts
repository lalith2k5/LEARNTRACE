import { Attempt, BktParameters, TraceSimulationPoint } from '../../src/types.js';

export const DEFAULT_BKT_PARAMS: BktParameters = {
  pL0: 0.15,      // Prior knowledge probability
  pTransit: 0.18,  // Skill acquisition probability per step
  pSlip: 0.10,     // Probability of slip (knowing skill but answering wrong)
  pGuess: 0.25,    // Probability of guessing (not knowing skill but answering right)
};

/**
 * Bayesian Knowledge Tracing (BKT)
 * Computes posterior probability of mastery after observing binary evidence sequence.
 */
export function computeBktMasterySequence(
  attempts: Array<{ correct: boolean }>,
  params: BktParameters = DEFAULT_BKT_PARAMS
): number[] {
  const { pL0, pTransit, pSlip, pGuess } = params;
  let pL = pL0;
  const history: number[] = [pL];

  for (const attempt of attempts) {
    let pL_given_obs: number;

    if (attempt.correct) {
      // P(L | Correct) = [P(L) * (1 - pSlip)] / [P(L) * (1 - pSlip) + (1 - P(L)) * pGuess]
      const numerator = pL * (1 - pSlip);
      const denominator = numerator + (1 - pL) * pGuess;
      pL_given_obs = denominator > 0 ? numerator / denominator : pL;
    } else {
      // P(L | Incorrect) = [P(L) * pSlip] / [P(L) * pSlip + (1 - P(L)) * (1 - pGuess)]
      const numerator = pL * pSlip;
      const denominator = numerator + (1 - pL) * (1 - pGuess);
      pL_given_obs = denominator > 0 ? numerator / denominator : pL;
    }

    // Transit to next state: P(L_next) = P(L_given_obs) + (1 - P(L_given_obs)) * P(Transit)
    pL = pL_given_obs + (1 - pL_given_obs) * pTransit;
    pL = Math.max(0.01, Math.min(0.99, pL));
    history.push(Math.round(pL * 1000) / 1000);
  }

  return history;
}

/**
 * Deep Knowledge Tracing (DKT) Neural Model Simulation
 * Simulates an LSTM/RNN recurrent knowledge state update:
 * h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h)
 * y_t = sigmoid(W_hy * h_t + b_y)
 */
export function computeDktMasterySequence(
  attempts: Array<{ correct: boolean; confidence?: number; timeTakenSeconds?: number }>
): number[] {
  // Dimension 4 hidden vector representing latent cognitive parameters [skill_strength, retention_rate, speed_factor, certainty]
  let h: number[] = [0.1, -0.2, 0.0, 0.1];
  const history: number[] = [0.15]; // baseline starting prediction

  // Weights representing trained pedagogical transitions
  const W_xh = [
    [0.75, 0.45, -0.30, 0.50],  // effect of correct answer
    [-0.80, -0.50, 0.25, -0.65], // effect of incorrect answer
  ];
  const W_hh_diag = [0.82, 0.78, 0.85, 0.80]; // recurrent memory retention

  for (let i = 0; i < attempts.length; i++) {
    const att = attempts[i];
    const obsIdx = att.correct ? 0 : 1;
    const inputVec = W_xh[obsIdx];
    
    // Confidence weighting modulation
    const confWeight = att.confidence ? (att.confidence / 3.0) : 1.0;

    // Recurrent hidden update: h_t = tanh(diag(W_hh) * h_{t-1} + inputVec * confWeight)
    const h_next: number[] = [];
    for (let j = 0; j < 4; j++) {
      const val = W_hh_diag[j] * h[j] + inputVec[j] * confWeight;
      h_next.push(Math.tanh(val));
    }
    h = h_next;

    // Output projection: logit = 1.1 * h[0] + 0.6 * h[1] - 0.2 * h[2] + 0.4 * h[3]
    const logit = 1.1 * h[0] + 0.6 * h[1] - 0.2 * h[2] + 0.4 * h[3];
    const pCorrectNext = 1 / (1 + Math.exp(-logit));
    const normalizedMastery = Math.max(0.05, Math.min(0.98, pCorrectNext));

    history.push(Math.round(normalizedMastery * 1000) / 1000);
  }

  return history;
}

/**
 * LearnTrace Recency-Weighted Heuristic Sequence Generator
 */
export function computeLearnTraceHeuristicSequence(
  attempts: Array<{ correct: boolean; confidence?: number; timeTakenSeconds?: number }>
): number[] {
  const history: number[] = [0.0];
  const weights = [0.4, 0.3, 0.2, 0.1];

  for (let step = 1; step <= attempts.length; step++) {
    const subAttempts = attempts.slice(0, step);
    const recent = subAttempts.slice(-4).reverse();
    let totalScore = 0;
    let totalWeight = 0;

    recent.forEach((att, idx) => {
      const weight = weights[idx] || 0.05;
      let score = att.correct ? 1.0 : 0.0;

      if (att.correct && att.confidence && att.confidence >= 4) {
        score = Math.min(1.0, score + 0.1);
      }
      if (!att.correct && att.confidence && att.confidence >= 4) {
        score = Math.max(0.0, score - 0.2); // Severe penalty for confident misconception
      }

      totalScore += score * weight;
      totalWeight += weight;
    });

    const mastery = totalWeight > 0 ? totalScore / totalWeight : 0.0;
    history.push(Math.round(Math.min(1.0, Math.max(0.0, mastery)) * 1000) / 1000);
  }

  return history;
}

/**
 * Full Step-by-Step Simulation Comparison for Live Trace or Sandbox Playgrounds
 */
export function generateMultiModelTraceSimulation(
  attempts: Array<{ correct: boolean; confidence?: number; timeTakenSeconds?: number; questionText?: string }>,
  bktParams: BktParameters = DEFAULT_BKT_PARAMS
): TraceSimulationPoint[] {
  const bktHistory = computeBktMasterySequence(attempts, bktParams);
  const dktHistory = computeDktMasterySequence(attempts);
  const ltHistory = computeLearnTraceHeuristicSequence(attempts);

  const points: TraceSimulationPoint[] = [];

  // Step 0 (Prior)
  points.push({
    step: 0,
    isCorrect: false,
    label: 'Prior Baseline',
    learnTraceScore: ltHistory[0],
    bktScore: bktHistory[0],
    dktScore: dktHistory[0],
  });

  for (let i = 0; i < attempts.length; i++) {
    const att = attempts[i];
    points.push({
      step: i + 1,
      isCorrect: att.correct,
      confidence: att.confidence,
      label: `Q${i + 1}: ${att.correct ? 'Correct (✓)' : 'Incorrect (✗)'}`,
      learnTraceScore: ltHistory[i + 1],
      bktScore: bktHistory[i + 1],
      dktScore: dktHistory[i + 1],
    });
  }

  return points;
}
