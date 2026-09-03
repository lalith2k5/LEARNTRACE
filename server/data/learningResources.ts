import { LearningResource } from '../../src/types.js';

/**
 * Curated Learning Resources for LearnTrace Knowledge Tracing Curriculum
 * Exactly 3 curated resources for each of the 8 core curriculum skills:
 * 1. Comprehensive Concept Guide (in-depth theory, mental models, key takeaways)
 * 2. Official Documentation / Reference Link (authoritative source)
 * 3. Interactive Practice Exercise (hands-on problem with hint & step-by-step solution)
 */
export const SEED_LEARNING_RESOURCES: LearningResource[] = [
  // -------------------------------------------------------------
  // 1. PYTHON (skill_python)
  // -------------------------------------------------------------
  {
    id: 'res_python_guide',
    skillId: 'skill_python',
    skillName: 'Python',
    title: 'Python Internals: Memory Model, Hash Tables, and Vectorized NumPy Arrays',
    type: 'guide',
    description: 'Master how CPython handles object pointers, dynamic list resizing, dictionary hash buckets, and contiguous memory layout in NumPy.',
    readTimeMinutes: 8,
    difficulty: 'Intermediate',
    keyConcepts: [
      'CPython PyObject reference counting and memory pointers',
      'Dictionary lookup amortized O(1) complexity via hash buckets and open addressing',
      'List comprehension vs generator expressions memory footprint',
      'NumPy ndarray strided buffers and SIMD vectorization',
    ],
    contentSummary: `### Python Data Model & Vectorization

Python is an interpreted, dynamically typed language where all variables are pointers to \`PyObject\` structures on the heap.

#### 1. Dictionary Hash Tables
- **Amortized O(1)** lookup, insertion, and deletion.
- Implemented using open addressing with quadratic perturbation to resolve hash collisions.
- Keys must be **hashable** (immutable objects implementing \`__hash__\` and \`__eq__\`).
- Since Python 3.7+, dictionary insertion order is guaranteed preserved through a dense array and sparse index table.

#### 2. List Comprehensions vs Generators
- **List Comprehensions** (\`[x for x in data]\`): Evaluated eagerly in memory, creating a full list object. Best for small-to-medium transformations requiring random access or reuse.
- **Generator Expressions** (\`(x for x in data)\`): Evaluated lazily via iterator protocol (\`__next__\`), yielding elements one by one with $O(1)$ memory consumption.

#### 3. NumPy Strided Layout & Vectorization
- Standard Python lists hold pointers to detached objects scattered across memory (pointer indirection).
- NumPy \`ndarray\` allocates a single contiguous C-order or Fortran-order memory buffer.
- Operations run in compiled C/Fortran code utilizing CPU vector registers (AVX/SIMD), achieving 10x to 100x speedups without Python interpreter GIL overhead.`,
  },
  {
    id: 'res_python_doc',
    skillId: 'skill_python',
    skillName: 'Python',
    title: 'Official Python Standard Library & Data Structures Reference',
    type: 'documentation',
    description: 'The definitive Python 3 documentation on built-in data structures, dictionary implementations, and memory protocols.',
    url: 'https://docs.python.org/3/tutorial/datastructures.html',
    readTimeMinutes: 12,
    difficulty: 'Beginner',
    keyConcepts: [
      'Built-in list methods and time complexities',
      'Tuple immutability and hashing rules',
      'Dictionary comprehension syntax',
      'collections.deque and itertools module',
    ],
    contentSummary: 'The official Python documentation covers sequence types, mapping types, and standard library data structures. It provides precise algorithmic specifications for list appending, dictionary comprehension syntax, set operations, and memory-efficient iterators.',
  },
  {
    id: 'res_python_practice',
    skillId: 'skill_python',
    skillName: 'Python',
    title: 'Hands-on Practice: NumPy Broadcasting & In-Place List Mutation',
    type: 'practice',
    description: 'Solve an array broadcasting shape challenge and diagnose object identity vs value equality.',
    difficulty: 'Intermediate',
    keyConcepts: ['Broadcasting trailing dimension matching', 'Object identity (is) vs value equality (==)'],
    practiceExercise: {
      prompt: `Consider the following two Python snippets:

Problem A:
You have a NumPy array \`A\` with shape \`(4, 1)\` and array \`B\` with shape \`(3,)\`.
What is the resulting shape of \`(A + B)\` under NumPy broadcasting rules?

Problem B:
\`\`\`python
a = [1, 2, [3, 4]]
b = list(a)
b[2].append(5)
\`\`\`
What does \`a[2]\` evaluate to after executing these lines, and why?`,
      codeSnippet: `import numpy as np

A = np.ones((4, 1))
B = np.ones((3,))
result = A + B
print("Shape:", result.shape)

a = [1, 2, [3, 4]]
b = list(a)
b[2].append(5)
print("a[2]:", a[2])`,
      hint: 'For Problem A, compare shapes from right to left, prepending 1 to B. For Problem B, remember that `list(a)` creates a shallow copy, not a deep copy.',
      solution: `Problem A:
The resulting shape is (4, 3).
NumPy aligns dimensions right-to-left:
Array A: 4 x 1
Array B: 1 x 3  (B's shape (3,) is virtually padded to (1, 3))
Comparing dimensions: 1 vs 3 -> compatible (yields 3); 4 vs 1 -> compatible (yields 4). The output shape is (4, 3).

Problem B:
a[2] evaluates to [3, 4, 5].
Calling list(a) produces a shallow copy. The outer list is a new object, but nested mutable objects (the sublist [3, 4]) share the exact same memory reference (id(a[2]) == id(b[2])). Mutating b[2] directly alters a[2].`,
      solutionExplanation: 'Understanding shallow vs deep copying and NumPy trailing dimension alignment is essential for avoiding insidious memory bugs in data pipelines.',
    },
  },

  // -------------------------------------------------------------
  // 2. PROBABILITY (skill_prob)
  // -------------------------------------------------------------
  {
    id: 'res_prob_guide',
    skillId: 'skill_prob',
    skillName: 'Probability',
    title: 'Foundations of Probability: Sample Spaces, Axioms & Combinatorics',
    type: 'guide',
    description: 'A mathematical and intuitive primer on Kolmogorov probability axioms, independent vs mutually exclusive events, and the power of the complement rule.',
    readTimeMinutes: 10,
    difficulty: 'Beginner',
    keyConcepts: [
      'Sample space S and event probability 0 <= P(A) <= 1',
      'Union rule: P(A or B) = P(A) + P(B) - P(A and B)',
      'Independent events: P(A and B) = P(A) * P(B)',
      'Mutually exclusive events: P(A and B) = 0',
      'Complement rule: P(at least one) = 1 - P(none)',
    ],
    contentSummary: `### Core Probability Axioms & Rules

Probability measures the likelihood of events occurring within a defined sample space $S$.

#### 1. Kolmogorov Axioms
1. **Non-negativity**: $P(E) \\ge 0$ for any event $E$.
2. **Total Probability**: $P(S) = 1$ (the sample space contains all possible outcomes).
3. **Countable Additivity**: For mutually exclusive events $E_1, E_2, \\dots$, $P(\\bigcup E_i) = \\sum P(E_i)$.

#### 2. Independence vs Mutual Exclusivity
- **Independent Events**: The occurrence of event $A$ provides zero information about event $B$.
  $$P(A \\cap B) = P(A) \\times P(B)$$
  $$P(A \\mid B) = P(A)$$
- **Mutually Exclusive (Disjoint) Events**: Events $A$ and $B$ cannot happen at the same time.
  $$P(A \\cap B) = 0$$
  $$P(A \\cup B) = P(A) + P(B)$$

#### 3. The Complement Rule Shortcut
When asked to find the probability of **"at least one"** event occurring across multiple independent trials, calculating the direct union is often tedious. Always consider the complement:
$$P(\\text{at least one}) = 1 - P(\\text{none})$$`,
  },
  {
    id: 'res_prob_doc',
    skillId: 'skill_prob',
    skillName: 'Probability',
    title: 'Khan Academy Probability Library & Interactive Venn Visualizers',
    type: 'documentation',
    description: 'Comprehensive lessons and practice modules covering compound events, independent vs dependent probabilities, and Venn diagrams.',
    url: 'https://www.khanacademy.org/math/statistics-probability/probability-library',
    readTimeMinutes: 15,
    difficulty: 'Beginner',
    keyConcepts: [
      'Interactive Venn diagram set intersections',
      'Multiplication rule for independent trials',
      'Permutations and combinations formulas',
      'Random experiments and sample spaces',
    ],
    contentSummary: 'Khan Academy provides an extensive collection of guided tutorials and interactive quizzes for fundamental probability, set operations, combinations, permutations, and compound event calculations.',
  },
  {
    id: 'res_prob_practice',
    skillId: 'skill_prob',
    skillName: 'Probability',
    title: 'Hands-on Practice: Multi-Die Roll & Complement Rule Challenge',
    type: 'practice',
    description: 'Calculate compound probabilities across independent die tosses using the complement principle.',
    difficulty: 'Intermediate',
    keyConcepts: ['Complement rule', 'Independent trials', 'Discrete sample spaces'],
    practiceExercise: {
      prompt: `A game consists of rolling three fair, standard six-sided dice at the same time.

Part 1:
What is the exact probability of rolling AT LEAST ONE six?

Part 2:
What is the probability of rolling a sum of at least 17?`,
      hint: 'For Part 1, find the probability of rolling no sixes on all 3 dice, then subtract from 1. For Part 2, list all combinations of (die1, die2, die3) that sum to 17 or 18.',
      solution: `Part 1 (At least one 6):
Each die has probability 5/6 of NOT rolling a 6.
Because the three rolls are independent:
P(no sixes) = (5/6) * (5/6) * (5/6) = 125 / 216.
By the complement rule:
P(at least one 6) = 1 - P(no sixes) = 1 - 125/216 = 91/216 ≈ 0.4213 (42.13%).

Part 2 (Sum >= 17):
The total possible outcomes are 6^3 = 216.
Combinations summing to 18:
- (6, 6, 6): 1 permutation.
Combinations summing to 17:
- (6, 6, 5), (6, 5, 6), (5, 6, 6): 3 permutations.
Total favorable outcomes = 1 + 3 = 4 outcomes.
P(Sum >= 17) = 4 / 216 = 1 / 54 ≈ 0.0185 (1.85%).`,
      solutionExplanation: 'Using the complement rule for compound "at least one" events avoids summing overlapping permutations and prevents double-counting errors.',
    },
  },

  // -------------------------------------------------------------
  // 3. CONDITIONAL PROBABILITY (skill_cond_prob)
  // -------------------------------------------------------------
  {
    id: 'res_cond_prob_guide',
    skillId: 'skill_cond_prob',
    skillName: 'Conditional Probability',
    title: "Bayesian Reasoning: Bayes' Theorem, Priors, and the Base Rate Fallacy",
    type: 'guide',
    description: 'Learn how to update beliefs in the presence of new evidence and avoid the common base rate fallacy in medical diagnostic tests.',
    readTimeMinutes: 12,
    difficulty: 'Intermediate',
    keyConcepts: [
      "Bayes' Theorem: P(A|B) = [P(B|A) * P(A)] / P(B)",
      'Prior probability vs Posterior probability',
      'Likelihood and Evidence (marginal probability)',
      'Law of Total Probability expansion',
      'Base rate fallacy intuition and frequency trees',
    ],
    contentSummary: `### Bayes' Theorem & Conditional Probabilities

Conditional probability $P(A \\mid B)$ represents the revised probability of event $A$ given that event $B$ has occurred:
$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$$

#### 1. Bayes' Theorem Formula
$$P(\\text{Hypothesis} \\mid \\text{Evidence}) = \\frac{P(\\text{Evidence} \\mid \\text{Hypothesis}) \\times P(\\text{Hypothesis})}{P(\\text{Evidence})}$$
- **Prior $P(H)$**: Initial belief before seeing new evidence.
- **Likelihood $P(E \\mid H)$**: Probability of observing the evidence if hypothesis is true.
- **Evidence $P(E)$**: Total probability of the evidence across all scenarios (using Law of Total Probability).
- **Posterior $P(H \\mid E)$**: Updated belief after observing the evidence.

#### 2. The Base Rate Fallacy
When an event has very low prevalence (e.g. 0.1% rare illness), even a test with 99% Sensitivity and 99% Specificity will produce **more false positives than true positives** because the healthy population is orders of magnitude larger.
Always compute:
$$P(E) = P(E \\mid H)P(H) + P(E \\mid \\neg H)P(\\neg H)$$`,
  },
  {
    id: 'res_cond_prob_doc',
    skillId: 'skill_cond_prob',
    skillName: 'Conditional Probability',
    title: "3Blue1Brown: Visualizing Bayes' Rule and Conditional Updates",
    type: 'documentation',
    description: 'An elegant geometric explanation of Bayesian updates using probability spaces, areas, and frequency trees.',
    url: 'https://www.3blue1brown.com/lessons/bayes-theorem',
    readTimeMinutes: 15,
    difficulty: 'Intermediate',
    keyConcepts: [
      'Visualizing probability as 2D area slices',
      'Reweighting hypotheses via evidence likelihood',
      'Odds ratio formulation of Bayes rule',
      'Intuitive explanation of false positive paradoxes',
    ],
    contentSummary: 'Grant Sanderson (3Blue1Brown) breaks down Bayes theorem with animations that illustrate sample spaces as areas, showing how new observations reshape prior probability slices.',
  },
  {
    id: 'res_cond_prob_practice',
    skillId: 'skill_cond_prob',
    skillName: 'Conditional Probability',
    title: 'Hands-on Practice: Medical Diagnostic Test Posterior Calculation',
    type: 'practice',
    description: 'Calculate the true posterior probability of disease given a positive lab test result.',
    difficulty: 'Advanced',
    keyConcepts: ["Bayes' Theorem", 'Sensitivity (True Positive Rate)', 'Specificity (True Negative Rate)', 'Base Rate'],
    practiceExercise: {
      prompt: `A rare genetic condition affects 1 in 1,000 individuals in the general population (Prevalence = 0.001).
A diagnostic test has:
- Sensitivity (True Positive Rate): 98% (P(Pos | Disease) = 0.98)
- False Positive Rate: 2% (P(Pos | No Disease) = 0.02)

A randomly selected individual tests positive. What is the exact probability that this individual actually has the genetic condition?`,
      hint: "Expand the denominator using the Law of Total Probability: P(Pos) = P(Pos | Disease)*P(Disease) + P(Pos | No Disease)*P(No Disease).",
      solution: `Step 1: Identify Given Probabilities
P(Disease) = 0.001
P(No Disease) = 1 - 0.001 = 0.999
P(Pos | Disease) = 0.98
P(Pos | No Disease) = 0.02

Step 2: Calculate Marginal Evidence P(Pos)
P(Pos) = [P(Pos | Disease) * P(Disease)] + [P(Pos | No Disease) * P(No Disease)]
P(Pos) = [0.98 * 0.001] + [0.02 * 0.999]
P(Pos) = 0.00098 + 0.01998 = 0.02096

Step 3: Apply Bayes' Theorem
P(Disease | Pos) = [P(Pos | Disease) * P(Disease)] / P(Pos)
P(Disease | Pos) = 0.00098 / 0.02096 ≈ 0.04675 (4.68%)

Conclusion:
Even though the test is 98% sensitive and only has a 2% false positive rate, because the disease is rare, a person with a positive result has only ~4.7% chance of truly having the condition. False positives (~20 in 1000) vastly outnumber true positives (~1 in 1000).`,
      solutionExplanation: 'This classic example demonstrates why confirmatory secondary testing is mandatory in clinical and fraud detection pipelines before taking irreversible action.',
    },
  },

  // -------------------------------------------------------------
  // 4. PROBABILITY DISTRIBUTIONS (skill_prob_dist)
  // -------------------------------------------------------------
  {
    id: 'res_dist_guide',
    skillId: 'skill_prob_dist',
    skillName: 'Probability Distributions',
    title: 'Probability Distributions: Continuous vs Discrete, Normal, Poisson, and Binomial',
    type: 'guide',
    description: 'Understand the mathematical distinction between PDF and PMF, the Empirical 68-95-99.7 rule, and how to choose the right statistical distribution for your data.',
    readTimeMinutes: 10,
    difficulty: 'Intermediate',
    keyConcepts: [
      'Discrete PMF vs Continuous PDF properties',
      'Exact point probability P(X=c) = 0 for continuous random variables',
      'Normal Distribution (Gaussian) parameters mu and sigma',
      'Empirical Rule: 68% in 1 sigma, 95% in 2 sigma, 99.7% in 3 sigma',
      'Poisson distribution for event counts over fixed intervals',
    ],
    contentSummary: `### Understanding Distributions

A probability distribution assigns likelihoods to different outcomes of a random variable $X$.

#### 1. Discrete vs Continuous
- **Discrete (PMF)**: Probability Mass Function $P(X = x)$. Values sum to 1: $\\sum P(x) = 1$. Examples: Binomial, Poisson, Geometric.
- **Continuous (PDF)**: Probability Density Function $f(x)$. Area under curve integrates to 1: $\\int_{-\\infty}^{\\infty} f(x)dx = 1$.
  - **Crucial Rule**: For continuous distributions, the probability of obtaining an exact single real number is **zero**: $P(X = c) = 0$. Probabilities exist only over intervals: $P(a \\le X \\le b) = \\int_a^b f(x)dx$.

#### 2. Normal (Gaussian) Distribution
$$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2}$$
- **The Empirical Rule (68-95-99.7)**:
  - $\\mu \\pm 1\\sigma$: ~68.26% of all data
  - $\\mu \\pm 2\\sigma$: ~95.44% of all data
  - $\\mu \\pm 3\\sigma$: ~99.73% of all data

#### 3. Poisson Distribution
Models the number of independent events occurring in a fixed interval with known constant mean rate $\\lambda$:
$$P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$`,
  },
  {
    id: 'res_dist_doc',
    skillId: 'skill_prob_dist',
    skillName: 'Probability Distributions',
    title: 'SciPy Stats Reference: Continuous and Discrete Statistical Distributions',
    type: 'documentation',
    description: 'Official API documentation for SciPy probability distributions, including CDF, PDF, PMF, PPF, and parameter estimation.',
    url: 'https://docs.scipy.org/doc/scipy/reference/stats.html',
    readTimeMinutes: 14,
    difficulty: 'Intermediate',
    keyConcepts: [
      'scipy.stats.norm (Gaussian distribution methods)',
      'scipy.stats.poisson (Discrete arrival rate model)',
      'scipy.stats.binom (Binomial trial sequences)',
      'Quantile/Percent-Point Function (PPF) calculation',
    ],
    contentSummary: 'The SciPy stats library is the scientific standard in Python for working with statistical distributions. It provides standardized methods: .rvs() for random sampling, .pdf()/.pmf() for density, .cdf() for cumulative probability, and .fit() for maximum likelihood parameter estimation.',
  },
  {
    id: 'res_dist_practice',
    skillId: 'skill_prob_dist',
    skillName: 'Probability Distributions',
    title: 'Hands-on Practice: Server Traffic Poisson Rate & Normal Z-Scores',
    type: 'practice',
    description: 'Calculate request probabilities using Poisson mass function and compute Gaussian standardized z-scores.',
    difficulty: 'Intermediate',
    keyConcepts: ['Poisson PMF calculation', 'Z-score standardization z = (x - mu) / sigma'],
    practiceExercise: {
      prompt: `Problem 1 (Poisson Server Influx):
An API gateway experiences an average rate of 3 incoming server errors per hour (lambda = 3).
What is the exact probability of observing exactly 0 errors in a given 1-hour period?

Problem 2 (Gaussian Z-score):
Customer checkout durations are normally distributed with mean mu = 120 seconds and standard deviation sigma = 20 seconds.
What is the z-score of a checkout taking 160 seconds, and what percentage of checkouts take less than this duration according to the Empirical Rule?`,
      hint: 'For Problem 1, use P(X=0) = (lambda^0 * e^-lambda) / 0!. For Problem 2, z = (x - mu) / sigma, and recall that mu + 2*sigma leaves only ~2.3% in the upper tail.',
      solution: `Problem 1:
Given lambda = 3, k = 0:
P(X = 0) = (3^0 * e^-3) / 0!
Since 3^0 = 1 and 0! = 1:
P(X = 0) = e^-3 ≈ 0.04979 (approx 4.98%).

Problem 2:
Z-score:
z = (160 - 120) / 20 = 40 / 20 = +2.0.
A z-score of +2.0 is exactly two standard deviations above the mean.
By the Empirical Rule, the interval [mu - 2*sigma, mu + 2*sigma] contains ~95.44% of the distribution.
The remaining 4.56% is split equally between the two tails (2.28% in each tail).
Percentage of checkouts taking LESS than 160s = 100% - 2.28% ≈ 97.72%.`,
      solutionExplanation: 'Understanding how Poisson models discrete arrivals and Gaussian distributions standardize real-world latencies allows engineers to design robust SLA monitors and capacity thresholds.',
    },
  },

  // -------------------------------------------------------------
  // 5. STATISTICS (skill_stats)
  // -------------------------------------------------------------
  {
    id: 'res_stats_guide',
    skillId: 'skill_stats',
    skillName: 'Statistics',
    title: 'Inferential Statistics: Central Limit Theorem, Hypothesis Testing & P-Values',
    type: 'guide',
    description: 'A deep conceptual breakdown of why the Central Limit Theorem works, how to formulate null and alternative hypotheses, and the precise definition of p-values.',
    readTimeMinutes: 11,
    difficulty: 'Intermediate',
    keyConcepts: [
      'Central Limit Theorem (CLT): Sample means approximate Normal for n >= 30',
      'Null hypothesis H0 vs Alternative hypothesis H1',
      'Precise definition of p-value (NOT the probability H0 is true)',
      'Type I error (False Positive, alpha) vs Type II error (False Negative, beta)',
      'Confidence interval interpretation: Long-run coverage percentage',
    ],
    contentSummary: `### Statistical Inference & Scientific Testing

Inferential statistics allows us to deduce properties of an underlying population from sample observations.

#### 1. Central Limit Theorem (CLT)
Given independent identically distributed (i.i.d.) random variables with mean $\\mu$ and finite variance $\\sigma^2$, as the sample size $n$ increases ($n \\ge 30$), the distribution of the sample mean $\\bar{X}$ converges to a Normal distribution:
$$\\bar{X} \\sim \\mathcal{N}\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$
The standard deviation of the sample mean is the **Standard Error (SE)**: $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$.

#### 2. What a P-Value IS and IS NOT
- **Formal Definition**: The probability of observing test statistics at least as extreme as the sample data, **assuming the null hypothesis $H_0$ is strictly true**.
- **Common Misconceptions**:
  - A p-value is **NOT** the probability that the null hypothesis is true ($P(H_0 \\mid \\text{Data})$).
  - A p-value is **NOT** the probability that the alternative hypothesis is false.
  - A p-value does **NOT** measure the magnitude of the practical effect (effect size).

#### 3. Error Types in Hypothesis Testing
- **Type I Error ($\\alpha$)**: Rejecting $H_0$ when $H_0$ is true (False Alarm).
- **Type II Error ($\\beta$)**: Failing to reject $H_0$ when $H_0$ is false (Missed Detection).
- **Statistical Power ($1 - \\beta$)**: Probability of correctly rejecting a false null hypothesis.`,
  },
  {
    id: 'res_stats_doc',
    skillId: 'skill_stats',
    skillName: 'Statistics',
    title: 'NIST/SEMATECH e-Handbook of Statistical Methods',
    type: 'documentation',
    description: 'The National Institute of Standards and Technology comprehensive reference on hypothesis testing, t-tests, ANOVA, and distribution modeling.',
    url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm',
    readTimeMinutes: 16,
    difficulty: 'Advanced',
    keyConcepts: [
      'Two-sample Student t-test vs Welch t-test',
      'Degrees of freedom and t-distribution critical values',
      'Assumptions of normality and homoscedasticity',
      'One-way ANOVA and F-tests',
    ],
    contentSummary: 'The NIST e-Handbook provides rigorous engineering guidance for statistical analysis. It outlines how to structure two-sample t-tests, verify normality assumptions with Q-Q plots, and determine statistical sample sizes.',
  },
  {
    id: 'res_stats_practice',
    skillId: 'skill_stats',
    skillName: 'Statistics',
    title: 'Hands-on Practice: A/B Test P-Value and Confidence Interval Analysis',
    type: 'practice',
    description: 'Evaluate an A/B experiment result, check significance against alpha, and interpret confidence interval bounds.',
    difficulty: 'Intermediate',
    keyConcepts: ['Null hypothesis testing', 'alpha significance threshold', 'Confidence interval coverage'],
    practiceExercise: {
      prompt: `A software team runs an A/B test on checkout page redesign with significance level alpha = 0.05.
The test results are:
- Sample size: n = 10,000 per variation
- P-value observed: p = 0.024
- 95% Confidence Interval for conversion lift: [+0.3%, +2.1%]

Question 1:
Do you reject or fail to reject the null hypothesis H0 (that the redesign has zero effect)?

Question 2:
True or False: "There is a 95% probability that the true population conversion lift lies between +0.3% and +2.1%." Explain why or why not.`,
      hint: 'Compare the p-value with alpha. For Question 2, think about whether the true population parameter is fixed or random in frequentist statistics.',
      solution: `Question 1:
We REJECT the null hypothesis H0.
Because the observed p-value (0.024) is strictly less than the predetermined significance threshold alpha (0.05), we conclude there is statistically significant evidence of a conversion rate difference. Furthermore, the 95% confidence interval [+0.3%, +2.1%] does not contain zero.

Question 2:
FALSE (in frequentist statistics).
The true population parameter is a fixed (unknown) constant, not a random variable with a probability distribution.
The correct interpretation is:
"If we repeated this experiment 100 times and calculated a 95% confidence interval each time, approximately 95 of those computed intervals would capture the true fixed population parameter." The specific realized interval [+0.3%, +2.1%] either contains the true value or it doesn't.`,
      solutionExplanation: 'Distinguishing between frequentist parameter constancy and Bayesian credible intervals is a cornerstone of rigorous statistical analysis.',
    },
  },

  // -------------------------------------------------------------
  // 6. LINEAR ALGEBRA (skill_linalg)
  // -------------------------------------------------------------
  {
    id: 'res_linalg_guide',
    skillId: 'skill_linalg',
    skillName: 'Linear Algebra',
    title: 'Linear Algebra for Machine Learning: Dot Products, Eigenvalues & SVD',
    type: 'guide',
    description: 'A visual and mathematical guide to linear transformations, matrix rank, eigenvectors, eigenvalues, and dimensionality reduction.',
    readTimeMinutes: 14,
    difficulty: 'Intermediate',
    keyConcepts: [
      'Dot product as projection and cosine similarity: u . v = ||u|| ||v|| cos(theta)',
      'Matrix multiplication as composition of linear transformations',
      'Rank of a matrix: Number of linearly independent row/column vectors',
      'Eigenvector and Eigenvalue equation: A * v = lambda * v',
      'Singular Value Decomposition (SVD): A = U * Sigma * V^T',
    ],
    contentSummary: `### Linear Algebra & Geometric Transformations

Linear algebra provides the mathematical language for multi-dimensional data representations and transformations.

#### 1. Dot Product & Orthogonality
The dot product between two vectors $\\mathbf{u}$ and $\\mathbf{v} \\in \\mathbb{R}^n$:
$$\\mathbf{u} \\cdot \\mathbf{v} = \\sum_{i=1}^n u_i v_i = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos(\\theta)$$
- If $\\mathbf{u} \\cdot \\mathbf{v} = 0$, the vectors are **orthogonal** (perpendicular, $\\theta = 90^\\circ$).
- Normalized dot product equals **Cosine Similarity**: $\\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}$.

#### 2. Matrix Rank & Invertibility
- The **Rank** of matrix $A$ is the dimension of the vector space spanned by its columns (maximum number of linearly independent column vectors).
- An $n \\times n$ square matrix is **invertible** if and only if $\\text{Rank}(A) = n$ (Full Rank, $\\det(A) \\ne 0$).

#### 3. Eigenvalues & Eigenvectors
For an $n \\times n$ square matrix $A$, a non-zero vector $\\mathbf{v}$ is an **eigenvector** if transformation by $A$ only scales $\\mathbf{v}$ by factor $\\lambda$ (the **eigenvalue**):
$$A\\mathbf{v} = \\lambda \\mathbf{v} \\iff (A - \\lambda I)\\mathbf{v} = \\mathbf{0}$$
The directions of eigenvectors remain invariant under transformation $A$. This forms the mathematical basis for **Principal Component Analysis (PCA)**.`,
  },
  {
    id: 'res_linalg_doc',
    skillId: 'skill_linalg',
    skillName: 'Linear Algebra',
    title: 'MIT OpenCourseWare 18.06: Linear Algebra by Gilbert Strang',
    type: 'documentation',
    description: 'The premier open courseware collection for linear algebra, featuring matrix factorization, null spaces, Gram-Schmidt orthogonalization, and positive definite matrices.',
    url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    readTimeMinutes: 20,
    difficulty: 'Intermediate',
    keyConcepts: [
      'The Four Fundamental Subspaces of a matrix',
      'LU and QR matrix decomposition algorithms',
      'Spectral theorem and symmetric matrix diagonalization',
      'Pseudoinverse (Moore-Penrose) for least squares regression',
    ],
    contentSummary: 'Gilbert Strang MIT 18.06 course notes provide visual, geometric, and computational foundations for matrix spaces, column spaces, row spaces, projections, and eigenvalues.',
  },
  {
    id: 'res_linalg_practice',
    skillId: 'skill_linalg',
    skillName: 'Linear Algebra',
    title: 'Hands-on Practice: Matrix Eigenvalues & Linear Independence',
    type: 'practice',
    description: 'Compute eigenvalues of a 2x2 matrix using the characteristic polynomial and evaluate matrix rank.',
    difficulty: 'Intermediate',
    keyConcepts: ['Characteristic equation det(A - lambda*I) = 0', 'Matrix rank and linear dependence'],
    practiceExercise: {
      prompt: `Problem 1:
Find the eigenvalues of the matrix A:
A = [
  [4, 1],
  [2, 3]
]

Problem 2:
Given three vectors in R^3:
v1 = [1, 2, 0]
v2 = [2, 4, 0]
v3 = [0, 0, 5]
What is the rank of the matrix formed by these three vectors as columns? Are they linearly independent?`,
      hint: 'For Problem 1, solve det(A - lambda*I) = (4 - lambda)*(3 - lambda) - (1)*(2) = 0. For Problem 2, inspect whether v2 is a scalar multiple of v1.',
      solution: `Problem 1 (Eigenvalues):
Characteristic equation:
det(A - lambda * I) = 0
det([
  [4 - lambda, 1],
  [2, 3 - lambda]
]) = 0
(4 - lambda)(3 - lambda) - (1 * 2) = 0
12 - 4*lambda - 3*lambda + lambda^2 - 2 = 0
lambda^2 - 7*lambda + 10 = 0

Factoring:
(lambda - 5)(lambda - 2) = 0
Eigenvalues are lambda_1 = 5 and lambda_2 = 2.

Problem 2 (Rank & Independence):
Notice that v2 = 2 * v1 (v2 is a direct scalar multiple of v1).
Therefore, {v1, v2} are linearly dependent.
Vector v3 = [0, 0, 5] has a non-zero entry in the third component, which cannot be formed by any combination of v1 and v2 (since both have 0 in the third component).
The maximal number of linearly independent vectors is 2 (e.g. {v1, v3}).
Rank = 2.
The three vectors are NOT linearly independent.`,
      solutionExplanation: 'Calculating the characteristic polynomial and identifying linear dependency between columns is foundational for understanding dimensionality reduction algorithms like PCA and SVD.',
    },
  },

  // -------------------------------------------------------------
  // 7. MODEL EVALUATION (skill_model_eval)
  // -------------------------------------------------------------
  {
    id: 'res_eval_guide',
    skillId: 'skill_model_eval',
    skillName: 'Model Evaluation',
    title: 'Model Evaluation: Confusion Matrices, Precision, Recall, F1 & ROC-AUC',
    type: 'guide',
    description: 'Learn how to choose the right performance metric for classification and regression models, avoiding the deceptive trap of raw accuracy on imbalanced data.',
    readTimeMinutes: 10,
    difficulty: 'Intermediate',
    keyConcepts: [
      'Confusion Matrix components: TP, FP, TN, FN',
      'Precision = TP / (TP + FP) vs Recall (Sensitivity) = TP / (TP + FN)',
      'F1-score as harmonic mean: 2 * (P * R) / (P + R)',
      'ROC curve (TPR vs FPR) and threshold-invariant ROC-AUC metric',
      'Stratified K-Fold cross validation for imbalanced datasets',
    ],
    contentSummary: `### Diagnostic Metrics for Machine Learning

Standard overall accuracy is often misleading: in an imbalanced fraud dataset where 99.5% of transactions are legitimate, a model predicting "Never Fraud" achieves 99.5% accuracy while failing 100% of fraud detections!

#### 1. Confusion Matrix Breakdown
- **True Positive (TP)**: Correctly predicted positive cases.
- **False Positive (FP)**: Type I error (e.g. flagging a benign email as spam).
- **False Negative (FN)**: Type II error (e.g. missing a patient with disease).
- **True Negative (TN)**: Correctly predicted negative cases.

#### 2. Precision vs Recall Tradeoff
- **Precision**: Quality of positive predictions. "When the model flags an item, how often is it right?"
  $$\\text{Precision} = \\frac{TP}{TP + FP}$$
  *Prioritize Precision when False Positives are costly* (e.g. spam filters where auto-deleting important email is unacceptable).
- **Recall (Sensitivity)**: Coverage of actual positives. "Out of all actual positive items, how many did we catch?"
  $$\\text{Recall} = \\frac{TP}{TP + FN}$$
  *Prioritize Recall when False Negatives are dangerous* (e.g. cancer screening, fraud detection, security breaches).

#### 3. F1-Score & ROC-AUC
- **F1-Score**: Harmonic mean balancing Precision and Recall:
  $$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$
- **ROC-AUC**: Area Under the Receiver Operating Characteristic curve. Measures ranking quality across *all* possible decision thresholds. Value ranges from 0.5 (random guess) to 1.0 (perfect ranking).`,
  },
  {
    id: 'res_eval_doc',
    skillId: 'skill_model_eval',
    skillName: 'Model Evaluation',
    title: 'Scikit-Learn Comprehensive Model Evaluation & Metric Reference',
    type: 'documentation',
    description: 'The official Python reference documentation for scikit-learn metrics, classification reports, ROC curves, and cross-validation strategies.',
    url: 'https://scikit-learn.org/stable/modules/model_evaluation.html',
    readTimeMinutes: 15,
    difficulty: 'Intermediate',
    keyConcepts: [
      'sklearn.metrics.classification_report output interpretation',
      'sklearn.metrics.roc_auc_score and precision_recall_curve',
      'StratifiedKFold and cross_val_score splitting',
      'Log-loss and Brier score calibration metrics',
    ],
    contentSummary: 'The scikit-learn model evaluation guide provides mathematical formulas, code recipes, and best practices for classification, regression, and clustering evaluation across imbalanced scenarios.',
  },
  {
    id: 'res_eval_practice',
    skillId: 'skill_model_eval',
    skillName: 'Model Evaluation',
    title: 'Hands-on Practice: Confusion Matrix Metric Calculation Challenge',
    type: 'practice',
    description: 'Compute Precision, Recall, and F1-score from a raw confusion matrix and select the optimal metric for an imbalanced scenario.',
    difficulty: 'Intermediate',
    keyConcepts: ['Precision calculation', 'Recall calculation', 'F1-score harmonic mean'],
    practiceExercise: {
      prompt: `A machine learning model evaluated on a test set of 200 samples produces the following confusion matrix:
- True Positives (TP) = 50
- False Positives (FP) = 10
- False Negatives (FN) = 20
- True Negatives (TN) = 120

Question 1:
Calculate the exact Precision and Recall of this model.

Question 2:
Calculate the F1-score.

Question 3:
If this model was deployed to detect critical structural airplane defects, which error (FP or FN) is more dangerous, and what metric must be prioritized?`,
      hint: 'Precision = TP / (TP + FP); Recall = TP / (TP + FN); F1 = 2 * (P * R) / (P + R).',
      solution: `Question 1:
Precision = TP / (TP + FP) = 50 / (50 + 10) = 50 / 60 ≈ 0.8333 (83.33%).
Recall = TP / (TP + FN) = 50 / (50 + 20) = 50 / 70 ≈ 0.7143 (71.43%).

Question 2 (F1-score):
F1 = 2 * (Precision * Recall) / (Precision + Recall)
F1 = 2 * (0.8333 * 0.7143) / (0.8333 + 0.7143)
F1 = 2 * 0.5952 / 1.5476 ≈ 1.1904 / 1.5476 ≈ 0.7692 (76.92%).

Question 3:
For airplane structural defects, a False Negative (FN) means an actual cracked part is marked safe, risking catastrophic flight failure. A False Positive (FP) merely causes an extra precautionary inspection. Therefore, False Negatives are far more dangerous, and RECALL (Sensitivity) must be prioritized.`,
      solutionExplanation: 'Connecting numerical confusion matrix metrics to real-world domain costs ensures practitioners choose appropriate decision thresholds rather than blindly relying on 0.5 probability cutoffs.',
    },
  },

  // -------------------------------------------------------------
  // 8. MACHINE LEARNING (skill_ml)
  // -------------------------------------------------------------
  {
    id: 'res_ml_guide',
    skillId: 'skill_ml',
    skillName: 'Machine Learning',
    title: 'Machine Learning Algorithms: Loss Functions, Gradient Descent & Regularization',
    type: 'guide',
    description: 'Master the core algorithms of machine learning: how models minimize empirical loss via gradient descent, balance the bias-variance tradeoff, and prevent overfitting via L1 and L2 penalties.',
    readTimeMinutes: 15,
    difficulty: 'Advanced',
    keyConcepts: [
      'Empirical Risk Minimization and loss functions (MSE, Cross-Entropy)',
      'Gradient Descent parameter update rule: theta <- theta - alpha * grad(L)',
      'Learning rate schedules and momentum optimization',
      'The Bias-Variance Tradeoff: Underfitting vs Overfitting',
      'L1 Regularization (Lasso, sparsity) vs L2 Regularization (Ridge, weight decay)',
    ],
    contentSummary: `### Principles of Machine Learning Algorithms

Machine learning models approximate an unknown mapping function $f: X \\to Y$ by minimizing an empirical loss over training data.

#### 1. Loss Functions
- **Mean Squared Error (MSE)** (Regression):
  $$L(\\theta) = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$$
- **Binary Cross-Entropy (Log-Loss)** (Classification):
  $$L(\\theta) = -\\frac{1}{n} \\sum_{i=1}^n [y_i \\log(\\hat{y}_i) + (1 - y_i) \\log(1 - \\hat{y}_i)]$$

#### 2. Gradient Descent Optimization
Iterative parameter update step along the steepest negative gradient of the loss surface:
$$\\theta^{(t+1)} = \\theta^{(t)} - \\alpha \\nabla_\\theta L(\\theta^{(t)})$$
- **$\\alpha$ (Learning Rate)**:
  - Too large $\\alpha$: Oscillates or diverges.
  - Too small $\\alpha$: Slow convergence or traps in local minima / saddle points.

#### 3. Bias-Variance Decomposition
$$\\text{Expected Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$
- **High Bias (Underfitting)**: Model is too simplistic (e.g. linear model for polynomial data). Fails on both train and test sets.
- **High Variance (Overfitting)**: Model memorizes noise in training data. Excellent training performance, poor test generalization.

#### 4. Regularization (L1 vs L2)
- **L1 Regularization (Lasso)**: Adds penalty $\\lambda \\sum |\\theta_i|$. Drives less important weights strictly to **zero**, inducing **sparsity** for automated feature selection.
- **L2 Regularization (Ridge)**: Adds penalty $\\lambda \\sum \\theta_i^2$. Penalizes large weights smoothly, keeping all weights small but non-zero.`,
  },
  {
    id: 'res_ml_doc',
    skillId: 'skill_ml',
    skillName: 'Machine Learning',
    title: 'Stanford CS229: Machine Learning Course Notes (Prof. Andrew Ng)',
    type: 'documentation',
    description: 'Renowned lecture notes and cheatsheets covering supervised learning, gradient descent, SVMs, regularization, and learning theory from Stanford University.',
    url: 'https://cs229.stanford.edu/',
    readTimeMinutes: 20,
    difficulty: 'Advanced',
    keyConcepts: [
      'Supervised vs unsupervised learning paradigms',
      'Maximum Likelihood Estimation (MLE) derivation',
      'Logistic regression sigmoid activation and cross-entropy derivation',
      'Kernel methods and Support Vector Machines',
    ],
    contentSummary: 'The Stanford CS229 course materials provide complete mathematical derivations for linear regression, logistic regression, gradient descent updates, and statistical learning theory.',
  },
  {
    id: 'res_ml_practice',
    skillId: 'skill_ml',
    skillName: 'Machine Learning',
    title: 'Hands-on Practice: Gradient Descent Weight Update & Regularization Effect',
    type: 'practice',
    description: 'Execute a single-step gradient descent parameter update and explain why L1 produces sparse weights.',
    difficulty: 'Advanced',
    keyConcepts: ['Gradient update step theta = theta - alpha * grad', 'L1 diamond vs L2 circle constraint geometry'],
    practiceExercise: {
      prompt: `Problem 1 (Gradient Descent Step):
A linear regression weight currently has value w = 2.50.
For a mini-batch of data, the derivative of the Mean Squared Error loss with respect to w is:
dL/dw = 1.60.
If the learning rate is alpha = 0.05, what is the updated weight value w_new after one gradient descent step?

Problem 2 (L1 vs L2 Geometry):
Why does L1 regularization (Lasso) drive model weights to strictly zero, whereas L2 regularization (Ridge) only shrinks them near zero?`,
      hint: 'Problem 1: w_new = w - alpha * (dL/dw). Problem 2: Think about the geometric shape of the L1 diamond contour (points on axes) vs L2 spherical contour.',
      solution: `Problem 1 (Gradient Update):
Update formula:
w_new = w - alpha * (dL / dw)
w_new = 2.50 - (0.05 * 1.60)
w_new = 2.50 - 0.08 = 2.42.

Problem 2 (L1 vs L2 Regularization Geometry):
- The L1 penalty (|w_1| + |w_2| <= C) forms a diamond (rhombus) in weight space with sharp corners located directly on the coordinate axes where one or more weights are exactly zero. When the elliptical contours of the unconstrained loss touch this diamond constraint, the intersection is overwhelmingly likely to occur at one of these sharp corners, setting parameters strictly to 0.0.
- The L2 penalty (w_1^2 + w_2^2 <= C) forms a smooth hypersphere (circle in 2D). The loss contours touch the smooth circular surface tangentially, almost never at an exact coordinate axis, shrinking weights toward zero without setting them to absolute zero.`,
      solutionExplanation: 'Mastering gradient descent steps and regularization geometry allows ML engineers to build models that converge stably and generalize to unseen test distributions.',
    },
  },
];
