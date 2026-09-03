import json
import os

questions = [
    # Difficulty 1: Recall (q_eval_01 to q_eval_08)
    {
        "id": "q_eval_01",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "In a binary classification confusion matrix, what does a False Positive (FP) represent?",
        "options": [
            {"id": "opt_a", "text": "An actual negative instance that was incorrectly predicted as positive (Type I error)"},
            {"id": "opt_b", "text": "An actual positive instance that was correctly predicted as positive"},
            {"id": "opt_c", "text": "An actual positive instance that was incorrectly predicted as negative"},
            {"id": "opt_d", "text": "An actual negative instance that was correctly predicted as negative"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: False Positive is a false alarm: actual class 0 predicted as class 1.",
            "opt_b": "Misconception: This is a True Positive (TP).",
            "opt_c": "Misconception: This is a False Negative (FN, Type II error).",
            "opt_d": "Misconception: This is a True Negative (TN)."
        },
        "explanation": "A False Positive occurs when the ground truth is Negative (0), but the model incorrectly predicts Positive (1)."
    },
    {
        "id": "q_eval_02",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the formula for Classification Precision?",
        "options": [
            {"id": "opt_a", "text": "TP / (TP + FP)"},
            {"id": "opt_b", "text": "TP / (TP + FN)"},
            {"id": "opt_c", "text": "(TP + TN) / Total"},
            {"id": "opt_d", "text": "TN / (TN + FP)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Precision measures the accuracy of positive predictions: fraction of predicted positives that are truly positive.",
            "opt_b": "Misconception: TP / (TP + FN) is Recall (Sensitivity).",
            "opt_c": "Misconception: This is overall Accuracy.",
            "opt_d": "Misconception: This is Specificity."
        },
        "explanation": "Precision evaluates prediction purity: out of all cases predicted as positive (TP + FP), what fraction were actually positive (TP)."
    },
    {
        "id": "q_eval_03",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the formula for Classification Recall (also known as Sensitivity or True Positive Rate)?",
        "options": [
            {"id": "opt_a", "text": "TP / (TP + FN)"},
            {"id": "opt_b", "text": "TP / (TP + FP)"},
            {"id": "opt_c", "text": "TN / (TN + FN)"},
            {"id": "opt_d", "text": "FN / (TP + FN)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Recall measures coverage: fraction of actual positive instances that the model successfully caught.",
            "opt_b": "Misconception: This is Precision.",
            "opt_c": "Misconception: Negative Predictive Value.",
            "opt_d": "Misconception: False Negative Rate (Miss Rate)."
        },
        "explanation": "Recall is the proportion of actual positives that were correctly classified: Recall = TP / (TP + FN)."
    },
    {
        "id": "q_eval_04",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the formula for Mean Squared Error (MSE) in regression evaluation?",
        "options": [
            {"id": "opt_a", "text": "(1 / n) * sum_{i=1}^n (y_i - y_hat_i)^2"},
            {"id": "opt_b", "text": "(1 / n) * sum_{i=1}^n |y_i - y_hat_i|"},
            {"id": "opt_c", "text": "sqrt((1 / n) * sum_{i=1}^n (y_i - y_hat_i)^2)"},
            {"id": "opt_d", "text": "max |y_i - y_hat_i|"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: MSE is the arithmetic average of the squared prediction errors.",
            "opt_b": "Misconception: This is Mean Absolute Error (MAE).",
            "opt_c": "Misconception: This is Root Mean Squared Error (RMSE).",
            "opt_d": "Misconception: This is Maximum Residual Error."
        },
        "explanation": "MSE is calculated by taking the average of the squared differences between observed values y_i and model predictions ŷ_i."
    },
    {
        "id": "q_eval_05",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What characterizes an 'overfitted' machine learning model?",
        "options": [
            {"id": "opt_a", "text": "Near-zero training error but high test/validation error, failing to generalize to unseen data by memorizing training noise"},
            {"id": "opt_b", "text": "High training error and high test error"},
            {"id": "opt_c", "text": "A model with too few parameters to capture linear trends"},
            {"id": "opt_d", "text": "A model that runs too slowly on GPUs"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Overfitting occurs when high model capacity memorizes sample idiosyncrasies and random noise, degrading out-of-sample performance.",
            "opt_b": "Misconception: High training and test error indicates underfitting (high bias).",
            "opt_c": "Misconception: Too few parameters causes underfitting, not overfitting.",
            "opt_d": "Misconception: Compute latency is a system bottleneck, not statistical overfitting."
        },
        "explanation": "Overfitting happens when a model learns the training set too well, capturing noise and specific outliers, leading to poor generalization on unseen validation data."
    },
    {
        "id": "q_eval_06",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What are the x-axis and y-axis of a Receiver Operating Characteristic (ROC) curve?",
        "options": [
            {"id": "opt_a", "text": "x-axis: False Positive Rate (FPR), y-axis: True Positive Rate (TPR / Recall)"},
            {"id": "opt_b", "text": "x-axis: Precision, y-axis: Recall"},
            {"id": "opt_c", "text": "x-axis: Training loss, y-axis: Validation loss"},
            {"id": "opt_d", "text": "x-axis: Sample size, y-axis: Variance"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The ROC curve plots TPR vs FPR across all classification decision thresholds in [0, 1].",
            "opt_b": "Misconception: This defines the Precision-Recall (PR) curve.",
            "opt_c": "Misconception: This is a learning curve.",
            "opt_d": "Misconception: This is a sample complexity curve."
        },
        "explanation": "The ROC curve plots Sensitivity (True Positive Rate) on the vertical y-axis against 1 - Specificity (False Positive Rate) on the horizontal x-axis."
    },
    {
        "id": "q_eval_07",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the formula for the F1-Score in terms of Precision (P) and Recall (R)?",
        "options": [
            {"id": "opt_a", "text": "F1 = 2 * (P * R) / (P + R)"},
            {"id": "opt_b", "text": "F1 = (P + R) / 2"},
            {"id": "opt_c", "text": "F1 = sqrt(P * R)"},
            {"id": "opt_d", "text": "F1 = P * R"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: F1 is the harmonic mean of precision and recall: 2 / (1/P + 1/R) = 2PR / (P+R).",
            "opt_b": "Misconception: Arithmetic mean, which would allow a model with 100% precision and 0% recall to misleadingly score 50%.",
            "opt_c": "Misconception: Geometric mean (G-measure).",
            "opt_d": "Misconception: Product of precision and recall."
        },
        "explanation": "The F1-score is the harmonic mean of precision and recall. It heavily penalizes extreme imbalances between the two metrics."
    },
    {
        "id": "q_eval_08",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the purpose of the Test Set in a standard Train-Validation-Test workflow?",
        "options": [
            {"id": "opt_a", "text": "To provide an unbiased, final evaluation of the final model's generalization error after all training and hyperparameter tuning are completely finished"},
            {"id": "opt_b", "text": "To optimize hyperparameters such as learning rate and regularization penalty"},
            {"id": "opt_c", "text": "To update model weights via gradient descent"},
            {"id": "opt_d", "text": "To augment the training dataset when samples are scarce"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The test set must be touched only once at the very end to prevent data leakage and optimistic bias.",
            "opt_b": "Misconception: Hyperparameter tuning must be done strictly on the Validation set.",
            "opt_c": "Misconception: Weight updates occur exclusively on the Training set.",
            "opt_d": "Misconception: Mixing test data into training is data contamination."
        },
        "explanation": "The test set acts as an unseen holdout dataset reserved solely for estimating real-world performance after all modeling decisions have been locked."
    },

    # Difficulty 2: Comprehension (q_eval_09 to q_eval_16)
    {
        "id": "q_eval_09",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the 'Accuracy Paradox' in imbalanced classification datasets (e.g., fraud detection where 99.5% of transactions are legitimate)?",
        "options": [
            {"id": "opt_a", "text": "A naive model predicting the majority class for 100% of samples achieves 99.5% accuracy while possessing zero practical utility (0% recall on fraud)"},
            {"id": "opt_b", "text": "Models with higher accuracy always have higher business ROI"},
            {"id": "opt_c", "text": "Accuracy cannot be computed if sample count is odd"},
            {"id": "opt_d", "text": "Increasing training data always causes accuracy to decrease"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Accuracy is dominated by the majority class, masking complete failure to detect the critical minority positive class.",
            "opt_b": "Misconception: High accuracy with 0% minority recall yields catastrophic business losses.",
            "opt_c": "Misconception: Accuracy formula works on any positive sample count.",
            "opt_d": "Misconception: More data generally improves model performance."
        },
        "explanation": "The Accuracy Paradox demonstrates that on imbalanced data, high accuracy can be achieved by a trivial model that never detects the minority positive class, rendering accuracy deceptive."
    },
    {
        "id": "q_eval_10",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why is the Precision-Recall (PR) curve strongly preferred over the ROC curve when evaluating classifiers on highly skewed, imbalanced datasets?",
        "options": [
            {"id": "opt_a", "text": "Because ROC's False Positive Rate (FP / (FP + TN)) is diluted by massive True Negative counts, presenting an overly optimistic picture, whereas PR metrics focus exclusively on the positive minority class"},
            {"id": "opt_b", "text": "Because PR curves can only be plotted for regression problems"},
            {"id": "opt_c", "text": "Because ROC curves require computing matrix inverses"},
            {"id": "opt_d", "text": "Because PR curves are always strictly horizontal"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: When TN is in millions, FP/(FP+TN) remains tiny even with thousands of false alarms, inflating AUC-ROC. PR curve directly exposes FP through Precision.",
            "opt_b": "Misconception: PR curve is an evaluation metric for classification, not regression.",
            "opt_c": "Misconception: ROC requires only sorting predicted probabilities.",
            "opt_d": "Misconception: PR curves typically slope downward as recall increases."
        },
        "explanation": "In severe class imbalance, huge TN numbers suppress FPR, making ROC look misleadingly excellent. PR curves do not incorporate TN, exposing false alarms directly."
    },
    {
        "id": "q_eval_11",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why does Root Mean Squared Error (RMSE) penalize large outlier errors significantly more severely than Mean Absolute Error (MAE)?",
        "options": [
            {"id": "opt_a", "text": "Because errors are squared before averaging in RMSE, making a single error of 10 contribute 100 to the sum, whereas in MAE it contributes only 10"},
            {"id": "opt_b", "text": "Because RMSE takes the logarithm of the errors"},
            {"id": "opt_c", "text": "Because MAE discards negative errors entirely"},
            {"id": "opt_d", "text": "Because RMSE is only calculated on training data"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Squaring disproportionately amplifies large residuals: a 10x error creates a 100x penalty in MSE/RMSE.",
            "opt_b": "Misconception: That describes RMSLE (Root Mean Squared Logarithmic Error).",
            "opt_c": "Misconception: MAE uses absolute values |e_i|, correctly retaining magnitude.",
            "opt_d": "Misconception: Both metrics evaluate training, validation, or test sets."
        },
        "explanation": "Because RMSE squares residuals before averaging, larger discrepancies exert quadratic weight on the score, making RMSE highly sensitive to outliers compared to linear MAE."
    },
    {
        "id": "q_eval_12",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the key advantage of Stratified k-Fold Cross-Validation over standard k-Fold Cross-Validation?",
        "options": [
            {"id": "opt_a", "text": "It preserves the exact percentage of samples for each target class within each fold, ensuring folds have identical class distribution to the overall dataset"},
            {"id": "opt_b", "text": "It runs k times faster on multicore CPUs"},
            {"id": "opt_c", "text": "It eliminates the need for training loops"},
            {"id": "opt_d", "text": "It automatically generates synthetic features"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Stratification ensures that rare classes are equally represented across all k folds, preventing folds with zero positive samples.",
            "opt_b": "Misconception: Stratification rearranges indices; compute time is identical.",
            "opt_c": "Misconception: All cross-validation requires training on k-1 folds.",
            "opt_d": "Misconception: That describes SMOTE or feature engineering."
        },
        "explanation": "Stratified k-fold cross-validation enforces consistent class balance across every split, avoiding folds with biased or zero positive cases in imbalanced datasets."
    },
    {
        "id": "q_eval_13",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does an Area Under the ROC Curve (AUC-ROC) of 0.5 represent?",
        "options": [
            {"id": "opt_a", "text": "Performance no better than random guessing (the diagonal line)"},
            {"id": "opt_b", "text": "Perfect classification accuracy"},
            {"id": "opt_c", "text": "A model that inverts all predictions (perfect inverse classifier)"},
            {"id": "opt_d", "text": "50% false positive rate at zero threshold"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: An AUC of 0.5 represents a completely uninformative model whose predictions are equivalent to coin tosses.",
            "opt_b": "Misconception: Perfect classification produces AUC = 1.0.",
            "opt_c": "Misconception: A perfectly inverted classifier has AUC = 0.0.",
            "opt_d": "Misconception: Confuses AUC area with single threshold coordinates."
        },
        "explanation": "AUC-ROC = 0.5 corresponds to the diagonal chance line, meaning the model has no discriminative ability between positive and negative classes."
    },
    {
        "id": "q_eval_14",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "Why is the Harmonic Mean used instead of the Arithmetic Mean when calculating the F1-Score?",
        "options": [
            {"id": "opt_a", "text": "The harmonic mean is pulled strongly toward the lower value, preventing a model with high precision and near-zero recall from receiving an artificially acceptable score"},
            {"id": "opt_b", "text": "Because precision and recall are negative numbers"},
            {"id": "opt_c", "text": "Because arithmetic mean cannot be calculated for fractions"},
            {"id": "opt_d", "text": "Because the harmonic mean is always larger than the arithmetic mean"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If P = 1.0 and R = 0.01, arithmetic mean is ~0.505, while harmonic mean is 2(0.01)/(1.01) ≈ 0.0198, correctly penalizing the model.",
            "opt_b": "Misconception: Both metrics are in [0, 1].",
            "opt_c": "Misconception: Arithmetic mean applies to all real numbers.",
            "opt_d": "Misconception: By AM-GM-HM inequality, Harmonic Mean is always less than or equal to Arithmetic Mean."
        },
        "explanation": "The harmonic mean scales toward the lower of the two components, ensuring that if either precision or recall is low, the F1-score drops accordingly."
    },
    {
        "id": "q_eval_15",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What happens when you lower the classification probability threshold from 0.5 to 0.2 for predicting the positive class?",
        "options": [
            {"id": "opt_a", "text": "Recall increases (fewer false negatives), but Precision typically decreases (more false positives)"},
            {"id": "opt_b", "text": "Recall decreases and Precision increases"},
            {"id": "opt_c", "text": "Both Precision and Recall are guaranteed to increase"},
            {"id": "opt_d", "text": "The model's weights and coefficients change"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: A lower threshold classifies more samples as positive, catching more true positives (higher recall) at the cost of more false alarms (lower precision).",
            "opt_b": "Misconception: That happens when raising the threshold (e.g. to 0.8).",
            "opt_c": "Misconception: Precision and recall exhibit an inherent trade-off.",
            "opt_d": "Misconception: Thresholding is purely post-processing; model weights are fixed."
        },
        "explanation": "Lowering the decision threshold makes the classifier more aggressive in predicting positive: True Positives rise (increasing Recall), but False Positives also rise (reducing Precision)."
    },
    {
        "id": "q_eval_16",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does a negative R^2 score indicate about a regression model evaluated on holdout test data?",
        "options": [
            {"id": "opt_a", "text": "The model's predictions perform worse than simply predicting the horizontal mean of the target variable for every sample"},
            {"id": "opt_b", "text": "The test data has negative numbers"},
            {"id": "opt_c", "text": "The model has zero residuals"},
            {"id": "opt_d", "text": "R^2 is mathematically impossible to be negative"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: R^2 = 1 - (SS_res / SS_tot). If SS_res > SS_tot, the model error exceeds the variance of a baseline constant mean predictor, yielding R^2 < 0.",
            "opt_b": "Misconception: Target values can be positive or negative; R^2 depends on residual ratios.",
            "opt_c": "Misconception: Zero residuals gives perfect R^2 = 1.0.",
            "opt_d": "Misconception: In out-of-sample evaluation, R^2 can be arbitrarily negative."
        },
        "explanation": "On test data, if the model's Mean Squared Error exceeds the baseline variance of the target, SS_res > SS_tot, making R² = 1 - (SS_res / SS_tot) negative."
    },

    # Difficulty 3: Application (q_eval_17 to q_eval_24)
    {
        "id": "q_eval_17",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Given the confusion matrix:\n- True Positives (TP): 80\n- False Positives (FP): 20\n- False Negatives (FN): 20\n- True Negatives (TN): 880\nCalculate the Precision and Recall.",
        "options": [
            {"id": "opt_a", "text": "Precision = 80%, Recall = 80%"},
            {"id": "opt_b", "text": "Precision = 88%, Recall = 80%"},
            {"id": "opt_c", "text": "Precision = 80%, Recall = 97.8%"},
            {"id": "opt_d", "text": "Precision = 90%, Recall = 90%"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Precision = TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 80%. Recall = TP / (TP + FN) = 80 / (80 + 20) = 80 / 100 = 80%.",
            "opt_b": "Misconception: Inverts denominators.",
            "opt_c": "Misconception: Confuses recall with specificity (880/900 ≈ 97.8%).",
            "opt_d": "Misconception: Arithmetic error."
        },
        "explanation": "Precision = 80 / (80 + 20) = 80 / 100 = 0.80. Recall = 80 / (80 + 20) = 80 / 100 = 0.80."
    },
    {
        "id": "q_eval_18",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If Precision is 60% (0.6) and Recall is 100% (1.0), calculate the F1-score.",
        "options": [
            {"id": "opt_a", "text": "0.75 (75%)"},
            {"id": "opt_b", "text": "0.80 (80%)"},
            {"id": "opt_c", "text": "0.60 (60%)"},
            {"id": "opt_d", "text": "0.90 (90%)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: F1 = 2 * (0.6 * 1.0) / (0.6 + 1.0) = 1.2 / 1.6 = 3/4 = 0.75.",
            "opt_b": "Misconception: Arithmetic mean (0.6 + 1.0) / 2 = 0.80.",
            "opt_c": "Misconception: Takes the minimum value.",
            "opt_d": "Misconception: Arithmetic error."
        },
        "explanation": "F1 = 2 * (P * R) / (P + R) = 2 * (0.6 * 1.0) / (0.6 + 1.0) = 1.2 / 1.6 = 0.75."
    },
    {
        "id": "q_eval_19",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "A dataset of 4 instances has actual binary labels y = [1, 0, 1, 0] and model predicted probabilities p = [0.9, 0.1, 0.8, 0.2]. Calculate the Binary Cross-Entropy (Log Loss) in terms of natural log ln.",
        "options": [
            {"id": "opt_a", "text": "-0.25 * [ln(0.9) + ln(0.9) + ln(0.8) + ln(0.8)] ≈ 0.164"},
            {"id": "opt_b", "text": "0.0"},
            {"id": "opt_c", "text": "0.50"},
            {"id": "opt_d", "text": "-0.25 * [ln(0.1) + ln(0.2)] ≈ 0.978"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For y=1: ln(0.9) and ln(0.8). For y=0: ln(1 - 0.1) = ln(0.9) and ln(1 - 0.2) = ln(0.8). Mean loss = -(2*ln(0.9) + 2*ln(0.8))/4 ≈ 0.164.",
            "opt_b": "Misconception: Log loss is only 0 if probabilities are exactly 1.0 and 0.0.",
            "opt_c": "Misconception: Confuses probability midpoint with loss.",
            "opt_d": "Misconception: Computes loss for wrong class labels."
        },
        "explanation": "Log Loss = -1/n ∑ [y_i ln p_i + (1 - y_i) ln(1 - p_i)]. Here, terms are ln(0.9), ln(0.9), ln(0.8), ln(0.8). Average negative log likelihood ≈ 0.164."
    },
    {
        "id": "q_eval_20",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In evaluating a multiclass model across 3 classes, macro-averaged F1 and micro-averaged F1 are computed. How is Macro-F1 calculated?",
        "options": [
            {"id": "opt_a", "text": "Calculate the F1-score independently for each class, then compute their unweighted arithmetic mean: (F1_1 + F1_2 + F1_3) / 3"},
            {"id": "opt_b", "text": "Sum the total TPs, FPs, and FNs globally across all classes and compute one single global F1-score"},
            {"id": "opt_c", "text": "Multiply all class F1 scores together"},
            {"id": "opt_d", "text": "Weigh each class F1 score by its sample support"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Macro-averaging treats all classes equally, regardless of support: arithmetic mean of class F1s.",
            "opt_b": "Misconception: This defines Micro-averaged F1.",
            "opt_c": "Misconception: Multiplicative averaging.",
            "opt_d": "Misconception: This defines Weighted-averaged F1."
        },
        "explanation": "Macro-average computes metric per class independently and takes the simple unweighted average: Macro_F1 = (1/K) ∑ F1_k, giving equal importance to rare and common classes."
    },
    {
        "id": "q_eval_21",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For actual values y = [10, 20, 30] and model predictions y_hat = [12, 18, 33], what is the Mean Absolute Error (MAE)?",
        "options": [
            {"id": "opt_a", "text": "(|10 - 12| + |20 - 18| + |30 - 33|) / 3 = (2 + 2 + 3) / 3 = 7 / 3 ≈ 2.33"},
            {"id": "opt_b", "text": "(4 + 4 + 9) / 3 = 17 / 3 ≈ 5.67"},
            {"id": "opt_c", "text": "sqrt(5.67) ≈ 2.38"},
            {"id": "opt_d", "text": "7.0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Residuals are | -2 | = 2, | +2 | = 2, | -3 | = 3. MAE = (2 + 2 + 3) / 3 = 7/3 ≈ 2.33.",
            "opt_b": "Misconception: This is the Mean Squared Error (MSE) = 17/3 ≈ 5.67.",
            "opt_c": "Misconception: This is the Root Mean Squared Error (RMSE) ≈ 2.38.",
            "opt_d": "Misconception: Sum of absolute errors without dividing by n = 3."
        },
        "explanation": "MAE = (1/3) [|10 - 12| + |20 - 18| + |30 - 33|] = (2 + 2 + 3) / 3 = 7 / 3 ≈ 2.33."
    },
    {
        "id": "q_eval_22",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In computer vision object detection, what is the Intersection over Union (IoU / Jaccard Index) of a predicted bounding box B_p and ground truth box B_gt?",
        "options": [
            {"id": "opt_a", "text": "Area(B_p ∩ B_gt) / Area(B_p ∪ B_gt)"},
            {"id": "opt_b", "text": "Area(B_p ∩ B_gt) / Area(B_gt)"},
            {"id": "opt_c", "text": "Area(B_p ∪ B_gt) / Area(B_p ∩ B_gt)"},
            {"id": "opt_d", "text": "Distance between box centroids"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: IoU measures overlap area divided by total union area: IoU >= 0.5 is standard threshold for true positive.",
            "opt_b": "Misconception: Divides only by ground truth area.",
            "opt_c": "Misconception: Inverts numerator and denominator.",
            "opt_d": "Misconception: Centroid distance does not account for box size/shape."
        },
        "explanation": "IoU = Area of Overlap / Area of Union = Area(B_p ∩ B_gt) / Area(B_p ∪ B_gt). It ranges from 0 (disjoint) to 1 (perfect match)."
    },
    {
        "id": "q_eval_23",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the Brier Score for evaluating the calibration of probabilistic binary predictions p_i for binary outcomes y_i in {0, 1}?",
        "options": [
            {"id": "opt_a", "text": "(1 / n) * sum_{i=1}^n (p_i - y_i)^2 — essentially MSE applied directly to probabilities"},
            {"id": "opt_b", "text": "(1 / n) * sum_{i=1}^n |p_i - y_i|"},
            {"id": "opt_c", "text": "The area under the Precision-Recall curve"},
            {"id": "opt_d", "text": "The correlation between p_i and y_i"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Brier score is the mean squared difference between predicted probability and actual binary indicator: lower is better (0 is perfect).",
            "opt_b": "Misconception: L1 loss version, not standard Brier score.",
            "opt_c": "Misconception: PR-AUC evaluates ranking, not calibration.",
            "opt_d": "Misconception: Pearson correlation is scale-dependent and doesn't measure probability calibration."
        },
        "explanation": "The Brier score measures calibration and refinement: BS = (1/n) ∑ (p_i - y_i)². Lower values indicate better calibrated, more accurate probabilistic forecasts."
    },
    {
        "id": "q_eval_24",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "If a regression model has residual sum of squares SS_res = 20 and total sum of squares SS_tot = 100, what is its R^2 score?",
        "options": [
            {"id": "opt_a", "text": "R^2 = 1 - (20 / 100) = 1 - 0.20 = 0.80 (80%)"},
            {"id": "opt_b", "text": "R^2 = 0.20 (20%)"},
            {"id": "opt_c", "text": "R^2 = 5.0"},
            {"id": "opt_d", "text": "R^2 = -0.80"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: R^2 = 1 - SS_res / SS_tot = 1 - 20/100 = 0.80.",
            "opt_b": "Misconception: Forgets to subtract from 1 (unexplained variance ratio).",
            "opt_c": "Misconception: SS_tot / SS_res ratio.",
            "opt_d": "Misconception: Negative sign error."
        },
        "explanation": "R² = 1 - (SS_res / SS_tot) = 1 - (20 / 100) = 0.80, meaning the model accounts for 80% of the target's total variation."
    },

    # Difficulty 4: Analysis (q_eval_25 to q_eval_32)
    {
        "id": "q_eval_25",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_prob"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the formal probabilistic interpretation of the Area Under the ROC Curve (AUC-ROC)?",
        "options": [
            {"id": "opt_a", "text": "The probability that the classifier ranks a randomly chosen positive instance higher than a randomly chosen negative instance: P(Score(X_pos) > Score(X_neg))"},
            {"id": "opt_b", "text": "The probability that the model achieves 100% precision"},
            {"id": "opt_c", "text": "The percentage of dataset instances correctly classified at threshold 0.5"},
            {"id": "opt_d", "text": "The expected value of the training loss"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: AUC-ROC is mathematically equivalent to the Wilcoxon-Mann-Whitney U statistic: the pairwise ranking probability between positive and negative classes.",
            "opt_b": "Misconception: AUC is threshold-independent and does not equal precision.",
            "opt_c": "Misconception: That describes accuracy at 0.5; AUC evaluates all possible thresholds simultaneously.",
            "opt_d": "Misconception: Training loss is a surrogate optimization objective."
        },
        "explanation": "AUC equals the probability that a random positive example receives a higher predicted score than a random negative example: AUC = P(f(x+) > f(x-))."
    },
    {
        "id": "q_eval_26",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In the Bias-Variance decomposition of Mean Squared Error, E[(y - y_hat)^2] = Bias(y_hat)^2 + Var(y_hat) + sigma^2, what does the term sigma^2 represent?",
        "options": [
            {"id": "opt_a", "text": "Irreducible error (intrinsic noise in the true data-generating process that no model can eliminate)"},
            {"id": "opt_b", "text": "Error caused by using too small a neural network architecture"},
            {"id": "opt_c", "text": "Variance caused by differences between training folds"},
            {"id": "opt_d", "text": "Error introduced by floating-point rounding"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: sigma^2 is the irreducible noise variance of the true environment y = f(x) + epsilon where Var(epsilon) = sigma^2.",
            "opt_b": "Misconception: That contributes to model Bias^2.",
            "opt_c": "Misconception: That is the model Variance Var(y_hat).",
            "opt_d": "Misconception: Numerical artifact."
        },
        "explanation": "The irreducible error σ² represents intrinsic stochastic noise in the outcome that cannot be eliminated regardless of how complex or perfectly tuned the model is."
    },
    {
        "id": "q_eval_27",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is Data Leakage in machine learning, and why is fitting a feature scaler (e.g. StandardScaler) on the entire dataset prior to train/test splitting a critical flaw?",
        "options": [
            {"id": "opt_a", "text": "Information from the test set (mean and std) leaks into the training pipeline, producing optimistically biased cross-validation scores that fail to replicate in real-world deployment"},
            {"id": "opt_b", "text": "It causes the computer's RAM memory to leak and crash"},
            {"id": "opt_c", "text": "It converts numeric features into string variables"},
            {"id": "opt_d", "text": "It forces all weights to zero"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Scalers must be fit ONLY on training folds and transformed on test folds; fitting on all data shares future distribution statistics with the training process.",
            "opt_b": "Misconception: Colloquial confusion with memory management leaks in C/C++.",
            "opt_c": "Misconception: Scaling preserves float types.",
            "opt_d": "Misconception: Scaling normalizes variance to 1, not zero weights."
        },
        "explanation": "Fitting preprocessing steps (scaling, imputation) on the full dataset before splitting leaks test data information into training, creating over-optimistic performance estimates."
    },
    {
        "id": "q_eval_28",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why is Adjusted R^2 used instead of standard R^2 when comparing multiple regression models with different numbers of predictors?",
        "options": [
            {"id": "opt_a", "text": "Standard R^2 monotonically increases (or stays constant) whenever any variable is added, even pure random noise; Adjusted R^2 penalizes extra parameters: 1 - [(1-R^2)(n-1)/(n-p-1)]"},
            {"id": "opt_b", "text": "Adjusted R^2 converts R^2 into a percentage between 0 and 100%"},
            {"id": "opt_c", "text": "Adjusted R^2 is only used when data has negative targets"},
            {"id": "opt_d", "text": "Standard R^2 cannot be computed with more than 2 features"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Adding predictors never increases SS_res in OLS; adjusted R^2 includes a degree-of-freedom penalty (n-1)/(n-p-1) that decreases if added features lack explanatory power.",
            "opt_b": "Misconception: Both standard and adjusted R^2 can be expressed as percentages.",
            "opt_c": "Misconception: Has nothing to do with target signs.",
            "opt_d": "Misconception: Standard R^2 is readily calculated for any p."
        },
        "explanation": "Standard R² mechanically increases with every added predictor. Adjusted R² penalizes model complexity (p parameters for n samples), only increasing if the new feature improves fit beyond chance."
    },
    {
        "id": "q_eval_29",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the difference between Platt Scaling and Isotonic Regression for post-hoc probability calibration of classifiers (e.g. SVMs or boosted trees)?",
        "options": [
            {"id": "opt_a", "text": "Platt scaling fits a parametric logistic sigmoid 1 / (1 + exp(A*s + B)) to model scores; Isotonic regression fits a non-parametric piecewise constant monotonic step function"},
            {"id": "opt_b", "text": "Platt scaling is only for regression; Isotonic is for clustering"},
            {"id": "opt_c", "text": "Platt scaling requires 1,000,000 samples while Isotonic requires only 10"},
            {"id": "opt_d", "text": "Isotonic regression assumes errors are normally distributed"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Platt scaling uses a 2-parameter logistic curve (effective on small datasets, robust to overfitting); Isotonic uses pool adjacent violators algorithm (PAVA), more flexible with abundant data.",
            "opt_b": "Misconception: Both are post-hoc calibration methods for classification probabilities.",
            "opt_c": "Misconception: Platt scaling works well on small datasets; Isotonic overfits on small datasets (< 1000 samples).",
            "opt_d": "Misconception: Isotonic regression is non-parametric."
        },
        "explanation": "Platt scaling fits a logistic regression to outputs. Isotonic regression fits a non-parametric monotonic piecewise-constant function, offering greater flexibility when validation data is abundant."
    },
    {
        "id": "q_eval_30",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What makes Matthews Correlation Coefficient (MCC) a superior metric to F1-Score for binary classification on imbalanced datasets?",
        "options": [
            {"id": "opt_a", "text": "MCC utilizes all four cells of the confusion matrix (TP, FP, TN, FN) symmetrically and yields +1 (perfect), 0 (random), -1 (inverse); F1 completely ignores True Negatives and depends on which class is labeled positive"},
            {"id": "opt_b", "text": "MCC is always 10 times faster to calculate"},
            {"id": "opt_c", "text": "MCC only applies to neural networks"},
            {"id": "opt_d", "text": "F1 score is undefined when precision is 0.5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: MCC = (TP*TN - FP*FN) / sqrt((TP+FP)(TP+FN)(TN+FP)(TN+FN)). It is symmetric under label swap and incorporates True Negatives.",
            "opt_b": "Misconception: Computational difference is negligible.",
            "opt_c": "Misconception: MCC is an evaluation metric applicable to any binary classifier.",
            "opt_d": "Misconception: F1 is well-defined for all non-zero denominator cases."
        },
        "explanation": "MCC is a discretized Pearson correlation between actual and predicted binaries incorporating all four confusion matrix quadrants symmetrically. F1 ignores TN and varies when positive/negative labels are swapped."
    },
    {
        "id": "q_eval_31",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why is Permutation Feature Importance preferred over Random Forest's default Impurity-based (Gini) feature importance?",
        "options": [
            {"id": "opt_a", "text": "Gini importance is calculated on training data and severely biases toward high-cardinality numerical/categorical features; Permutation importance is computed on held-out validation data and measures actual drops in model performance"},
            {"id": "opt_b", "text": "Permutation importance requires zero compute time"},
            {"id": "opt_c", "text": "Gini importance cannot be calculated on decision trees"},
            {"id": "opt_d", "text": "Permutation importance always assigns 0 to correlated features"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Mean Decrease Impurity overfits training splits and favors features with many unique values (e.g. IDs). Permutation importance shuffles features on validation data, reflecting genuine predictive utility.",
            "opt_b": "Misconception: Permutation requires re-evaluating the model p times on test data.",
            "opt_c": "Misconception: Gini importance is standard in CART/Random Forest trees.",
            "opt_d": "Misconception: Correlated features dilute importance across each other, but do not automatically drop to zero."
        },
        "explanation": "Default Gini impurity importance artificially favors high-cardinality features and reflects training data memorization. Permutation importance tests generalization drop on unseen validation data."
    },
    {
        "id": "q_eval_32",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "On a Reliability Diagram (Calibration Curve), if the curve for a binary classifier sits substantially below the 45-degree diagonal line, what does that indicate?",
        "options": [
            {"id": "opt_a", "text": "The model is overconfident: its predicted probabilities are systematically higher than the true empirical frequency of positive outcomes"},
            {"id": "opt_b", "text": "The model is underconfident: predicted probabilities are lower than empirical frequencies"},
            {"id": "opt_c", "text": "The model has 100% accuracy"},
            {"id": "opt_d", "text": "The model is perfectly calibrated"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If curve lies below diagonal (e.g. predicted prob = 0.80, but empirical fraction is only 0.50), the model is systematically overconfident.",
            "opt_b": "Misconception: Underconfidence produces a curve sitting ABOVE the diagonal.",
            "opt_c": "Misconception: Calibration curves measure probability accuracy, not binary label accuracy.",
            "opt_d": "Misconception: Perfect calibration lies exactly along the 45-degree diagonal line."
        },
        "explanation": "When predicted probabilities exceed actual observed fraction of positives, the curve drops below the diagonal, indicating the model is overconfident in its probabilistic forecasts."
    },

    # Difficulty 5: Synthesis (q_eval_33 to q_eval_40)
    {
        "id": "q_eval_33",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How is Expected Calibration Error (ECE) computed across M probability bins B_1, ..., B_M?",
        "options": [
            {"id": "opt_a", "text": "ECE = sum_{m=1}^M [ (|B_m| / n) * |acc(B_m) - conf(B_m)| ], weighting bin calibration gaps by bin sample frequency"},
            {"id": "opt_b", "text": "ECE = max_m |acc(B_m) - conf(B_m)|"},
            {"id": "opt_c", "text": "ECE = (1 / M) * sum_{m=1}^M [acc(B_m)]"},
            {"id": "opt_d", "text": "ECE is the area under the ROC curve minus 0.5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: ECE takes the weighted average absolute difference between predicted confidence conf(B_m) and empirical accuracy acc(B_m) across all bins.",
            "opt_b": "Misconception: That defines Maximum Calibration Error (MCE).",
            "opt_c": "Misconception: Unweighted accuracy sum.",
            "opt_d": "Misconception: Conflates calibration with discrimination."
        },
        "explanation": "ECE partitions probability predictions into M bins and computes the weighted average absolute difference between empirical accuracy and average confidence: ECE = ∑ (|B_m|/n) |acc(B_m) - conf(B_m)|."
    },
    {
        "id": "q_eval_34",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is Normalized Discounted Cumulative Gain (NDCG@k) in Information Retrieval and Recommender Systems, and why is logarithmic discounting applied?",
        "options": [
            {"id": "opt_a", "text": "NDCG@k = DCG@k / IDCG@k, where DCG@k = sum_{i=1}^k rel_i / log_2(i + 1); log discounting penalizes relevant items appearing lower in the ranked list, reflecting user scanning decay"},
            {"id": "opt_b", "text": "It computes the classification accuracy of top k items"},
            {"id": "opt_c", "text": "It sums relevance scores without position weighting"},
            {"id": "opt_d", "text": "It divides precision by recall at rank k"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: DCG discounts relevance logarithmically by rank position i; dividing by ideal sorted DCG (IDCG) normalizes the metric to [0, 1].",
            "opt_b": "Misconception: Accuracy ignores item ranking order.",
            "opt_c": "Misconception: That is Cumulative Gain (CG), which ignores ranking order entirely.",
            "opt_d": "Misconception: Conflates ranking gain with P/R."
        },
        "explanation": "NDCG@k measures ranking quality with graded relevance: items ranked lower receive a logarithmic position penalty 1/log₂(i+1). Normalizing by ideal ranking (IDCG) scales the metric to [0, 1]."
    },
    {
        "id": "q_eval_35",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What mathematical guarantee do Shapley values (SHAP) provide that makes them the unique additive feature attribution method in Explainable AI?",
        "options": [
            {"id": "opt_a", "text": "They uniquely satisfy all four cooperative game theory axioms: Efficiency (attributions sum to f(x) - E[f(x)]), Symmetry, Dummy (Null player), and Additivity"},
            {"id": "opt_b", "text": "They guarantee that models never overfit on test data"},
            {"id": "opt_c", "text": "They convert any black-box model into a single linear regression"},
            {"id": "opt_d", "text": "They compute exact feature attributions in O(1) time"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Lloyd Shapley (1953 Nobel laureate) proved that Shapley values are the unique allocation satisfying efficiency, symmetry, dummy player, and additivity axioms.",
            "opt_b": "Misconception: SHAP is an interpretability framework, not a training regularization technique.",
            "opt_c": "Misconception: Local linear explanation surrogate (LIME/TreeSHAP), but does not alter the underlying model.",
            "opt_d": "Misconception: Exact Shapley calculation requires summing over 2^p coalitions (exponential complexity)."
        },
        "explanation": "By cooperative game theory, Shapley values uniquely allocate the total gain f(x) - E[f(x)] among players (features) while satisfying Efficiency, Symmetry, Dummy player, and Additivity."
    },
    {
        "id": "q_eval_36",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What fundamental finite-sample statistical guarantee does Conformal Prediction provide for any arbitrary black-box machine learning model?",
        "options": [
            {"id": "opt_a", "text": "It constructs prediction sets C(X) guaranteed to contain the true label Y with exact marginal coverage 1 - alpha (e.g. 95%) under only the assumption of exchangeability, with no distributional assumptions"},
            {"id": "opt_b", "text": "It guarantees 100% test accuracy on unseen data"},
            {"id": "opt_c", "text": "It guarantees that the prediction set always contains exactly one single class"},
            {"id": "opt_d", "text": "It requires the underlying model to be a Bayesian neural network"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Conformal prediction inverts non-conformity scores using sample quantiles on calibration data, providing distribution-free finite-sample valid coverage P(Y in C(X)) >= 1 - alpha.",
            "opt_b": "Misconception: Coverage rate is 1 - alpha (e.g. 95%), not 100% accuracy.",
            "opt_c": "Misconception: Prediction sets dynamically expand for ambiguous/uncertain inputs to maintain validity.",
            "opt_d": "Misconception: It wraps around ANY black-box model (GBDT, Deep Net, Random Forest)."
        },
        "explanation": "Conformal prediction generates prediction sets C(X) with rigorous finite-sample coverage P(Y ∈ C(X)) ≥ 1 - α for any black-box model, assuming only exchangeable data."
    },
    {
        "id": "q_eval_37",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "Under asymmetric misclassification costs (e.g., False Negative cost C_FN = $1000, False Positive cost C_FP = $10), what is the optimal Bayes decision threshold p* for predicting positive?",
        "options": [
            {"id": "opt_a", "text": "p* = C_FP / (C_FP + C_FN) = 10 / (10 + 1000) ≈ 0.0099 (predict positive whenever P(Y=1|X) > 0.0099)"},
            {"id": "opt_b", "text": "p* = 0.50"},
            {"id": "opt_c", "text": "p* = C_FN / C_FP = 100"},
            {"id": "opt_d", "text": "p* = (1000 - 10) / 1000 = 0.99"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Expected cost of positive prediction is (1-p)*C_FP; cost of negative is p*C_FN. Equating costs yields optimal threshold p* = C_FP / (C_FP + C_FN) = 10/1010 ≈ 0.0099.",
            "opt_b": "Misconception: 0.5 is optimal only under equal costs C_FP = C_FN.",
            "opt_c": "Misconception: Probabilities cannot exceed 1.0.",
            "opt_d": "Misconception: High threshold would increase deadly false negatives."
        },
        "explanation": "Minimizing expected risk E[Cost] = (1-p)C_FP vs p C_FN yields optimal Bayes decision threshold p* = C_FP / (C_FP + C_FN) = 10 / 1010 ≈ 0.0099."
    },
    {
        "id": "q_eval_38",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Bayes Error Rate (irreducible classification risk) represent in statistical pattern recognition?",
        "options": [
            {"id": "opt_a", "text": "The lowest possible prediction error achievable by any classifier on a given data distribution, occurring where class-conditional density distributions overlap"},
            {"id": "opt_b", "text": "The error rate of a naive Bayes classifier with Laplace smoothing"},
            {"id": "opt_c", "text": "The error rate on the training set after 1,000 epochs"},
            {"id": "opt_d", "text": "The error caused by choosing an improper prior"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Bayes error rate is 1 - E_X [ max_k P(Y=k | X) ], the theoretical lower bound on error due to intrinsic class overlap.",
            "opt_b": "Misconception: Naive Bayes is a specific algorithm, often far from the optimal Bayes classifier.",
            "opt_c": "Misconception: Training error can be zero (memorization), while Bayes error rate remains positive.",
            "opt_d": "Misconception: Prior misspecification error."
        },
        "explanation": "The Bayes optimal classifier assigns x to the class maximizing posterior P(Y=k|X). The Bayes error rate 1 - E[max_k P(Y=k|X)] is the theoretical lower bound on classification error."
    },
    {
        "id": "q_eval_39",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the ROC Convex Hull represent in machine learning cost-sensitive evaluation?",
        "options": [
            {"id": "opt_a", "text": "The optimal upper envelope connecting superior operating points; any point on the hull can be achieved, and points along chord lines can be achieved by stochastic threshold interpolation"},
            {"id": "opt_b", "text": "The minimum volume enclosing all negative data points in feature space"},
            {"id": "opt_c", "text": "The bounding box enclosing the precision-recall curve"},
            {"id": "opt_d", "text": "A regularization penalty restricting neural net weights to a convex polytope"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Provost & Fawcett showed that classifiers beneath the ROC convex hull are strictly Pareto-dominated; stochastic combination of two hull points realizes any operating point on the segment.",
            "opt_b": "Misconception: Feature space geometric hull, not ROC space.",
            "opt_c": "Misconception: PR space bounding box.",
            "opt_d": "Misconception: Weight constraint."
        },
        "explanation": "The ROC convex hull identifies the subset of classifiers and thresholds that are optimal across all possible class distributions and misclassification cost ratios."
    },
    {
        "id": "q_eval_40",
        "skillId": "skill_model_eval",
        "skillName": "Model Evaluation",
        "skillsTested": ["skill_model_eval", "skill_stats"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "Why does Surrogate Loss minimization (such as Logistic Loss or Hinge Loss) serve as a convex proxy for 0-1 classification loss in gradient-based optimization?",
        "options": [
            {"id": "opt_a", "text": "0-1 loss is discontinuous and non-convex with zero gradients almost everywhere (NP-hard to optimize); surrogate losses provide smooth, convex upper bounds with informative subgradients"},
            {"id": "opt_b", "text": "Surrogate losses ensure that classification accuracy is always exactly 100%"},
            {"id": "opt_c", "text": "0-1 loss is only applicable to unsupervised learning"},
            {"id": "opt_d", "text": "Surrogate losses eliminate all need for regularization"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Direct 0-1 loss step function has derivative 0 everywhere and step discontinuity at 0; convex surrogates (hinge, logistic, exponential) enable gradient-based convergence.",
            "opt_b": "Misconception: No loss function guarantees 100% accuracy.",
            "opt_c": "Misconception: 0-1 loss is the fundamental metric of supervised classification.",
            "opt_d": "Misconception: Regularization is still necessary to prevent overfitting."
        },
        "explanation": "The 0-1 loss I(y ≠ ŷ) is non-convex and non-differentiable (zero gradient almost everywhere). Smooth convex surrogates (logistic loss ln(1+e^(-yf)), hinge max(0, 1-yf)) provide efficient gradient-based training."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/modelEvaluation.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const MODEL_EVALUATION_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Model Evaluation questions in {out_file}")

if __name__ == '__main__':
    main()
