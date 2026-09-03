import json
import os

questions = [
    # Difficulty 1: Recall (q_ml_01 to q_ml_08)
    {
        "id": "q_ml_01",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "Which machine learning paradigm learns patterns from labeled training data (input-target pairs (x_i, y_i)) to predict targets for new unseen inputs?",
        "options": [
            {"id": "opt_a", "text": "Supervised Learning"},
            {"id": "opt_b", "text": "Unsupervised Learning"},
            {"id": "opt_c", "text": "Reinforcement Learning"},
            {"id": "opt_d", "text": "Self-Supervised Contrastive Clustering"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Supervised learning maps inputs x to ground-truth labels y provided during training.",
            "opt_b": "Misconception: Unsupervised learning discovers hidden structure in unlabeled data (no target y).",
            "opt_c": "Misconception: Reinforcement learning learns policies via reward signals from an environment.",
            "opt_d": "Misconception: Specific self-supervised representation technique."
        },
        "explanation": "Supervised learning algorithms are trained using datasets containing both input features and corresponding target output labels."
    },
    {
        "id": "q_ml_02",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the Sigmoid (logistic) activation function formula used in binary logistic regression?",
        "options": [
            {"id": "opt_a", "text": "sigma(z) = 1 / (1 + exp(-z))"},
            {"id": "opt_b", "text": "sigma(z) = max(0, z)"},
            {"id": "opt_c", "text": "sigma(z) = (exp(z) - exp(-z)) / (exp(z) + exp(-z))"},
            {"id": "opt_d", "text": "sigma(z) = exp(z)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sigmoid function maps any real-valued logit z in (-inf, +inf) smoothly into the probability interval (0, 1).",
            "opt_b": "Misconception: This is the Rectified Linear Unit (ReLU).",
            "opt_c": "Misconception: This is the Hyperbolic Tangent (tanh).",
            "opt_d": "Misconception: Standard exponential function."
        },
        "explanation": "The standard logistic sigmoid function is σ(z) = 1 / (1 + e^(-z)). It compresses real inputs into valid probabilities between 0 and 1."
    },
    {
        "id": "q_ml_03",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the standard weight update rule in Gradient Descent with learning rate eta and loss function L(theta)?",
        "options": [
            {"id": "opt_a", "text": "theta_new = theta_old - eta * grad_theta L(theta_old)"},
            {"id": "opt_b", "text": "theta_new = theta_old + eta * grad_theta L(theta_old)"},
            {"id": "opt_c", "text": "theta_new = theta_old * eta"},
            {"id": "opt_d", "text": "theta_new = grad_theta L(theta_old) / eta"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Gradient points in direction of steepest ascent; stepping in the negative gradient direction minimizes loss L(theta).",
            "opt_b": "Misconception: Gradient ascent, which maximizes loss rather than minimizing it.",
            "opt_c": "Misconception: Weight decay without gradient direction.",
            "opt_d": "Misconception: Inverts learning rate scaling."
        },
        "explanation": "Gradient descent minimizes the loss function by iteratively moving parameters in the opposite direction of the gradient: θ ← θ - η ∇L(θ)."
    },
    {
        "id": "q_ml_04",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What type of machine learning algorithm is k-Nearest Neighbors (k-NN)?",
        "options": [
            {"id": "opt_a", "text": "A non-parametric, instance-based (lazy) learner that stores training data and predicts based on distance to nearest neighbors at query time"},
            {"id": "opt_b", "text": "A parametric linear model with fixed weights"},
            {"id": "opt_c", "text": "A gradient-boosted decision tree ensemble"},
            {"id": "opt_d", "text": "An unsupervised deep neural network"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: k-NN does not learn explicit parameters during training; it defers computation until inference by querying Euclidean/Manhattan distances to training instances.",
            "opt_b": "Misconception: k-NN has no parametric weight vector.",
            "opt_c": "Misconception: That describes XGBoost/LightGBM.",
            "opt_d": "Misconception: k-NN is primarily used for supervised classification/regression."
        },
        "explanation": "k-NN is an instance-based lazy learning algorithm: it does not construct an explicit model during training, making predictions on the fly by locating the k closest stored samples."
    },
    {
        "id": "q_ml_05",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What objective function does standard k-Means Clustering minimize?",
        "options": [
            {"id": "opt_a", "text": "Within-Cluster Sum of Squares (WCSS / Inertia): sum_{k=1}^K sum_{x in S_k} ||x - mu_k||_2^2"},
            {"id": "opt_b", "text": "Cross-entropy classification loss"},
            {"id": "opt_c", "text": "The maximum distance between all pairs of points"},
            {"id": "opt_d", "text": "The number of clusters K"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: k-Means iteratively alternates between assigning points to nearest centroids and recalculating centroids to minimize within-cluster squared Euclidean distance.",
            "opt_b": "Misconception: Cross-entropy is for supervised classification.",
            "opt_c": "Misconception: That is complete linkage in hierarchical clustering.",
            "opt_d": "Misconception: K is a fixed hyperparameter, not minimized."
        },
        "explanation": "k-Means minimizes the Within-Cluster Sum of Squares (Inertia): WCSS = ∑ ∑ ||x - μ_k||², seeking compact, spherical clusters."
    },
    {
        "id": "q_ml_06",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the Gini Impurity formula for a node with K classes and class probabilities p_1, ..., p_K?",
        "options": [
            {"id": "opt_a", "text": "Gini = 1 - sum_{k=1}^K p_k^2"},
            {"id": "opt_b", "text": "Gini = - sum_{k=1}^K p_k * log_2(p_k)"},
            {"id": "opt_c", "text": "Gini = sum_{k=1}^K p_k"},
            {"id": "opt_d", "text": "Gini = 1 / K"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Gini impurity measures the probability that a randomly chosen element would be incorrectly labeled if randomly labeled according to class distribution.",
            "opt_b": "Misconception: This is Shannon Entropy used in Information Gain.",
            "opt_c": "Misconception: Sum of probabilities always equals 1.",
            "opt_d": "Misconception: Uniform reciprocal."
        },
        "explanation": "Gini Impurity is defined as 1 - ∑ p_k². A pure node (where all items belong to one class) has Gini = 1 - 1² = 0."
    },
    {
        "id": "q_ml_07",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the Rectified Linear Unit (ReLU) activation function?",
        "options": [
            {"id": "opt_a", "text": "f(x) = max(0, x)"},
            {"id": "opt_b", "text": "f(x) = 1 / (1 + exp(-x))"},
            {"id": "opt_c", "text": "f(x) = x^2"},
            {"id": "opt_d", "text": "f(x) = tanh(x)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: ReLU outputs x if x > 0 and 0 otherwise, enabling efficient backpropagation without saturating positive gradients.",
            "opt_b": "Misconception: Sigmoid function.",
            "opt_c": "Misconception: Quadratic function.",
            "opt_d": "Misconception: Tanh function."
        },
        "explanation": "ReLU is defined as f(x) = max(0, x). It has become the standard activation function in deep learning due to simplicity and resistance to vanishing gradients."
    },
    {
        "id": "q_ml_08",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What happens in gradient descent if the learning rate eta is set excessively large?",
        "options": [
            {"id": "opt_a", "text": "The optimizer may overshoot the minimum and diverge to infinity, with loss increasing uncontrollably"},
            {"id": "opt_b", "text": "The model takes infinitely long to take a single step"},
            {"id": "opt_c", "text": "The model is mathematically guaranteed to find the global minimum"},
            {"id": "opt_d", "text": "The gradients become zero on the first step"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Excessive step sizes oscillate across ravines and overshoot the valley floor, causing divergence.",
            "opt_b": "Misconception: Extremely small learning rates take infinitely long to converge.",
            "opt_c": "Misconception: Large learning rates prevent convergence altogether.",
            "opt_d": "Misconception: Gradients explode rather than vanishing to zero."
        },
        "explanation": "An overly large learning rate causes gradient descent to take giant steps that leap over the loss valley, leading to wild oscillations and numerical divergence."
    },

    # Difficulty 2: Comprehension (q_ml_09 to q_ml_16)
    {
        "id": "q_ml_09",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the key geometric and structural difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?",
        "options": [
            {"id": "opt_a", "text": "L1 uses a diamond-shaped constraint region with sharp corners along axes that drives redundant coefficients exactly to zero (feature selection); L2 uses a smooth spherical ball that shrinks weights toward zero without setting them exactly to zero"},
            {"id": "opt_b", "text": "L1 adds squared weights; L2 adds absolute weights"},
            {"id": "opt_c", "text": "L2 can only be used on classification; L1 is only for regression"},
            {"id": "opt_d", "text": "L1 increases the number of features"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The sharp corners of the L1 diamond intersect elliptical loss contours directly on coordinate axes, producing exact sparsity (w_i = 0).",
            "opt_b": "Misconception: Inverts the definitions (L1 = |w|, L2 = w^2).",
            "opt_c": "Misconception: Both regularizers apply equally to classification and regression models.",
            "opt_d": "Misconception: L1 selects a sparse subset, decreasing active features."
        },
        "explanation": "L1 penalty (Lasso, ∑|w_i|) has sharp corners on the coordinate axes that set weights exactly to zero, producing sparse models. L2 penalty (Ridge, ∑w_i²) shrinks weights smoothly."
    },
    {
        "id": "q_ml_10",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "How does Random Forest reduce the variance of individual decision trees without increasing bias?",
        "options": [
            {"id": "opt_a", "text": "By combining Bootstrap Aggregation (bagging) with random feature subspace sampling at each split, decorrelating the individual trees so their averaged variance decreases by 1/B"},
            {"id": "opt_b", "text": "By pruning all trees down to a single decision stump"},
            {"id": "opt_c", "text": "By training trees sequentially on the residuals of previous trees"},
            {"id": "opt_d", "text": "By replacing decision trees with logistic regressions"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Averaging B decorrelated trees reduces ensemble variance: Var(ensemble) = rho * sigma^2 + (1 - rho)/B * sigma^2, where random feature selection reduces correlation rho.",
            "opt_b": "Misconception: Single stumps have extreme bias (underfitting).",
            "opt_c": "Misconception: Sequential residual training defines Boosting (e.g. AdaBoost, GBDT), not Random Forest.",
            "opt_d": "Misconception: Random forest is composed strictly of decision trees."
        },
        "explanation": "Random Forest builds deep, low-bias trees on bootstrap samples and selects a random subset of features at each node (decorrelation). Averaging decorrelated trees slashes variance."
    },
    {
        "id": "q_ml_11",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the fundamental difference between Bagging and Boosting ensemble paradigms?",
        "options": [
            {"id": "opt_a", "text": "Bagging trains independent base models in parallel on bootstrap samples to reduce variance; Boosting trains base models sequentially where each new model focuses on errors/residuals of previous models to reduce bias"},
            {"id": "opt_b", "text": "Bagging is for neural networks; Boosting is only for linear regression"},
            {"id": "opt_c", "text": "Bagging always overfits; Boosting never overfits"},
            {"id": "opt_d", "text": "Boosting trains models completely in parallel on separate GPUs"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Bagging combines parallel independent high-variance learners to reduce variance. Boosting fits sequential weak learners to iterative residuals to reduce bias.",
            "opt_b": "Misconception: Both are general ensemble meta-algorithms.",
            "opt_c": "Misconception: Boosting can easily overfit if trained for too many iterations without shrinkage/regularization.",
            "opt_d": "Misconception: Boosting is fundamentally sequential because tree t depends on errors of tree t-1."
        },
        "explanation": "Bagging (parallel bootstrap aggregation) targets variance reduction. Boosting (sequential residual fitting) targets bias reduction."
    },
    {
        "id": "q_ml_12",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the 'Curse of Dimensionality', and why does it degrade distance-based algorithms like k-NN and k-Means in high-dimensional spaces?",
        "options": [
            {"id": "opt_a", "text": "As dimensionality d increases, volume grows exponentially and data points become equidistant from one another (distance to nearest neighbor approaches distance to farthest neighbor), rendering Euclidean distance non-informative"},
            {"id": "opt_b", "text": "High-dimensional data cannot be stored on modern SSDs"},
            {"id": "opt_c", "text": "High-dimensional spaces cause matrix inverses to become negative"},
            {"id": "opt_d", "text": "High dimensions force all data points into the origin"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In high dimensions, the ratio (dist_max - dist_min) / dist_min -> 0. Points reside in a thin shell on the boundary of the space, destroying local density contrast.",
            "opt_b": "Misconception: Hardware storage is not the mathematical curse.",
            "opt_c": "Misconception: Inverses depend on eigenvalues, not spatial dimension directly.",
            "opt_d": "Misconception: Points disperse toward the hypersphere boundaries, away from the center."
        },
        "explanation": "In high dimensions, space becomes exponentially vast and sparse. The contrast between distance to nearest and farthest neighbors vanishes, degrading distance-based metrics."
    },
    {
        "id": "q_ml_13",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "How does Support Vector Machine (SVM) determine the optimal decision boundary for linearly separable binary data?",
        "options": [
            {"id": "opt_a", "text": "It finds the hyperplane that maximizes the geometric margin (distance between the decision boundary and the closest data points of either class, known as support vectors)"},
            {"id": "opt_b", "text": "It computes the center of mass of all training points"},
            {"id": "opt_c", "text": "It minimizes the sum of squared distances to all training points"},
            {"id": "opt_d", "text": "It fits a decision tree with maximal depth"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: SVM is a maximum-margin classifier: max 2/||w|| subject to y_i(w^T x_i + b) >= 1. The boundary depends only on the critical support vectors.",
            "opt_b": "Misconception: That describes centroid classification (nearest centroid classifier).",
            "opt_c": "Misconception: That describes least-squares regression.",
            "opt_d": "Misconception: SVMs are linear/kernel margin classifiers, not decision trees."
        },
        "explanation": "SVM finds the unique separating hyperplane that maximizes the margin 2/||w|| to the nearest training instances (the support vectors), providing maximum robustness."
    },
    {
        "id": "q_ml_14",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the trade-off between Mini-Batch Gradient Descent and Full-Batch Gradient Descent?",
        "options": [
            {"id": "opt_a", "text": "Full-batch computes exact gradients over the entire dataset (stable but slow and memory-intensive); mini-batch computes noisy gradient estimates on small subsets (faster, enables GPU parallelism, and noise helps escape shallow local minima)"},
            {"id": "opt_b", "text": "Full-batch is always faster because it uses 1 thread"},
            {"id": "opt_c", "text": "Mini-batch cannot be used with neural networks"},
            {"id": "opt_d", "text": "Mini-batch requires storing the entire dataset in GPU VRAM simultaneously"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Mini-batch gradient descent (e.g. batch size 32-256) balances computational vectorization on modern GPUs with stochastic exploration to navigate complex loss landscapes.",
            "opt_b": "Misconception: Full-batch requires sweeping millions of rows per parameter update, making it extremely slow.",
            "opt_c": "Misconception: Mini-batch is the universal standard for deep learning.",
            "opt_d": "Misconception: Mini-batch loads only a fraction of data into VRAM at any time."
        },
        "explanation": "Mini-batch gradient descent computes updates on small subsets (e.g., 64 samples), offering computational speed, GPU hardware efficiency, and helpful stochastic gradient noise."
    },
    {
        "id": "q_ml_15",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why does Early Stopping act as an implicit regularizer in iterative neural network training?",
        "options": [
            {"id": "opt_a", "text": "By halting training when validation loss stops improving, it prevents the optimization trajectory from exploring high-norm parameter regions that fit noise in the training set"},
            {"id": "opt_b", "text": "It sets all network weights to zero"},
            {"id": "opt_c", "text": "It doubles the learning rate after every epoch"},
            {"id": "opt_d", "text": "It guarantees 100% training accuracy"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Parameters start near zero; early stopping restricts total trajectory length in parameter space, behaving analogously to an L2 weight decay penalty.",
            "opt_b": "Misconception: Retains the weights corresponding to the best validation checkpoint.",
            "opt_c": "Misconception: Learning rate schedules decrease or decay, not double.",
            "opt_d": "Misconception: Early stopping explicitly sacrifices perfect training accuracy to preserve generalization."
        },
        "explanation": "Stopping before convergence limits the effective capacity of the network and bounds the distance weights can travel from initialization, providing regularization equivalent to L2 shrinkage."
    },
    {
        "id": "q_ml_16",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the primary role of the 'Kernel Trick' in Support Vector Machines?",
        "options": [
            {"id": "opt_a", "text": "It computes the inner product of data points in a high-dimensional (or infinite-dimensional) transformed feature space without explicitly calculating coordinates in that space"},
            {"id": "opt_b", "text": "It accelerates CPU clock speed during training"},
            {"id": "opt_c", "text": "It converts continuous features into discrete categories"},
            {"id": "opt_d", "text": "It eliminates the need for training labels"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By replacing inner product <x_i, x_j> with kernel K(x_i, x_j) = <phi(x_i), phi(x_j)>, linear algorithms solve complex non-linear problems with O(d) cost.",
            "opt_b": "Misconception: Algorithmic mathematical formulation, not hardware overclocking.",
            "opt_c": "Misconception: That is binning/discretization.",
            "opt_d": "Misconception: SVM remains fully supervised."
        },
        "explanation": "The kernel trick enables learning non-linear decision boundaries by evaluating pairwise similarity K(x_i, x_j) corresponding to dot products in high-dimensional feature space without explicit transformation."
    },

    # Difficulty 3: Application (q_ml_17 to q_ml_24)
    {
        "id": "q_ml_17",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Given current weight w = 4.0, learning rate eta = 0.1, and loss gradient dL/dw = 6.0, what is the updated weight after one gradient descent step?",
        "options": [
            {"id": "opt_a", "text": "3.4"},
            {"id": "opt_b", "text": "4.6"},
            {"id": "opt_c", "text": "0.6"},
            {"id": "opt_d", "text": "2.4"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: w_new = w_old - eta * (dL/dw) = 4.0 - 0.1 * 6.0 = 4.0 - 0.6 = 3.4.",
            "opt_b": "Misconception: Gradient ascent: 4.0 + 0.6 = 4.6.",
            "opt_c": "Misconception: Only calculates step size eta * grad = 0.6.",
            "opt_d": "Misconception: Arithmetic error."
        },
        "explanation": "w ← w - η(dL/dw) = 4.0 - 0.1(6.0) = 4.0 - 0.6 = 3.4."
    },
    {
        "id": "q_ml_18",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A decision tree node contains 30 samples of Class A and 70 samples of Class B. What is the Gini Impurity of this node?",
        "options": [
            {"id": "opt_a", "text": "1 - (0.3^2 + 0.7^2) = 1 - (0.09 + 0.49) = 1 - 0.58 = 0.42"},
            {"id": "opt_b", "text": "0.58"},
            {"id": "opt_c", "text": "0.50"},
            {"id": "opt_d", "text": "0.21"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: p_A = 0.3, p_B = 0.7. Gini = 1 - (0.3^2 + 0.7^2) = 1 - (0.09 + 0.49) = 0.42.",
            "opt_b": "Misconception: Sum of squared probabilities p_A^2 + p_B^2 without subtracting from 1.",
            "opt_c": "Misconception: Maximum Gini for binary split (0.50 occurs at 50/50 split).",
            "opt_d": "Misconception: p_A * p_B = 0.21 (Gini = 2*p_A*p_B = 0.42)."
        },
        "explanation": "Gini = 1 - ∑ p_k² = 1 - (0.3² + 0.7²) = 1 - (0.09 + 0.49) = 1 - 0.58 = 0.42."
    },
    {
        "id": "q_ml_19",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the Euclidean distance between query point q = [1, 2] and candidate point p = [4, 6] in 2D feature space?",
        "options": [
            {"id": "opt_a", "text": "5.0"},
            {"id": "opt_b", "text": "7.0"},
            {"id": "opt_c", "text": "25.0"},
            {"id": "opt_d", "text": "3.5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: dist = sqrt((4-1)^2 + (6-2)^2) = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.0.",
            "opt_b": "Misconception: Manhattan distance: |4-1| + |6-2| = 3 + 4 = 7.0.",
            "opt_c": "Misconception: Squared Euclidean distance without square root: 25.0.",
            "opt_d": "Misconception: Arithmetic error."
        },
        "explanation": "d(p, q) = √((4 - 1)² + (6 - 2)²) = √(3² + 4²) = √(9 + 16) = √25 = 5.0."
    },
    {
        "id": "q_ml_20",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A logistic regression model has weights w = [0.5, -1.0] and bias b = 0.5. For input x = [2.0, 1.0], what is the logit z and predicted probability P(Y=1|x)?",
        "options": [
            {"id": "opt_a", "text": "z = 0.5*(2.0) - 1.0*(1.0) + 0.5 = 0.5; P(Y=1|x) = 1 / (1 + exp(-0.5)) ≈ 0.622"},
            {"id": "opt_b", "text": "z = 1.0; P(Y=1|x) = 0.731"},
            {"id": "opt_c", "text": "z = 0.0; P(Y=1|x) = 0.500"},
            {"id": "opt_d", "text": "z = -0.5; P(Y=1|x) = 0.378"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: z = 0.5(2) + (-1)(1) + 0.5 = 1 - 1 + 0.5 = 0.5. sigma(0.5) = 1 / (1 + e^-0.5) ≈ 0.622.",
            "opt_b": "Misconception: Arithmetic error in logit sum.",
            "opt_c": "Misconception: Omits the bias term b = 0.5.",
            "opt_d": "Misconception: Inverts sign of logit."
        },
        "explanation": "Logit z = wᵀx + b = (0.5)(2) + (-1.0)(1) + 0.5 = 1 - 1 + 0.5 = 0.5. Probability σ(0.5) = 1 / (1 + e^(-0.5)) ≈ 0.622."
    },
    {
        "id": "q_ml_21",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In a k-Means clustering update step, Cluster 1 has 3 assigned data points: [2, 4], [4, 6], and [6, 2]. What is the updated centroid mu_1?",
        "options": [
            {"id": "opt_a", "text": "[4.0, 4.0]"},
            {"id": "opt_b", "text": "[3.0, 3.0]"},
            {"id": "opt_c", "text": "[12.0, 12.0]"},
            {"id": "opt_d", "text": "[4.0, 6.0]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: mu_1 = [(2+4+6)/3, (4+6+2)/3] = [12/3, 12/3] = [4.0, 4.0].",
            "opt_b": "Misconception: Arithmetic division error.",
            "opt_c": "Misconception: Sum of points without dividing by count n = 3.",
            "opt_d": "Misconception: Takes medoid or maximum coordinates."
        },
        "explanation": "The centroid update computes the arithmetic mean of assigned points: x_coord = (2+4+6)/3 = 4.0, y_coord = (4+6+2)/3 = 4.0 -> [4.0, 4.0]."
    },
    {
        "id": "q_ml_22",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In k-NN classification with k = 5, a query point's 5 nearest neighbors have labels [Positive, Negative, Positive, Positive, Negative]. What is the predicted label and estimated probability of being Positive under majority voting?",
        "options": [
            {"id": "opt_a", "text": "Predicted: Positive, Estimated Probability: 3/5 = 60%"},
            {"id": "opt_b", "text": "Predicted: Negative, Estimated Probability: 40%"},
            {"id": "opt_c", "text": "Predicted: Tie (cannot decide)"},
            {"id": "opt_d", "text": "Predicted: Positive, Estimated Probability: 100%"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Positive count = 3, Negative count = 2. Majority class is Positive with probability 3/5 = 0.60.",
            "opt_b": "Misconception: Minority class.",
            "opt_c": "Misconception: Odd k = 5 prevents ties in binary classification.",
            "opt_d": "Misconception: Ignores presence of the 2 negative neighbors."
        },
        "explanation": "With 3 Positive and 2 Negative votes among the 5 nearest neighbors, majority voting assigns label Positive with empirical posterior probability 3/5 = 60%."
    },
    {
        "id": "q_ml_23",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "How many trainable parameters (weights + biases) are in a standard Dense (fully connected) neural network layer with 100 input features and 20 output neurons?",
        "options": [
            {"id": "opt_a", "text": "100 * 20 + 20 = 2,020 parameters"},
            {"id": "opt_b", "text": "100 * 20 = 2,000 parameters"},
            {"id": "opt_c", "text": "100 + 20 = 120 parameters"},
            {"id": "opt_d", "text": "100 * 20 + 100 = 2,100 parameters"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Weight matrix W has shape 100 x 20 (2,000 weights), plus 1 bias parameter per output neuron (20 biases), yielding 2,020 parameters.",
            "opt_b": "Misconception: Forgets the bias terms b in y = Wx + b.",
            "opt_c": "Misconception: Adds dimensions instead of multiplying.",
            "opt_d": "Misconception: Assigns biases to inputs instead of output neurons."
        },
        "explanation": "Parameters = (input_dim × output_dim) + output_dim = (100 × 20) + 20 = 2,000 + 20 = 2,020."
    },
    {
        "id": "q_ml_24",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In AdaBoost, how are sample weights adjusted after a base classifier makes predictions?",
        "options": [
            {"id": "opt_a", "text": "Weights of incorrectly classified samples are increased, forcing subsequent base learners to concentrate on hard-to-classify instances"},
            {"id": "opt_b", "text": "Incorrect samples are permanently deleted from the dataset"},
            {"id": "opt_c", "text": "All sample weights are set equal to 1.0"},
            {"id": "opt_d", "text": "Weights of correctly classified samples are increased"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: AdaBoost updates weights via w_i <- w_i * exp(alpha * I(y_i != h(x_i))), exponentially amplifying the influence of misclassified instances.",
            "opt_b": "Misconception: Samples are never discarded.",
            "opt_c": "Misconception: Uniform weights is only the initial condition w_i = 1/N.",
            "opt_d": "Misconception: Inverts reinforcement logic."
        },
        "explanation": "AdaBoost increases weights for misclassified samples and decreases weights for correct ones, ensuring future weak learners focus on the difficult boundary examples."
    },

    # Difficulty 4: Analysis (q_ml_25 to q_ml_32)
    {
        "id": "q_ml_25",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What mathematical formulation distinguishes modern Gradient Boosted Decision Trees (GBDT / XGBoost) from traditional Gradient Boosting?",
        "options": [
            {"id": "opt_a", "text": "XGBoost uses a second-order Taylor expansion of the loss function (utilizing both first-order gradients g_i and second-order Hessians h_i) to compute exact tree split gain and optimal leaf weights w_j* = -G_j / (H_j + lambda)"},
            {"id": "opt_b", "text": "XGBoost trains trees completely in parallel using bagging"},
            {"id": "opt_c", "text": "XGBoost eliminates the need for regularization penalties"},
            {"id": "opt_d", "text": "XGBoost only optimizes Mean Squared Error"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Friedman's original GBM used first-order gradients; XGBoost's 2nd-order Taylor expansion incorporates curvature (Hessian) and explicit leaf regularization (lambda, gamma).",
            "opt_b": "Misconception: Trees are still trained sequentially; feature histograms/splits are parallelized.",
            "opt_c": "Misconception: Explicit L1 (alpha) and L2 (lambda) leaf weight penalties are central to XGBoost.",
            "opt_d": "Misconception: Works for any twice-differentiable custom objective function."
        },
        "explanation": "XGBoost approximates any twice-differentiable loss with a 2nd-order Taylor polynomial using gradients g_i and Hessians h_i, deriving exact analytic leaf weights and split gain."
    },
    {
        "id": "q_ml_26",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why does the Vanishing Gradient Problem occur in deep neural networks using Sigmoid or Tanh activation functions?",
        "options": [
            {"id": "opt_a", "text": "The derivative of Sigmoid maxes out at 0.25 (Tanh at 1.0); repeatedly multiplying numbers < 0.25 across multiple layers via the chain rule causes backpropagated gradients to decay exponentially toward zero, freezing early layers"},
            {"id": "opt_b", "text": "Gradients exceed the maximum 64-bit floating point capacity"},
            {"id": "opt_c", "text": "Backpropagation cannot be computed for non-linear functions"},
            {"id": "opt_d", "text": "Deep networks have no local minima"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: sigma'(z) = sigma(z)(1 - sigma(z)) <= 0.25. Over L layers, (0.25)^L vanishes rapidly (e.g. 0.25^10 ≈ 9.5e-7), preventing lower layer learning.",
            "opt_b": "Misconception: That describes the Exploding Gradient problem (mitigated by gradient clipping).",
            "opt_c": "Misconception: Backpropagation is defined via chain rule on differentiable maps.",
            "opt_d": "Misconception: Deep networks have abundant local minima and saddle points."
        },
        "explanation": "Because Sigmoid's derivative is at most 0.25, chain-rule multiplications through many layers cause gradient signals to shrink exponentially toward zero, stalling training in early layers."
    },
    {
        "id": "q_ml_27",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does the Adam Optimizer combine the advantages of Momentum and RMSprop, and why is bias correction applied?",
        "options": [
            {"id": "opt_a", "text": "It tracks exponentially decaying moving averages of past gradients (1st moment / Momentum) and squared gradients (2nd moment / RMSprop); bias correction divides by (1 - beta^t) to counteract initialization bias toward zero in early iterations"},
            {"id": "opt_b", "text": "It replaces gradient descent with genetic algorithms"},
            {"id": "opt_c", "text": "It computes the exact Hessian matrix at every step"},
            {"id": "opt_d", "text": "It keeps the learning rate completely fixed throughout training"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: m_t = beta_1 m_{t-1} + (1-beta_1) g_t; v_t = beta_2 v_{t-1} + (1-beta_2) g_t^2. Initialized at 0, m_t and v_t are biased toward 0; dividing by 1 - beta^t corrects this.",
            "opt_b": "Misconception: Adam is a first-order stochastic gradient method.",
            "opt_c": "Misconception: Computing exact Hessians is O(p^2) to O(p^3) (second-order Newton methods, not Adam).",
            "opt_d": "Misconception: Adam adapts individual learning rates per parameter."
        },
        "explanation": "Adam maintains exponentially decaying averages of gradients (first moment) and squared gradients (second moment). Bias correction (1 - β^t) compensates for zero-initialization in initial steps."
    },
    {
        "id": "q_ml_28",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the key difference between Principal Component Analysis (PCA) and t-Distributed Stochastic Neighbor Embedding (t-SNE) for dimensionality reduction?",
        "options": [
            {"id": "opt_a", "text": "PCA is a linear, convex global method that preserves large pairwise distances and global variance; t-SNE is a non-linear, non-convex technique that preserves local neighbor manifold structure using student-t probability distributions"},
            {"id": "opt_b", "text": "PCA can only reduce data to 1 dimension; t-SNE can only reduce to 100 dimensions"},
            {"id": "opt_c", "text": "t-SNE produces a parametric projection matrix that can directly transform new test points; PCA cannot"},
            {"id": "opt_d", "text": "PCA minimizes cross-entropy loss between probabilities"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: PCA maximizes global variance via orthogonal linear projections; t-SNE minimizes KL divergence between high-dim Gaussian affinities and low-dim Student-t affinities.",
            "opt_b": "Misconception: Both can reduce to arbitrary target dimensions (t-SNE typically 2D or 3D for visualization).",
            "opt_c": "Misconception: Inverts fact: PCA provides explicit linear projection matrix W; standard t-SNE is non-parametric and cannot project new out-of-sample points.",
            "opt_d": "Misconception: t-SNE minimizes KL divergence, PCA maximizes variance/minimizes reconstruction MSE."
        },
        "explanation": "PCA performs an orthogonal linear projection preserving global variance. t-SNE is non-linear, matching local neighborhood probabilities (KL divergence) to reveal manifold clusters in 2D/3D."
    },
    {
        "id": "q_ml_29",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does Isolation Forest detect anomalies compared to traditional density or distance-based algorithms?",
        "options": [
            {"id": "opt_a", "text": "Anomalies are isolated with fewer random recursive feature splits because they reside in sparse regions; their average path length from root to leaf in isolation trees is significantly shorter"},
            {"id": "opt_b", "text": "It computes the exact Mahalanobis distance to all cluster centers"},
            {"id": "opt_c", "text": "It fits a deep autoencoder and measures reconstruction error"},
            {"id": "opt_d", "text": "It deletes points that have odd coordinate values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Isolation Forest exploits 'few and different': outliers require very few random partition cuts to isolate, resulting in noticeably shorter tree path lengths h(x).",
            "opt_b": "Misconception: That describes elliptic envelope or distance-based detection.",
            "opt_c": "Misconception: That describes neural autoencoder anomaly detection.",
            "opt_d": "Misconception: Arbitrary non-mathematical assertion."
        },
        "explanation": "Isolation Forest explicitly isolates anomalies instead of profiling normal points. Because anomalies are sparse and distant, random binary partitioning isolates them closer to the root (shorter path lengths)."
    },
    {
        "id": "q_ml_30",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the 'Naive' conditional independence assumption in Naive Bayes classification, and what happens when features are strongly correlated?",
        "options": [
            {"id": "opt_a", "text": "It assumes all features are conditionally independent given the class label: P(x_1, ..., x_d | y) = prod P(x_i | y); correlated features lead to double-counting evidence, producing overconfident (extreme 0 or 1) posterior probabilities"},
            {"id": "opt_b", "text": "It assumes the target class y is independent of all input features"},
            {"id": "opt_c", "text": "Correlated features cause the algorithm to throw a division-by-zero error"},
            {"id": "opt_d", "text": "It assumes all features follow a Poisson distribution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Conditional independence factorizes joint likelihood into products. If two features are identical copies, evidence is counted twice, distorting posterior calibration toward 0 or 1.",
            "opt_b": "Misconception: If y were independent of features, the model couldn't classify anything.",
            "opt_c": "Misconception: Correlations do not cause math exceptions in naive Bayes.",
            "opt_d": "Misconception: Features can follow Gaussian, Multinomial, or Bernoulli distributions."
        },
        "explanation": "Naive Bayes assumes features are conditionally independent given the class. When features correlate, it double-counts evidence, leading to poorly calibrated, overconfident posterior probabilities."
    },
    {
        "id": "q_ml_31",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the difference between One-vs-Rest (OvR) and One-vs-One (OvO) strategies for multiclass classification using binary base learners?",
        "options": [
            {"id": "opt_a", "text": "OvR trains K classifiers (each class against all other classes combined); OvO trains K*(K-1)/2 classifiers (one for every pairwise combination of classes) and uses majority voting"},
            {"id": "opt_b", "text": "OvR trains K^2 classifiers; OvO trains K classifiers"},
            {"id": "opt_c", "text": "OvO can only be used with decision trees; OvR only with SVMs"},
            {"id": "opt_d", "text": "OvR requires identical numbers of samples in each class"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For K classes: OvR trains K models on full dataset; OvO trains K(K-1)/2 models on pairwise subsets, advantageous for algorithms scaling poorly with sample size (e.g. O(N^3) SVMs).",
            "opt_b": "Misconception: Mathematical counts are inverted/incorrect.",
            "opt_c": "Misconception: Both are universal meta-strategies applicable to any binary classifier.",
            "opt_d": "Misconception: Neither strategy requires balanced classes."
        },
        "explanation": "OvR trains K classifiers (class k vs all others). OvO trains K(K-1)/2 pairwise classifiers (class i vs class j). OvO uses smaller subsets per model, popular for kernel SVMs."
    },
    {
        "id": "q_ml_32",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why does Batch Normalization accelerate neural network training and reduce sensitivity to parameter initialization?",
        "options": [
            {"id": "opt_a", "text": "It standardizes layer inputs across the mini-batch to zero mean and unit variance, smoothing the optimization loss landscape and preventing activation distributions from shifting wildly as earlier layers update (reducing internal covariate shift)"},
            {"id": "opt_b", "text": "It converts all floating-point numbers into 8-bit integers"},
            {"id": "opt_c", "text": "It removes all non-linear activation functions from the network"},
            {"id": "opt_d", "text": "It eliminates the need for backpropagation"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Batch norm standardizes activations and adds learnable scale (gamma) and shift (beta), smoothing loss landscape gradients and allowing higher learning rates.",
            "opt_b": "Misconception: That describes quantization (INT8), not batch normalization.",
            "opt_c": "Misconception: Normalization is inserted before or after non-linearities.",
            "opt_d": "Misconception: Batch norm layers have learnable parameters updated via backpropagation."
        },
        "explanation": "Batch Normalization normalizes activations by mini-batch mean and variance, stabilizing intermediate representation distributions and smoothing the optimization landscape."
    },

    # Difficulty 5: Synthesis (q_ml_33 to q_ml_40)
    {
        "id": "q_ml_33",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Scaled Dot-Product Attention formula introduced in the Transformer architecture, and why is the scaling factor 1 / sqrt(d_k) essential?",
        "options": [
            {"id": "opt_a", "text": "Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V; without 1/sqrt(d_k), for large key dimensions d_k, dot products grow large in magnitude, pushing softmax into regions with vanishingly small gradients"},
            {"id": "opt_b", "text": "Attention(Q, K, V) = Q K^T V; 1/sqrt(d_k) normalizes the vocabulary size"},
            {"id": "opt_c", "text": "Attention(Q, K, V) = sigmoid(Q K^T) / d_k"},
            {"id": "opt_d", "text": "The scaling factor prevents matrix multiplication from exceeding GPU memory"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If components of q and k are independent with variance 1, q . k has mean 0 and variance d_k. Dividing by sqrt(d_k) restores variance to 1, preventing softmax saturation.",
            "opt_b": "Misconception: Missing softmax and scaling rationale.",
            "opt_c": "Misconception: Transformer attention uses row-wise softmax, not element-wise sigmoid.",
            "opt_d": "Misconception: Memory complexity is O(N^2), unaffected by scalar scaling."
        },
        "explanation": "Attention(Q, K, V) = softmax(QKᵀ / √d_k)V. For large d_k, dot products grow proportionally to d_k, pushing softmax into saturated regimes with near-zero gradients. Scaling by 1/√d_k maintains stable unit variance."
    },
    {
        "id": "q_ml_34",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What are the Expectation (E) and Maximization (M) steps in the Expectation-Maximization (EM) algorithm for fitting Gaussian Mixture Models (GMMs)?",
        "options": [
            {"id": "opt_a", "text": "E-step: Compute posterior probabilities (responsibilities gamma_{ik}) that component k generated data point x_i using current parameters; M-step: Update mixture weights, means, and covariance matrices by maximizing the expected complete-data log-likelihood weighted by responsibilities"},
            {"id": "opt_b", "text": "E-step: Train a neural net; M-step: Evaluate accuracy on test data"},
            {"id": "opt_c", "text": "E-step: Eliminate outliers; M-step: Multiply feature matrices"},
            {"id": "opt_d", "text": "E-step: Compute eigenvalues; M-step: Set lowest eigenvalues to zero"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: EM iteratively optimizes a lower bound (ELBO) on incomplete log-likelihood: E-step calculates posterior soft assignments; M-step computes closed-form weighted MLE updates.",
            "opt_b": "Misconception: Conflates general ML workflow with statistical EM.",
            "opt_c": "Misconception: Unrelated preprocessing steps.",
            "opt_d": "Misconception: That describes PCA."
        },
        "explanation": "In GMMs, the E-step computes the responsibility γ_ik = P(z_i = k | x_i; θ). The M-step updates weights π_k, means μ_k, and covariances Σ_k using closed-form weighted averages."
    },
    {
        "id": "q_ml_35",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the InfoNCE (Information Noise-Contrastive Estimation) loss function used in self-supervised representation learning (e.g. SimCLR, CPC)?",
        "options": [
            {"id": "opt_a", "text": "L = - log [ exp(sim(q, k_+) / tau) / ( exp(sim(q, k_+) / tau) + sum_{i=1}^K exp(sim(q, k_{i,-}) / tau) ) ], maximizing mutual information lower bound between positive representation pairs against negative distractor pairs"},
            {"id": "opt_b", "text": "The L2 reconstruction error of a masked image patch"},
            {"id": "opt_c", "text": "A standard binary hinge loss with margin 1.0"},
            {"id": "opt_d", "text": "The variance of cluster centroids across batches"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: InfoNCE is a categorical cross-entropy loss that treats finding the positive key k_+ among K negative distractors as a classification problem, lower-bounding mutual information I(X; Y).",
            "opt_b": "Misconception: That describes Masked Autoencoders (MAE).",
            "opt_c": "Misconception: Hinge loss is used in SVMs.",
            "opt_d": "Misconception: Non-contrastive variance loss (VICReg)."
        },
        "explanation": "InfoNCE is a contrastive loss optimizing cosine similarity for positive view pairs (augmented versions of the same sample) while contrasting against negative pairs, lower-bounding mutual information."
    },
    {
        "id": "q_ml_36",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the 'Double Descent' phenomenon in modern machine learning, and how does it challenge traditional statistical learning theory?",
        "options": [
            {"id": "opt_a", "text": "As model capacity increases past the interpolation threshold (where training error reaches zero), test risk increases (classical U-curve overfitting) but then decreases again as overparameterization continues, achieving lower generalization error than under-parameterized models"},
            {"id": "opt_b", "text": "Gradient descent converges twice as fast when learning rate is doubled"},
            {"id": "opt_c", "text": "Validation error drops on epoch 1 and drops again on epoch 2"},
            {"id": "opt_d", "text": "Two neural networks trained together always achieve zero error"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Belkin et al. (2019) demonstrated double descent: classical bias-variance peak occurs at interpolation boundary p = n; beyond it, implicit regularization of SGD finds minimum-norm interpolators with decreasing variance.",
            "opt_b": "Misconception: Double descent refers to model capacity / sample size curves, not training speed.",
            "opt_c": "Misconception: Epoch-level fluctuations are training dynamics, not capacity double descent.",
            "opt_d": "Misconception: Arbitrary non-scientific assertion."
        },
        "explanation": "Double descent shows that beyond the interpolation threshold (where p > n and train error = 0), test error peaks and then drops steadily again, explaining why massive overparameterized deep networks generalize well."
    },
    {
        "id": "q_ml_37",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What do the Karush-Kuhn-Tucker (KKT) Complementary Slackness conditions alpha_i * [ y_i (w^T x_i + b) - 1 ] = 0 imply for Support Vector Machines?",
        "options": [
            {"id": "opt_a", "text": "Only data points that lie exactly on the margin boundary (or violate it) have non-zero Lagrange multipliers alpha_i > 0; all interior non-boundary points have alpha_i = 0 and exert zero influence on the final model"},
            {"id": "opt_b", "text": "All training samples contribute equally to weight vector w"},
            {"id": "opt_c", "text": "The margin width must be zero"},
            {"id": "opt_d", "text": "The slack variables must equal the learning rate"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Complementary slackness requires that if y_i(w^T x_i + b) > 1 (point strictly outside margin), alpha_i MUST be 0. Thus w = sum alpha_i y_i x_i depends exclusively on support vectors.",
            "opt_b": "Misconception: Only the sparse subset of support vectors have alpha_i > 0.",
            "opt_c": "Misconception: Margin width is 2/||w|| > 0.",
            "opt_d": "Misconception: Slack variables measure margin margin violations, unrelated to learning rate."
        },
        "explanation": "By KKT complementary slackness, α_i = 0 for any point strictly outside the margin. The optimal decision boundary w = ∑ α_i y_i x_i is constructed entirely from the sparse subset where α_i > 0 (support vectors)."
    },
    {
        "id": "q_ml_38",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Clipped Surrogate Objective in Proximal Policy Optimization (PPO) in Reinforcement Learning, and why is clipping applied?",
        "options": [
            {"id": "opt_a", "text": "L^CLIP = E[ min( r_t(theta) * A_t, clip(r_t(theta), 1 - epsilon, 1 + epsilon) * A_t ) ], where r_t = pi_theta / pi_old; clipping penalizes policy updates moving too far from old policy, preventing disastrous performance collapses"},
            {"id": "opt_b", "text": "It clips gradient values to [-1, 1] to prevent NaN errors"},
            {"id": "opt_c", "text": "It truncates the length of every game episode to 10 steps"},
            {"id": "opt_d", "text": "It rounds all neural network weights to integer values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: PPO bounds probability ratio r_t(theta) within [1-epsilon, 1+epsilon] when multiplied by advantage A_t, serving as a first-order trust region method that ensures stable policy updates.",
            "opt_b": "Misconception: That is gradient clipping, a generic backpropagation trick.",
            "opt_c": "Misconception: That is max episode steps.",
            "opt_d": "Misconception: That describes extreme quantization."
        },
        "explanation": "PPO clips probability ratio r_t(θ) = π_θ(a|s) / π_old(a|s) to [1-ε, 1+ε], preventing destructive excessively large policy updates without requiring second-order natural gradient computation."
    },
    {
        "id": "q_ml_39",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "Why does Cosine Annealing with Warm Restarts (SGDR) enhance convergence and generalization in deep learning optimization?",
        "options": [
            {"id": "opt_a", "text": "It smoothly decays the learning rate via a cosine curve to allow fine-grained convergence in valleys, then periodically resets it to a high value to escape sharp, sub-optimal local minima toward wider, flatter minima"},
            {"id": "opt_b", "text": "It eliminates the need for computing gradients"},
            {"id": "opt_c", "text": "It forces the network to converge in exactly 1 epoch"},
            {"id": "opt_d", "text": "It resets all weights to random values every 10 epochs"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Loshchilov & Hutter showed that cyclical cosine annealing helps models navigate multivariant landscapes: restarts kick weights out of sharp minima, promoting convergence to flat basins that generalize better.",
            "opt_b": "Misconception: Learning rate schedules control step size; gradients are still computed.",
            "opt_c": "Misconception: Requires multiple cycles across dozens or hundreds of epochs.",
            "opt_d": "Misconception: Only learning rate is reset, not model weights."
        },
        "explanation": "Cosine annealing decays η along a cosine curve for convergence, then resets η to a peak. This warm restart provides kinetic energy to jump out of sharp local minima into broad, flat basins."
    },
    {
        "id": "q_ml_40",
        "skillId": "skill_ml",
        "skillName": "Machine Learning",
        "skillsTested": ["skill_ml", "skill_linalg"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In matrix calculus for neural networks, given affine transformation y = W x + b where x in R^n, W in R^{m x n}, and scalar loss L, what are the exact gradients dL/dW and dL/dx in terms of incoming gradient delta = dL/dy in R^m?",
        "options": [
            {"id": "opt_a", "text": "dL/dW = delta * x^T  (outer product, shape m x n)  and  dL/dx = W^T * delta  (shape n x 1)"},
            {"id": "opt_b", "text": "dL/dW = W * delta^T  and  dL/dx = delta * W"},
            {"id": "opt_c", "text": "dL/dW = delta * W  and  dL/dx = x * delta^T"},
            {"id": "opt_d", "text": "dL/dW = x * delta^T  and  dL/dx = W * delta"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By multivariable chain rule: dL/dW_ij = (dL/dy_i) * (dy_i/dW_ij) = delta_i * x_j, so dL/dW = delta x^T. For input: dL/dx_j = sum delta_i W_ij, so dL/dx = W^T delta.",
            "opt_b": "Misconception: Shape mismatch (W is m x n, delta^T is 1 x m).",
            "opt_c": "Misconception: Dimensions are incompatible for matrix multiplication.",
            "opt_d": "Misconception: Inverts outer product order and misses transpose on W."
        },
        "explanation": "By vector-matrix chain rule, ∂L/∂W = δ xᵀ (yielding an m × n outer product) and ∂L/∂x = Wᵀ δ (propagating the gradient backward to the previous layer)."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/machineLearning.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const MACHINE_LEARNING_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Machine Learning questions in {out_file}")

if __name__ == '__main__':
    main()
