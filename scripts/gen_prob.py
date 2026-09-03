import json
import os

questions = [
    # Difficulty 1: Recall (q_prob_01 to q_prob_08)
    {
        "id": "q_prob_01",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "According to Kolmogorov's First Axiom of Probability, what range of values can the probability P(E) of any event E take?",
        "options": [
            {"id": "opt_a", "text": "0 <= P(E) <= 1"},
            {"id": "opt_b", "text": "-1 <= P(E) <= 1"},
            {"id": "opt_c", "text": "0 < P(E) < infinity"},
            {"id": "opt_d", "text": "P(E) >= 1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Probability is non-negative and bounded above by the measure of the entire sample space (1).",
            "opt_b": "Misconception: Confuses probability with correlation coefficients or trigonometric functions bounded by [-1, 1].",
            "opt_c": "Misconception: Confuses probability with odds ratios or likelihood values.",
            "opt_d": "Misconception: Reverses bounding inequalities."
        },
        "explanation": "Kolmogorov's axioms state that for any event E, 0 <= P(E) <= 1, and the probability of the entire sample space P(S) = 1."
    },
    {
        "id": "q_prob_02",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the probability of the complement of an event A, denoted P(A') or P(A^c)?",
        "options": [
            {"id": "opt_a", "text": "1 - P(A)"},
            {"id": "opt_b", "text": "1 / P(A)"},
            {"id": "opt_c", "text": "P(A) - 1"},
            {"id": "opt_d", "text": "-P(A)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Since A and A' partition the sample space S, P(A) + P(A') = 1, so P(A') = 1 - P(A).",
            "opt_b": "Misconception: Confuses complement with reciprocal odds.",
            "opt_c": "Misconception: Inverts subtraction order resulting in a negative number.",
            "opt_d": "Misconception: Confuses complement with negation in real numbers."
        },
        "explanation": "The complement rule states that the probability of an event not occurring is one minus the probability of the event occurring: P(A') = 1 - P(A)."
    },
    {
        "id": "q_prob_03",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the sample space of a random experiment?",
        "options": [
            {"id": "opt_a", "text": "The set of all possible outcomes of the experiment"},
            {"id": "opt_b", "text": "The collection of successful outcomes only"},
            {"id": "opt_c", "text": "The average value observed after repeated trials"},
            {"id": "opt_d", "text": "The physical laboratory area where data is recorded"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The sample space (often denoted Omega or S) encompasses every possible distinct outcome.",
            "opt_b": "Misconception: Defines a specific event rather than the complete sample space.",
            "opt_c": "Misconception: Confuses sample space with sample mean.",
            "opt_d": "Misconception: Literal colloquial interpretation of 'space'."
        },
        "explanation": "In probability theory, the sample space S is the exhaustive universal set of all mutually exclusive elementary outcomes of a random trial."
    },
    {
        "id": "q_prob_04",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "If two events A and B are mutually exclusive (disjoint), what is P(A and B)?",
        "options": [
            {"id": "opt_a", "text": "0"},
            {"id": "opt_b", "text": "P(A) * P(B)"},
            {"id": "opt_c", "text": "1"},
            {"id": "opt_d", "text": "P(A) + P(B)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Mutually exclusive events cannot happen simultaneously; their intersection is the empty set with probability 0.",
            "opt_b": "Misconception: Confuses mutually exclusive events with independent events where P(A and B) = P(A)*P(B).",
            "opt_c": "Misconception: Confuses intersection with certainty.",
            "opt_d": "Misconception: Confuses intersection with union P(A or B)."
        },
        "explanation": "Mutually exclusive events share no common outcomes. Therefore, their joint occurrence is impossible: P(A ∩ B) = 0."
    },
    {
        "id": "q_prob_05",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the probability of the empty set (the impossible event) P(empty set)?",
        "options": [
            {"id": "opt_a", "text": "0"},
            {"id": "opt_b", "text": "Undefined"},
            {"id": "opt_c", "text": "-infinity"},
            {"id": "opt_d", "text": "0.5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: An event that contains zero outcomes has a probability measure of 0.",
            "opt_b": "Misconception: Confuses impossible event with dividing by zero.",
            "opt_c": "Misconception: Probabilities can never be negative.",
            "opt_d": "Misconception: Confuses impossibility with equiprobable uncertainty."
        },
        "explanation": "By definition derived from the probability axioms, the measure of the null event contains no outcomes and has P(∅) = 0."
    },
    {
        "id": "q_prob_06",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What defines two events A and B as statistically independent?",
        "options": [
            {"id": "opt_a", "text": "P(A and B) = P(A) * P(B)"},
            {"id": "opt_b", "text": "P(A and B) = 0"},
            {"id": "opt_c", "text": "P(A or B) = P(A) + P(B)"},
            {"id": "opt_d", "text": "P(A) = P(B)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Statistical independence means the occurrence of one event provides no information about the other, so the joint probability factorizes.",
            "opt_b": "Misconception: Confuses independence with mutually exclusive (disjoint) events.",
            "opt_c": "Misconception: This is the addition rule for disjoint events, not independent events.",
            "opt_d": "Misconception: Equiprobable events need not be independent."
        },
        "explanation": "Events A and B are statistically independent if and only if their joint probability equals the product of their marginal probabilities: P(A ∩ B) = P(A)P(B)."
    },
    {
        "id": "q_prob_07",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is a discrete random variable?",
        "options": [
            {"id": "opt_a", "text": "A variable whose set of possible values is countable (finite or countably infinite)"},
            {"id": "opt_b", "text": "A variable that can take any real value on a continuous interval"},
            {"id": "opt_c", "text": "A variable whose identity is kept confidential for privacy"},
            {"id": "opt_d", "text": "A deterministic constant that never changes"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Discrete random variables map outcomes to countable sets (integers, counts).",
            "opt_b": "Misconception: This is the definition of a continuous random variable.",
            "opt_c": "Misconception: Colloquial confusion between 'discrete' and 'discreet'.",
            "opt_d": "Misconception: Random variables vary stochastically."
        },
        "explanation": "A discrete random variable takes on values from a countable set, such as the roll of a die (1 to 6) or the count of coin flips."
    },
    {
        "id": "q_prob_08",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the expected value E[X] of a discrete random variable X taking values x_i with probabilities p(x_i)?",
        "options": [
            {"id": "opt_a", "text": "Sum of (x_i * p(x_i)) over all i"},
            {"id": "opt_b", "text": "Sum of p(x_i) / x_i over all i"},
            {"id": "opt_c", "text": "(Sum of x_i) / n"},
            {"id": "opt_d", "text": "Max(x_i) - Min(x_i)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Expected value is the probability-weighted sum of all possible realization values.",
            "opt_b": "Misconception: Inverts weighting terms.",
            "opt_c": "Misconception: Confuses theoretical expected value with an unweighted sample mean.",
            "opt_d": "Misconception: This calculates the statistical range, not expected value."
        },
        "explanation": "The expected value E[X] is the probability-weighted average of the possible values: E[X] = ∑ x_i * P(X = x_i)."
    },

    # Difficulty 2: Comprehension (q_prob_09 to q_prob_16)
    {
        "id": "q_prob_09",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "For any two general events A and B, what is the Addition Rule for the union P(A or B)?",
        "options": [
            {"id": "opt_a", "text": "P(A) + P(B) - P(A and B)"},
            {"id": "opt_b", "text": "P(A) + P(B)"},
            {"id": "opt_c", "text": "P(A) * P(B)"},
            {"id": "opt_d", "text": "P(A) + P(B) + P(A and B)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The intersection P(A and B) is counted twice when adding P(A) and P(B) and must be subtracted once.",
            "opt_b": "Misconception: Forgets to subtract the intersection, valid only when events are disjoint.",
            "opt_c": "Misconception: Confuses union with joint probability of independent events.",
            "opt_d": "Misconception: Adds the intersection again instead of subtracting."
        },
        "explanation": "Principle of Inclusion-Exclusion for two sets: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)."
    },
    {
        "id": "q_prob_10",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the fundamental difference between a permutation and a combination when choosing k items from n items?",
        "options": [
            {"id": "opt_a", "text": "In permutations the order of selection matters; in combinations the order does not matter"},
            {"id": "opt_b", "text": "In combinations the order matters; in permutations the order does not matter"},
            {"id": "opt_c", "text": "Permutations allow replacement; combinations never allow replacement"},
            {"id": "opt_d", "text": "Combinations always produce a larger number of possibilities than permutations for k > 1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Permutations count ordered arrangements (nPk = n!/(n-k)!), while combinations count unordered subsets (nCk = n!/(k!(n-k)!)).",
            "opt_b": "Misconception: Reverses definitions.",
            "opt_c": "Misconception: Both permutations and combinations have with-replacement and without-replacement variants.",
            "opt_d": "Misconception: Since k! >= 1, nPk >= nCk."
        },
        "explanation": "Order matters in permutations (e.g., race podium 1st, 2nd, 3rd), whereas order is disregarded in combinations (e.g., selecting a committee)."
    },
    {
        "id": "q_prob_11",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "If a fair coin is tossed 3 times, what is the probability of getting at least one Head?",
        "options": [
            {"id": "opt_a", "text": "7/8 (0.875)"},
            {"id": "opt_b", "text": "1/2 (0.50)"},
            {"id": "opt_c", "text": "3/8 (0.375)"},
            {"id": "opt_d", "text": "1/8 (0.125)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: P(at least 1 H) = 1 - P(all Tails) = 1 - (1/2)^3 = 1 - 1/8 = 7/8.",
            "opt_b": "Misconception: Assumes each coin flip's single probability represents the cumulative probability.",
            "opt_c": "Misconception: Calculates the probability of getting exactly one Head: 3 * (1/8) = 3/8.",
            "opt_d": "Misconception: Calculates P(all Tails) or P(all Heads)."
        },
        "explanation": "Using the complement rule: P(at least one Head) = 1 - P(no Heads) = 1 - (1/2)^3 = 1 - 1/8 = 7/8."
    },
    {
        "id": "q_prob_12",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "If an event has odds of 3 to 1 in favor of occurring, what is its probability?",
        "options": [
            {"id": "opt_a", "text": "3/4 (0.75)"},
            {"id": "opt_b", "text": "1/3 (0.333)"},
            {"id": "opt_c", "text": "3.0"},
            {"id": "opt_d", "text": "2/3 (0.667)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Odds of a:b correspond to probability a / (a + b) = 3 / (3 + 1) = 3/4.",
            "opt_b": "Misconception: Inverts the ratio into 1/3.",
            "opt_c": "Misconception: Confuses odds ratio with probability (which cannot exceed 1.0).",
            "opt_d": "Misconception: Subtracts ratio components incorrectly."
        },
        "explanation": "Odds in favor of a:b means a favorable outcomes for every b unfavorable outcomes. Probability = a / (a + b) = 3 / 4 = 0.75."
    },
    {
        "id": "q_prob_13",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the expected value when rolling a single fair 6-sided die?",
        "options": [
            {"id": "opt_a", "text": "3.5"},
            {"id": "opt_b", "text": "3.0"},
            {"id": "opt_c", "text": "4.0"},
            {"id": "opt_d", "text": "1/6"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5.",
            "opt_b": "Misconception: Assumes expected value must be an integer outcome on the die.",
            "opt_c": "Misconception: Rounds up to 4.",
            "opt_d": "Misconception: Confuses expected value with the probability of rolling any single face."
        },
        "explanation": "E[X] = ∑ x * (1/6) = (1+2+3+4+5+6)/6 = 21/6 = 3.5. Expected values do not have to be possible individual outcomes."
    },
    {
        "id": "q_prob_14",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Can two non-empty events A and B with P(A) > 0 and P(B) > 0 be BOTH mutually exclusive AND independent?",
        "options": [
            {"id": "opt_a", "text": "No, because mutually exclusive requires P(A and B) = 0, whereas independence requires P(A and B) = P(A)*P(B) > 0"},
            {"id": "opt_b", "text": "Yes, all mutually exclusive events are automatically independent"},
            {"id": "opt_c", "text": "Yes, if both events have probability 0.5"},
            {"id": "opt_d", "text": "Yes, if they occur in different sample spaces"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If A occurs, B cannot occur (P(B|A)=0 != P(B)), making them highly dependent.",
            "opt_b": "Misconception: Common misconception conflating 'no overlap' with 'independence'.",
            "opt_c": "Misconception: If P(A)=0.5 and P(B)=0.5, mutually exclusive means P(A and B)=0 != 0.25.",
            "opt_d": "Misconception: Probability events must belong to the same probability space."
        },
        "explanation": "If two events are mutually exclusive, the occurrence of A guarantees B did not occur. Thus they carry maximum mutual information and cannot be independent unless one has probability 0."
    },
    {
        "id": "q_prob_15",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "When rolling two standard fair 6-sided dice, what is the most probable sum of their faces?",
        "options": [
            {"id": "opt_a", "text": "7 (probability 6/36 = 1/6)"},
            {"id": "opt_b", "text": "6 (probability 5/36)"},
            {"id": "opt_c", "text": "8 (probability 5/36)"},
            {"id": "opt_d", "text": "12 (probability 1/36)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sum 7 has the most combinations: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) -> 6/36.",
            "opt_b": "Misconception: Sum 6 has only 5 combinations.",
            "opt_c": "Misconception: Sum 8 has only 5 combinations.",
            "opt_d": "Misconception: Sum 12 has only 1 combination (6,6)."
        },
        "explanation": "The sum of two dice forms a triangular distribution peaking at 7 with 6 combinations out of 36 (1/6 probability)."
    },
    {
        "id": "q_prob_16",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does the Law of Large Numbers (LLN) state?",
        "options": [
            {"id": "opt_a", "text": "As the number of independent identical trials increases, the sample average converges to the theoretical expected value"},
            {"id": "opt_b", "text": "Large numbers in a dataset will always skew the distribution towards positive infinity"},
            {"id": "opt_c", "text": "After a long streak of losses, a win is mathematically due to balance the average"},
            {"id": "opt_d", "text": "Sample variance increases proportionally to the square of the sample size"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The sample mean of i.i.d. variables converges almost surely (strong) or in probability (weak) to the expected value.",
            "opt_b": "Misconception: Misinterprets 'large numbers' literally as magnitude rather than sample size.",
            "opt_c": "Misconception: This is the Gambler's Fallacy, not the Law of Large Numbers.",
            "opt_d": "Misconception: Sample variance of the mean decreases (sigma^2 / n)."
        },
        "explanation": "The LLN guarantees that the empirical mean of independent and identically distributed random variables converges to the population mean as sample size n approaches infinity."
    },

    # Difficulty 3: Application (q_prob_17 to q_prob_24)
    {
        "id": "q_prob_17",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the variance Var(X) of a random variable X in terms of its expected values?",
        "options": [
            {"id": "opt_a", "text": "E[X^2] - (E[X])^2"},
            {"id": "opt_b", "text": "(E[X])^2 - E[X^2]"},
            {"id": "opt_c", "text": "E[X^2] - E[X]"},
            {"id": "opt_d", "text": "E[(X - E[X])]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Var(X) = E[(X - mu)^2] expands to E[X^2 - 2X*mu + mu^2] = E[X^2] - (E[X])^2.",
            "opt_b": "Misconception: Reverses terms which would yield a negative variance.",
            "opt_c": "Misconception: Forgets to square the second expected value.",
            "opt_d": "Misconception: E[X - E[X]] is always 0."
        },
        "explanation": "Variance is the expected value of squared deviations from the mean: Var(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2."
    },
    {
        "id": "q_prob_18",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the probability of drawing 2 Aces consecutively from a standard 52-card deck without replacement?",
        "options": [
            {"id": "opt_a", "text": "(4/52) * (3/51) = 1/221"},
            {"id": "opt_b", "text": "(4/52) * (4/52) = 1/169"},
            {"id": "opt_c", "text": "4/52 = 1/13"},
            {"id": "opt_d", "text": "2/52 = 1/26"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: First Ace is 4/52; without replacement, 3 Aces remain among 51 cards: (4/52)*(3/51) = 12/2652 = 1/221.",
            "opt_b": "Misconception: Assumes sampling with replacement.",
            "opt_c": "Misconception: Calculates probability of drawing only 1 Ace.",
            "opt_d": "Misconception: Divides 2 by 52."
        },
        "explanation": "Without replacement, the events are dependent: P(Ace 1 and Ace 2) = P(Ace 1) * P(Ace 2 | Ace 1) = (4/52) * (3/51) = 1/221."
    },
    {
        "id": "q_prob_19",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In a room of 23 randomly chosen people, what is the approximate probability that at least two people share the same birthday (assuming 365 days, non-leap year)?",
        "options": [
            {"id": "opt_a", "text": "~50.7% (greater than 50%)"},
            {"id": "opt_b", "text": "~6.3% (23 / 365)"},
            {"id": "opt_c", "text": "~1.2%"},
            {"id": "opt_d", "text": "~99.9%"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The Birthday Paradox shows that with 23 people, the number of pairs is (23*22)/2 = 253, making P(match) > 50%.",
            "opt_b": "Misconception: Naively compares individual people to 365 rather than pairs of people.",
            "opt_c": "Misconception: Underestimates exponential growth of pairwise comparisons.",
            "opt_d": "Misconception: 99.9% occurs around 70 people, not 23."
        },
        "explanation": "P(no shared birthday) = (365/365)*(364/365)*...*(343/365) ≈ 0.4927. Therefore P(at least one match) = 1 - 0.4927 ≈ 0.5073 (50.7%)."
    },
    {
        "id": "q_prob_20",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What does Markov's Inequality state for a non-negative random variable X with expected value E[X] and any constant a > 0?",
        "options": [
            {"id": "opt_a", "text": "P(X >= a) <= E[X] / a"},
            {"id": "opt_b", "text": "P(X >= a) <= Var(X) / a^2"},
            {"id": "opt_c", "text": "P(X >= a) >= a / E[X]"},
            {"id": "opt_d", "text": "P(|X - E[X]| >= a) <= E[X] / a"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Markov's inequality bounds the tail probability of non-negative variables by E[X] / a.",
            "opt_b": "Misconception: This is Chebyshev's Inequality, which uses variance.",
            "opt_c": "Misconception: Inverts the bound.",
            "opt_d": "Misconception: Confuses deviation from mean with value magnitude."
        },
        "explanation": "Markov's inequality provides an upper bound on the probability that a non-negative random variable exceeds a positive threshold: P(X ≥ a) ≤ E[X] / a."
    },
    {
        "id": "q_prob_21",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Using Chebyshev's Inequality, what is the maximum probability that a random variable X deviates from its mean mu by at least 2 standard deviations (k = 2)?",
        "options": [
            {"id": "opt_a", "text": "1 / 2^2 = 1/4 (25%)"},
            {"id": "opt_b", "text": "1 / 2 = 50%"},
            {"id": "opt_c", "text": "5% (0.05)"},
            {"id": "opt_d", "text": "1 / 2^3 = 1/8 (12.5%)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Chebyshev bounds P(|X - mu| >= k*sigma) <= 1 / k^2. For k=2, 1/4 = 0.25.",
            "opt_b": "Misconception: Forgets to square k.",
            "opt_c": "Misconception: Confuses Chebyshev's general distribution bound with the Normal distribution 68-95-99.7 rule (~5%).",
            "opt_d": "Misconception: Cubes k instead of squaring."
        },
        "explanation": "Chebyshev's inequality guarantees that for ANY probability distribution with finite variance, P(|X - μ| ≥ kσ) ≤ 1 / k². For k = 2, this is at most 25%."
    },
    {
        "id": "q_prob_22",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A lottery ticket costs $2. There is a 1 in 1000 chance to win $1000, and 0 otherwise. What is the expected net gain per ticket?",
        "options": [
            {"id": "opt_a", "text": "-$1.00 (loss of $1)"},
            {"id": "opt_b", "text": "$1.00 gain"},
            {"id": "opt_c", "text": "$0.00 (fair game)"},
            {"id": "opt_d", "text": "-$2.00 loss"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[Payout] = (1/1000) * $1000 = $1.00. Net profit = E[Payout] - Cost = $1.00 - $2.00 = -$1.00.",
            "opt_b": "Misconception: Calculates gross expected payout ($1.00) but forgets to subtract ticket price ($2.00).",
            "opt_c": "Misconception: Assumes lottery odds are zero-sum fair.",
            "opt_d": "Misconception: Assumes you never win."
        },
        "explanation": "Expected return = (1/1000)*1000 + (999/1000)*0 - 2 = 1 - 2 = -$1.00. The player loses an average of $1.00 per ticket."
    },
    {
        "id": "q_prob_23",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For two independent random variables X and Y, what is Var(X - Y)?",
        "options": [
            {"id": "opt_a", "text": "Var(X) + Var(Y)"},
            {"id": "opt_b", "text": "Var(X) - Var(Y)"},
            {"id": "opt_c", "text": "Var(X) + Var(Y) - 2 Cov(X, Y)"},
            {"id": "opt_d", "text": "(Var(X) - Var(Y))^2"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Var(aX + bY) = a^2 Var(X) + b^2 Var(Y) when independent. Here b = -1, (-1)^2 = +1.",
            "opt_b": "Misconception: Subtracts variances, forgetting that variance measures dispersion and always accumulates.",
            "opt_c": "Misconception: For independent variables, Cov(X, Y) = 0.",
            "opt_d": "Misconception: Squares the difference of variances."
        },
        "explanation": "Variances of independent random variables always add regardless of sign: Var(X - Y) = Var(X + (-1)Y) = Var(X) + (-1)²Var(Y) = Var(X) + Var(Y)."
    },
    {
        "id": "q_prob_24",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the probability of getting a sum of 4 when rolling two standard 6-sided dice?",
        "options": [
            {"id": "opt_a", "text": "3/36 = 1/12"},
            {"id": "opt_b", "text": "4/36 = 1/9"},
            {"id": "opt_c", "text": "2/36 = 1/18"},
            {"id": "opt_d", "text": "1/36"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Favorable pairs are (1,3), (2,2), (3,1) -> 3 out of 36 outcomes.",
            "opt_b": "Misconception: Assumes the target sum (4) equals the number of combinations.",
            "opt_c": "Misconception: Overlooks that (1,3) and (3,1) are distinct outcomes on two distinguishable dice.",
            "opt_d": "Misconception: Counts only (2,2)."
        },
        "explanation": "There are 3 favorable pairs: (1, 3), (2, 2), and (3, 1). Total sample space size is 36. Probability = 3/36 = 1/12."
    },

    # Difficulty 4: Analysis (q_prob_25 to q_prob_32)
    {
        "id": "q_prob_25",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob", "skill_cond_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In the Monty Hall Problem, why should a contestant switch doors after the host reveals a goat behind one of the two unchosen doors?",
        "options": [
            {"id": "opt_a", "text": "Switching doubles the win probability from 1/3 (initial pick) to 2/3 (remaining door)"},
            {"id": "opt_b", "text": "The win probability remains 1/2 regardless of switching because two unopened doors remain"},
            {"id": "opt_c", "text": "Switching reduces win probability to 1/3"},
            {"id": "opt_d", "text": "The host always acts randomly without knowing where the car is"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Initial pick has 1/3 chance of being the car. The host must reveal a goat from the remaining 2/3 probability mass, transferring it entirely to the other door.",
            "opt_b": "Misconception: Classic misconception assuming 2 remaining doors implies equal 50-50 probability.",
            "opt_c": "Misconception: Reverses probabilities.",
            "opt_d": "Misconception: The host knows where the car is and deliberately reveals a goat."
        },
        "explanation": "Your initial door has P(Car) = 1/3. The two doors you did not pick have combined P(Car) = 2/3. Since Monty never opens the car door, that entire 2/3 shifts to the single remaining unopened door."
    },
    {
        "id": "q_prob_26",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why does Linearity of Expectation E[X + Y] = E[X] + E[Y] hold even when X and Y are highly dependent?",
        "options": [
            {"id": "opt_a", "text": "Because expectation is an integral/summation operator, and the integral of a sum is always the sum of integrals by the algebraic properties of summation"},
            {"id": "opt_b", "text": "Because covariance between any two variables is mathematically non-existent in expectation"},
            {"id": "opt_c", "text": "It does NOT hold; linearity strictly requires independence between X and Y"},
            {"id": "opt_d", "text": "Because probabilities of dependent variables automatically cancel out"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Expectation is a linear functional over the space of random variables. Marginalization removes dependency terms in the sum: ∑∑ (x+y)p(x,y) = ∑ x p(x) + ∑ y p(y).",
            "opt_b": "Misconception: Covariance exists, but affects variance, not expectation.",
            "opt_c": "Misconception: Confuses Linearity of Expectation with additivity of variance.",
            "opt_d": "Misconception: Flawed probability cancellation logic."
        },
        "explanation": "Linearity of expectation is an algebraic property of summations/integrals: E[X + Y] = ∫∫ (x+y)f(x,y)dxdy = ∫x f_X(x)dx + ∫y f_Y(y)dy = E[X] + E[Y], with no requirement of independence."
    },
    {
        "id": "q_prob_27",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "A gambler observes 10 consecutive 'Red' outcomes on a fair roulette wheel and bets heavily on 'Black', believing Black is 'due'. What cognitive bias is this?",
        "options": [
            {"id": "opt_a", "text": "Gambler's Fallacy (belief that independent past random trials influence future independent trials)"},
            {"id": "opt_b", "text": "Base Rate Fallacy"},
            {"id": "opt_c", "text": "Berkson's Fallacy"},
            {"id": "opt_d", "text": "Simpson's Paradox"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Each spin of a fair roulette wheel is an independent event with memoryless physics.",
            "opt_b": "Misconception: Base rate fallacy involves ignoring prior prevalence in Bayesian calculations.",
            "opt_c": "Misconception: Berkson's fallacy is selection bias creating spurious negative correlation.",
            "opt_d": "Misconception: Simpson's paradox involves trend reversal when aggregating subgroups."
        },
        "explanation": "The Gambler's Fallacy is the mistaken belief that if an event occurred more frequently than normal in the past, it is less likely to happen in the future, violating trial independence."
    },
    {
        "id": "q_prob_28",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does the Coupon Collector's Problem calculate, and what is its expected number of trials to collect all n distinct coupons?",
        "options": [
            {"id": "opt_a", "text": "E[T] = n * H_n ≈ n * ln(n) + gamma * n where H_n is the n-th harmonic number"},
            {"id": "opt_b", "text": "E[T] = n^2"},
            {"id": "opt_c", "text": "E[T] = n"},
            {"id": "opt_d", "text": "E[T] = 2^n"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sum of geometric trials with probabilities (n-i)/n gives n * ∑(1/k) = n * H_n ≈ n ln(n).",
            "opt_b": "Misconception: Overestimates coupon acquisition time.",
            "opt_c": "Misconception: n is only possible in the best-case zero-duplicate scenario.",
            "opt_d": "Misconception: Confuses with exponential combinatorial search."
        },
        "explanation": "The waiting time is the sum of n independent geometric random variables: E[T] = ∑ (n / (n - i)) = n * ∑ (1/k) = n * H_n ≈ n ln(n) + γn."
    },
    {
        "id": "q_prob_29",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does a covariance of Cov(X, Y) = 0 imply about the relationship between two random variables X and Y?",
        "options": [
            {"id": "opt_a", "text": "There is no LINEAR relationship; however, X and Y may still have a strong non-linear dependency"},
            {"id": "opt_b", "text": "X and Y are strictly independent in all respects"},
            {"id": "opt_c", "text": "One of the variables must have variance equal to zero"},
            {"id": "opt_d", "text": "P(X and Y) = P(X) * P(Y) for all values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Covariance only measures linear association. For example, if X ~ Uniform(-1, 1) and Y = X^2, Cov(X, Y) = 0 despite complete deterministic dependence.",
            "opt_b": "Misconception: Common error conflating zero correlation with statistical independence.",
            "opt_c": "Misconception: Non-degenerate variables can easily have zero covariance.",
            "opt_d": "Misconception: This is the condition for independence, which is stronger than zero covariance."
        },
        "explanation": "Zero covariance means lack of linear relationship. Non-linear relationships (such as Y = X² where X is symmetric around 0) yield Cov(X, Y) = 0 despite being 100% dependent."
    },
    {
        "id": "q_prob_30",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is Simpson's Paradox in probability and data aggregation?",
        "options": [
            {"id": "opt_a", "text": "A trend or association that appears in different groups disappears or reverses when the groups are combined"},
            {"id": "opt_b", "text": "The sample variance is always smaller than the true population variance"},
            {"id": "opt_c", "text": "Extreme values are naturally followed by values closer to the mean"},
            {"id": "opt_d", "text": "P(A|B) is always strictly greater than P(B|A)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Simpson's paradox occurs when an unobserved confounding variable creates disparate group weights.",
            "opt_b": "Misconception: This describes the bias of the uncorrected sample variance.",
            "opt_c": "Misconception: This describes regression to the mean.",
            "opt_d": "Misconception: Reverses conditional probabilities arbitrarily."
        },
        "explanation": "Simpson's Paradox occurs when aggregate data contradicts sub-group trends due to confounding factors with unequal sub-population sizes."
    },
    {
        "id": "q_prob_31",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "If X is a random variable with mean mu and standard deviation sigma, what is the standardized variable Z = (X - mu) / sigma guaranteed to have?",
        "options": [
            {"id": "opt_a", "text": "Mean = 0 and Variance = 1"},
            {"id": "opt_b", "text": "A standard Normal distribution regardless of X's distribution"},
            {"id": "opt_c", "text": "Mean = 1 and Variance = 0"},
            {"id": "opt_d", "text": "Bounded support strictly between -3 and +3"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[Z] = (E[X] - mu)/sigma = 0; Var(Z) = Var(X)/sigma^2 = sigma^2/sigma^2 = 1.",
            "opt_b": "Misconception: Standardizing does NOT make a non-normal distribution normal; shape and skewness are preserved.",
            "opt_c": "Misconception: Inverts mean and variance.",
            "opt_d": "Misconception: Values can theoretically exceed 3 standard deviations."
        },
        "explanation": "Standardization shifts the center to 0 and scales spread to 1 (E[Z]=0, Var(Z)=1), but preserves the underlying distribution's shape."
    },
    {
        "id": "q_prob_32",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is Jensen's Inequality for a convex function g(x) and a random variable X?",
        "options": [
            {"id": "opt_a", "text": "g(E[X]) <= E[g(X)]"},
            {"id": "opt_b", "text": "g(E[X]) >= E[g(X)]"},
            {"id": "opt_c", "text": "g(E[X]) = E[g(X)]"},
            {"id": "opt_d", "text": "g'(E[X]) <= Var(X)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For convex functions, the secant line lies above the curve, so E[g(X)] >= g(E[X]).",
            "opt_b": "Misconception: This inequality holds for concave functions (like log(x)), not convex.",
            "opt_c": "Misconception: Equality holds only for linear functions.",
            "opt_d": "Misconception: Fabricates an inequality with variance."
        },
        "explanation": "Jensen's inequality states that for any convex function g, the value of the function evaluated at the mean is less than or equal to the expected value of the function: g(E[X]) ≤ E[g(X)]."
    },

    # Difficulty 5: Synthesis (q_prob_33 to q_prob_40)
    {
        "id": "q_prob_33",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Moment Generating Function (MGF) M_X(t) of a random variable X, and what is its fundamental uniqueness property?",
        "options": [
            {"id": "opt_a", "text": "M_X(t) = E[e^{tX}]; if M_X(t) exists in an open neighborhood around t=0, it uniquely characterizes the probability distribution"},
            {"id": "opt_b", "text": "M_X(t) = E[t^X]; it only characterizes integer-valued random variables"},
            {"id": "opt_c", "text": "M_X(t) = Var(tX); it only calculates the 2nd moment"},
            {"id": "opt_d", "text": "M_X(t) = E[ln(tX)]; it requires X to be strictly negative"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: M_X(t) = E[exp(tX)] uniquely defines the distribution if it converges in (-h, h) for some h > 0.",
            "opt_b": "Misconception: E[t^X] is the Probability Generating Function (PGF).",
            "opt_c": "Misconception: MGF generates all moments via successive derivatives at t=0.",
            "opt_d": "Misconception: Logarithmic expectations do not generate polynomial moments."
        },
        "explanation": "MGF M_X(t) = E[e^(tX)]. Its k-th derivative at t=0 yields the k-th moment E[X^k]. By the uniqueness theorem, if an MGF exists around 0, it uniquely determines the cumulative distribution function."
    },
    {
        "id": "q_prob_34",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How does Chernoff's Bound provide exponentially tighter tail probability bounds than Chebyshev's Inequality?",
        "options": [
            {"id": "opt_a", "text": "By applying Markov's inequality to the exponential random variable e^{tX} and optimizing over parameter t > 0: P(X >= a) <= min_{t>0} e^{-ta} M_X(t)"},
            {"id": "opt_b", "text": "By computing the 4th moment (kurtosis) instead of the 2nd moment"},
            {"id": "opt_c", "text": "By assuming the underlying random variable is normally distributed"},
            {"id": "opt_d", "text": "By inverting the sample size using Fourier series"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For t > 0, X >= a <=> e^{tX} >= e^{ta}. Applying Markov's gives E[e^{tX}]/e^{ta}. Minimizing over t yields exponential decay in the tail.",
            "opt_b": "Misconception: Chernoff bounds use the full MGF (all moments), not just the 4th.",
            "opt_c": "Misconception: Chernoff bounds apply to any distribution whose MGF exists, not just normal.",
            "opt_d": "Misconception: Fourier inversion yields the characteristic function, not Chernoff bound optimization."
        },
        "explanation": "Chernoff bounding exponentiates the tail event P(X ≥ a) = P(e^(tX) ≥ e^(ta)) and applies Markov's inequality, yielding an exponential decay bound min_t [e^(-ta) E[e^(tX)]]."
    },
    {
        "id": "q_prob_35",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the first Borel-Cantelli Lemma state for a sequence of events A_1, A_2, ...?",
        "options": [
            {"id": "opt_a", "text": "If sum_{n=1}^infinity P(A_n) < infinity, the probability that infinitely many of the events occur is 0"},
            {"id": "opt_b", "text": "If sum_{n=1}^infinity P(A_n) = infinity, the probability that infinitely many events occur is always 1"},
            {"id": "opt_c", "text": "Events must be pairwise independent for their probabilities to sum to 1"},
            {"id": "opt_d", "text": "Every infinite sequence of events contains a convergent subsequence"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The first Borel-Cantelli lemma requires only summability of probabilities (no independence needed) to guarantee P(limsup A_n) = 0.",
            "opt_b": "Misconception: That is the Second Borel-Cantelli Lemma, which strictly requires event independence.",
            "opt_c": "Misconception: Borel-Cantelli does not require probabilities to sum to 1.",
            "opt_d": "Misconception: Confuses measure theory with Bolzano-Weierstrass theorem in real analysis."
        },
        "explanation": "Borel-Cantelli Lemma 1: If ∑ P(A_n) < ∞, then P(A_n occurs infinitely often) = 0. This is a cornerstone for proving almost sure convergence."
    },
    {
        "id": "q_prob_36",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "For n independent Uniform(0, 1) random variables, what is the probability density function of the maximum order statistic X_{(n)} = max(X_1, ..., X_n)?",
        "options": [
            {"id": "opt_a", "text": "f_{(n)}(x) = n * x^{n-1} for x in [0, 1]"},
            {"id": "opt_b", "text": "f_{(n)}(x) = x^n for x in [0, 1]"},
            {"id": "opt_c", "text": "f_{(n)}(x) = 1 / n for x in [0, 1]"},
            {"id": "opt_d", "text": "f_{(n)}(x) = n * (1 - x)^{n-1} for x in [0, 1]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: CDF F_{(n)}(x) = P(all X_i <= x) = x^n. Differentiating gives PDF f_{(n)}(x) = n * x^{n-1}.",
            "opt_b": "Misconception: Confuses the CDF with the PDF (must differentiate).",
            "opt_c": "Misconception: Constant density implies uniform distribution.",
            "opt_d": "Misconception: This is the density of the minimum order statistic X_{(1)}."
        },
        "explanation": "P(max ≤ x) = ∏ P(X_i ≤ x) = x^n. Differentiating with respect to x gives the probability density function f_{(n)}(x) = n*x^(n-1)."
    },
    {
        "id": "q_prob_37",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Probabilistic Method (pioneered by Paul Erdős) used for in mathematics and computer science?",
        "options": [
            {"id": "opt_a", "text": "Proving the existence of an object with desired deterministic properties by showing that a randomly chosen object has a strictly positive probability of possessing those properties"},
            {"id": "opt_b", "text": "Estimating stock market returns using Monte Carlo simulations"},
            {"id": "opt_c", "text": "Finding approximate numerical roots of high-degree polynomials"},
            {"id": "opt_d", "text": "Generating cryptographically secure pseudorandom bit sequences"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If P(Object has property P) > 0 in a probability space, then an object with property P must exist deterministically.",
            "opt_b": "Misconception: Confuses pure mathematical existence proof technique with practical financial simulation.",
            "opt_c": "Misconception: Confuses with Newton-Raphson or numerical methods.",
            "opt_d": "Misconception: Confuses with CSPRNG cryptography."
        },
        "explanation": "The probabilistic method is a non-constructive proof method: to prove a structure exists, one constructs an appropriate probability space and proves P(Structure exists) > 0."
    },
    {
        "id": "q_prob_38",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In a stationary discrete-time Markov Chain with transition matrix P, what condition guarantees the existence of a unique stationary distribution pi = pi * P?",
        "options": [
            {"id": "opt_a", "text": "The chain is irreducible and aperiodic (ergodic) with finite state space"},
            {"id": "opt_b", "text": "The matrix P must be symmetric and positive definite"},
            {"id": "opt_c", "text": "The states must all be transient"},
            {"id": "opt_d", "text": "The chain must have absorbing states at all boundaries"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Irreducibility ensures all states communicate; aperiodicity prevents cyclic oscillation, guaranteeing unique convergence by the Perron-Frobenius theorem.",
            "opt_b": "Misconception: Transition matrices are row-stochastic, not necessarily symmetric.",
            "opt_c": "Misconception: Transient states have zero stationary probability in the long run.",
            "opt_d": "Misconception: Absorbing states yield multiple stationary distributions depending on starting state."
        },
        "explanation": "A finite Markov chain that is irreducible (any state reachable from any other) and aperiodic is ergodic, guaranteeing a unique stationary probability vector π such that π = πP."
    },
    {
        "id": "q_prob_39",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Coupling argument in probability theory primarily used to establish?",
        "options": [
            {"id": "opt_a", "text": "Bounding the total variation distance between two probability distributions by constructing them on a joint probability space where they coincide with high probability"},
            {"id": "opt_b", "text": "Linking physical CPU cores for parallel random number generation"},
            {"id": "opt_c", "text": "Computing the inverse of covariance matrices in high dimensions"},
            {"id": "opt_d", "text": "Determining whether a neural network has converged during backpropagation"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Coupling constructs two random variables X and Y on the same probability space to prove TV(P, Q) <= P(X != Y).",
            "opt_b": "Misconception: Hardware parallelization.",
            "opt_c": "Misconception: Linear algebra matrix inversion.",
            "opt_d": "Misconception: Optimization convergence."
        },
        "explanation": "The coupling inequality states that for any coupling (X, Y) of distributions P and Q, ||P - Q||_TV ≤ P(X ≠ Y), providing an elegant tool to prove convergence rates of Markov chains."
    },
    {
        "id": "q_prob_40",
        "skillId": "skill_prob",
        "skillName": "Probability",
        "skillsTested": ["skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Law of the Iterated Logarithm (LIL) describe about the fluctuations of sums of i.i.d. variables S_n = sum_{i=1}^n X_i with mean 0 and variance 1?",
        "options": [
            {"id": "opt_a", "text": "The exact asymptotic magnitude of oscillations: limsup_{n->inf} S_n / sqrt(2 n ln(ln(n))) = 1 almost surely"},
            {"id": "opt_b", "text": "That S_n is strictly bounded by sqrt(n) for all n"},
            {"id": "opt_c", "text": "That log(S_n) approaches a normal distribution"},
            {"id": "opt_d", "text": "That the variance of S_n decreases logarithmically"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The LIL fills the gap between the Law of Large Numbers (rate n) and Central Limit Theorem (scale sqrt(n)), identifying the exact almost-sure fluctuation boundary.",
            "opt_b": "Misconception: CLT states fluctuations are order sqrt(n), but the supreme peaks reach sqrt(2n ln ln n).",
            "opt_c": "Misconception: Fabricated statement.",
            "opt_d": "Misconception: Var(S_n) = n grows linearly."
        },
        "explanation": "The Law of the Iterated Logarithm provides the sharpest almost-sure asymptotic envelope for random walk trajectories: limsup S_n / √(2n ln ln n) = 1 a.s."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/probability.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const PROBABILITY_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Probability questions in {out_file}")

if __name__ == '__main__':
    main()
