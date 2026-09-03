import json
import os

questions = [
    # Difficulty 1: Recall (q_dist_01 to q_dist_08)
    {
        "id": "q_dist_01",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the total area under the curve of any valid Probability Density Function (PDF) f(x) over its entire real domain?",
        "options": [
            {"id": "opt_a", "text": "Exactly 1"},
            {"id": "opt_b", "text": "100"},
            {"id": "opt_c", "text": "Infinity"},
            {"id": "opt_d", "text": "Equal to the variance of the distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By the normalization axiom of probability, the integral of f(x) from -infinity to +infinity must equal 1.",
            "opt_b": "Misconception: Confuses probability measure (1.0) with percentage (100%).",
            "opt_c": "Misconception: Integrals of divergent functions approach infinity, but valid PDFs must integrate to 1.",
            "opt_d": "Misconception: Area is a universal probability measure, independent of variance."
        },
        "explanation": "A fundamental axiom of continuous random variables requires that the integral of the PDF over the entire real line equals 1: ∫ f(x)dx = 1."
    },
    {
        "id": "q_dist_02",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What are the mean and standard deviation of the Standard Normal Distribution Z ~ N(mu, sigma^2)?",
        "options": [
            {"id": "opt_a", "text": "Mean = 0, Standard Deviation = 1"},
            {"id": "opt_b", "text": "Mean = 1, Standard Deviation = 0"},
            {"id": "opt_c", "text": "Mean = 0, Standard Deviation = 0"},
            {"id": "opt_d", "text": "Mean = 1, Standard Deviation = 1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The standard normal distribution is specifically defined with mu = 0 and sigma = 1.",
            "opt_b": "Misconception: Reverses mean and variance.",
            "opt_c": "Misconception: A distribution with 0 variance is a deterministic point mass.",
            "opt_d": "Misconception: Shifted mean."
        },
        "explanation": "The standard normal distribution is the special Gaussian distribution denoted N(0, 1), with mean μ = 0 and standard deviation σ = 1."
    },
    {
        "id": "q_dist_03",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What does a Cumulative Distribution Function (CDF) F(x) calculate for a random variable X?",
        "options": [
            {"id": "opt_a", "text": "P(X <= x) — the probability that X takes a value less than or equal to x"},
            {"id": "opt_b", "text": "P(X = x) — the point probability at exact value x"},
            {"id": "opt_c", "text": "P(X >= x) — the survival function"},
            {"id": "opt_d", "text": "The derivative of the PDF"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By definition, CDF F(x) = P(X <= x), which accumulates probability from -infinity up to x.",
            "opt_b": "Misconception: That is the PMF (discrete) or PDF density (continuous). For continuous variables, P(X = x) = 0.",
            "opt_c": "Misconception: P(X >= x) is the Complementary CDF or Survival function 1 - F(x).",
            "opt_d": "Misconception: The PDF is the derivative of the CDF, not vice versa."
        },
        "explanation": "The Cumulative Distribution Function F(x) is defined as F(x) = P(X ≤ x). It is non-decreasing, with limits F(-∞) = 0 and F(+∞) = 1."
    },
    {
        "id": "q_dist_04",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the support (set of possible values) of a Bernoulli random variable X ~ Bernoulli(p)?",
        "options": [
            {"id": "opt_a", "text": "{0, 1}"},
            {"id": "opt_b", "text": "All non-negative integers {0, 1, 2, ...}"},
            {"id": "opt_c", "text": "Continuous interval [0, 1]"},
            {"id": "opt_d", "text": "{-1, +1}"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: A Bernoulli trial has exactly two outcomes: failure (0) or success (1).",
            "opt_b": "Misconception: That is the support of a Poisson or Geometric distribution.",
            "opt_c": "Misconception: That is the support of a continuous Beta or Uniform(0,1) distribution.",
            "opt_d": "Misconception: That is a Rademacher random variable used in machine learning theory."
        },
        "explanation": "A Bernoulli random variable models a single binary trial taking value 1 with probability p and 0 with probability 1 - p."
    },
    {
        "id": "q_dist_05",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "In a Poisson distribution with rate parameter lambda, what do the mean and variance equal?",
        "options": [
            {"id": "opt_a", "text": "Mean = lambda, Variance = lambda"},
            {"id": "opt_b", "text": "Mean = lambda, Variance = lambda^2"},
            {"id": "opt_c", "text": "Mean = 1 / lambda, Variance = 1 / lambda^2"},
            {"id": "opt_d", "text": "Mean = lambda, Variance = sqrt(lambda)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: A hallmark characteristic of the Poisson distribution is equidispersed mean = variance = lambda.",
            "opt_b": "Misconception: Confuses variance with standard deviation squared when variance is lambda.",
            "opt_c": "Misconception: These are the mean and variance of an Exponential distribution.",
            "opt_d": "Misconception: sqrt(lambda) is the standard deviation, not variance."
        },
        "explanation": "The Poisson distribution is equidispersed: its expected value and variance are both equal to the rate parameter λ."
    },
    {
        "id": "q_dist_06",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What two parameters define a Binomial distribution B(n, p)?",
        "options": [
            {"id": "opt_a", "text": "n (number of independent trials) and p (probability of success on each trial)"},
            {"id": "opt_b", "text": "mu (mean) and sigma (standard deviation)"},
            {"id": "opt_c", "text": "alpha (shape) and beta (rate)"},
            {"id": "opt_d", "text": "k (degrees of freedom) and lambda (rate)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Binomial counts the number of successes in n fixed independent Bernoulli trials with constant success probability p.",
            "opt_b": "Misconception: Parameters of a Normal distribution.",
            "opt_c": "Misconception: Parameters of a Gamma or Beta distribution.",
            "opt_d": "Misconception: Parameters of Chi-Square and Poisson."
        },
        "explanation": "A Binomial distribution models the number of successes in n independent, identical Bernoulli trials with success probability p."
    },
    {
        "id": "q_dist_07",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "For a continuous random variable X, what is the exact probability of X taking any single specific real value c, P(X = c)?",
        "options": [
            {"id": "opt_a", "text": "0"},
            {"id": "opt_b", "text": "f(c) where f is the PDF"},
            {"id": "opt_c", "text": "1 / infinity = undefined"},
            {"id": "opt_d", "text": "1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Continuous probabilities are integrals over intervals. The integral of a density over a single point has width 0: ∫_c^c f(x)dx = 0.",
            "opt_b": "Misconception: Confuses probability density f(c) with actual probability mass.",
            "opt_c": "Misconception: In measure theory, the measure of a single point under Lebesgue measure is exactly 0.",
            "opt_d": "Misconception: Certainty."
        },
        "explanation": "For continuous random variables, probabilities are represented by areas under curves. Because a single point has zero width, P(X = c) = ∫_c^c f(x)dx = 0."
    },
    {
        "id": "q_dist_08",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the probability mass function (PMF) of a Geometric random variable modeling the number of trials X until the first success (with success probability p)?",
        "options": [
            {"id": "opt_a", "text": "P(X = k) = (1 - p)^{k - 1} * p for k in {1, 2, 3, ...}"},
            {"id": "opt_b", "text": "P(X = k) = p^k * (1 - p)"},
            {"id": "opt_c", "text": "P(X = k) = (1 - p)^k"},
            {"id": "opt_d", "text": "P(X = k) = nCk * p^k * (1 - p)^{n-k}"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Requires k - 1 consecutive failures (each with probability 1-p) followed by success on the k-th trial.",
            "opt_b": "Misconception: Reverses successes and failures.",
            "opt_c": "Misconception: P(X > k) tail probability, not PMF.",
            "opt_d": "Misconception: Binomial PMF, which has fixed trials n."
        },
        "explanation": "To achieve the first success on trial k, one must experience k - 1 failures followed by 1 success: P(X = k) = (1 - p)^(k-1) * p."
    },

    # Difficulty 2: Comprehension (q_dist_09 to q_dist_16)
    {
        "id": "q_dist_09",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "According to the 68-95-99.7 Empirical Rule for a Normal Distribution N(mu, sigma^2), what percentage of data falls within 2 standard deviations [mu - 2*sigma, mu + 2*sigma]?",
        "options": [
            {"id": "opt_a", "text": "Approximately 95.4%"},
            {"id": "opt_b", "text": "Approximately 68.3%"},
            {"id": "opt_c", "text": "Approximately 99.7%"},
            {"id": "opt_d", "text": "Exactly 100%"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In a normal distribution, ±1 sigma covers ~68.3%, ±2 sigma covers ~95.4%, and ±3 sigma covers ~99.7%.",
            "opt_b": "Misconception: 68.3% corresponds to 1 standard deviation.",
            "opt_c": "Misconception: 99.7% corresponds to 3 standard deviations.",
            "opt_d": "Misconception: Normal distribution tails extend to infinity; it never reaches 100% at finite bounds."
        },
        "explanation": "The empirical rule for normal distributions states: ~68.3% within 1 standard deviation, ~95.45% within 2 standard deviations, and ~99.73% within 3 standard deviations."
    },
    {
        "id": "q_dist_10",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does the 'Memoryless Property' of the Exponential Distribution mean mathematically?",
        "options": [
            {"id": "opt_a", "text": "P(X > s + t | X > s) = P(X > t) — the probability of waiting an additional t time units is independent of how long you have already waited"},
            {"id": "opt_b", "text": "The computer running the simulation forgets the random seed after each iteration"},
            {"id": "opt_c", "text": "The variance of the distribution is 0"},
            {"id": "opt_d", "text": "The distribution has no cumulative distribution function"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The exponential distribution (and geometric in discrete) is the unique continuous distribution satisfying P(X > s + t | X > s) = P(X > t).",
            "opt_b": "Misconception: Literal colloquial interpretation of 'memoryless'.",
            "opt_c": "Misconception: Variance is 1 / lambda^2 > 0.",
            "opt_d": "Misconception: CDF is F(x) = 1 - e^{-lambda x}."
        },
        "explanation": "The memoryless property means past elapsed time provides zero information about remaining waiting time: P(X > s+t | X > s) = e^(-λ(s+t)) / e^(-λs) = e^(-λt) = P(X > t)."
    },
    {
        "id": "q_dist_11",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "When does a Poisson distribution serve as an accurate approximation to a Binomial distribution B(n, p)?",
        "options": [
            {"id": "opt_a", "text": "When n is large (n >= 20 or 100) and p is small (p <= 0.05), with lambda = n * p"},
            {"id": "opt_b", "text": "When p is close to 0.5 and n is small"},
            {"id": "opt_c", "text": "Only when n equals infinity and p equals 1"},
            {"id": "opt_d", "text": "When n < 5 and p > 0.9"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Poisson Limit Theorem (Law of Rare Events): as n -> inf and p -> 0 with np = lambda constant, Binomial converges to Poisson(lambda).",
            "opt_b": "Misconception: When p is near 0.5 and n is large, the Normal distribution is the proper approximation.",
            "opt_c": "Misconception: Inverted limits.",
            "opt_d": "Misconception: Requires large n and small p."
        },
        "explanation": "The Poisson distribution approximates the Binomial for rare events (large number of trials n with low success probability p), setting λ = np."
    },
    {
        "id": "q_dist_12",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the probability density function f(x) of a Continuous Uniform distribution on interval [a, b]?",
        "options": [
            {"id": "opt_a", "text": "1 / (b - a) for x in [a, b], and 0 elsewhere"},
            {"id": "opt_b", "text": "(b - a) / 2"},
            {"id": "opt_c", "text": "1 / (x - a)"},
            {"id": "opt_d", "text": "(x - a) / (b - a)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Constant density 1/(b-a) ensures the integral over [a, b] equals (b-a)/(b-a) = 1.",
            "opt_b": "Misconception: Confuses density with half-width.",
            "opt_c": "Misconception: Variable density violates uniformity.",
            "opt_d": "Misconception: This is the CDF F(x) = (x - a) / (b - a), not the PDF."
        },
        "explanation": "Because probability is uniformly distributed across [a, b], the height of the rectangular density function must be 1 / (b - a) so that area equals 1."
    },
    {
        "id": "q_dist_13",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does positive (right) skewness indicate about a distribution's shape and relative positioning of Mean and Median?",
        "options": [
            {"id": "opt_a", "text": "A long tail extending toward the right (higher values), typically pulling the Mean to be greater than the Median"},
            {"id": "opt_b", "text": "A long tail extending toward the left, with Mean less than Median"},
            {"id": "opt_c", "text": "A perfectly symmetrical bell curve where Mean equals Median"},
            {"id": "opt_d", "text": "A bimodal distribution with two equal peaks"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Extreme high values in the right tail pull the sensitive mean upward while the median remains robust.",
            "opt_b": "Misconception: This defines negative (left) skewness.",
            "opt_c": "Misconception: Symmetrical distributions have skewness = 0.",
            "opt_d": "Misconception: Skewness measures asymmetry, not multimodality."
        },
        "explanation": "In a right-skewed distribution, the tail on the right side is longer or fatter. Large positive outliers pull the mean rightward, so typically Mean > Median."
    },
    {
        "id": "q_dist_14",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the variance of a Bernoulli random variable with parameter p?",
        "options": [
            {"id": "opt_a", "text": "p * (1 - p)"},
            {"id": "opt_b", "text": "p^2"},
            {"id": "opt_c", "text": "sqrt(p * (1 - p))"},
            {"id": "opt_d", "text": "p / (1 - p)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[X] = p, E[X^2] = 0^2*(1-p) + 1^2*p = p. Var(X) = E[X^2] - (E[X])^2 = p - p^2 = p(1 - p).",
            "opt_b": "Misconception: Confuses variance with squared mean.",
            "opt_c": "Misconception: This is the standard deviation, not variance.",
            "opt_d": "Misconception: This is the odds ratio."
        },
        "explanation": "For X ~ Bernoulli(p), Var(X) = E[X²] - (E[X])² = p - p² = p(1 - p). It reaches its maximum of 0.25 when p = 0.5."
    },
    {
        "id": "q_dist_15",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why does the Central Limit Theorem (CLT) state that sample means become normally distributed even if the population distribution is heavily skewed?",
        "options": [
            {"id": "opt_a", "text": "Because convolving independent random variables smooths and symmetrizes their probability density, converging to a Gaussian attractor under finite variance"},
            {"id": "opt_b", "text": "Because taking samples automatically eliminates all outliers from raw data"},
            {"id": "opt_c", "text": "Because non-normal data is transformed into logarithms during sampling"},
            {"id": "opt_d", "text": "It only applies if the underlying data was already normal"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Adding independent random variables corresponds to convolving their PDFs, which centralizes mass and converges to Gaussian as n -> inf by Berry-Esseen theorem.",
            "opt_b": "Misconception: Outliers are still present, but their average converges.",
            "opt_c": "Misconception: CLT requires no logarithmic data transformation.",
            "opt_d": "Misconception: The power of CLT is that it applies to ANY population distribution with finite variance."
        },
        "explanation": "The sum of independent random variables corresponds to repetitive convolution of their densities, which universally converges to a Gaussian distribution as sample size grows."
    },
    {
        "id": "q_dist_16",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the relationship between the Exponential Distribution (rate lambda) and the Poisson Distribution (rate lambda)?",
        "options": [
            {"id": "opt_a", "text": "In a Poisson process with rate lambda, the counts of events in time interval t follow Poisson(lambda * t), while the waiting times between successive events follow Exponential(lambda)"},
            {"id": "opt_b", "text": "Exponential is discrete while Poisson is continuous"},
            {"id": "opt_c", "text": "Poisson is the square root of the Exponential distribution"},
            {"id": "opt_d", "text": "They are completely unrelated distributions"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Poisson models event counts per interval; Exponential models continuous inter-arrival durations in the same underlying Poisson process.",
            "opt_b": "Misconception: Inverts definitions: Poisson is discrete (counts), Exponential is continuous (time).",
            "opt_c": "Misconception: Arbitrary non-linear relationship.",
            "opt_d": "Misconception: They are dual aspects of the identical stochastic process."
        },
        "explanation": "A Poisson process generates counts of occurrences following a Poisson distribution, and the continuous time between consecutive occurrences is exponentially distributed."
    },

    # Difficulty 3: Application (q_dist_17 to q_dist_24)
    {
        "id": "q_dist_17",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A test score is normally distributed with mean mu = 100 and standard deviation sigma = 15. What is the z-score of a student who scored 130?",
        "options": [
            {"id": "opt_a", "text": "z = +2.0"},
            {"id": "opt_b", "text": "z = +1.5"},
            {"id": "opt_c", "text": "z = +30.0"},
            {"id": "opt_d", "text": "z = -2.0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: z = (x - mu) / sigma = (130 - 100) / 15 = 30 / 15 = 2.0.",
            "opt_b": "Misconception: Divides by 20 instead of 15.",
            "opt_c": "Misconception: Forgets to divide by standard deviation sigma.",
            "opt_d": "Misconception: Sign error: a score above the mean has positive z-score."
        },
        "explanation": "The z-score measures standard deviations from the mean: z = (X - μ) / σ = (130 - 100) / 15 = 30 / 15 = +2.0."
    },
    {
        "id": "q_dist_18",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For a Binomial distribution with n = 100 independent trials and success probability p = 0.2, what are the expected value E[X] and variance Var(X)?",
        "options": [
            {"id": "opt_a", "text": "E[X] = 20, Var(X) = 16"},
            {"id": "opt_b", "text": "E[X] = 20, Var(X) = 20"},
            {"id": "opt_c", "text": "E[X] = 20, Var(X) = 4"},
            {"id": "opt_d", "text": "E[X] = 50, Var(X) = 25"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[X] = n*p = 100 * 0.2 = 20. Var(X) = n*p*(1-p) = 100 * 0.2 * 0.8 = 16.",
            "opt_b": "Misconception: Confuses Binomial with Poisson where variance equals mean.",
            "opt_c": "Misconception: 4 is the standard deviation (sqrt(16)), not variance.",
            "opt_d": "Misconception: Assumes p = 0.5."
        },
        "explanation": "For X ~ Binomial(n, p): E[X] = np = 100 * 0.2 = 20. Var(X) = np(1 - p) = 100 * 0.2 * 0.8 = 16 (Standard Deviation = 4)."
    },
    {
        "id": "q_dist_19",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A call center receives an average of 3 calls per minute (Poisson rate lambda = 3). What is the probability of receiving exactly 0 calls in a given minute?",
        "options": [
            {"id": "opt_a", "text": "e^{-3} ≈ 0.0498 (approximately 5.0%)"},
            {"id": "opt_b", "text": "0.0"},
            {"id": "opt_c", "text": "1 / 3 = 0.333"},
            {"id": "opt_d", "text": "3 * e^{-3} ≈ 0.149"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: P(X = 0) = (e^{-3} * 3^0) / 0! = e^{-3} * 1 / 1 = e^{-3} ≈ 0.04979.",
            "opt_b": "Misconception: Believes probability of zero events in Poisson must be zero.",
            "opt_c": "Misconception: Divides 1 by lambda.",
            "opt_d": "Misconception: Calculates P(X = 1) = 3 * e^{-3}."
        },
        "explanation": "Using Poisson PMF P(X = k) = (e^(-λ) * λ^k) / k! for k = 0: P(X = 0) = (e^(-3) * 3^0) / 0! = e^(-3) ≈ 0.0498."
    },
    {
        "id": "q_dist_20",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If a server's time-to-failure follows an Exponential distribution with rate lambda = 0.01 per hour (mean 100 hours), what is the probability that it survives past 100 hours P(X > 100)?",
        "options": [
            {"id": "opt_a", "text": "e^{-1} ≈ 0.368 (36.8%)"},
            {"id": "opt_b", "text": "0.50 (50%)"},
            {"id": "opt_c", "text": "0.0"},
            {"id": "opt_d", "text": "1 - e^{-1} ≈ 0.632"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Survival function P(X > t) = e^{-lambda * t}. For t = 1/lambda = 100, P(X > 100) = e^{-0.01 * 100} = e^{-1} ≈ 0.3679.",
            "opt_b": "Misconception: Confuses mean with median. The median is ln(2)/lambda ≈ 69.3 hours.",
            "opt_c": "Misconception: Believes reaching the mean guarantees failure.",
            "opt_d": "Misconception: Calculates the probability of failing BEFORE 100 hours: F(100) = 1 - e^{-1}."
        },
        "explanation": "Survival function for Exponential distribution is P(X > t) = e^(-λt). At the mean t = 1/λ = 100 hours, P(X > 100) = e^(-1) ≈ 0.368."
    },
    {
        "id": "q_dist_21",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If X ~ N(10, 4) and we define a linear transformation Y = 3X + 5, what is the distribution of Y?",
        "options": [
            {"id": "opt_a", "text": "Y ~ N(35, 36)"},
            {"id": "opt_b", "text": "Y ~ N(35, 12)"},
            {"id": "opt_c", "text": "Y ~ N(30, 16)"},
            {"id": "opt_d", "text": "Y ~ N(35, 17)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: E[Y] = 3*10 + 5 = 35. Var(Y) = 3^2 * Var(X) = 9 * 4 = 36. Thus Y ~ N(35, 36).",
            "opt_b": "Misconception: Multiplies variance by 3 instead of 3^2 = 9.",
            "opt_c": "Misconception: Forgets to add constant 5 to mean.",
            "opt_d": "Misconception: Adds constant to variance."
        },
        "explanation": "Linear transformation of Gaussian remains Gaussian: E[3X + 5] = 3E[X] + 5 = 35. Var(3X + 5) = 3² Var(X) = 9 * 4 = 36."
    },
    {
        "id": "q_dist_22",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If X is uniformly distributed on [0, 10], what is the probability P(2 <= X <= 7)?",
        "options": [
            {"id": "opt_a", "text": "(7 - 2) / (10 - 0) = 5 / 10 = 0.50 (50%)"},
            {"id": "opt_b", "text": "0.70"},
            {"id": "opt_c", "text": "0.20"},
            {"id": "opt_d", "text": "0.35"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For Uniform(a, b), P(c <= X <= d) = (d - c) / (b - a) = (7 - 2) / (10 - 0) = 0.50.",
            "opt_b": "Misconception: Uses upper bound 7/10 without subtracting lower bound.",
            "opt_c": "Misconception: Uses lower bound 2/10.",
            "opt_d": "Misconception: Multiplies bounds."
        },
        "explanation": "The probability is the length of the subinterval divided by total interval length: (7 - 2) / (10 - 0) = 5 / 10 = 0.50."
    },
    {
        "id": "q_dist_23",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the median of a standard normal distribution Z ~ N(0, 1)?",
        "options": [
            {"id": "opt_a", "text": "0"},
            {"id": "opt_b", "text": "0.5"},
            {"id": "opt_c", "text": "1.0"},
            {"id": "opt_d", "text": "-1.0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Due to perfect symmetry around mu = 0, exactly 50% of the probability mass lies below 0, so Median = Mean = Mode = 0.",
            "opt_b": "Misconception: Confuses the median value x with the cumulative probability F(x) = 0.5.",
            "opt_c": "Misconception: Confuses standard deviation with median.",
            "opt_d": "Misconception: Arbitrary negative."
        },
        "explanation": "Because the normal distribution is perfectly symmetric around its mean μ = 0, P(Z ≤ 0) = 0.50. Hence, the median equals 0."
    },
    {
        "id": "q_dist_24",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For an independent sum of two Poisson variables X ~ Poisson(lambda_1 = 2) and Y ~ Poisson(lambda_2 = 5), what is the exact distribution of S = X + Y?",
        "options": [
            {"id": "opt_a", "text": "S ~ Poisson(7)"},
            {"id": "opt_b", "text": "S ~ Poisson(10)"},
            {"id": "opt_c", "text": "S ~ Normal(7, 7)"},
            {"id": "opt_d", "text": "S ~ Binomial(7, 0.5)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The sum of independent Poisson random variables is Poisson with rate equal to the sum of rates: lambda = 2 + 5 = 7.",
            "opt_b": "Misconception: Multiplies rates 2 * 5 = 10.",
            "opt_c": "Misconception: Poisson sums are strictly Poisson, not Gaussian (though approximately normal for large lambda).",
            "opt_d": "Misconception: Confuses Poisson with Binomial."
        },
        "explanation": "By the convolution of MGFs, M_{X+Y}(t) = M_X(t)M_Y(t) = e^(λ_1(e^t-1)) * e^(λ_2(e^t-1)) = e^((λ_1+λ_2)(e^t-1)), which is Poisson(λ_1 + λ_2) = Poisson(7)."
    },

    # Difficulty 4: Analysis (q_dist_25 to q_dist_32)
    {
        "id": "q_dist_25",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why does the standard Cauchy Distribution have an undefined mean and infinite variance, violating the standard Central Limit Theorem?",
        "options": [
            {"id": "opt_a", "text": "Its heavy tails decay as 1 / x^2, so the integral for the expected value integral_{-inf}^{inf} x / (pi*(1+x^2)) dx diverges (not absolutely integrable)"},
            {"id": "opt_b", "text": "Because it has no probability density function"},
            {"id": "opt_c", "text": "Because it can only take negative values"},
            {"id": "opt_d", "text": "Because its cumulative distribution function exceeds 1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Heavy tails decay too slowly for ∫ |x| f(x) dx to converge, rendering the expected value undefined and variance infinite.",
            "opt_b": "Misconception: Cauchy has a smooth closed-form PDF: 1 / (pi * (1 + x^2)).",
            "opt_c": "Misconception: Cauchy is symmetric over the entire real line (-inf, +inf).",
            "opt_d": "Misconception: Cauchy CDF is valid: 1/pi * arctan(x) + 1/2."
        },
        "explanation": "The Cauchy distribution has heavy tails decaying at O(1/x²). Because ∫ |x| f(x)dx diverges, its mean does not exist and variance is infinite, meaning sample averages never converge."
    },
    {
        "id": "q_dist_26",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What distribution results from the sum of squares of k independent standard normal random variables Z_1^2 + ... + Z_k^2?",
        "options": [
            {"id": "opt_a", "text": "Chi-Square distribution with k degrees of freedom (chi^2_k)"},
            {"id": "opt_b", "text": "Student's t-distribution with k degrees of freedom"},
            {"id": "opt_c", "text": "F-distribution with (k, 1) degrees of freedom"},
            {"id": "opt_d", "text": "Normal distribution with mean k"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By definition, the Chi-Square distribution with k degrees of freedom is the distribution of the sum of k independent squared standard normal variables.",
            "opt_b": "Misconception: Student's t is a ratio of a normal variable divided by sqrt(Chi-Square / k).",
            "opt_c": "Misconception: F-distribution is a ratio of two scaled independent Chi-Square variables.",
            "opt_d": "Misconception: Sum of squares is strictly non-negative; normal variables have negative support."
        },
        "explanation": "The sum of k squared independent N(0, 1) variables is distributed as Chi-Square with k degrees of freedom: ∑_{i=1}^k Z_i² ~ χ²(k)."
    },
    {
        "id": "q_dist_27",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does Student's t-distribution compare to the Standard Normal distribution, and what happens as degrees of freedom nu -> infinity?",
        "options": [
            {"id": "opt_a", "text": "Student's t has heavier tails (higher kurtosis) to account for uncertainty in estimating the population variance from sample data; it converges to Standard Normal as nu -> infinity"},
            {"id": "opt_b", "text": "Student's t has lighter tails than normal; it converges to Uniform"},
            {"id": "opt_c", "text": "Student's t is asymmetric and skewed right"},
            {"id": "opt_d", "text": "Student's t variance approaches infinity as nu -> infinity"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Heavier tails account for sampling variability of s; as degrees of freedom increase, sample variance converges to true variance, approaching N(0, 1).",
            "opt_b": "Misconception: Inverts tail thickness.",
            "opt_c": "Misconception: Student's t is symmetric around 0.",
            "opt_d": "Misconception: Variance is nu / (nu - 2), which converges to 1 as nu -> inf."
        },
        "explanation": "The t-distribution accounts for extra uncertainty from estimating σ with sample s. Its fatter tails produce higher critical values. As ν → ∞, t(ν) → N(0, 1)."
    },
    {
        "id": "q_dist_28",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_cond_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why is the Beta distribution on [0, 1] ideally suited as a prior distribution for the probability parameter p of a Binomial or Bernoulli distribution?",
        "options": [
            {"id": "opt_a", "text": "Because its support is strictly bounded to [0, 1] matching probability values, and it is the conjugate prior for the Binomial distribution (posterior is also Beta)"},
            {"id": "opt_b", "text": "Because it always enforces a uniform distribution regardless of hyperparameters"},
            {"id": "opt_c", "text": "Because its variance is zero at alpha = beta"},
            {"id": "opt_d", "text": "Because it can only take discrete values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Support on [0, 1] naturally models probabilities, and Beta-Binomial conjugacy yields simple algebraic parameter addition.",
            "opt_b": "Misconception: Beta is uniform only when alpha = beta = 1; other hyperparameters yield U-shaped, skewed, or bell-shaped curves.",
            "opt_c": "Misconception: Variance is alpha*beta / ((alpha+beta)^2 * (alpha+beta+1)) > 0.",
            "opt_d": "Misconception: Beta is a continuous distribution."
        },
        "explanation": "The Beta distribution is supported on [0, 1], perfectly modeling unknown probabilities. Its functional form θ^(α-1)(1-θ)^(β-1) is algebraically conjugate to Binomial likelihood θ^k(1-θ)^(n-k)."
    },
    {
        "id": "q_dist_29",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "If a random variable X is Log-Normally distributed, what does that imply about the variable Y = ln(X)?",
        "options": [
            {"id": "opt_a", "text": "Y is Normally distributed: Y ~ N(mu, sigma^2)"},
            {"id": "opt_b", "text": "Y is Exponentially distributed"},
            {"id": "opt_c", "text": "Y is Uniformly distributed"},
            {"id": "opt_d", "text": "Y must be strictly non-negative"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By definition, X is Log-Normal if its natural logarithm Y = ln(X) follows a normal distribution.",
            "opt_b": "Misconception: Confuses log-normal with exponential decay.",
            "opt_c": "Misconception: Confuses with uniform transform.",
            "opt_d": "Misconception: Since X > 0, ln(X) ranges across all real numbers (-inf, +inf)."
        },
        "explanation": "A log-normal distribution is the distribution of a random variable whose logarithm is normally distributed: if Y ~ N(μ, σ²), then X = e^Y ~ LogNormal(μ, σ²)."
    },
    {
        "id": "q_dist_30",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "On a Quantile-Quantile (Q-Q) plot comparing empirical sample quantiles against theoretical normal quantiles, what does an 'S-shaped' curve with points bowing above the line at the top and below at the bottom indicate?",
        "options": [
            {"id": "opt_a", "text": "Heavy tails (leptokurtic distribution) with more extreme outliers than a normal distribution"},
            {"id": "opt_b", "text": "Light tails (platykurtic distribution) with fewer outliers"},
            {"id": "opt_c", "text": "Perfect normality"},
            {"id": "opt_d", "text": "Negative skewness with a long left tail"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sample quantiles exceeding theoretical normal quantiles at both extremes indicates heavy tails (higher kurtosis than Gaussian).",
            "opt_b": "Misconception: Light tails curve below the line on the right and above on the left.",
            "opt_c": "Misconception: Perfect normality produces points lying strictly along the diagonal straight line.",
            "opt_d": "Misconception: Skewness produces one-sided curvature, not symmetric S-shape."
        },
        "explanation": "When sample quantiles are more extreme than normal quantiles at both high and low percentiles (S-shape), the empirical data exhibits heavier tails and excess kurtosis."
    },
    {
        "id": "q_dist_31",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the convolution of two independent normal distributions X_1 ~ N(mu_1, sigma_1^2) and X_2 ~ N(mu_2, sigma_2^2)?",
        "options": [
            {"id": "opt_a", "text": "X_1 + X_2 ~ N(mu_1 + mu_2, sigma_1^2 + sigma_2^2)"},
            {"id": "opt_b", "text": "X_1 + X_2 ~ N(mu_1 * mu_2, sigma_1 * sigma_2)"},
            {"id": "opt_c", "text": "X_1 + X_2 ~ ChiSquare(2)"},
            {"id": "opt_d", "text": "X_1 + X_2 ~ N(mu_1 + mu_2, (sigma_1 + sigma_2)^2)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The normal family is closed under addition: means add and independent variances add.",
            "opt_b": "Misconception: Multiplies parameters.",
            "opt_c": "Misconception: Sum of normals is normal, not Chi-Square (which requires squaring).",
            "opt_d": "Misconception: Standard deviations do not add linearly; variances add."
        },
        "explanation": "The sum of independent Gaussian random variables is always Gaussian with mean μ = μ_1 + μ_2 and variance σ² = σ_1² + σ_2²."
    },
    {
        "id": "q_dist_32",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In survival analysis and reliability engineering, what does a Weibull distribution hazard rate shape parameter k > 1 indicate?",
        "options": [
            {"id": "opt_a", "text": "An increasing failure rate over time ('wear-out' phase where older components are more prone to failure)"},
            {"id": "opt_b", "text": "A constant failure rate over time (identical to exponential distribution)"},
            {"id": "opt_c", "text": "A decreasing failure rate ('infant mortality' phase where early defects burn in)"},
            {"id": "opt_d", "text": "A failure rate of zero"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For Weibull, hazard h(t) proportional to t^{k-1}. For k > 1, hazard increases with time, modeling aging and mechanical fatigue.",
            "opt_b": "Misconception: k = 1 gives constant hazard (exponential distribution).",
            "opt_c": "Misconception: k < 1 gives decreasing hazard (infant mortality).",
            "opt_d": "Misconception: Hazard rate is positive."
        },
        "explanation": "The Weibull hazard function is h(t) = (k/λ)(t/λ)^(k-1). When k > 1, h(t) increases monotonically over time, modeling physical wear and aging."
    },

    # Difficulty 5: Synthesis (q_dist_33 to q_dist_40)
    {
        "id": "q_dist_33",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "Under the Principle of Maximum Entropy, what distribution maximizes differential entropy over (-infinity, +infinity) subject to a specified mean mu and variance sigma^2?",
        "options": [
            {"id": "opt_a", "text": "The Gaussian (Normal) distribution N(mu, sigma^2)"},
            {"id": "opt_b", "text": "The Uniform distribution"},
            {"id": "opt_c", "text": "The Laplace (double exponential) distribution"},
            {"id": "opt_d", "text": "The Student's t-distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The Gaussian distribution maximizes Shannon differential entropy among all continuous distributions with fixed first and second moments.",
            "opt_b": "Misconception: Uniform maximizes entropy on a FINITE bounded interval [a, b] with no moment constraints.",
            "opt_c": "Misconception: Laplace maximizes entropy with fixed mean absolute deviation E[|X-mu|].",
            "opt_d": "Misconception: Student's t has lower entropy than Gaussian for same variance."
        },
        "explanation": "By calculus of variations, the Gaussian distribution uniquely maximizes differential entropy H(f) = -∫ f(x)ln f(x)dx subject to normalization and fixed variance constraints."
    },
    {
        "id": "q_dist_34",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_linalg"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "For a p-dimensional Multivariate Normal distribution X ~ N_p(mu, Sigma), what must the covariance matrix Sigma strictly satisfy?",
        "options": [
            {"id": "opt_a", "text": "Sigma must be symmetric and positive semi-definite (positive definite for non-degenerate distributions)"},
            {"id": "opt_b", "text": "Sigma must be an orthogonal matrix with determinant 1"},
            {"id": "opt_c", "text": "All off-diagonal elements must be zero"},
            {"id": "opt_d", "text": "The trace of Sigma must equal 1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Variances along any linear combination v^T Sigma v must be >= 0 (positive semi-definite), and Cov(X_i, X_j) = Cov(X_j, X_i) (symmetric).",
            "opt_b": "Misconception: Covariance matrices are not orthogonal in general.",
            "opt_c": "Misconception: Off-diagonal elements represent covariances between features; zero off-diagonals only occur when features are mutually uncorrelated.",
            "opt_d": "Misconception: Trace is the sum of feature variances, which can take any positive real number."
        },
        "explanation": "A valid covariance matrix must be symmetric (Σ = Σ^T) and positive semi-definite (v^T Σ v ≥ 0 for all vectors v) to ensure non-negative variance for any linear projection."
    },
    {
        "id": "q_dist_35",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How does Inverse Transform Sampling generate random variates X from an arbitrary continuous distribution with invertible CDF F(x)?",
        "options": [
            {"id": "opt_a", "text": "Sample U ~ Uniform(0, 1), and compute X = F^{-1}(U)"},
            {"id": "opt_b", "text": "Sample U ~ Uniform(0, 1), and compute X = F(U)"},
            {"id": "opt_c", "text": "Sample Z ~ N(0, 1), and compute X = d/dx [F(Z)]"},
            {"id": "opt_d", "text": "Multiply U by the variance of the distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: P(F^{-1}(U) <= x) = P(U <= F(x)) = F(x), exactly recovering the target cumulative distribution function.",
            "opt_b": "Misconception: Inverts direction: F(U) maps domain into probabilities, not probabilities into domain values.",
            "opt_c": "Misconception: Derivative of CDF is PDF, not a sampling generator.",
            "opt_d": "Misconception: Scaling Uniform only produces a wider uniform distribution."
        },
        "explanation": "By the Probability Integral Transform, if U ~ Uniform(0, 1), then X = F^(-1)(U) has exactly CDF F(x), because P(F^(-1)(U) ≤ x) = P(U ≤ F(x)) = F(x)."
    },
    {
        "id": "q_dist_36",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does Sklar's Theorem state regarding multivariate joint distributions and Copulas C(u_1, ..., u_d)?",
        "options": [
            {"id": "opt_a", "text": "Any multivariate joint CDF can be decomposed into its 1D marginal CDFs linked together by a unique copula function that fully captures the dependency structure: F(x_1, ..., x_d) = C(F_1(x_1), ..., F_d(x_d))"},
            {"id": "opt_b", "text": "All multivariate distributions must be decomposed into independent Gaussians"},
            {"id": "opt_c", "text": "Copulas can only model linear Pearson correlations"},
            {"id": "opt_d", "text": "Marginals must be identically distributed for a copula to exist"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sklar's theorem decouples the choice of marginal distributions from the complex non-linear dependency structure captured by copula C.",
            "opt_b": "Misconception: Copulas permit completely non-Gaussian and asymmetric dependencies.",
            "opt_c": "Misconception: Copulas capture non-linear, tail, and rank dependencies (Kendall tau, Spearman rho).",
            "opt_d": "Misconception: Marginals can belong to entirely disparate distribution families."
        },
        "explanation": "Sklar's Theorem allows decoupling the marginal distributions F_i(x_i) from the dependency structure C: F(x_1,...,x_d) = C(F_1(x_1),...,F_d(x_d)), forming the foundation of modern multivariate modeling."
    },
    {
        "id": "q_dist_37",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In a continuous bivariate transformation (Y_1, Y_2) = g(X_1, X_2), what scaling factor is required in the change-of-variables formula for joint density f_{Y_1, Y_2}(y_1, y_2)?",
        "options": [
            {"id": "opt_a", "text": "The absolute value of the determinant of the Jacobian matrix: |det(J)| where J = d(x_1, x_2) / d(y_1, y_2)"},
            {"id": "opt_b", "text": "The trace of the Hessian matrix"},
            {"id": "opt_c", "text": "The ratio of their standard deviations"},
            {"id": "opt_d", "text": "1 / (y_1 + y_2)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The Jacobian determinant measures local volume distortion under multidimensional coordinate transformation: f_Y(y) = f_X(g^{-1}(y)) * |det(J)|.",
            "opt_b": "Misconception: Hessian evaluates curvature in optimization, not differential volume scaling.",
            "opt_c": "Misconception: 1D linear scaling cannot account for multi-variable rotation and shear.",
            "opt_d": "Misconception: Arbitrary fraction."
        },
        "explanation": "In multivariate transformation, area elements transform via the Jacobian matrix: dx_1 dx_2 = |det(J)| dy_1 dy_2. Thus f_Y(y_1, y_2) = f_X(x_1(y), x_2(y)) * |det(J)|."
    },
    {
        "id": "q_dist_38",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_cond_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "When a Poisson parameter lambda itself follows a Gamma(alpha, beta) prior distribution, what marginal distribution results for the observed event count X (Gamma-Poisson mixture)?",
        "options": [
            {"id": "opt_a", "text": "Negative Binomial distribution"},
            {"id": "opt_b", "text": "Exponential distribution"},
            {"id": "opt_c", "text": "Gaussian distribution"},
            {"id": "opt_d", "text": "Student's t-distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Compounding Poisson(lambda) over Gamma(alpha, beta) integrates out lambda into a Negative Binomial distribution, modeling overdispersed count data.",
            "opt_b": "Misconception: Exponential is continuous; counts are discrete.",
            "opt_c": "Misconception: Normal distribution has negative support.",
            "opt_d": "Misconception: Student's t is a Gaussian-Inverse Gamma mixture."
        },
        "explanation": "Integrating the joint distribution ∫ Poisson(x|λ)Gamma(λ|α,β)dλ yields the Negative Binomial distribution, providing a natural mechanism to model overdispersion in count data."
    },
    {
        "id": "q_dist_39",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Fisher-Tippett-Gnedenko Theorem (Extreme Value Theory) state about the normalized maximum M_n = max(X_1, ..., X_n) of i.i.d. random variables as n -> infinity?",
        "options": [
            {"id": "opt_a", "text": "It can only converge in distribution to one of three universal extreme value families: Gumbel, Fréchet, or Weibull (unified as Generalized Extreme Value distribution)"},
            {"id": "opt_b", "text": "It always converges to a Normal distribution by Central Limit Theorem"},
            {"id": "opt_c", "text": "It always diverges to infinity without any non-degenerate limiting distribution"},
            {"id": "opt_d", "text": "It converges to a Uniform distribution on [0, 1]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The EVT is the analog of the CLT for maxima: sample maxima can only converge to the GEV family parameterized by shape parameter xi.",
            "opt_b": "Misconception: CLT applies to sample SUMS/MEANS, not sample MAXIMA.",
            "opt_c": "Misconception: Proper affine normalization (M_n - b_n)/a_n produces non-degenerate limiting laws.",
            "opt_d": "Misconception: Maximum orders are non-uniform."
        },
        "explanation": "Analogous to the CLT for sums, the Fisher-Tippett-Gnedenko theorem proves that the distribution of normalized sample maxima can only converge to the Generalized Extreme Value (GEV) distribution."
    },
    {
        "id": "q_dist_40",
        "skillId": "skill_prob_dist",
        "skillName": "Probability Distributions",
        "skillsTested": ["skill_prob_dist", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In a homogeneous Poisson point process in R^d with intensity rho, what is the probability that a ball B(r) of radius r contains zero points?",
        "options": [
            {"id": "opt_a", "text": "exp(-rho * Vol(B(r))) where Vol(B(r)) is the Euclidean volume of the ball"},
            {"id": "opt_b", "text": "1 / (1 + rho * r^d)"},
            {"id": "opt_c", "text": "1 - rho * r"},
            {"id": "opt_d", "text": "exp(-rho * r)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Expected count in region A is lambda = rho * Volume(A). By Poisson zero-term: P(N(A) = 0) = e^{-lambda} = exp(-rho * Vol(A)).",
            "opt_b": "Misconception: Algebraic decay.",
            "opt_c": "Misconception: Linear approximation.",
            "opt_d": "Misconception: Omits multi-dimensional volume scaling (r^d)."
        },
        "explanation": "In a spatial Poisson process, the count of points in any measurable region S follows Poisson(λ = ρ * Vol(S)). For k = 0, P(N(B) = 0) = e^(-ρ Vol(B(r)))."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/probabilityDistributions.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const PROBABILITY_DISTRIBUTIONS_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Probability Distributions questions in {out_file}")

if __name__ == '__main__':
    main()
