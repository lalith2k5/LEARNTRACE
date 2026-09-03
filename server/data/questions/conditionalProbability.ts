import { SeedQuestionDefinition } from '../questionBank.js';

export const CONDITIONAL_PROBABILITY_QUESTIONS: SeedQuestionDefinition[] = [
  {
    "id": "q_cond_01",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "What is the mathematical definition of the conditional probability P(A|B) for events A and B where P(B) > 0?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(A and B) / P(B)"
      },
      {
        "id": "opt_b",
        "text": "P(A and B) / P(A)"
      },
      {
        "id": "opt_c",
        "text": "P(A) * P(B)"
      },
      {
        "id": "opt_d",
        "text": "P(A) + P(B) - P(B)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: By definition, P(A|B) measures the fraction of event B's probability mass that also belongs to event A.",
      "opt_b": "Misconception: Divides by P(A) instead of P(B), which defines P(B|A).",
      "opt_c": "Misconception: Confuses conditional probability with joint probability of independent events.",
      "opt_d": "Misconception: Flawed algebraic expression."
    },
    "explanation": "Conditional probability P(A|B) is the probability of A occurring given that B has already occurred: P(A|B) = P(A \u2229 B) / P(B)."
  },
  {
    "id": "q_cond_02",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "In Bayes' Theorem, P(H|E) = [P(E|H) * P(H)] / P(E), what is P(H) termed?",
    "options": [
      {
        "id": "opt_a",
        "text": "Prior probability (the initial belief in hypothesis H before observing evidence E)"
      },
      {
        "id": "opt_b",
        "text": "Posterior probability"
      },
      {
        "id": "opt_c",
        "text": "Likelihood"
      },
      {
        "id": "opt_d",
        "text": "Marginal evidence"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(H) is the prior belief before seeing evidence E.",
      "opt_b": "Misconception: P(H|E) is the posterior probability (after observing evidence).",
      "opt_c": "Misconception: P(E|H) is the likelihood function.",
      "opt_d": "Misconception: P(E) is the marginal evidence."
    },
    "explanation": "P(H) is the prior probability, reflecting the initial credence assigned to hypothesis H prior to incorporating evidence E."
  },
  {
    "id": "q_cond_03",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "What does the term P(E|H) represent in Bayes' Theorem?",
    "options": [
      {
        "id": "opt_a",
        "text": "Likelihood (the probability of observing evidence E assuming hypothesis H is true)"
      },
      {
        "id": "opt_b",
        "text": "Prior probability"
      },
      {
        "id": "opt_c",
        "text": "Posterior probability"
      },
      {
        "id": "opt_d",
        "text": "Normalizing constant"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Likelihood measures how well hypothesis H explains the observed evidence E.",
      "opt_b": "Misconception: Prior is P(H).",
      "opt_c": "Misconception: Posterior is P(H|E).",
      "opt_d": "Misconception: Normalizing constant is P(E)."
    },
    "explanation": "The likelihood P(E|H) assesses how probable the observed data E would be under the assumption that hypothesis H is true."
  },
  {
    "id": "q_cond_04",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "If two events A and B are statistically independent, what does P(A|B) equal?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(A)"
      },
      {
        "id": "opt_b",
        "text": "P(B)"
      },
      {
        "id": "opt_c",
        "text": "1"
      },
      {
        "id": "opt_d",
        "text": "0"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Independence means learning that B occurred provides zero new information about the likelihood of A.",
      "opt_b": "Misconception: Confuses P(A|B) with P(B).",
      "opt_c": "Misconception: Implies B guarantees A.",
      "opt_d": "Misconception: Confuses independence with mutually exclusive events."
    },
    "explanation": "By definition of independence: P(A|B) = P(A \u2229 B) / P(B) = [P(A)*P(B)] / P(B) = P(A)."
  },
  {
    "id": "q_cond_05",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "According to the Law of Total Probability, if B_1, ..., B_k form a partition of sample space S, how is P(A) calculated?",
    "options": [
      {
        "id": "opt_a",
        "text": "Sum_{i=1}^k [ P(A | B_i) * P(B_i) ]"
      },
      {
        "id": "opt_b",
        "text": "Product_{i=1}^k [ P(A | B_i) ]"
      },
      {
        "id": "opt_c",
        "text": "Sum_{i=1}^k [ P(A | B_i) / P(B_i) ]"
      },
      {
        "id": "opt_d",
        "text": "Max_{i=1}^k [ P(A | B_i) ]"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(A) is reconstructed by marginalizing over all disjoint partition subsets weighted by their prior probability.",
      "opt_b": "Misconception: Multiplies conditional probabilities.",
      "opt_c": "Misconception: Divides by prior probabilities.",
      "opt_d": "Misconception: Confuses total probability with maximum likelihood."
    },
    "explanation": "The Law of Total Probability expresses P(A) as the weighted sum of A across all partition segments B_i: P(A) = \u2211 P(A|B_i)P(B_i)."
  },
  {
    "id": "q_cond_06",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "What is the product rule (chain rule) for the joint probability of two events P(A and B)?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(A and B) = P(A | B) * P(B) = P(B | A) * P(A)"
      },
      {
        "id": "opt_b",
        "text": "P(A and B) = P(A | B) + P(B)"
      },
      {
        "id": "opt_c",
        "text": "P(A and B) = P(A | B) / P(B)"
      },
      {
        "id": "opt_d",
        "text": "P(A and B) = [P(A) + P(B)] / 2"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Multiplying both sides of conditional definition by denominator gives P(A \u2229 B) = P(A|B)P(B).",
      "opt_b": "Misconception: Adds terms.",
      "opt_c": "Misconception: Divides instead of multiplying.",
      "opt_d": "Misconception: Computes arithmetic mean."
    },
    "explanation": "The chain rule states that joint probability equals conditional probability times conditioning event probability: P(A \u2229 B) = P(A|B)P(B)."
  },
  {
    "id": "q_cond_07",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "Why must P(B) > 0 in order to define P(A|B)?",
    "options": [
      {
        "id": "opt_a",
        "text": "Because conditioning on an event with measure 0 would result in division by zero, rendering the conditional probability undefined in standard probability"
      },
      {
        "id": "opt_b",
        "text": "Because events with probability 0 cannot exist physically"
      },
      {
        "id": "opt_c",
        "text": "Because conditional probabilities must always be integers"
      },
      {
        "id": "opt_d",
        "text": "Because P(A) would automatically equal zero"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Standard Kolmogorov definition P(A|B) = P(A and B)/P(B) requires non-zero denominator.",
      "opt_b": "Misconception: In continuous spaces, individual points have measure zero yet can occur.",
      "opt_c": "Misconception: Probabilities are real numbers in [0, 1], not integers.",
      "opt_d": "Misconception: P(A) is completely independent of whether P(B) is 0."
    },
    "explanation": "In elementary probability, dividing by P(B) = 0 is undefined. Advanced measure theory handles zero-probability conditions using Radon-Nikodym derivatives."
  },
  {
    "id": "q_cond_08",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 1,
    "cognitiveCategory": "Recall",
    "text": "What is the relationship between P(A|B) and P(B|A)?",
    "options": [
      {
        "id": "opt_a",
        "text": "They are generally NOT equal; P(A|B) = P(B|A) * [P(A) / P(B)]"
      },
      {
        "id": "opt_b",
        "text": "They are always identical by commutative property of probability"
      },
      {
        "id": "opt_c",
        "text": "P(A|B) is always strictly larger than P(B|A)"
      },
      {
        "id": "opt_d",
        "text": "P(A|B) + P(B|A) = 1"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Conditional probability is asymmetric; swapping order scales by the ratio of priors P(A)/P(B).",
      "opt_b": "Misconception: Classic confusion known as the Prosecutor's Fallacy or transposed conditional.",
      "opt_c": "Misconception: The relative magnitude depends entirely on P(A) vs P(B).",
      "opt_d": "Misconception: Conditional probabilities of swapped events do not sum to 1."
    },
    "explanation": "P(A|B) and P(B|A) are different conditional statements. For example, P(Mammal | Dog) = 1, but P(Dog | Mammal) is very small."
  },
  {
    "id": "q_cond_09",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "What is the Prosecutor's Fallacy?",
    "options": [
      {
        "id": "opt_a",
        "text": "Confusing P(Evidence | Innocent) with P(Innocent | Evidence)"
      },
      {
        "id": "opt_b",
        "text": "Assuming an eyewitness is always 100% accurate"
      },
      {
        "id": "opt_c",
        "text": "Failing to account for measurement precision in DNA lab equipment"
      },
      {
        "id": "opt_d",
        "text": "Believing a suspect is guilty solely due to past criminal records"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: The fallacy transposes the conditional, equating the rarity of a match if innocent with the probability of innocence given a match.",
      "opt_b": "Misconception: Describes eyewitness unreliability, not the conditional probability transposition.",
      "opt_c": "Misconception: Laboratory technical error.",
      "opt_d": "Misconception: Character bias."
    },
    "explanation": "The Prosecutor's Fallacy confuses P(E|I) with P(I|E). Showing that a random innocent person has only a 1 in 1,000,000 chance of matching DNA does NOT mean the matched defendant has a 99.9999% chance of guilt."
  },
  {
    "id": "q_cond_10",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "What does conditional independence between A and B given C, denoted (A _|_ B | C), mean mathematically?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(A and B | C) = P(A | C) * P(B | C)"
      },
      {
        "id": "opt_b",
        "text": "P(A and B) = P(A) * P(B)"
      },
      {
        "id": "opt_c",
        "text": "P(A | B) = P(C)"
      },
      {
        "id": "opt_d",
        "text": "P(C | A and B) = 1"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Once C is known, learning A provides no additional information about B.",
      "opt_b": "Misconception: This is marginal independence, which neither implies nor is implied by conditional independence.",
      "opt_c": "Misconception: Nonsensical equivalence.",
      "opt_d": "Misconception: Implies A and B guarantee C."
    },
    "explanation": "Events A and B are conditionally independent given C if knowledge of C makes A and B independent: P(A \u2229 B | C) = P(A|C) * P(B|C)."
  },
  {
    "id": "q_cond_11",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob",
      "skill_model_eval"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "In a medical diagnostic test for a disease D, what does the 'Sensitivity' of the test represent?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(Test Positive | Disease Present) \u2014 the true positive rate"
      },
      {
        "id": "opt_b",
        "text": "P(Disease Present | Test Positive) \u2014 positive predictive value"
      },
      {
        "id": "opt_c",
        "text": "P(Test Negative | Disease Absent) \u2014 specificity"
      },
      {
        "id": "opt_d",
        "text": "P(Disease Present) \u2014 prior prevalence"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Sensitivity is the probability that a sick individual correctly tests positive.",
      "opt_b": "Misconception: This is Precision or Positive Predictive Value (PPV).",
      "opt_c": "Misconception: This is Specificity (True Negative Rate).",
      "opt_d": "Misconception: This is the disease base rate or prevalence."
    },
    "explanation": "Sensitivity is the test's ability to correctly identify diseased patients: P(Positive Test | Disease Present)."
  },
  {
    "id": "q_cond_12",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob",
      "skill_model_eval"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "In a medical test, what does 'Specificity' represent?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(Test Negative | Disease Absent) \u2014 the true negative rate"
      },
      {
        "id": "opt_b",
        "text": "P(Disease Absent | Test Negative) \u2014 negative predictive value"
      },
      {
        "id": "opt_c",
        "text": "P(Test Positive | Disease Absent) \u2014 false positive rate"
      },
      {
        "id": "opt_d",
        "text": "P(Test Positive | Disease Present) \u2014 sensitivity"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Specificity measures the probability that a healthy individual tests negative.",
      "opt_b": "Misconception: This is Negative Predictive Value (NPV).",
      "opt_c": "Misconception: This is the False Positive Rate (1 - Specificity).",
      "opt_d": "Misconception: This is Sensitivity."
    },
    "explanation": "Specificity is the probability that a healthy person tests negative: P(Negative Test | Healthy)."
  },
  {
    "id": "q_cond_13",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "How does a very low prior probability (rare disease prevalence) impact the posterior probability of disease given a positive test?",
    "options": [
      {
        "id": "opt_a",
        "text": "Even with high sensitivity and specificity, the posterior probability of disease given a positive test can remain surprisingly low due to false positives outnumbering true cases"
      },
      {
        "id": "opt_b",
        "text": "The posterior probability is always greater than 99% if sensitivity is 99%"
      },
      {
        "id": "opt_c",
        "text": "Prior probability has zero mathematical influence on posterior probability"
      },
      {
        "id": "opt_d",
        "text": "A rare prior forces sensitivity to drop to 0%"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: When disease prevalence is 1 in 10,000, even a 1% false positive rate produces ~100 false positives for every 1 true positive.",
      "opt_b": "Misconception: Commits the Base Rate Fallacy.",
      "opt_c": "Misconception: Denies Bayes' Theorem where P(H) directly scales the numerator.",
      "opt_d": "Misconception: Sensitivity is a test characteristic independent of prevalence."
    },
    "explanation": "The Base Rate Fallacy demonstrates that for rare conditions, the small false positive rate from the massive healthy population overwhelms true positives from the tiny infected population."
  },
  {
    "id": "q_cond_14",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "What is the chain rule of probability for three events A, B, and C?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(A and B and C) = P(A) * P(B | A) * P(C | A and B)"
      },
      {
        "id": "opt_b",
        "text": "P(A and B and C) = P(A) * P(B) * P(C)"
      },
      {
        "id": "opt_c",
        "text": "P(A and B and C) = P(A | B) * P(B | C) * P(C | A)"
      },
      {
        "id": "opt_d",
        "text": "P(A and B and C) = P(A) + P(B | A) + P(C | B)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Successive conditioning decomposes any joint distribution: P(A) * P(B|A) * P(C|A,B).",
      "opt_b": "Misconception: Assumes mutual independence between all three events.",
      "opt_c": "Misconception: Circular conditioning that does not evaluate to joint probability.",
      "opt_d": "Misconception: Adds probabilities instead of multiplying."
    },
    "explanation": "By repeatedly applying P(X \u2229 Y) = P(Y|X)P(X), the joint probability factorizes as P(A \u2229 B \u2229 C) = P(A)P(B|A)P(C|A,B)."
  },
  {
    "id": "q_cond_15",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "What is the False Positive Rate (FPR) in terms of Specificity?",
    "options": [
      {
        "id": "opt_a",
        "text": "FPR = 1 - Specificity"
      },
      {
        "id": "opt_b",
        "text": "FPR = 1 - Sensitivity"
      },
      {
        "id": "opt_c",
        "text": "FPR = Specificity / Sensitivity"
      },
      {
        "id": "opt_d",
        "text": "FPR = 1 / Specificity"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Specificity is True Negative Rate (TN / (TN+FP)), so False Positive Rate (FP / (TN+FP)) = 1 - Specificity.",
      "opt_b": "Misconception: 1 - Sensitivity is False Negative Rate (FNR).",
      "opt_c": "Misconception: Ratios between specificity and sensitivity do not equal FPR.",
      "opt_d": "Misconception: Reciprocal error."
    },
    "explanation": "Since a negative actual case must be either a true negative or a false positive, True Negative Rate + False Positive Rate = 1, so FPR = 1 - Specificity."
  },
  {
    "id": "q_cond_16",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 2,
    "cognitiveCategory": "Comprehension",
    "text": "If a family has two children, and you are told that at least one of them is a Boy, what is the probability that both are Boys (assuming equiprobable independent births)?",
    "options": [
      {
        "id": "opt_a",
        "text": "1/3"
      },
      {
        "id": "opt_b",
        "text": "1/2"
      },
      {
        "id": "opt_c",
        "text": "1/4"
      },
      {
        "id": "opt_d",
        "text": "2/3"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Sample space is {BB, BG, GB, GG}. Condition 'at least one boy' leaves {BB, BG, GB} (3 outcomes). Favorable is {BB} (1 outcome) -> 1/3.",
      "opt_b": "Misconception: Confuses 'at least one is a boy' with 'the first child is a boy', which would be 1/2.",
      "opt_c": "Misconception: Calculates unconditioned P(BB) = 1/4.",
      "opt_d": "Misconception: Calculates probability that exactly one is a girl."
    },
    "explanation": "Unconditioned sample space: {BB, BG, GB, GG}, each with probability 1/4. Given at least one Boy, GG is eliminated, leaving 3 equally likely possibilities. Only 1 (BB) has both boys: 1/3."
  },
  {
    "id": "q_cond_17",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "A disease has 1% prevalence (P(D)=0.01). A test has 90% Sensitivity and 90% Specificity. A random patient tests positive. What is the probability that the patient actually has the disease P(D|+)?",
    "options": [
      {
        "id": "opt_a",
        "text": "Approximately 8.3% (0.009 / (0.009 + 0.099))"
      },
      {
        "id": "opt_b",
        "text": "90.0%"
      },
      {
        "id": "opt_c",
        "text": "81.0%"
      },
      {
        "id": "opt_d",
        "text": "50.0%"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(+|D)P(D) = 0.90*0.01 = 0.009. P(+|D')P(D') = 0.10*0.99 = 0.099. P(+) = 0.108. P(D|+) = 0.009 / 0.108 = 1/12 \u2248 8.33%.",
      "opt_b": "Misconception: Base Rate Fallacy: assumes test accuracy equals posterior probability.",
      "opt_c": "Misconception: Multiplies sensitivity by specificity.",
      "opt_d": "Misconception: Arbitrary guess."
    },
    "explanation": "P(D|+) = (0.90 * 0.01) / [0.90 * 0.01 + (1 - 0.90) * 0.99] = 0.009 / (0.009 + 0.099) = 0.009 / 0.108 \u2248 8.33%."
  },
  {
    "id": "q_cond_18",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "In a naive Bayes spam filter, 20% of emails are spam (P(S)=0.2). Word 'free' appears in 70% of spam (P(W|S)=0.7) and 10% of non-spam (P(W|S')=0.1). What is P(S|W)?",
    "options": [
      {
        "id": "opt_a",
        "text": "63.6% (0.14 / 0.22)"
      },
      {
        "id": "opt_b",
        "text": "70.0%"
      },
      {
        "id": "opt_c",
        "text": "14.0%"
      },
      {
        "id": "opt_d",
        "text": "87.5%"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Numerator: 0.7 * 0.2 = 0.14. Denominator: 0.14 + (0.10 * 0.80) = 0.14 + 0.08 = 0.22. P(S|W) = 0.14 / 0.22 = 7/11 \u2248 63.64%.",
      "opt_b": "Misconception: Confuses likelihood P(W|S) with posterior P(S|W).",
      "opt_c": "Misconception: Joint probability P(S and W) = 0.14, forgets to divide by P(W).",
      "opt_d": "Misconception: Inverts denominator terms."
    },
    "explanation": "P(S|W) = P(W|S)P(S) / [P(W|S)P(S) + P(W|S')P(S')] = (0.7*0.2) / (0.14 + 0.1*0.8) = 0.14 / 0.22 \u2248 63.64%."
  },
  {
    "id": "q_cond_19",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "From a standard deck of 52 cards, you draw a single card and are told it is Red. What is the probability that it is a Heart?",
    "options": [
      {
        "id": "opt_a",
        "text": "13/26 = 1/2 (50%)"
      },
      {
        "id": "opt_b",
        "text": "13/52 = 1/4 (25%)"
      },
      {
        "id": "opt_c",
        "text": "1/13"
      },
      {
        "id": "opt_d",
        "text": "26/52 = 1/2"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(Heart | Red) = P(Heart and Red) / P(Red) = (13/52) / (26/52) = 13/26 = 1/2.",
      "opt_b": "Misconception: Forgets that conditioning restricts sample space to the 26 red cards.",
      "opt_c": "Misconception: Confuses suit probability with card rank probability.",
      "opt_d": "Misconception: Calculates P(Red) rather than P(Heart | Red)."
    },
    "explanation": "Given the card is Red, the effective sample space is reduced to 26 cards (13 Hearts and 13 Diamonds). The probability of drawing a Heart is 13/26 = 1/2."
  },
  {
    "id": "q_cond_20",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "Two factories produce lightbulbs. Factory A produces 60% of all bulbs, with a 2% defect rate. Factory B produces 40% with a 5% defect rate. If a randomly picked bulb is defective, what is the probability it came from Factory A?",
    "options": [
      {
        "id": "opt_a",
        "text": "37.5% (0.012 / 0.032)"
      },
      {
        "id": "opt_b",
        "text": "60.0%"
      },
      {
        "id": "opt_c",
        "text": "24.0%"
      },
      {
        "id": "opt_d",
        "text": "50.0%"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(Defect and A) = 0.60 * 0.02 = 0.012. P(Defect and B) = 0.40 * 0.05 = 0.020. Total P(Defect) = 0.032. P(A | Defect) = 0.012 / 0.032 = 3/8 = 37.5%.",
      "opt_b": "Misconception: Cites prior factory share without updating with defect rate.",
      "opt_c": "Misconception: Multiplication mistake.",
      "opt_d": "Misconception: Assumes equal likelihood."
    },
    "explanation": "P(A|D) = (0.60 * 0.02) / (0.60 * 0.02 + 0.40 * 0.05) = 0.012 / (0.012 + 0.020) = 0.012 / 0.032 = 37.5%."
  },
  {
    "id": "q_cond_21",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "Given the contingency table for 100 students:\n- Male: 30 Math majors, 20 Non-Math\n- Female: 20 Math majors, 30 Non-Math\nWhat is P(Female | Math major)?",
    "options": [
      {
        "id": "opt_a",
        "text": "20/50 = 40%"
      },
      {
        "id": "opt_b",
        "text": "20/100 = 20%"
      },
      {
        "id": "opt_c",
        "text": "20/50 = 50%"
      },
      {
        "id": "opt_d",
        "text": "30/50 = 60%"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Total Math majors = 30 + 20 = 50. Female Math majors = 20. P(Female | Math) = 20/50 = 40%.",
      "opt_b": "Misconception: Divides by overall total of 100 students instead of conditioning on Math majors.",
      "opt_c": "Misconception: Arithmetic error in fraction reduction.",
      "opt_d": "Misconception: Computes P(Male | Math major) = 30/50 = 60%."
    },
    "explanation": "Total number of Math majors is 30 (male) + 20 (female) = 50. Among them, 20 are female. P(Female | Math) = 20 / 50 = 40%."
  },
  {
    "id": "q_cond_22",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "In a 3-door Monty Hall game, if Door 1 was selected, and Monty opens Door 3 showing a goat, what is P(Car behind Door 2 | Monty opened Door 3)?",
    "options": [
      {
        "id": "opt_a",
        "text": "2/3 (66.7%)"
      },
      {
        "id": "opt_b",
        "text": "1/2 (50.0%)"
      },
      {
        "id": "opt_c",
        "text": "1/3 (33.3%)"
      },
      {
        "id": "opt_d",
        "text": "1.0 (100%)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Bayes theorem: P(C2 | O3) = P(O3|C2)P(C2) / P(O3) = (1 * 1/3) / (1/2) = 2/3.",
      "opt_b": "Misconception: Naive equal probability assumption across remaining two doors.",
      "opt_c": "Misconception: P(Car behind Door 1 | Monty opened Door 3) = 1/3.",
      "opt_d": "Misconception: Assumes switching guarantees a win."
    },
    "explanation": "If car is behind door 2, Monty is forced to open door 3 (P=1). If behind door 1, he chooses between 2 and 3 randomly (P=0.5). By Bayes' theorem, P(C2|O3) = (1 * 1/3) / (1/2) = 2/3."
  },
  {
    "id": "q_cond_23",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "What is the Conditional Expectation E[X | Y = y] of a discrete random variable X given Y = y?",
    "options": [
      {
        "id": "opt_a",
        "text": "Sum over x of [ x * P(X = x | Y = y) ]"
      },
      {
        "id": "opt_b",
        "text": "E[X] * E[Y]"
      },
      {
        "id": "opt_c",
        "text": "Sum over y of [ y * P(Y = y | X = x) ]"
      },
      {
        "id": "opt_d",
        "text": "E[X] / P(Y = y)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Conditional expectation is the mean of the conditional probability distribution P(X=x|Y=y).",
      "opt_b": "Misconception: Confuses with product of expectations.",
      "opt_c": "Misconception: Swaps variables calculating E[Y|X].",
      "opt_d": "Misconception: Incorrect division by scalar probability."
    },
    "explanation": "E[X | Y=y] is the expected value computed using the conditional probability mass function: E[X | Y=y] = \u2211 x P(X=x | Y=y)."
  },
  {
    "id": "q_cond_24",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 3,
    "cognitiveCategory": "Application",
    "text": "Suppose a coin is either fair (P(H)=0.5, prior P(F)=0.8) or two-headed (P(H)=1.0, prior P(B)=0.2). You flip the coin once and get Heads. What is the posterior probability that the coin is fair P(F|H)?",
    "options": [
      {
        "id": "opt_a",
        "text": "2/3 (approximately 66.7%)"
      },
      {
        "id": "opt_b",
        "text": "4/5 (80.0%)"
      },
      {
        "id": "opt_c",
        "text": "1/2 (50.0%)"
      },
      {
        "id": "opt_d",
        "text": "1/3 (33.3%)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: P(H and F) = 0.8 * 0.5 = 0.4. P(H and B) = 0.2 * 1.0 = 0.2. Total P(H) = 0.6. P(F|H) = 0.4 / 0.6 = 2/3 \u2248 66.7%.",
      "opt_b": "Misconception: Cites original prior P(F)=0.8 without Bayesian updating.",
      "opt_c": "Misconception: Assumes equal posterior probability.",
      "opt_d": "Misconception: Computes P(Biased | Heads) = 0.2 / 0.6 = 1/3."
    },
    "explanation": "P(F|H) = P(H|F)P(F) / [P(H|F)P(F) + P(H|B)P(B)] = (0.5 * 0.8) / (0.5 * 0.8 + 1.0 * 0.2) = 0.4 / 0.6 = 2/3."
  },
  {
    "id": "q_cond_25",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "What is Berkson's Fallacy (selection bias in conditional probabilities)?",
    "options": [
      {
        "id": "opt_a",
        "text": "Conditioning on a common collider effect induces a spurious negative correlation between two independent causes in the sampled subpopulation"
      },
      {
        "id": "opt_b",
        "text": "Assuming correlation implies causation in observational medical trials"
      },
      {
        "id": "opt_c",
        "text": "Failing to normalize likelihoods to sum to 1 in Bayesian estimation"
      },
      {
        "id": "opt_d",
        "text": "Overestimating the probability of rare conjunctive events"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: In hospitalized patients (collider condition), disease A and disease B can appear negatively correlated even if independent in general population.",
      "opt_b": "Misconception: General post hoc ergo propter hoc fallacy.",
      "opt_c": "Misconception: Algorithmic arithmetic error.",
      "opt_d": "Misconception: Conjunction fallacy (Tversky & Kahneman Linda problem)."
    },
    "explanation": "Berkson's bias occurs when conditioning on a shared outcome (e.g. hospitalization) creates an artificial negative dependency between otherwise independent causal factors."
  },
  {
    "id": "q_cond_26",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "In a causal Directed Acyclic Graph (DAG) with structure X -> Z <- Y (a collider at Z), what happens to the dependency between X and Y when we condition on Z?",
    "options": [
      {
        "id": "opt_a",
        "text": "X and Y, which are marginally independent, become conditionally dependent given Z (collider unblocks the path)"
      },
      {
        "id": "opt_b",
        "text": "X and Y become conditionally independent"
      },
      {
        "id": "opt_c",
        "text": "Z becomes independent of both X and Y"
      },
      {
        "id": "opt_d",
        "text": "The causal directions reverse automatically"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Conditioning on a collider (or its descendants) opens the path between X and Y according to Pearl's d-separation rules.",
      "opt_b": "Misconception: X and Y were ALREADY marginally independent; conditioning on a collider creates dependency.",
      "opt_c": "Misconception: Z remains causally dependent on both parents.",
      "opt_d": "Misconception: Causal DAG topologies do not reverse."
    },
    "explanation": "In d-separation, a collider node blocks a path by default. Conditioning on the collider (or its descendants) opens the active trail, inducing conditional dependence between its causes ('explaining away')."
  },
  {
    "id": "q_cond_27",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "What is the Zero-Frequency Problem in Naive Bayes text classification, and how is Laplace (Add-1) smoothing applied to resolve it?",
    "options": [
      {
        "id": "opt_a",
        "text": "If a word never appeared with a class in training, P(Word | Class) = 0 wipes out the entire joint probability; Laplace smoothing adds pseudocount alpha to avoid zero probabilities"
      },
      {
        "id": "opt_b",
        "text": "Words with zero syllables cause division by zero during vectorization"
      },
      {
        "id": "opt_c",
        "text": "Zero-frequency words cause infinite gradient descent loops"
      },
      {
        "id": "opt_d",
        "text": "It eliminates rare words by pruning them entirely from vocabulary"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Since Naive Bayes multiplies conditional probabilities \u220f P(w_i|C), a single 0 sets the posterior to 0. Laplace smoothing adds 1 to count and |V| to denominator.",
      "opt_b": "Misconception: Irrelevant linguistic attribute.",
      "opt_c": "Misconception: Naive Bayes uses closed-form counting, not iterative gradient descent.",
      "opt_d": "Misconception: Laplace smoothing retains all vocabulary words rather than pruning."
    },
    "explanation": "Because naive Bayes multiplies likelihoods, a zero conditional probability P(w_i|C) zeros out the entire posterior. Laplace smoothing assigns prior pseudocounts: P(w|C) = (count + 1) / (total_words + |V|)."
  },
  {
    "id": "q_cond_28",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "Can two random variables be marginally independent but conditionally dependent given a third variable Z?",
    "options": [
      {
        "id": "opt_a",
        "text": "Yes; for example, two independent fair coins X and Y, with Z = X XOR Y. X and Y are independent, but given Z, knowing X determines Y"
      },
      {
        "id": "opt_b",
        "text": "No; marginal independence mathematically guarantees conditional independence for all conditioning variables"
      },
      {
        "id": "opt_c",
        "text": "Yes, but only if Z is an unmeasurable set"
      },
      {
        "id": "opt_d",
        "text": "No; independence is an immutable invariant under conditioning"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Classic counterexample: P(X=1, Y=1) = 0.25 (independent). But given Z = X XOR Y = 1, knowing X=1 forces Y=0 (100% dependent).",
      "opt_b": "Misconception: Common beginner error assuming marginal independence implies conditional independence.",
      "opt_c": "Misconception: Non-measurable sets are not required; discrete boolean algebra proves it.",
      "opt_d": "Misconception: Conditioning fundamentally reshapes probability spaces."
    },
    "explanation": "Marginal independence does NOT imply conditional independence. In the XOR example, X and Y are independent, but conditioning on Z = X \u2295 Y renders X and Y completely deterministic."
  },
  {
    "id": "q_cond_29",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "In Bayesian updating, what is the 'Likelihood Ratio' (Bayes Factor) between two competing hypotheses H_1 and H_2 given evidence E?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(E | H_1) / P(E | H_2)"
      },
      {
        "id": "opt_b",
        "text": "P(H_1) / P(H_2)"
      },
      {
        "id": "opt_c",
        "text": "P(H_1 | E) / P(H_2 | E)"
      },
      {
        "id": "opt_d",
        "text": "P(E and H_1) / P(E and H_2)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: The Bayes Factor is the ratio of likelihoods measuring how much the evidence favors H_1 over H_2.",
      "opt_b": "Misconception: This is the prior odds ratio.",
      "opt_c": "Misconception: This is the posterior odds ratio.",
      "opt_d": "Misconception: Ratio of joints."
    },
    "explanation": "Bayes' Theorem in odds form: Posterior Odds = Prior Odds * Bayes Factor, where the Bayes Factor (Likelihood Ratio) is P(E|H_1) / P(E|H_2)."
  },
  {
    "id": "q_cond_30",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "What is the Law of Total Variance (Eve's Law) for random variables X and Y?",
    "options": [
      {
        "id": "opt_a",
        "text": "Var(X) = E[Var(X | Y)] + Var(E[X | Y])"
      },
      {
        "id": "opt_b",
        "text": "Var(X) = Var(X | Y) + Var(Y)"
      },
      {
        "id": "opt_c",
        "text": "Var(X) = E[Var(X | Y)] * Var(E[X | Y])"
      },
      {
        "id": "opt_d",
        "text": "Var(X) = E[X | Y]^2 - Var(Y)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Decomposes total variance into 'unexplained' expected within-group variance plus 'explained' between-group variance of the conditional mean.",
      "opt_b": "Misconception: Omits expectation operators.",
      "opt_c": "Misconception: Multiplies variance components.",
      "opt_d": "Misconception: Algebraic error."
    },
    "explanation": "The Law of Total Variance decomposes overall variance into the expected conditional variance ('within-group variation') plus the variance of the conditional expectation ('between-group variation')."
  },
  {
    "id": "q_cond_31",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "Why does conditioning on an ancestor confounder C in a fork DAG (X <- C -> Y) block the back-door path between X and Y?",
    "options": [
      {
        "id": "opt_a",
        "text": "Because C is a non-collider on the path, so conditioning on C renders X and Y conditionally independent along that path, removing confounding bias"
      },
      {
        "id": "opt_b",
        "text": "Because conditioning on C deletes the nodes X and Y from the graph"
      },
      {
        "id": "opt_c",
        "text": "Because C becomes a collider when conditioned upon"
      },
      {
        "id": "opt_d",
        "text": "Because it reverses the causal arrows pointing away from C"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: In d-separation, non-colliders (chains and forks) block paths when conditioned on, neutralizing spurious confounding associations.",
      "opt_b": "Misconception: Conditioning evaluates distribution slices, never deleting graph nodes.",
      "opt_c": "Misconception: Non-colliders never transform into colliders.",
      "opt_d": "Misconception: Arrow directions represent immutable causal physics."
    },
    "explanation": "In a causal fork X \u2190 C \u2192 Y, C is a confounder that creates a spurious association. Conditioning on C blocks the path, satisfying the backdoor criterion and isolating the true causal effect."
  },
  {
    "id": "q_cond_32",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 4,
    "cognitiveCategory": "Analysis",
    "text": "What happens in a conjugate Bayesian model when the number of observed data points approaches infinity?",
    "options": [
      {
        "id": "opt_a",
        "text": "The posterior distribution becomes increasingly dominated by the data likelihood, and the influence of the prior vanishes (Bernstein-von Mises theorem)"
      },
      {
        "id": "opt_b",
        "text": "The prior distribution completely overrides the data"
      },
      {
        "id": "opt_c",
        "text": "The posterior variance approaches positive infinity"
      },
      {
        "id": "opt_d",
        "text": "The posterior probability collapses to zero everywhere"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: As sample size n -> inf, the likelihood overwhelms the prior, and the posterior concentrates around the true parameter value asymptotically matching MLE.",
      "opt_b": "Misconception: Prior influence diminishes proportionally to 1/n.",
      "opt_c": "Misconception: Posterior variance shrinks to zero as precision accumulates.",
      "opt_d": "Misconception: Probability density integrates to 1, concentrating as a Dirac delta."
    },
    "explanation": "The Bernstein-von Mises theorem ensures that with large sample sizes, the posterior distribution converges to a Gaussian centered at the MLE, washing out the initial prior choice."
  },
  {
    "id": "q_cond_33",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "In a Bayesian network with DAG structure G, how does the joint probability distribution factorize across all vertices V?",
    "options": [
      {
        "id": "opt_a",
        "text": "P(X_1, ..., X_n) = Product_{i=1}^n P(X_i | Parents(X_i))"
      },
      {
        "id": "opt_b",
        "text": "P(X_1, ..., X_n) = Product_{i=1}^n P(X_i | Children(X_i))"
      },
      {
        "id": "opt_c",
        "text": "P(X_1, ..., X_n) = Sum_{i=1}^n P(X_i | Parents(X_i))"
      },
      {
        "id": "opt_d",
        "text": "P(X_1, ..., X_n) = Product_{i=1}^n [ P(X_i) / P(Parents(X_i)) ]"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: The Markov condition on DAGs guarantees that the joint distribution factorizes into the product of each variable conditioned on its immediate parents.",
      "opt_b": "Misconception: Conditioning on children inverts causal factorization.",
      "opt_c": "Misconception: Joint factorization requires multiplication, not summation.",
      "opt_d": "Misconception: Flawed algebraic division."
    },
    "explanation": "By the chain rule and local Markov property, any Bayesian network joint distribution factors as P(X_1,...,X_n) = \u220f P(X_i | Pa(X_i))."
  },
  {
    "id": "q_cond_34",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob_dist"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "In Beta-Binomial conjugate Bayesian updating, if prior is Beta(alpha, beta) and we observe k successes in n independent trials, what is the exact posterior distribution?",
    "options": [
      {
        "id": "opt_a",
        "text": "Beta(alpha + k, beta + n - k)"
      },
      {
        "id": "opt_b",
        "text": "Beta(alpha * k, beta * (n - k))"
      },
      {
        "id": "opt_c",
        "text": "Binomial(n, (alpha + k) / (alpha + beta + n))"
      },
      {
        "id": "opt_d",
        "text": "Beta(alpha + n, beta + k)"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Likelihood theta^k (1-theta)^{n-k} multiplies prior theta^{alpha-1} (1-theta)^{beta-1} yielding theta^{(alpha+k)-1} (1-theta)^{(beta+n-k)-1}.",
      "opt_b": "Misconception: Parameters add, not multiply.",
      "opt_c": "Misconception: The posterior for continuous parameter theta is a Beta distribution, not Binomial.",
      "opt_d": "Misconception: Swaps total trials n and successes k in update parameters."
    },
    "explanation": "Because the Beta prior and Binomial likelihood are conjugate, exponents add directly: the posterior parameter for successes is \u03b1 + k, and for failures is \u03b2 + (n - k)."
  },
  {
    "id": "q_cond_35",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "What constitutes the 'Markov Blanket' of a node X in a Bayesian belief network, such that X is conditionally independent of all other nodes in the network given this blanket?",
    "options": [
      {
        "id": "opt_a",
        "text": "X's parents, X's children, and all other parents of X's children (spouses)"
      },
      {
        "id": "opt_b",
        "text": "X's immediate parents and immediate children only"
      },
      {
        "id": "opt_c",
        "text": "All ancestors and descendants of X"
      },
      {
        "id": "opt_d",
        "text": "All nodes sharing the same topological rank as X"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: To shield X from unblocked collider paths through its children, the Markov Blanket must include the co-parents (spouses) of its children.",
      "opt_b": "Misconception: Forgets co-parents; without co-parents, conditioning on children would unblock collider paths to spouses.",
      "opt_c": "Misconception: Ancestors and descendants are far broader than necessary.",
      "opt_d": "Misconception: Topological rank does not reflect d-separation shielding."
    },
    "explanation": "A node's Markov Blanket consists of its parents, children, and spouses (co-parents of its children). Conditioned on this set, the node is d-separated from all remaining variables in the network."
  },
  {
    "id": "q_cond_36",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "What is the role of the posterior conditional distribution q(Z) = P(Z | X, theta) in the Expectation step (E-step) of the Expectation-Maximization (EM) algorithm?",
    "options": [
      {
        "id": "opt_a",
        "text": "It computes the expectation of the complete-data log-likelihood with respect to the latent variables Z conditioned on the observed data X and current parameter estimates theta"
      },
      {
        "id": "opt_b",
        "text": "It directly updates the parameter estimates theta using closed-form gradient descent"
      },
      {
        "id": "opt_c",
        "text": "It eliminates all noise from observed variables X"
      },
      {
        "id": "opt_d",
        "text": "It guarantees that the log-likelihood reaches the global optimum in one iteration"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: E-step calculates Q(theta | theta^{(t)}) = E_{Z|X, theta^{(t)}} [ln P(X, Z | theta)], tightening the Evidence Lower Bound (ELBO).",
      "opt_b": "Misconception: Updating parameters is the Maximization (M-step).",
      "opt_c": "Misconception: EM infers latent distributions, not noise elimination.",
      "opt_d": "Misconception: EM can get trapped in local optima."
    },
    "explanation": "In the E-step, the conditional distribution P(Z|X, \u03b8_old) computes the expected complete log-likelihood Q(\u03b8; \u03b8_old) over unobserved latent variables Z."
  },
  {
    "id": "q_cond_37",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "In a Hidden Markov Model (HMM), how does the Forward Algorithm compute the filtering distribution P(X_t | y_{1:t}) in O(N^2 * T) time rather than exponential time?",
    "options": [
      {
        "id": "opt_a",
        "text": "By recursively computing alpha_t(j) = P(y_{1:t}, X_t = j) through dynamic programming: summing transition probabilities weighted by alpha_{t-1} and multiplying by emission probability P(y_t | X_t = j)"
      },
      {
        "id": "opt_b",
        "text": "By inverting the emission covariance matrix using singular value decomposition"
      },
      {
        "id": "opt_c",
        "text": "By sampling paths using rejection Monte Carlo"
      },
      {
        "id": "opt_d",
        "text": "By assuming hidden states are strictly independent across time"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Forward variable recurrence alpha_t(j) = [sum_i alpha_{t-1}(i) a_{ij}] b_j(y_t) reuses subproblems via dynamic programming.",
      "opt_b": "Misconception: Linear algebra inversion.",
      "opt_c": "Misconception: That is Particle Filtering (Sequential Monte Carlo), not the exact Forward Algorithm.",
      "opt_d": "Misconception: HMM hidden states form a Markov chain, which is explicitly time-dependent."
    },
    "explanation": "The Forward Algorithm uses dynamic programming to marginalize over previous hidden states: \u03b1_t(j) = [\u2211_i \u03b1_{t-1}(i) A_ij] B_j(y_t), reducing exponential complexity O(N^T) to O(N\u00b2T)."
  },
  {
    "id": "q_cond_38",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "What is Jeffreys Prior in Bayesian inference, and what fundamental invariance property does it satisfy?",
    "options": [
      {
        "id": "opt_a",
        "text": "p(theta) proportional to sqrt(det(I(theta))) where I(theta) is the Fisher Information matrix; it is invariant under differentiable reparameterization of the parameter space"
      },
      {
        "id": "opt_b",
        "text": "A uniform prior p(theta) = constant; invariant only under linear shifts"
      },
      {
        "id": "opt_c",
        "text": "A Gaussian prior with infinite variance; invariant under scaling"
      },
      {
        "id": "opt_d",
        "text": "A prior that maximizes entropy subject to moment constraints"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Jeffreys prior p(theta) \u221d \u221a|I(theta)| transforms under the Jacobian change-of-variables formula exactly to maintain geometric objectivity across reparameterizations.",
      "opt_b": "Misconception: A uniform prior is NOT invariant under non-linear parameter transformations (e.g. theta vs theta^2).",
      "opt_c": "Misconception: Improper Gaussian.",
      "opt_d": "Misconception: That defines Maximum Entropy priors."
    },
    "explanation": "Jeffreys prior uses the square root of the determinant of the Fisher Information matrix: p(\u03b8) \u221d \u221a|I(\u03b8)|. It guarantees that Bayesian inferences remain invariant under any monotonic reparameterization \u03c6 = h(\u03b8)."
  },
  {
    "id": "q_cond_39",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "In Judea Pearl's Causal Calculus (do-calculus), how does the causal interventional distribution P(Y | do(X = x)) fundamentally differ from observational conditional distribution P(Y | X = x)?",
    "options": [
      {
        "id": "opt_a",
        "text": "do(X = x) actively cuts all incoming causal arrows into X (graph mutilation), eliminating spurious backdoor correlations from confounders; P(Y | X = x) passively filters data across all existing trails"
      },
      {
        "id": "opt_b",
        "text": "They are mathematically equivalent in all observational datasets"
      },
      {
        "id": "opt_c",
        "text": "do(X = x) divides the conditional probability by the variance of X"
      },
      {
        "id": "opt_d",
        "text": "do(X = x) requires all variables to be normally distributed"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Interventions set X by force, removing arrows into X (Pa(X) -> X), isolating true causal mechanism from confounding associations.",
      "opt_b": "Misconception: The fundamental fallacy of confounding 'seeing' with 'doing' (correlation vs causation).",
      "opt_c": "Misconception: Do-calculus is structural graph manipulation, not simple scaling.",
      "opt_d": "Misconception: Applies to non-parametric graphs regardless of distribution family."
    },
    "explanation": "Intervention do(X=x) represents physical experimental manipulation, severing all edges directed into X in the causal DAG and eliminating confounding backdoor bias: P(Y|do(X)) \u2260 P(Y|X)."
  },
  {
    "id": "q_cond_40",
    "skillId": "skill_cond_prob",
    "skillName": "Conditional Probability",
    "skillsTested": [
      "skill_cond_prob",
      "skill_prob"
    ],
    "difficulty": 5,
    "cognitiveCategory": "Synthesis",
    "text": "What is the Radon-Nikodym derivative's role in modern axiomatic probability when defining conditional expectation E[X | G] on a sub-sigma-algebra G where individual events may have probability zero?",
    "options": [
      {
        "id": "opt_a",
        "text": "E[X | G] is defined as the Radon-Nikodym derivative of the signed measure nu(A) = integral_A X dP with respect to the probability measure P restricted to G"
      },
      {
        "id": "opt_b",
        "text": "It computes the numerical gradient of conditional density using finite difference approximations"
      },
      {
        "id": "opt_c",
        "text": "It proves that continuous distributions must have compact support"
      },
      {
        "id": "opt_d",
        "text": "It converts Lebesgue integrals into discrete Riemann sums"
      }
    ],
    "correctAnswer": "opt_a",
    "distractorRationales": {
      "opt_a": "Correct: Kolmogorov's rigorous definition uses Radon-Nikodym theorem: E[X|G] is the unique G-measurable random variable satisfying \u222b_A E[X|G] dP = \u222b_A X dP for all A in G.",
      "opt_b": "Misconception: Numerical optimization.",
      "opt_c": "Misconception: Real analysis support.",
      "opt_d": "Misconception: Integration definition."
    },
    "explanation": "Kolmogorov defined conditional expectation abstractly: for any sub-\u03c3-algebra G, E[X|G] is the Radon-Nikodym derivative d\u03bd/dP|_G where \u03bd(A) = \u222b_A X dP, guaranteeing existence even on null sets."
  }
];
