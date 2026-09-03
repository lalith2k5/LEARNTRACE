import json
import os

questions = [
    # Difficulty 1: Recall (q_stats_01 to q_stats_08)
    {
        "id": "q_stats_01",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the rigorous definition of a p-value in null hypothesis significance testing?",
        "options": [
            {"id": "opt_a", "text": "The probability of obtaining a test statistic at least as extreme as the observed value, assuming that the null hypothesis (H_0) is true"},
            {"id": "opt_b", "text": "The probability that the null hypothesis is true given the observed data"},
            {"id": "opt_c", "text": "The probability that the alternative hypothesis is false"},
            {"id": "opt_d", "text": "The probability that an experimental result was produced by pure error"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: A p-value is P(Data >= observed | H_0 is true), calculating tail extremity under the null condition.",
            "opt_b": "Misconception: Transposed conditional error: p-value is NOT P(H_0 | Data); that would be a Bayesian posterior.",
            "opt_c": "Misconception: Confuses p-value with error rates.",
            "opt_d": "Misconception: Colloquial misinterpretation."
        },
        "explanation": "A p-value measures evidence against H_0: it is P(T ≥ t_obs | H_0), the probability of observing data this extreme if the null hypothesis were true."
    },
    {
        "id": "q_stats_02",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is a Type I error in statistical hypothesis testing?",
        "options": [
            {"id": "opt_a", "text": "Rejecting the null hypothesis H_0 when it is actually true (False Positive)"},
            {"id": "opt_b", "text": "Failing to reject H_0 when H_0 is false (False Negative)"},
            {"id": "opt_c", "text": "Accepting the alternative hypothesis when it is true"},
            {"id": "opt_d", "text": "Calculating an incorrect sample mean"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Type I error rate alpha is the probability of a false alarm: rejecting a true null hypothesis.",
            "opt_b": "Misconception: This defines a Type II error (beta, false negative).",
            "opt_c": "Misconception: This is a correct rejection (Statistical Power: 1 - beta).",
            "opt_d": "Misconception: Computation bug, not statistical error category."
        },
        "explanation": "Type I error occurs when a test rejects a true null hypothesis (a false alarm). The probability of committing a Type I error is denoted by α."
    },
    {
        "id": "q_stats_03",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is a Type II error in statistical hypothesis testing?",
        "options": [
            {"id": "opt_a", "text": "Failing to reject the null hypothesis H_0 when the alternative hypothesis H_1 is true (False Negative)"},
            {"id": "opt_b", "text": "Rejecting the null hypothesis when H_0 is true (False Positive)"},
            {"id": "opt_c", "text": "Setting significance level alpha = 0.05"},
            {"id": "opt_d", "text": "Using a one-tailed test instead of a two-tailed test"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Type II error beta occurs when a real effect exists but the test fails to detect it.",
            "opt_b": "Misconception: This is a Type I error (alpha).",
            "opt_c": "Misconception: Significance threshold selection.",
            "opt_d": "Misconception: Test specification choice."
        },
        "explanation": "Type II error (β) occurs when a test fails to reject a false null hypothesis, missing a genuine effect or difference."
    },
    {
        "id": "q_stats_04",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob_dist"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the formula for the Standard Error of the Mean (SE) for a sample of size n with sample standard deviation s?",
        "options": [
            {"id": "opt_a", "text": "SE = s / sqrt(n)"},
            {"id": "opt_b", "text": "SE = s * sqrt(n)"},
            {"id": "opt_c", "text": "SE = s^2 / n"},
            {"id": "opt_d", "text": "SE = s / n"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Standard error scales inversely with the square root of sample size: SE = s / √n.",
            "opt_b": "Misconception: Multiplies instead of dividing, meaning error would grow with larger sample sizes.",
            "opt_c": "Misconception: This is the variance of the sample mean, not the standard error.",
            "opt_d": "Misconception: Divides by n rather than sqrt(n)."
        },
        "explanation": "The standard error reflects the dispersion of sample means around the true population mean: SE = s / √n."
    },
    {
        "id": "q_stats_05",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "Why is Bessel's correction (dividing by n - 1 instead of n) applied when calculating sample variance s^2 = sum(x_i - x_bar)^2 / (n - 1)?",
        "options": [
            {"id": "opt_a", "text": "To remove negative bias and make s^2 an unbiased estimator of population variance sigma^2 (E[s^2] = sigma^2)"},
            {"id": "opt_b", "text": "To account for missing values in survey data"},
            {"id": "opt_c", "text": "To guarantee that sample variance is always greater than 1"},
            {"id": "opt_d", "text": "Because one data point is always discarded as an outlier"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Because deviations are measured from the sample mean x_bar (which minimizes squared deviations) rather than true mu, dividing by n underestimates sigma^2 by (n-1)/n.",
            "opt_b": "Misconception: Irrelevant data imputation issue.",
            "opt_c": "Misconception: Variance can be less than 1.",
            "opt_d": "Misconception: All n observations are used; n - 1 represents degrees of freedom."
        },
        "explanation": "Using sample mean x̄ instead of true μ reduces variability by one degree of freedom. Dividing by n - 1 corrects for this downward bias: E[s²] = σ²."
    },
    {
        "id": "q_stats_06",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the Statistical Power of a hypothesis test?",
        "options": [
            {"id": "opt_a", "text": "1 - beta (the probability of correctly rejecting H_0 when H_1 is true)"},
            {"id": "opt_b", "text": "1 - alpha"},
            {"id": "opt_c", "text": "alpha / beta"},
            {"id": "opt_d", "text": "The sample size n"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Power is the true positive rate: 1 - Type II error rate (1 - beta).",
            "opt_b": "Misconception: 1 - alpha is the confidence level (True Negative rate).",
            "opt_c": "Misconception: Ratio of error probabilities.",
            "opt_d": "Misconception: Sample size affects power, but is not the definition of power."
        },
        "explanation": "Statistical power (1 - β) is the likelihood that a study will detect an effect when there truly is an effect to be detected."
    },
    {
        "id": "q_stats_07",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob_dist"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "In a two-tailed z-test at significance level alpha = 0.05, what are the standard critical values?",
        "options": [
            {"id": "opt_a", "text": "+/- 1.96"},
            {"id": "opt_b", "text": "+/- 1.645"},
            {"id": "opt_c", "text": "+/- 2.58"},
            {"id": "opt_d", "text": "+/- 3.00"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In standard normal distribution, 2.5% in each tail yields critical z-scores of +/- 1.96.",
            "opt_b": "Misconception: +/- 1.645 corresponds to a one-tailed 5% or two-tailed 10% test.",
            "opt_c": "Misconception: +/- 2.58 corresponds to a two-tailed 1% test (alpha = 0.01).",
            "opt_d": "Misconception: 3 standard deviations corresponds to alpha = 0.0027."
        },
        "explanation": "For a two-tailed test with α = 0.05, each tail contains α/2 = 0.025 of the area under the standard normal curve, giving z = ±1.96."
    },
    {
        "id": "q_stats_08",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the correct frequentist interpretation of a 95% Confidence Interval for a population mean mu?",
        "options": [
            {"id": "opt_a", "text": "Under repeated sampling under identical conditions, 95% of constructed confidence intervals will contain the fixed true population parameter mu"},
            {"id": "opt_b", "text": "There is a 95% probability that the true parameter mu lies inside this specific calculated interval [a, b]"},
            {"id": "opt_c", "text": "95% of the raw data values fall within the interval"},
            {"id": "opt_d", "text": "The null hypothesis has a 95% probability of being rejected"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In frequentist statistics, mu is a fixed constant; the interval bounds are random variables across repeated experiments.",
            "opt_b": "Misconception: Once calculated, the interval either contains mu or it doesn't (P = 0 or 1). Assigning probability to a fixed parameter is a Bayesian concept (credible interval).",
            "opt_c": "Misconception: Confuses confidence interval for the mean with a prediction interval for raw data.",
            "opt_d": "Misconception: Completely conflates confidence intervals with hypothesis rejection."
        },
        "explanation": "In frequentist statistics, the parameter μ is fixed and the interval bounds vary with each sample. '95% confidence' refers to the long-run coverage rate of the sampling procedure."
    },

    # Difficulty 2: Comprehension (q_stats_09 to q_stats_16)
    {
        "id": "q_stats_09",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the primary difference between practical significance (effect size) and statistical significance (p-value)?",
        "options": [
            {"id": "opt_a", "text": "A tiny, practically meaningless effect can achieve statistical significance (p < 0.05) simply by using a sufficiently massive sample size n; effect size quantifies magnitude regardless of sample size"},
            {"id": "opt_b", "text": "Statistical significance measures magnitude in dollars, while effect size is measured in seconds"},
            {"id": "opt_c", "text": "They always measure the exact same underlying quantity"},
            {"id": "opt_d", "text": "Statistical significance applies only to biology, while effect size is used in economics"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Test statistics scale with sqrt(n), so trivial differences become statistically significant with huge samples. Effect size (e.g. Cohen's d) measures real-world impact.",
            "opt_b": "Misconception: Fabricated arbitrary measurement units.",
            "opt_c": "Misconception: Ignores the critical distinction between p-value and magnitude.",
            "opt_d": "Misconception: Both concepts apply universally across all quantitative disciplines."
        },
        "explanation": "Because SE = s/√n, large samples detect trivial differences as statistically significant (p < 0.05). Effect size measures the substantive importance independent of sample size."
    },
    {
        "id": "q_stats_10",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob_dist"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "When should an independent two-sample t-test be used instead of a paired t-test?",
        "options": [
            {"id": "opt_a", "text": "When the observations in the two groups are collected from separate, independent subjects (e.g., Treatment Group vs Control Group)"},
            {"id": "opt_b", "text": "When the same subjects are measured before and after an intervention"},
            {"id": "opt_c", "text": "When matched pairs of identical twins are compared"},
            {"id": "opt_d", "text": "When comparing three or more groups simultaneously"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Independent t-test compares two distinct uncoupled cohorts. Paired t-test is for repeated measures on the same subjects.",
            "opt_b": "Misconception: Before-and-after repeated measures requires a paired t-test.",
            "opt_c": "Misconception: Matched pairs requires a paired t-test.",
            "opt_d": "Misconception: Comparing 3+ groups requires One-Way ANOVA, not a two-sample t-test."
        },
        "explanation": "Independent t-tests analyze two mutually exclusive groups. Paired t-tests analyze dependent observations (e.g., pre-test vs. post-test on the same individuals)."
    },
    {
        "id": "q_stats_11",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "In Analysis of Variance (ANOVA), what intuitive ratio does the F-statistic measure?",
        "options": [
            {"id": "opt_a", "text": "Between-group variance (treatment effect) divided by Within-group variance (random error)"},
            {"id": "opt_b", "text": "Within-group variance divided by Between-group variance"},
            {"id": "opt_c", "text": "Total sample size divided by number of groups"},
            {"id": "opt_d", "text": "Sample mean divided by population mean"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: F = MS_between / MS_within. If treatment differences exceed random background noise, F is significantly greater than 1.",
            "opt_b": "Misconception: Inverts the F-ratio.",
            "opt_c": "Misconception: Ratio of sample counts.",
            "opt_d": "Misconception: Ratio of means."
        },
        "explanation": "ANOVA's F-statistic compares variance between group means to variance within groups: F = MS_Between / MS_Within. High F indicates real differences between group means."
    },
    {
        "id": "q_stats_12",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is 'p-hacking' (data dredging / data snooping)?",
        "options": [
            {"id": "opt_a", "text": "Testing multiple hypotheses, subgroups, or stopping rules iteratively until an uncorrected p-value drops below 0.05, producing false positive discoveries"},
            {"id": "opt_b", "text": "Using a cybersecurity exploit to modify database query logs"},
            {"id": "opt_c", "text": "Computing p-values using an open-source Python library"},
            {"id": "opt_d", "text": "Setting significance level alpha to 0.01 instead of 0.05"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: P-hacking exploits multiple comparisons and researcher degrees of freedom to artificially manufacture statistically significant results.",
            "opt_b": "Misconception: Colloquial confusion with network security hacking.",
            "opt_c": "Misconception: Standard programming practice.",
            "opt_d": "Misconception: Lowering alpha reduces false positives, which is the opposite of p-hacking."
        },
        "explanation": "P-hacking occurs when researchers try various analyses until finding statistically significant results, massively inflating the Family-Wise Error Rate."
    },
    {
        "id": "q_stats_13",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why are non-parametric tests like the Mann-Whitney U test preferred over two-sample t-tests when data has severe outliers and heavy skewness?",
        "options": [
            {"id": "opt_a", "text": "Because they analyze the relative ranks of data values rather than raw values, making them robust to extreme outliers and independent of normality assumptions"},
            {"id": "opt_b", "text": "Because they never require more than 3 data points"},
            {"id": "opt_c", "text": "Because they always yield lower p-values than t-tests"},
            {"id": "opt_d", "text": "Because they calculate population parameters directly without error"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Rank-based tests replace raw magnitudes with rank order, eliminating the distorting influence of extreme outliers and distribution shape.",
            "opt_b": "Misconception: Small sample sizes have very low power in non-parametric tests.",
            "opt_c": "Misconception: When normality holds, t-tests are more powerful than rank tests.",
            "opt_d": "Misconception: Non-parametric tests are distribution-free, not parameter-certain."
        },
        "explanation": "Rank tests such as Mann-Whitney U convert values to ordinal ranks. This removes parametric distributional assumptions and protects against distortive outliers."
    },
    {
        "id": "q_stats_14",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What happens to the width of a Confidence Interval when the sample size n is quadrupled (multiplied by 4), holding confidence level constant?",
        "options": [
            {"id": "opt_a", "text": "The width is halved (reduced by a factor of 2)"},
            {"id": "opt_b", "text": "The width is cut to one fourth (reduced by a factor of 4)"},
            {"id": "opt_c", "text": "The width doubles"},
            {"id": "opt_d", "text": "The width remains unchanged"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Margin of error is proportional to 1 / sqrt(n). If n becomes 4n, 1 / sqrt(4n) = 1 / (2*sqrt(n)), halving the interval width.",
            "opt_b": "Misconception: Forgets the square root in standard error formula.",
            "opt_c": "Misconception: Increasing sample size narrows the interval, never widens it.",
            "opt_d": "Misconception: Sample size directly controls interval precision."
        },
        "explanation": "Because margin of error depends on SE = s / √n, multiplying n by 4 reduces the denominator by √4 = 2, halving the width of the confidence interval."
    },
    {
        "id": "q_stats_15",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does Cohen's d measure in the context of comparing two group means?",
        "options": [
            {"id": "opt_a", "text": "Standardized difference between two means expressed in pooled standard deviation units: (mu_1 - mu_2) / sigma_pooled"},
            {"id": "opt_b", "text": "The difference between p-value and significance level alpha"},
            {"id": "opt_c", "text": "The correlation coefficient between two variables squared"},
            {"id": "opt_d", "text": "The percentage of missing data in the control group"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Cohen's d standardizes mean differences: d = 0.2 (small), 0.5 (medium), 0.8 (large) effect.",
            "opt_b": "Misconception: Conflates effect size with p-value difference.",
            "opt_c": "Misconception: This describes R^2 (coefficient of determination).",
            "opt_d": "Misconception: Data quality metric."
        },
        "explanation": "Cohen's d is a standardized effect size measuring how many standard deviations separate two group means: d = (x̄_1 - x̄_2) / s_pooled."
    },
    {
        "id": "q_stats_16",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does a negative correlation coefficient r = -0.85 indicate about two continuous variables X and Y?",
        "options": [
            {"id": "opt_a", "text": "A strong linear inverse relationship: as X increases, Y tends to decrease"},
            {"id": "opt_b", "text": "A weak positive relationship"},
            {"id": "opt_c", "text": "An 85% probability that X causes Y"},
            {"id": "opt_d", "text": "That the data contains 85% negative values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Pearson r ranges from -1 to +1. -0.85 indicates a strong negative linear trend.",
            "opt_b": "Misconception: Fails to recognize negative sign and magnitude.",
            "opt_c": "Misconception: Correlation does not imply causation.",
            "opt_d": "Misconception: r is scale-invariant; data values can all be positive while correlation is negative."
        },
        "explanation": "Pearson's r = -0.85 indicates a strong inverse linear association: when one variable rises, the other predictably falls."
    },

    # Difficulty 3: Application (q_stats_17 to q_stats_24)
    {
        "id": "q_stats_17",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A sample of n = 100 students has mean test score x_bar = 73 with sample standard deviation s = 10. Test H_0: mu = 70 against H_1: mu > 70. What is the calculated test statistic z?",
        "options": [
            {"id": "opt_a", "text": "z = +3.0"},
            {"id": "opt_b", "text": "z = +0.3"},
            {"id": "opt_c", "text": "z = +30.0"},
            {"id": "opt_d", "text": "z = +1.96"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: SE = 10 / sqrt(100) = 1.0. z = (73 - 70) / 1.0 = +3.0.",
            "opt_b": "Misconception: Divides by 10 instead of SE = 1.0.",
            "opt_c": "Misconception: Multiplies by sqrt(n).",
            "opt_d": "Misconception: Cites the 5% critical threshold instead of calculated statistic."
        },
        "explanation": "SE = s / √n = 10 / √100 = 1.0. The test statistic is z = (x̄ - μ_0) / SE = (73 - 70) / 1.0 = +3.0."
    },
    {
        "id": "q_stats_18",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For a sample of n = 64 items with mean x_bar = 50 and standard deviation s = 16, what is the 95% confidence interval for population mean mu (using z = 2.0 for 95%)?",
        "options": [
            {"id": "opt_a", "text": "[46, 54]"},
            {"id": "opt_b", "text": "[48, 52]"},
            {"id": "opt_c", "text": "[34, 66]"},
            {"id": "opt_d", "text": "[49, 51]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: SE = 16 / sqrt(64) = 16 / 8 = 2. Margin of error = z * SE = 2 * 2 = 4. CI = 50 +/- 4 = [46, 54].",
            "opt_b": "Misconception: Uses margin of error = 1 * SE = 2 instead of z * SE = 4.",
            "opt_c": "Misconception: Uses standard deviation s = 16 directly without dividing by sqrt(n).",
            "opt_d": "Misconception: Divides margin of error by 4."
        },
        "explanation": "Standard Error SE = 16 / √64 = 2.0. Margin of error ME = 2.0 * 2.0 = 4.0. The 95% CI is 50 ± 4.0 = [46, 54]."
    },
    {
        "id": "q_stats_19",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If a researcher performs m = 20 independent hypothesis tests at family-wise significance level alpha = 0.05, what is the Bonferroni-corrected significance threshold for each individual test?",
        "options": [
            {"id": "opt_a", "text": "alpha_corrected = 0.05 / 20 = 0.0025"},
            {"id": "opt_b", "text": "alpha_corrected = 0.05 * 20 = 1.0"},
            {"id": "opt_c", "text": "alpha_corrected = 0.01"},
            {"id": "opt_d", "text": "alpha_corrected = 0.05 / sqrt(20) ≈ 0.011"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Bonferroni divides overall alpha by total number of comparisons: 0.05 / 20 = 0.0025.",
            "opt_b": "Misconception: Multiplies instead of dividing.",
            "opt_c": "Misconception: Arbitrary rounded guess.",
            "opt_d": "Misconception: Divides by sqrt(m) instead of m."
        },
        "explanation": "The Bonferroni correction controls Family-Wise Error Rate by testing each hypothesis at α_per_test = α_FWER / m = 0.05 / 20 = 0.0025."
    },
    {
        "id": "q_stats_20",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In a 3 x 4 contingency table analyzing categorical independence, how many degrees of freedom (df) does the Chi-Square test have?",
        "options": [
            {"id": "opt_a", "text": "df = (3 - 1) * (4 - 1) = 2 * 3 = 6"},
            {"id": "opt_b", "text": "df = 3 * 4 = 12"},
            {"id": "opt_c", "text": "df = (3 + 4) - 1 = 6"},
            {"id": "opt_d", "text": "df = (3 - 1) + (4 - 1) = 5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For r rows and c columns, df = (r - 1)(c - 1) = (3 - 1)(4 - 1) = 6.",
            "opt_b": "Misconception: Total number of cells r * c, omitting row/column marginal constraints.",
            "opt_c": "Misconception: Adds dimensions.",
            "opt_d": "Misconception: Sums degrees of freedom instead of multiplying."
        },
        "explanation": "Degrees of freedom for an r × c contingency table equals (r - 1) × (c - 1) = (3 - 1)(4 - 1) = 2 × 3 = 6."
    },
    {
        "id": "q_stats_21",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A Chi-Square test observed frequency is O = 30 and expected frequency under H_0 is E = 20. What is this single cell's contribution to the Chi-Square test statistic sum (O - E)^2 / E?",
        "options": [
            {"id": "opt_a", "text": "(30 - 20)^2 / 20 = 100 / 20 = 5.0"},
            {"id": "opt_b", "text": "(30 - 20) / 20 = 0.5"},
            {"id": "opt_c", "text": "(30 - 20)^2 / 30 = 3.33"},
            {"id": "opt_d", "text": "10.0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: (O - E)^2 / E = (30 - 20)^2 / 20 = 10^2 / 20 = 100 / 20 = 5.0.",
            "opt_b": "Misconception: Forgets to square the numerator.",
            "opt_c": "Misconception: Divides by observed O = 30 instead of expected E = 20.",
            "opt_d": "Misconception: Computes raw residual (O - E)."
        },
        "explanation": "Pearson's chi-square component is (O - E)² / E = (30 - 20)² / 20 = 100 / 20 = 5.0."
    },
    {
        "id": "q_stats_22",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In an A/B test with 1,000 visitors per variation:\n- Variant A conversions: 50 (5%)\n- Variant B conversions: 75 (7.5%)\nWhat is the Relative Lift in conversion rate of B over A?",
        "options": [
            {"id": "opt_a", "text": "+50% relative lift ((0.075 - 0.05) / 0.05)"},
            {"id": "opt_b", "text": "+2.5% absolute lift"},
            {"id": "opt_c", "text": "+75%"},
            {"id": "opt_d", "text": "+25%"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Relative lift = (Rate_B - Rate_A) / Rate_A = (0.075 - 0.050) / 0.050 = 0.025 / 0.050 = +50%.",
            "opt_b": "Misconception: 2.5% is the ABSOLUTE difference in percentage points, not relative lift.",
            "opt_c": "Misconception: Uses raw conversion count.",
            "opt_d": "Misconception: Fraction calculation error."
        },
        "explanation": "Relative lift measures proportional increase over baseline: (7.5% - 5.0%) / 5.0% = 2.5% / 5.0% = +50.0%."
    },
    {
        "id": "q_stats_23",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If a simple linear regression model produces an R^2 of 0.64, what percentage of the variance in dependent variable Y is explained by independent variable X?",
        "options": [
            {"id": "opt_a", "text": "64%"},
            {"id": "opt_b", "text": "80% (since r = sqrt(0.64) = 0.80)"},
            {"id": "opt_c", "text": "36%"},
            {"id": "opt_d", "text": "40.96% (0.64^2)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By definition, the coefficient of determination R^2 is the proportion of total sum of squares explained by the model: 0.64 = 64%.",
            "opt_b": "Misconception: 80% is the correlation coefficient r, not the explained variance.",
            "opt_c": "Misconception: 36% is the unexplained residual variance (1 - R^2).",
            "opt_d": "Misconception: Squares R^2 again."
        },
        "explanation": "R² directly represents the fraction of total variance in the dependent variable explained by the regression model: 0.64 = 64%."
    },
    {
        "id": "q_stats_24",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Two independent samples have sizes n_1 = 10, n_2 = 15. What are the degrees of freedom for an independent two-sample t-test assuming equal variances?",
        "options": [
            {"id": "opt_a", "text": "df = n_1 + n_2 - 2 = 10 + 15 - 2 = 23"},
            {"id": "opt_b", "text": "df = 10 + 15 - 1 = 24"},
            {"id": "opt_c", "text": "df = 10 * 15 = 150"},
            {"id": "opt_d", "text": "df = min(10, 15) - 1 = 9"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Pooled two-sample t-test degrees of freedom = (n_1 - 1) + (n_2 - 1) = n_1 + n_2 - 2 = 23.",
            "opt_b": "Misconception: Only subtracts 1 degree of freedom instead of 2 (one for each group mean).",
            "opt_c": "Misconception: Multiplies sample sizes.",
            "opt_d": "Misconception: Conservative Welch approximation lower bound."
        },
        "explanation": "Because two parameters (the two group means) are estimated from the pooled data, df = (n_1 - 1) + (n_2 - 1) = 10 + 15 - 2 = 23."
    },

    # Difficulty 4: Analysis (q_stats_25 to q_stats_32)
    {
        "id": "q_stats_25",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does the Benjamini-Hochberg (FDR) procedure differ fundamentally from the Bonferroni correction in high-dimensional hypothesis testing (e.g. genomics, A/B testing)?",
        "options": [
            {"id": "opt_a", "text": "Bonferroni controls the Family-Wise Error Rate (prob of ANY false positive), making it overly conservative for large m; Benjamini-Hochberg controls the expected proportion of false discoveries among rejected tests (FDR), yielding higher power"},
            {"id": "opt_b", "text": "Benjamini-Hochberg is strictly more conservative than Bonferroni"},
            {"id": "opt_c", "text": "Bonferroni requires all tests to be normally distributed while Benjamini-Hochberg does not"},
            {"id": "opt_d", "text": "Benjamini-Hochberg only applies to Bayesian models"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: FWER = P(V >= 1) is too strict when testing 10,000 genes; FDR = E[V / R] tolerates a controlled 5% false rate among discoveries.",
            "opt_b": "Misconception: Benjamini-Hochberg is less conservative and detects more true signals.",
            "opt_c": "Misconception: Both procedures operate directly on valid p-values regardless of distribution.",
            "opt_d": "Misconception: Benjamini-Hochberg is a standard frequentist procedure."
        },
        "explanation": "Bonferroni controls the probability of even a single false positive (FWER), severely crippling power when m is large. Benjamini-Hochberg controls False Discovery Rate (FDR = E[FP/Total_Discoveries]), offering greater discovery power."
    },
    {
        "id": "q_stats_26",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In Ordinary Least Squares (OLS) regression, what occurs when the Gauss-Markov assumption of Homoscedasticity (Var(epsilon | X) = sigma^2 * I) is violated (Heteroscedasticity)?",
        "options": [
            {"id": "opt_a", "text": "OLS coefficient estimates remain unbiased, but standard errors are biased, invalidating t-statistics, p-values, and confidence intervals (requiring White/Huber robust standard errors)"},
            {"id": "opt_b", "text": "OLS coefficient estimates become completely biased and inconsistent"},
            {"id": "opt_c", "text": "R^2 becomes greater than 1.0"},
            {"id": "opt_d", "text": "The regression line can no longer be computed"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Heteroscedasticity does not bias beta, but it ruins variance estimates (OLS is no longer BLUE). Heteroscedasticity-consistent (sandwich) standard errors must be used.",
            "opt_b": "Misconception: Unbiasedness of beta requires only E[epsilon|X]=0 (exogeneity); variance structure does not cause bias.",
            "opt_c": "Misconception: R^2 remains in [0, 1].",
            "opt_d": "Misconception: Normal equations (X^T X)^(-1) X^T Y still solve algebraically."
        },
        "explanation": "Under heteroscedasticity, OLS point estimates remain unbiased and consistent, but the standard errors are incorrect, making hypothesis tests unreliable. White's robust standard errors resolve this."
    },
    {
        "id": "q_stats_27",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the Variance Inflation Factor (VIF), and what threshold typically signals severe multicollinearity in multiple regression?",
        "options": [
            {"id": "opt_a", "text": "VIF = 1 / (1 - R_j^2); values exceeding 5 to 10 indicate severe multicollinearity inflating coefficient standard errors"},
            {"id": "opt_b", "text": "VIF = Var(Y) / Var(X); values exceeding 1.0 indicate collinearity"},
            {"id": "opt_c", "text": "VIF = R^2 * 100; values exceeding 50 indicate collinearity"},
            {"id": "opt_d", "text": "VIF = p-value / alpha; values below 0.05 indicate collinearity"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: VIF_j measures how much variance of beta_j is inflated due to linear correlation with other predictors; VIF > 5 or 10 is standard cutoff.",
            "opt_b": "Misconception: Ratio of marginal variances.",
            "opt_c": "Misconception: Percentage of R^2.",
            "opt_d": "Misconception: Ratio of significance thresholds."
        },
        "explanation": "VIF_j = 1 / (1 - R_j²), where R_j² is from regressing feature j on all other features. VIF > 5-10 indicates high multicollinearity, blowing up standard errors and making individual coefficients unstable."
    },
    {
        "id": "q_stats_28",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why is Welch's t-test recommended over Student's standard two-sample t-test as the default two-sample test in modern applied statistics?",
        "options": [
            {"id": "opt_a", "text": "Welch's t-test does not assume equal variances between the two groups, adjusting degrees of freedom via the Welch-Satterthwaite equation to robustly control Type I error"},
            {"id": "opt_b", "text": "Welch's t-test can handle non-numeric categorical data directly"},
            {"id": "opt_c", "text": "Welch's t-test completely eliminates the requirement for random sampling"},
            {"id": "opt_d", "text": "Student's t-test has been deprecated due to mathematical flaws in its derivation"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Equal-variance t-test severely inflates Type I error when variances and sample sizes are unequal. Welch's test performs nearly identically when variances are equal and maintains nominal alpha when unequal.",
            "opt_b": "Misconception: Both tests evaluate numeric sample means.",
            "opt_c": "Misconception: Random sampling is required by all inferential tests.",
            "opt_d": "Misconception: Student's t-test is mathematically valid under exact homoscedasticity."
        },
        "explanation": "Welch's t-test relaxes the homoscedasticity assumption. It protects against severe Type I error inflation when group variances and sample sizes differ, with virtually no power loss when variances are equal."
    },
    {
        "id": "q_stats_29",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does Non-Parametric Bootstrap resampling construct a 95% Confidence Interval for an estimator theta_hat without making any parametric distributional assumptions?",
        "options": [
            {"id": "opt_a", "text": "Resample n observations with replacement from the original data B times (e.g. B=2000), compute theta_hat_b on each bootstrap sample, and take the 2.5th and 97.5th percentiles of the empirical distribution"},
            {"id": "opt_b", "text": "Resample n observations without replacement, which shuffles the data labels"},
            {"id": "opt_c", "text": "Add synthetic Gaussian noise to each data point"},
            {"id": "opt_d", "text": "Fit a normal distribution to the data and sample from its formula"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Efron's percentile bootstrap resamples WITH replacement from the empirical distribution function F_n, using empirical percentiles as CI bounds.",
            "opt_b": "Misconception: Resampling without replacement simply reproduces the identical dataset (permutation test for null hypothesis, not bootstrap for CI).",
            "opt_c": "Misconception: Jittering or data augmentation, not bootstrap.",
            "opt_d": "Misconception: That is the Parametric Bootstrap, not Non-Parametric Bootstrap."
        },
        "explanation": "The non-parametric bootstrap treats the sample as an empirical population, repeatedly sampling with replacement to generate an empirical sampling distribution for the estimator."
    },
    {
        "id": "q_stats_30",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does Wilks' Theorem state regarding the asymptotic distribution of the Likelihood Ratio Test (LRT) statistic Lambda = -2 * ln(L_0 / L_1)?",
        "options": [
            {"id": "opt_a", "text": "Under H_0, as sample size n -> infinity, -2 ln(Lambda) converges in distribution to a Chi-Square distribution with degrees of freedom equal to the difference in parameter dimensionality between models"},
            {"id": "opt_b", "text": "It converges to a standard normal distribution N(0, 1)"},
            {"id": "opt_c", "text": "It converges to Student's t-distribution with n - 1 degrees of freedom"},
            {"id": "opt_d", "text": "It converges to an F-distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Wilks' theorem proves -2 ln(L_0 / L_1) ~ chi^2(df) where df = dim(Theta_1) - dim(Theta_0) for nested models.",
            "opt_b": "Misconception: Chi-square is a sum of squared normals, not normal itself.",
            "opt_c": "Misconception: LRT for general likelihoods does not follow Student's t.",
            "opt_d": "Misconception: F-distribution occurs in finite-sample linear regression, while Wilks' theorem is asymptotic chi-square."
        },
        "explanation": "Wilks' Theorem shows that for nested models, the deviance -2(ln L_0 - ln L_1) asymptotically follows a χ² distribution with degrees of freedom equal to the number of constrained parameters."
    },
    {
        "id": "q_stats_31",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In meta-analysis, what does an asymmetric Funnel Plot typically indicate about the published body of scientific literature?",
        "options": [
            {"id": "opt_a", "text": "Publication bias (file-drawer effect), where small studies with non-significant or negative results are systematically unpublished, leaving a missing cluster in the funnel"},
            {"id": "opt_b", "text": "That the underlying studies all used the identical laboratory equipment"},
            {"id": "opt_c", "text": "That all studies were perfectly randomized"},
            {"id": "opt_d", "text": "That the effect size is strictly zero"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Funnel plots graph precision (1/SE) vs effect size. In absence of bias, it forms an inverted symmetrical funnel; missing lower-left quadrant reveals unpublished small non-significant trials.",
            "opt_b": "Misconception: Funnel plots evaluate study heterogeneity and publication selection, not hardware.",
            "opt_c": "Misconception: Randomization does not prevent publication filtering.",
            "opt_d": "Misconception: Asymmetry demonstrates bias, not zero true effect."
        },
        "explanation": "An asymmetric funnel plot (Egger's test) reveals publication bias: small studies with insignificant effects go unpublished, creating an empty gap in the funnel."
    },
    {
        "id": "q_stats_32",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the primary advantage of sequential testing (e.g. Wald's Sequential Probability Ratio Test - SPRT) in continuous A/B testing over fixed-sample-size testing?",
        "options": [
            {"id": "opt_a", "text": "It allows continuous monitoring and early stopping for efficacy or futility while mathematically maintaining exact control over Type I error rates"},
            {"id": "opt_b", "text": "It guarantees that no statistical error can ever be committed"},
            {"id": "opt_c", "text": "It eliminates the need for a control group"},
            {"id": "opt_d", "text": "It ensures that the sample size is always strictly identical to 100"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Standard peeking inflates false positives from 5% to 30%+. SPRT or alpha-spending boundaries allow early stopping while preserving nominal alpha.",
            "opt_b": "Misconception: Probabilistic tests always maintain non-zero error bounds alpha and beta.",
            "opt_c": "Misconception: Both control and variant are required for likelihood ratio updating.",
            "opt_d": "Misconception: Sample size in sequential testing is a stopping random variable, not fixed."
        },
        "explanation": "Sequential testing dynamically evaluates the likelihood ratio after every observation, enabling early termination when evidence is decisive without inflating Type I error."
    },

    # Difficulty 5: Synthesis (q_stats_33 to q_stats_40)
    {
        "id": "q_stats_33",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Neyman-Pearson Lemma prove regarding the construction of hypothesis tests between two simple hypotheses H_0: theta = theta_0 vs H_1: theta = theta_1?",
        "options": [
            {"id": "opt_a", "text": "The Likelihood Ratio Test (rejecting H_0 when L(theta_1; x) / L(theta_0; x) >= k) is the Uniformly Most Powerful (UMP) test for any given significance level alpha"},
            {"id": "opt_b", "text": "P-values are strictly equivalent to posterior probabilities"},
            {"id": "opt_c", "text": "No test can achieve a Type I error rate lower than 0.05"},
            {"id": "opt_d", "text": "Prior distributions must always be uninformative"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Neyman-Pearson Lemma states that the likelihood ratio test maximizes power 1 - beta among all tests of size <= alpha for simple hypotheses.",
            "opt_b": "Misconception: Conflates frequentist Neyman-Pearson with Bayesian inference.",
            "opt_c": "Misconception: Alpha can be arbitrarily small (e.g. 0.001 or 10^-6).",
            "opt_d": "Misconception: Neyman-Pearson is a frequentist optimization theorem."
        },
        "explanation": "The Neyman-Pearson Lemma proves that for simple hypotheses, the likelihood ratio test achieves maximum statistical power for a fixed Type I error threshold α."
    },
    {
        "id": "q_stats_34",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Cramér-Rao Lower Bound (CRLB) establish about the variance of any unbiased estimator theta_hat of parameter theta?",
        "options": [
            {"id": "opt_a", "text": "Var(theta_hat) >= 1 / I(theta), where I(theta) is the Fisher Information; an unbiased estimator achieving this lower bound is termed efficient"},
            {"id": "opt_b", "text": "Var(theta_hat) = 0 for all sample sizes n >= 30"},
            {"id": "opt_c", "text": "Var(theta_hat) <= 1 / I(theta)"},
            {"id": "opt_d", "text": "Var(theta_hat) equals the sample variance s^2"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: CRLB sets the theoretical floor on estimator variance: Var(theta_hat) >= 1 / I(theta). Estimators reaching it achieve 100% statistical efficiency.",
            "opt_b": "Misconception: Estimators with finite sample sizes inherently possess positive variance.",
            "opt_c": "Misconception: Inverts inequality: CRLB is a LOWER bound, not upper.",
            "opt_d": "Misconception: Sample variance is an empirical statistic, not the theoretical information bound."
        },
        "explanation": "The Cramér-Rao inequality states that no unbiased estimator can have a variance lower than the reciprocal of Fisher Information: Var(θ̂) ≥ 1 / I(θ)."
    },
    {
        "id": "q_stats_35",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the James-Stein Paradox in multivariate statistical estimation for dimension p >= 3?",
        "options": [
            {"id": "opt_a", "text": "The standard sample mean vector (MLE) is inadmissible under squared error loss; shrinking the sample mean toward a common origin strictly reduces total mean squared error"},
            {"id": "opt_b", "text": "Sample means can never be computed when dimension exceeds 2"},
            {"id": "opt_c", "text": "Multivariate normal distributions have infinite entropy"},
            {"id": "opt_d", "text": "Estimating 3 or more means requires dividing alpha by p"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Charles Stein (1956) proved that in 3+ dimensions, shrinking individual MLE estimates toward a shared grand mean or vector dominates the standard sample mean.",
            "opt_b": "Misconception: Sample mean vectors are easily calculated in any dimension.",
            "opt_c": "Misconception: Multivariate normal entropy is finite: 1/2 ln|2*pi*e*Sigma|.",
            "opt_d": "Misconception: Bonferroni correction for testing, not point estimation."
        },
        "explanation": "Stein's paradox proved that the ordinary sample mean is inadmissible for p ≥ 3 under sum-of-squared errors. The James-Stein shrinkage estimator achieves strictly lower risk everywhere."
    },
    {
        "id": "q_stats_36",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How does an Exact Permutation (Randomization) Test compute its p-value without relying on asymptotic distribution theory?",
        "options": [
            {"id": "opt_a", "text": "Under the null hypothesis of no treatment effect, group labels are exchangeable; the test evaluates the test statistic across all possible permutations of labels to form the exact reference distribution"},
            {"id": "opt_b", "text": "By inverting the Hessian matrix using singular value decomposition"},
            {"id": "opt_c", "text": "By assuming the data follows an exact Student's t-distribution"},
            {"id": "opt_d", "text": "By generating artificial Gaussian data matching the sample mean and variance"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Under H_0, treatment assignment is exchangeable. Recomputing test statistic over all label permutations gives exact finite-sample p-values without distributional assumptions.",
            "opt_b": "Misconception: Optimization technique.",
            "opt_c": "Misconception: Permutation tests are distribution-free.",
            "opt_d": "Misconception: Parametric simulation."
        },
        "explanation": "Permutation tests leverage exchangeability under H_0: shuffling labels across all (or Monte Carlo sampled) combinations constructs the exact null distribution of the test statistic."
    },
    {
        "id": "q_stats_37",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In econometric Two-Stage Least Squares (2SLS) regression with an endogenous regressor X, what two core properties must a valid Instrumental Variable Z strictly satisfy?",
        "options": [
            {"id": "opt_a", "text": "Instrument Relevance (Cov(Z, X) != 0) and Instrument Exogeneity / Exclusion Restriction (Cov(Z, epsilon) = 0, affecting Y only through X)"},
            {"id": "opt_b", "text": "Z must have zero variance and be uncorrelated with X"},
            {"id": "opt_c", "text": "Z must be identically normally distributed with mean 0"},
            {"id": "opt_d", "text": "Z must have higher correlation with Y than with X"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Relevance ensures Z predicts X in stage 1; exogeneity (exclusion restriction) ensures Z is uncorrelated with error term epsilon in stage 2.",
            "opt_b": "Misconception: A zero-variance variable is constant and useless.",
            "opt_c": "Misconception: IVs do not require normal distributions (can be binary lottery/policy shifts).",
            "opt_d": "Misconception: If Z correlated directly with Y through channels other than X, the exclusion restriction would be violated."
        },
        "explanation": "A valid instrumental variable Z must satisfy: 1) Relevance (strongly correlated with endogenous treatment X), and 2) Exogeneity (uncorrelated with regression error ε, affecting outcome Y solely through X)."
    },
    {
        "id": "q_stats_38",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In Bayesian hypothesis testing, what threshold of Bayes Factor BF_{10} (comparing H_1 over H_0) is widely considered 'Decisive evidence' according to the Jeffreys / Kass-Raftery scale?",
        "options": [
            {"id": "opt_a", "text": "BF_{10} > 100 (or 2 ln(BF_{10}) > 10)"},
            {"id": "opt_b", "text": "BF_{10} > 1.0"},
            {"id": "opt_c", "text": "BF_{10} > 3.0"},
            {"id": "opt_d", "text": "BF_{10} = 0.05"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Kass & Raftery scale: BF 1-3 (barely worth mention), 3-20 (positive), 20-150 (strong), > 100/150 (decisive evidence).",
            "opt_b": "Misconception: BF > 1 simply favors H_1 over H_0, but values between 1 and 3 are anecdotal/inconclusive.",
            "opt_c": "Misconception: BF > 3 is moderate/positive evidence.",
            "opt_d": "Misconception: 0.05 is the frequentist alpha threshold."
        },
        "explanation": "On the Kass-Raftery scale for Bayes Factors, BF₁₀ > 100 represents decisive evidence supporting hypothesis 1 over hypothesis 0 (posterior odds change by over 100x)."
    },
    {
        "id": "q_stats_39",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the False Coverage-statement Rate (FCR), and why is it necessary when reporting confidence intervals for selected parameters after screening?",
        "options": [
            {"id": "opt_a", "text": "Standard marginal confidence intervals fail to cover the true parameters at their nominal 95% rate when only 'statistically significant' findings are selected; FCR controls the expected proportion of non-covering intervals among selected findings"},
            {"id": "opt_b", "text": "It computes the false positive rate of medical insurance coverage algorithms"},
            {"id": "opt_c", "text": "It is identical to the false discovery rate in all circumstances"},
            {"id": "opt_d", "text": "It replaces hypothesis testing with linear programming"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Benjamini & Yekutieli (2005) introduced FCR: selecting only significant parameters (winner's curse) causes standard CIs to under-cover dramatically unless adjusted.",
            "opt_b": "Misconception: Colloquial healthcare confusion.",
            "opt_c": "Misconception: FDR applies to point hypothesis decisions; FCR applies to interval estimations.",
            "opt_d": "Misconception: Mathematical optimization technique."
        },
        "explanation": "Conditioning on selection (reporting CIs only for features passing a threshold) biases estimates (Winner's Curse). The False Coverage-statement Rate (FCR) adjusts intervals to maintain proper coverage across selected parameters."
    },
    {
        "id": "q_stats_40",
        "skillId": "skill_stats",
        "skillName": "Statistical Inference",
        "skillsTested": ["skill_stats", "skill_prob"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How does the Score Test (Rao's Score Test / Lagrange Multiplier Test) evaluate H_0: theta = theta_0 without needing to fit the unconstrained alternative model?",
        "options": [
            {"id": "opt_a", "text": "It evaluates the slope of the log-likelihood function (gradient / score vector U(theta_0)) at the restricted null parameter theta_0; under H_0, the score has mean 0 and variance I(theta_0)"},
            {"id": "opt_b", "text": "By calculating the maximum of the unconstrained likelihood using gradient descent"},
            {"id": "opt_c", "text": "By calculating the area under the ROC curve"},
            {"id": "opt_d", "text": "By subtracting the null log-likelihood from the saturated model"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Score test statistic S = U(theta_0)^T I(theta_0)^{-1} U(theta_0) requires estimating parameters ONLY under H_0, making it computationally cheaper than Wald or LRT.",
            "opt_b": "Misconception: That describes the Wald test or LRT, which require fitting the unconstrained model.",
            "opt_c": "Misconception: Classification metric.",
            "opt_d": "Misconception: That defines deviance."
        },
        "explanation": "Rao's Score test tests whether the gradient of the log-likelihood evaluated at the restricted parameter θ_0 is significantly different from zero: S = U(θ_0)ᵀ I(θ_0)⁻¹ U(θ_0) ~ χ²(r)."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/statistics.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const STATISTICS_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Statistics questions in {out_file}")

if __name__ == '__main__':
    main()
