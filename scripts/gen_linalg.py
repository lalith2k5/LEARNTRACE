import json
import os

questions = [
    # Difficulty 1: Recall (q_linalg_01 to q_linalg_08)
    {
        "id": "q_linalg_01",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the dot product of two non-zero vectors that are orthogonal (perpendicular) to each other?",
        "options": [
            {"id": "opt_a", "text": "0"},
            {"id": "opt_b", "text": "1"},
            {"id": "opt_c", "text": "-1"},
            {"id": "opt_d", "text": "Infinity"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: u . v = ||u|| ||v|| cos(90 degrees) = ||u|| ||v|| * 0 = 0.",
            "opt_b": "Misconception: 1 is the dot product of a unit vector with itself (orthonormal).",
            "opt_c": "Misconception: -1 occurs for anti-parallel unit vectors (cos(180 degrees) = -1).",
            "opt_d": "Misconception: Dot product of finite vectors is always finite."
        },
        "explanation": "Orthogonal vectors have an angle of 90° (π/2 radians) between them. Because cos(90°) = 0, their inner product u · v = 0."
    },
    {
        "id": "q_linalg_02",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the transpose of the product of two compatible matrices A and B, (A B)^T?",
        "options": [
            {"id": "opt_a", "text": "B^T A^T"},
            {"id": "opt_b", "text": "A^T B^T"},
            {"id": "opt_c", "text": "-(A B)"},
            {"id": "opt_d", "text": "(B A)^T"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The transpose reverses the order of matrix multiplication: (AB)^T = B^T A^T.",
            "opt_b": "Misconception: Forgets to reverse matrix multiplication order.",
            "opt_c": "Misconception: This defines skew-symmetric matrices.",
            "opt_d": "Misconception: Matrix multiplication is non-commutative."
        },
        "explanation": "Matrix transpose reverses operand order: (AB)^T = B^T A^T. This is required for dimension compatibility: if A is (m × k) and B is (k × n), B^T is (n × k) and A^T is (k × m), yielding (n × m)."
    },
    {
        "id": "q_linalg_03",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the determinant of a 2 x 2 matrix A = [[a, b], [c, d]]?",
        "options": [
            {"id": "opt_a", "text": "a*d - b*c"},
            {"id": "opt_b", "text": "a*c - b*d"},
            {"id": "opt_c", "text": "a*d + b*c"},
            {"id": "opt_d", "text": "(a + d) - (b + c)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: det(A) = ad - bc for any 2x2 matrix.",
            "opt_b": "Misconception: Multiplies column elements instead of diagonals.",
            "opt_c": "Misconception: Adds instead of subtracting the anti-diagonal product.",
            "opt_d": "Misconception: Sums elements instead of multiplying."
        },
        "explanation": "The determinant of a 2 × 2 matrix [[a, b], [c, d]] is the difference of diagonal products: det(A) = ad - bc."
    },
    {
        "id": "q_linalg_04",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What condition on the determinant det(A) determines whether a square matrix A is invertible (non-singular)?",
        "options": [
            {"id": "opt_a", "text": "det(A) != 0"},
            {"id": "opt_b", "text": "det(A) == 0"},
            {"id": "opt_c", "text": "det(A) > 1"},
            {"id": "opt_d", "text": "det(A) must be an integer"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: A matrix is invertible if and only if its determinant is non-zero (full rank).",
            "opt_b": "Misconception: det(A) == 0 means the matrix is singular (non-invertible, collapses space).",
            "opt_c": "Misconception: Any non-zero real number (including fractions and negatives) permits inversion.",
            "opt_d": "Misconception: Determinants can be any non-zero real or complex number."
        },
        "explanation": "A square matrix is invertible if and only if det(A) ≠ 0. If det(A) = 0, the transformation collapses at least one dimension, rendering inverse mapping impossible."
    },
    {
        "id": "q_linalg_05",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the Trace of an n x n square matrix A, denoted Tr(A)?",
        "options": [
            {"id": "opt_a", "text": "The sum of the main diagonal elements: sum_{i=1}^n A_{ii}"},
            {"id": "opt_b", "text": "The product of the main diagonal elements"},
            {"id": "opt_c", "text": "The determinant of the matrix"},
            {"id": "opt_d", "text": "The maximum singular value"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By definition, the trace is the sum of diagonal entries (and equals the sum of eigenvalues).",
            "opt_b": "Misconception: The product of diagonal elements of a triangular matrix is the determinant, not trace.",
            "opt_c": "Misconception: Trace is a linear sum, determinant is an alternating multilinear product.",
            "opt_d": "Misconception: That is the spectral norm ||A||_2."
        },
        "explanation": "The trace of a square matrix is the sum of its main diagonal elements: Tr(A) = ∑ A_ii. It also equals the sum of its eigenvalues."
    },
    {
        "id": "q_linalg_06",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "If matrix A has dimension 3 x 4 and matrix B has dimension 4 x 2, what is the dimension of their matrix product C = A * B?",
        "options": [
            {"id": "opt_a", "text": "3 x 2"},
            {"id": "opt_b", "text": "4 x 4"},
            {"id": "opt_c", "text": "3 x 4"},
            {"id": "opt_d", "text": "The product is undefined"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Inner dimensions (4 and 4) match, producing an outer dimension of 3 x 2.",
            "opt_b": "Misconception: Combines inner dimensions.",
            "opt_c": "Misconception: Retains dimensions of matrix A.",
            "opt_d": "Misconception: Compatible because columns of A (4) equal rows of B (4)."
        },
        "explanation": "Matrix multiplication (m × k) × (k × n) requires inner dimensions to match (k = 4) and yields a resulting matrix of dimension (m × n) = 3 × 2."
    },
    {
        "id": "q_linalg_07",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the defining equation for an eigenvector v != 0 and its corresponding eigenvalue lambda for a square matrix A?",
        "options": [
            {"id": "opt_a", "text": "A * v = lambda * v"},
            {"id": "opt_b", "text": "A * v = lambda"},
            {"id": "opt_c", "text": "v * A = lambda * I"},
            {"id": "opt_d", "text": "A * lambda = v"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Linear transformation A applied to eigenvector v merely scales it by scalar factor lambda without changing its direction.",
            "opt_b": "Misconception: A*v is an n-dimensional vector; lambda is a scalar.",
            "opt_c": "Misconception: Dimension mismatch.",
            "opt_d": "Misconception: Lambda is a scalar scaling factor, not an input vector."
        },
        "explanation": "An eigenvector is a non-zero vector whose direction remains unchanged when linear transformation A is applied, merely scaling by λ: Av = λv."
    },
    {
        "id": "q_linalg_08",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is an Identity Matrix I?",
        "options": [
            {"id": "opt_a", "text": "A square matrix with ones on the main diagonal and zeros everywhere else, such that A * I = I * A = A"},
            {"id": "opt_b", "text": "A matrix composed entirely of ones"},
            {"id": "opt_c", "text": "A matrix whose determinant is 0"},
            {"id": "opt_d", "text": "A matrix with zeros on the diagonal and ones elsewhere"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Identity matrix is the multiplicative identity in matrix algebra: I_ij = 1 if i=j else 0.",
            "opt_b": "Misconception: A matrix of all ones is the all-ones matrix J.",
            "opt_c": "Misconception: det(I) = 1, never 0.",
            "opt_d": "Misconception: Inverted matrix structure."
        },
        "explanation": "The identity matrix I has 1s along the main diagonal and 0s elsewhere. Multiplying any compatible matrix by I leaves it unchanged: AI = IA = A."
    },

    # Difficulty 2: Comprehension (q_linalg_09 to q_linalg_16)
    {
        "id": "q_linalg_09",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the geometric interpretation of the absolute value of the determinant |det(A)| for a linear transformation A in R^n?",
        "options": [
            {"id": "opt_a", "text": "The scaling factor by which the transformation scales n-dimensional volumes (e.g. area in 2D, volume in 3D)"},
            {"id": "opt_b", "text": "The angle of rotation applied to unit vectors"},
            {"id": "opt_c", "text": "The distance from the origin to the center of the matrix"},
            {"id": "opt_d", "text": "The number of non-zero rows in the matrix"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: |det(A)| measures how much any geometric region's volume expands or contracts under linear map A.",
            "opt_b": "Misconception: Pure rotations have |det(A)| = 1, regardless of rotation angle.",
            "opt_c": "Misconception: Determinant is a geometric volume factor, not spatial distance.",
            "opt_d": "Misconception: That describes row rank."
        },
        "explanation": "The determinant measures the volume change factor induced by transformation A: a unit cube with volume 1 transforms into a parallelepiped with volume |det(A)|."
    },
    {
        "id": "q_linalg_10",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the Rank of a matrix A?",
        "options": [
            {"id": "opt_a", "text": "The maximum number of linearly independent column (or row) vectors in A, representing the dimension of its column space"},
            {"id": "opt_b", "text": "The total number of elements in the matrix"},
            {"id": "opt_c", "text": "The sum of the diagonal entries"},
            {"id": "opt_d", "text": "The largest numerical entry in the matrix"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Row rank equals column rank, defining the dimension of the vector space spanned by the matrix columns.",
            "opt_b": "Misconception: Total elements is rows * columns.",
            "opt_c": "Misconception: That is the trace.",
            "opt_d": "Misconception: That is the max norm ||A||_max."
        },
        "explanation": "Matrix rank is the dimension of the vector space spanned by its columns (or rows), indicating the number of non-redundant linear dimensions."
    },
    {
        "id": "q_linalg_11",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "According to the Rank-Nullity Theorem, for an m x n matrix A representing a linear transformation from R^n to R^m, what fundamental relationship holds?",
        "options": [
            {"id": "opt_a", "text": "Rank(A) + Nullity(A) = n (number of columns / dimension of domain)"},
            {"id": "opt_b", "text": "Rank(A) + Nullity(A) = m (number of rows / dimension of codomain)"},
            {"id": "opt_c", "text": "Rank(A) * Nullity(A) = n"},
            {"id": "opt_d", "text": "Rank(A) - Nullity(A) = 0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Dimension of column space (rank) + dimension of null space (nullity) equals the total input dimension n.",
            "opt_b": "Misconception: Rank-nullity applies to domain dimension n, not codomain m.",
            "opt_c": "Misconception: Relationship is additive, not multiplicative.",
            "opt_d": "Misconception: Rank and nullity are rarely equal."
        },
        "explanation": "The Rank-Nullity Theorem states dim(Range(A)) + dim(Ker(A)) = dim(Domain), which translates to Rank(A) + Nullity(A) = n."
    },
    {
        "id": "q_linalg_12",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What special properties do real Symmetric Matrices (A = A^T) always possess regarding their eigenvalues and eigenvectors?",
        "options": [
            {"id": "opt_a", "text": "All eigenvalues are strictly real numbers, and eigenvectors corresponding to distinct eigenvalues are mutually orthogonal"},
            {"id": "opt_b", "text": "All eigenvalues must be positive integers"},
            {"id": "opt_c", "text": "Their determinant is always zero"},
            {"id": "opt_d", "text": "Eigenvalues are always pure imaginary numbers"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Spectral Theorem for real symmetric matrices guarantees real eigenvalues and an orthonormal basis of eigenvectors.",
            "opt_b": "Misconception: Eigenvalues can be arbitrary real numbers, negative, zero, or non-integers.",
            "opt_c": "Misconception: Symmetric matrices are frequently full-rank and invertible.",
            "opt_d": "Misconception: Skew-symmetric matrices (A = -A^T) have imaginary eigenvalues, not symmetric ones."
        },
        "explanation": "By the Spectral Theorem, any real symmetric matrix has exclusively real eigenvalues and can be orthogonally diagonalized: A = Q Λ Q^T with Q^T Q = I."
    },
    {
        "id": "q_linalg_13",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What defines a real symmetric matrix A as Positive Definite?",
        "options": [
            {"id": "opt_a", "text": "x^T A x > 0 for all non-zero vectors x in R^n (all eigenvalues are strictly positive)"},
            {"id": "opt_b", "text": "All individual entries A_ij in the matrix are positive numbers"},
            {"id": "opt_c", "text": "det(A) > 100"},
            {"id": "opt_d", "text": "Tr(A) = 0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Positive definiteness ensures quadratic form x^T A x > 0 for x != 0, equivalent to all eigenvalues lambda_i > 0.",
            "opt_b": "Misconception: A matrix can have negative off-diagonal entries and still be positive definite (e.g. [[2, -1], [-1, 2]]).",
            "opt_c": "Misconception: Any positive determinant with positive eigenvalues qualifies.",
            "opt_d": "Misconception: Trace of positive definite matrix must be strictly positive."
        },
        "explanation": "A matrix is positive definite if its quadratic form xᵀAx > 0 for every x ≠ 0. This guarantees strictly positive curvature, vital for convex optimization and Hessian matrices."
    },
    {
        "id": "q_linalg_14",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "How is the Cosine Similarity between two non-zero feature vectors u and v calculated?",
        "options": [
            {"id": "opt_a", "text": "(u . v) / (||u||_2 * ||v||_2)"},
            {"id": "opt_b", "text": "||u - v||_2"},
            {"id": "opt_c", "text": "u . v"},
            {"id": "opt_d", "text": "(u + v) / 2"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Cosine similarity normalizes inner product by L2 magnitudes: cos(theta) = (u . v) / (||u|| ||v||), ranging from -1 to +1.",
            "opt_b": "Misconception: This is Euclidean distance L2.",
            "opt_c": "Misconception: Unnormalized dot product depends heavily on vector magnitude.",
            "opt_d": "Misconception: Vector centroid/mean."
        },
        "explanation": "Cosine similarity measures angular orientation between vectors regardless of their magnitude: cos(θ) = (u · v) / (||u|| ||v||)."
    },
    {
        "id": "q_linalg_15",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the formula for the orthogonal projection of vector y onto a non-zero vector u?",
        "options": [
            {"id": "opt_a", "text": "proj_u(y) = [ (y . u) / (u . u) ] * u"},
            {"id": "opt_b", "text": "proj_u(y) = (y . u) * u"},
            {"id": "opt_c", "text": "proj_u(y) = y - u"},
            {"id": "opt_d", "text": "proj_u(y) = [ (u . u) / (y . u) ] * y"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Projecting y onto u scales u by the scalar shadow component (y . u) / ||u||^2.",
            "opt_b": "Misconception: Only valid if u is already a unit vector (||u|| = 1).",
            "opt_c": "Misconception: Vector subtraction.",
            "opt_d": "Misconception: Inverts scalar ratio and projects onto y instead of u."
        },
        "explanation": "The orthogonal projection of y onto line span{u} is proj_u(y) = ((y · u) / ||u||²) u."
    },
    {
        "id": "q_linalg_16",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is an Orthogonal Matrix Q?",
        "options": [
            {"id": "opt_a", "text": "A square matrix with orthonormal columns and rows such that Q^T Q = Q Q^T = I (meaning Q^{-1} = Q^T)"},
            {"id": "opt_b", "text": "A matrix where every entry is either 0 or 1"},
            {"id": "opt_c", "text": "A matrix with determinant equal to 0"},
            {"id": "opt_d", "text": "A diagonal matrix with arbitrary real values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Orthogonal matrices preserve lengths and angles: Q^T = Q^{-1}, so Q^T Q = I.",
            "opt_b": "Misconception: Binary matrix.",
            "opt_c": "Misconception: Orthogonal matrices have det(Q) = +/- 1, never 0.",
            "opt_d": "Misconception: Diagonal matrices are only orthogonal if diagonal entries are +/- 1."
        },
        "explanation": "An orthogonal matrix Q preserves Euclidean distance and inner products (isometry). Its transpose equals its inverse: QᵀQ = I, and det(Q) = ±1."
    },

    # Difficulty 3: Application (q_linalg_17 to q_linalg_24)
    {
        "id": "q_linalg_17",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Calculate the determinant of matrix A = [[3, 8], [4, 6]].",
        "options": [
            {"id": "opt_a", "text": "-14"},
            {"id": "opt_b", "text": "+50"},
            {"id": "opt_c", "text": "+18"},
            {"id": "opt_d", "text": "-5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: det(A) = 3*6 - 8*4 = 18 - 32 = -14.",
            "opt_b": "Misconception: Adds 18 + 32 = 50.",
            "opt_c": "Misconception: Only calculates main diagonal product 3*6 = 18.",
            "opt_d": "Misconception: Arithmetic error."
        },
        "explanation": "det(A) = ad - bc = (3)(6) - (8)(4) = 18 - 32 = -14."
    },
    {
        "id": "q_linalg_18",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What are the eigenvalues of matrix A = [[2, 0], [0, 5]]?",
        "options": [
            {"id": "opt_a", "text": "lambda_1 = 2, lambda_2 = 5"},
            {"id": "opt_b", "text": "lambda_1 = 0, lambda_2 = 10"},
            {"id": "opt_c", "text": "lambda_1 = 7, lambda_2 = 10"},
            {"id": "opt_d", "text": "lambda_1 = sqrt(2), lambda_2 = sqrt(5)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: For any diagonal or triangular matrix, the eigenvalues are simply the entries along the main diagonal.",
            "opt_b": "Misconception: 10 is the determinant, not an eigenvalue.",
            "opt_c": "Misconception: 7 is the trace (sum of eigenvalues).",
            "opt_d": "Misconception: Square root error."
        },
        "explanation": "The characteristic equation det(A - λI) = (2 - λ)(5 - λ) = 0 yields eigenvalues λ = 2 and λ = 5 directly from the diagonal."
    },
    {
        "id": "q_linalg_19",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Compute the matrix-vector product A * x where A = [[1, 2], [3, 4]] and x = [[5], [6]].",
        "options": [
            {"id": "opt_a", "text": "[[17], [39]]"},
            {"id": "opt_b", "text": "[[5, 12], [15, 24]]"},
            {"id": "opt_c", "text": "[[11], [25]]"},
            {"id": "opt_d", "text": "56"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Row 1: 1*5 + 2*6 = 5 + 12 = 17. Row 2: 3*5 + 4*6 = 15 + 24 = 39.",
            "opt_b": "Misconception: Element-wise multiplication keeping 2x2 shape.",
            "opt_c": "Misconception: Row 1: 1+2+5+6 arithmetic error.",
            "opt_d": "Misconception: Sums all elements into a scalar."
        },
        "explanation": "Matrix-vector product: [1*5 + 2*6, 3*5 + 4*6]^T = [5 + 12, 15 + 24]^T = [17, 39]^T."
    },
    {
        "id": "q_linalg_20",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the inverse of matrix A = [[4, 7], [2, 6]]?",
        "options": [
            {"id": "opt_a", "text": "[[0.6, -0.7], [-0.2, 0.4]]"},
            {"id": "opt_b", "text": "[[6, -7], [-2, 4]]"},
            {"id": "opt_c", "text": "[[0.25, 0.14], [0.5, 0.17]]"},
            {"id": "opt_d", "text": "A is singular and has no inverse"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: det(A) = 4*6 - 7*2 = 24 - 14 = 10. A^{-1} = 1/10 * [[6, -7], [-2, 4]] = [[0.6, -0.7], [-0.2, 0.4]].",
            "opt_b": "Misconception: Computes adjugate matrix but forgets to divide by determinant 10.",
            "opt_c": "Misconception: Inverts each entry individually (reciprocal matrix).",
            "opt_d": "Misconception: det(A) = 10 != 0, so A is fully invertible."
        },
        "explanation": "det(A) = 4(6) - 7(2) = 10. A^(-1) = (1/10)[[6, -7], [-2, 4]] = [[0.6, -0.7], [-0.2, 0.4]]."
    },
    {
        "id": "q_linalg_21",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "For vector u = [3, 4], what is its L2 norm (Euclidean length) ||u||_2?",
        "options": [
            {"id": "opt_a", "text": "5"},
            {"id": "opt_b", "text": "7"},
            {"id": "opt_c", "text": "25"},
            {"id": "opt_d", "text": "1"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: ||u||_2 = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.",
            "opt_b": "Misconception: Computes L1 norm (Manhattan distance): |3| + |4| = 7.",
            "opt_c": "Misconception: Forgets the square root, leaving squared norm ||u||^2 = 25.",
            "opt_d": "Misconception: Confuses with normalized unit vector length."
        },
        "explanation": "||u||_2 = √(3² + 4²) = √(9 + 16) = √25 = 5."
    },
    {
        "id": "q_linalg_22",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In Ordinary Least Squares, what is the hat (projection) matrix H that projects target vector y onto column space of X, y_hat = H * y?",
        "options": [
            {"id": "opt_a", "text": "H = X (X^T X)^{-1} X^T"},
            {"id": "opt_b", "text": "H = (X^T X)^{-1} X^T"},
            {"id": "opt_c", "text": "H = X^T X"},
            {"id": "opt_d", "text": "H = X (X^T X) X^T"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: beta_hat = (X^T X)^{-1} X^T y. Therefore y_hat = X beta_hat = X(X^T X)^{-1} X^T y = H y.",
            "opt_b": "Misconception: This is the Moore-Penrose pseudoinverse X^+ yielding beta_hat, not the projection matrix H.",
            "opt_c": "Misconception: This is the Gram matrix X^T X.",
            "opt_d": "Misconception: Omits matrix inversion."
        },
        "explanation": "The hat matrix puts the hat on y: H = X(XᵀX)⁻¹Xᵀ. Notice H is symmetric (Hᵀ = H) and idempotent (H² = H)."
    },
    {
        "id": "q_linalg_23",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Calculate the trace of matrix A = [[4, 1, 9], [0, -2, 5], [7, 3, 8]].",
        "options": [
            {"id": "opt_a", "text": "10"},
            {"id": "opt_b", "text": "14"},
            {"id": "opt_c", "text": "35"},
            {"id": "opt_d", "text": "0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Tr(A) = 4 + (-2) + 8 = 10.",
            "opt_b": "Misconception: Adds 4 + 2 + 8 = 14, ignoring negative sign on -2.",
            "opt_c": "Misconception: Sums all 9 elements in the matrix.",
            "opt_d": "Misconception: Confuses trace with determinant."
        },
        "explanation": "Tr(A) is the sum of main diagonal elements: 4 + (-2) + 8 = 10."
    },
    {
        "id": "q_linalg_24",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Are the two vectors u = [2, -3] and v = [6, 4] orthogonal?",
        "options": [
            {"id": "opt_a", "text": "Yes, because their dot product is 2*6 + (-3)*4 = 12 - 12 = 0"},
            {"id": "opt_b", "text": "No, because their dot product is 24"},
            {"id": "opt_c", "text": "No, because vector components have different signs"},
            {"id": "opt_d", "text": "Only if normalized by their Euclidean norm"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: u . v = 2(6) + (-3)(4) = 12 - 12 = 0. Zero dot product guarantees orthogonality.",
            "opt_b": "Misconception: Arithmetic error.",
            "opt_c": "Misconception: Differing signs are necessary for positive and negative products to cancel to 0.",
            "opt_d": "Misconception: Orthogonality is scale-invariant."
        },
        "explanation": "Vectors are orthogonal if their dot product is zero: u · v = 2(6) + (-3)(4) = 12 - 12 = 0. Therefore, u and v are orthogonal."
    },

    # Difficulty 4: Analysis (q_linalg_25 to q_linalg_32)
    {
        "id": "q_linalg_25",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does the Eckart-Young-Mirsky Theorem state about Singular Value Decomposition (SVD) A = U Sigma V^T and low-rank matrix approximation?",
        "options": [
            {"id": "opt_a", "text": "The optimal rank-k approximation of A under both Frobenius and spectral norms is obtained by truncating SVD to the top k singular values: A_k = sum_{i=1}^k sigma_i u_i v_i^T"},
            {"id": "opt_b", "text": "Matrix A can only be approximated if its rank is an even number"},
            {"id": "opt_c", "text": "Truncating SVD always increases total matrix variance"},
            {"id": "opt_d", "text": "SVD requires matrix A to be square and positive definite"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Truncated SVD provides the best rank-k approximation in least squares sense, forming the theoretical basis for PCA and dimensionality reduction.",
            "opt_b": "Misconception: Applies to any integer rank k <= rank(A).",
            "opt_c": "Misconception: Truncation filters noise and discards residual variance.",
            "opt_d": "Misconception: Unlike eigendecomposition, SVD exists for ANY rectangular m x n matrix."
        },
        "explanation": "The Eckart-Young-Mirsky theorem proves that keeping the top k singular components minimizes ||A - A_k||_F and ||A - A_k||_2, establishing truncated SVD as the optimal low-rank projection."
    },
    {
        "id": "q_linalg_26",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "How does Principal Component Analysis (PCA) mathematically derive principal components from an n x p centered data matrix X?",
        "options": [
            {"id": "opt_a", "text": "By performing eigendecomposition on the empirical covariance matrix C = (1/n) X^T X; the eigenvectors are the principal directions (loadings) and eigenvalues represent explained variance"},
            {"id": "opt_b", "text": "By computing the inverse of X using Gaussian elimination"},
            {"id": "opt_c", "text": "By sorting the features according to their Pearson correlation with target y"},
            {"id": "opt_d", "text": "By setting all off-diagonal entries to zero using thresholding"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: PCA diagonalizes sample covariance: C v_i = lambda_i v_i. First eigenvector maximizes variance of projected data: var(X v_1) = lambda_1.",
            "opt_b": "Misconception: X is generally rectangular and not invertible.",
            "opt_c": "Misconception: PCA is unsupervised; it operates without a target y.",
            "opt_d": "Misconception: That describes graphical lasso, not PCA."
        },
        "explanation": "PCA diagonalizes the sample covariance matrix C = XᵀX / n. Its orthonormal eigenvectors define the orthogonal axes of maximal variance, ordered by eigenvalues."
    },
    {
        "id": "q_linalg_27",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the Condition Number kappa(A) = sigma_max / sigma_min of an invertible matrix A, and why is an ill-conditioned matrix problematic for numerical algorithms?",
        "options": [
            {"id": "opt_a", "text": "It measures sensitivity of the solution of linear system Ax = b to small perturbations in data; a huge condition number indicates near-singularity, causing catastrophic rounding error amplification"},
            {"id": "opt_b", "text": "It measures the memory consumption of storing the matrix in bytes"},
            {"id": "opt_c", "text": "A high condition number guarantees fast convergence in gradient descent"},
            {"id": "opt_d", "text": "It is the ratio of row count to column count"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: kappa(A) bounds relative error ||delta x||/||x|| <= kappa(A) * ||delta b||/||b||. If kappa = 10^12, 12 digits of numerical precision are lost.",
            "opt_b": "Misconception: Memory size is an implementation detail, not mathematical conditioning.",
            "opt_c": "Misconception: High condition numbers create elongated ravines, slowing first-order gradient descent dramatically.",
            "opt_d": "Misconception: Ratio of singular values, not dimensions."
        },
        "explanation": "The condition number κ(A) = σ_max / σ_min measures how much output errors are amplified by input perturbations. Ill-conditioned matrices (κ >> 1) lead to severe numerical instability."
    },
    {
        "id": "q_linalg_28",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why is the matrix product G = A^T A always symmetric and positive semi-definite for any real m x n matrix A?",
        "options": [
            {"id": "opt_a", "text": "(A^T A)^T = A^T (A^T)^T = A^T A (symmetric), and for any vector x, x^T (A^T A) x = (Ax)^T (Ax) = ||Ax||_2^2 >= 0 (positive semi-definite)"},
            {"id": "opt_b", "text": "Because all entries in A^T A are always positive"},
            {"id": "opt_c", "text": "Because A must have a non-zero determinant"},
            {"id": "opt_d", "text": "Because multiplying by a transpose always produces the identity matrix"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Elegant proof: Transpose property proves symmetry; quadratic form equals squared Euclidean norm ||Ax||^2, which is inherently non-negative.",
            "opt_b": "Misconception: Individual matrix entries can be negative.",
            "opt_c": "Misconception: A can be rectangular or singular.",
            "opt_d": "Misconception: A^T A = I only if columns of A are orthonormal."
        },
        "explanation": "(AᵀA)ᵀ = AᵀA proves symmetry. For any vector x, xᵀ(AᵀA)x = (Ax)ᵀ(Ax) = ||Ax||² ≥ 0, which proves that AᵀA is always positive semi-definite."
    },
    {
        "id": "q_linalg_29",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "In QR Decomposition of an m x n matrix A (with full column rank n), what are matrices Q and R?",
        "options": [
            {"id": "opt_a", "text": "Q is an m x n matrix with orthonormal columns (Q^T Q = I_n), and R is an n x n upper triangular invertible matrix"},
            {"id": "opt_b", "text": "Q is lower triangular and R is diagonal"},
            {"id": "opt_c", "text": "Q and R are both symmetric matrices"},
            {"id": "opt_d", "text": "Q contains the eigenvalues and R contains the eigenvectors"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: QR decomposition factors A into orthonormal columns Q and upper triangular R (via Gram-Schmidt or Householder reflections).",
            "opt_b": "Misconception: Confuses with LU or Cholesky decomposition.",
            "opt_c": "Misconception: Neither Q nor R is symmetric.",
            "opt_d": "Misconception: That describes eigendecomposition A = Q Lambda Q^T."
        },
        "explanation": "QR decomposition represents A as A = QR, where Q has orthonormal columns and R is upper-triangular, providing numerically stable solutions to least squares problems."
    },
    {
        "id": "q_linalg_30",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the Moore-Penrose Pseudoinverse A^+ of an m x n matrix A with SVD A = U Sigma V^T?",
        "options": [
            {"id": "opt_a", "text": "A^+ = V Sigma^+ U^T, where Sigma^+ inverts all non-zero singular values (1 / sigma_i) and transposes the diagonal"},
            {"id": "opt_b", "text": "A^+ = U^T Sigma V"},
            {"id": "opt_c", "text": "A^+ = 1 / det(A) * A^T"},
            {"id": "opt_d", "text": "A^+ = A^T A"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: By inverting non-zero singular values and reversing orthogonal factors, A^+ uniquely satisfies the 4 Penrose conditions for any matrix.",
            "opt_b": "Misconception: Transposes without inverting singular values.",
            "opt_c": "Misconception: Determinants only exist for square matrices.",
            "opt_d": "Misconception: Gram matrix."
        },
        "explanation": "The pseudoinverse generalizes matrix inversion to rectangular/singular matrices via SVD: A⁺ = V Σ⁺ Uᵀ, where non-zero singular values are replaced with 1/σ_i."
    },
    {
        "id": "q_linalg_31",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Why does adding an L2 regularization term (Ridge / Tikhonov: lambda * I) to the normal equations (X^T X + lambda * I)^{-1} guarantee that the matrix is invertible?",
        "options": [
            {"id": "opt_a", "text": "X^T X is positive semi-definite (eigenvalues >= 0); adding lambda * I shifts all eigenvalues to lambda_i + lambda > 0, ensuring strictly positive eigenvalues and non-zero determinant"},
            {"id": "opt_b", "text": "It forces all off-diagonal elements to zero"},
            {"id": "opt_c", "text": "It reduces the dimensionality of X from p to k"},
            {"id": "opt_d", "text": "It eliminates outliers from X"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Shifting spectrum by lambda > 0 prevents zero eigenvalues (even if p > n or columns are collinear), making the matrix strictly positive definite.",
            "opt_b": "Misconception: Off-diagonals remain non-zero; lambda is added only to the diagonal.",
            "opt_c": "Misconception: Ridge retains all p features (shrinkage, not selection).",
            "opt_d": "Misconception: Regularization penalizes weights, not outlier removal."
        },
        "explanation": "If XᵀX has eigenvalues λ_i ≥ 0, adding λI shifts the eigenvalues to λ_i + λ > 0. Because all eigenvalues are strictly positive, det(XᵀX + λI) > 0, guaranteeing invertibility."
    },
    {
        "id": "q_linalg_32",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the relationship between the geometric multiplicity and algebraic multiplicity of an eigenvalue lambda?",
        "options": [
            {"id": "opt_a", "text": "Geometric multiplicity (dimension of eigenspace) is always less than or equal to algebraic multiplicity (multiplicity as root of characteristic polynomial)"},
            {"id": "opt_b", "text": "Geometric multiplicity is always strictly greater than algebraic multiplicity"},
            {"id": "opt_c", "text": "They are never equal under any circumstances"},
            {"id": "opt_d", "text": "Their product must equal the matrix determinant"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Fundamental theorem: 1 <= dim(Ker(A - lambda*I)) <= algebraic_multiplicity. A matrix is diagonalizable iff they are equal for all eigenvalues.",
            "opt_b": "Misconception: Geometric multiplicity cannot exceed algebraic multiplicity.",
            "opt_c": "Misconception: They are equal for all diagonalizable matrices (including all symmetric matrices).",
            "opt_d": "Misconception: Arbitrary non-linear assertion."
        },
        "explanation": "The geometric multiplicity (number of linearly independent eigenvectors for λ) is bounded above by its algebraic multiplicity. When geometric < algebraic, the matrix is defective."
    },

    # Difficulty 5: Synthesis (q_linalg_33 to q_linalg_40)
    {
        "id": "q_linalg_33",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Rayleigh Quotient R(A, x) = (x^T A x) / (x^T x) optimize for a real symmetric matrix A?",
        "options": [
            {"id": "opt_a", "text": "Its maximum value over all x != 0 equals the largest eigenvalue lambda_max (achieved at the dominant eigenvector), and its minimum equals lambda_min"},
            {"id": "opt_b", "text": "It computes the determinant of A"},
            {"id": "opt_c", "text": "It computes the L1 sparsity penalty"},
            {"id": "opt_d", "text": "It always equals Tr(A) for any vector x"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Min-max theorem (Courant-Fischer): max_x R(A, x) = lambda_1 and min_x R(A, x) = lambda_n, providing variational formulation for eigendecomposition.",
            "opt_b": "Misconception: Determinant is a single scalar invariant, not a vector quotient.",
            "opt_c": "Misconception: Rayleigh quotient is quadratic (L2), not L1.",
            "opt_d": "Misconception: Rayleigh quotient evaluates directional Rayleigh curvature, not trace."
        },
        "explanation": "The Rayleigh quotient R(A, x) is bounded between the minimum and maximum eigenvalues: λ_min ≤ R(A, x) ≤ λ_max. The extrema occur at the corresponding eigenvectors."
    },
    {
        "id": "q_linalg_34",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_prob_dist"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How is the Cholesky Decomposition A = L L^T (where L is lower triangular with positive diagonal) used to sample from a Multivariate Normal distribution X ~ N(mu, Sigma)?",
        "options": [
            {"id": "opt_a", "text": "Decompose Sigma = L L^T, sample standard normal vector z ~ N(0, I), and set X = mu + L * z"},
            {"id": "opt_b", "text": "Decompose Sigma = Q Lambda Q^T, and set X = mu + Sigma * z"},
            {"id": "opt_c", "text": "Divide z by the determinant of Sigma"},
            {"id": "opt_d", "text": "Sample uniformly and scale by L^{-1}"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Var(mu + L*z) = L Var(z) L^T = L I L^T = L L^T = Sigma, perfectly generating the desired covariance matrix in O(n^3/3) operations.",
            "opt_b": "Misconception: Multiplies by Sigma instead of its square root L.",
            "opt_c": "Misconception: Dividing by determinant does not match covariance scaling.",
            "opt_d": "Misconception: Normal generation uses affine Gaussian maps, not inverted uniform distributions."
        },
        "explanation": "Because Cov(Lz) = L Cov(z) Lᵀ = L I Lᵀ = LLᵀ = Σ, multiplying standard normal vector z by Cholesky factor L generates correlated Gaussian variables with covariance Σ."
    },
    {
        "id": "q_linalg_35",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does the Perron-Frobenius Theorem guarantee about the dominant eigenvalue and eigenvector of an irreducible, primitive non-negative matrix (such as Google's PageRank transition matrix)?",
        "options": [
            {"id": "opt_a", "text": "There exists a unique real dominant eigenvalue equal to spectral radius r(A), and its corresponding eigenvector has strictly positive real components (the unique stationary distribution)"},
            {"id": "opt_b", "text": "All eigenvalues must be imaginary numbers"},
            {"id": "opt_c", "text": "The matrix has no eigenvectors"},
            {"id": "opt_d", "text": "The dominant eigenvalue is always 0"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Perron-Frobenius guarantees a positive dominant eigenvalue lambda_1 = 1 with a strictly positive eigenvector, ensuring PageRank converges to a unique positive ranking.",
            "opt_b": "Misconception: Skew-symmetric matrices have imaginary eigenvalues; non-negative matrices have real dominant eigenvalue.",
            "opt_c": "Misconception: Every square matrix has at least one eigenvalue/eigenvector.",
            "opt_d": "Misconception: For a stochastic matrix, dominant eigenvalue is exactly 1."
        },
        "explanation": "Perron-Frobenius ensures that positive/stochastic matrices have a unique maximal real eigenvalue (λ = 1 for Markov chains) with a strictly positive eigenvector, ensuring PageRank's unique convergence."
    },
    {
        "id": "q_linalg_36",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In Fisher's Linear Discriminant Analysis (LDA), finding the projection vector w that maximizes between-class variance relative to within-class variance is formulated as what linear algebra problem?",
        "options": [
            {"id": "opt_a", "text": "A Generalized Eigenvalue Problem: S_B w = lambda S_W w (or S_W^{-1} S_B w = lambda w)"},
            {"id": "opt_b", "text": "A standard singular value decomposition of S_B + S_W"},
            {"id": "opt_c", "text": "Inverting the target labels matrix"},
            {"id": "opt_d", "text": "A linear programming simplex algorithm"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Maximizing J(w) = (w^T S_B w) / (w^T S_W w) via Rayleigh quotient differentiation yields generalized eigenvalue problem S_B w = lambda S_W w.",
            "opt_b": "Misconception: SVD on sum does not maximize class separation ratio.",
            "opt_c": "Misconception: Class labels are not matrix factors.",
            "opt_d": "Misconception: LDA is closed-form linear algebra, not linear programming."
        },
        "explanation": "Fisher's LDA maximizes the Rayleigh quotient J(w) = (wᵀ S_B w) / (wᵀ S_W w). Taking the gradient and setting to zero yields the generalized eigenvalue problem S_B w = λ S_W w."
    },
    {
        "id": "q_linalg_37",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is Mercer's Theorem, and why is it fundamental to the 'Kernel Trick' in Support Vector Machines (SVMs)?",
        "options": [
            {"id": "opt_a", "text": "Any continuous, symmetric, positive semi-definite kernel function K(x, z) can be expressed as an inner product <phi(x), phi(z)> in a high-dimensional Reproducing Kernel Hilbert Space (RKHS)"},
            {"id": "opt_b", "text": "It proves that all non-linear datasets can be separated with 100% accuracy"},
            {"id": "opt_c", "text": "It proves that Gaussian kernels cannot be computed on modern GPUs"},
            {"id": "opt_d", "text": "It eliminates the need for slack variables in soft-margin SVMs"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Mercer's theorem guarantees that positive semi-definite Gram matrices K_ij = K(x_i, x_j) correspond to valid inner products in some feature space without explicit feature mapping.",
            "opt_b": "Misconception: Overfitting or non-separable geometries can prevent perfect separation.",
            "opt_c": "Misconception: Gaussian RBF kernels are routinely accelerated on GPUs.",
            "opt_d": "Misconception: Slack variables are still required to prevent overfitting."
        },
        "explanation": "Mercer's Theorem guarantees that any symmetric positive semi-definite kernel computes an inner product in an implicit Hilbert feature space: K(x, z) = ⟨φ(x), φ(z)⟩, enabling non-linear SVMs."
    },
    {
        "id": "q_linalg_38",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the Nuclear Norm ||A||_* of a matrix, and why is it used as a convex relaxation in Matrix Completion (e.g. Netflix Prize recommender systems)?",
        "options": [
            {"id": "opt_a", "text": "The sum of singular values: ||A||_* = sum sigma_i(A); it is the tightest convex surrogate for matrix rank, inducing low-rank solutions analogously to L1 regularization for vectors"},
            {"id": "opt_b", "text": "The square root of the sum of squared entries"},
            {"id": "opt_c", "text": "The largest entry in the matrix"},
            {"id": "opt_d", "text": "The number of non-zero singular values"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Direct rank minimization is NP-hard. Nuclear norm (sum of singular values) is the L1 norm of the singular value vector, serving as the convex relaxation of rank.",
            "opt_b": "Misconception: That is the Frobenius norm ||A||_F.",
            "opt_c": "Misconception: That is the max norm ||A||_max.",
            "opt_d": "Misconception: That is the exact rank(A) (non-convex L0 equivalent)."
        },
        "explanation": "The nuclear norm ||A||_* = ∑ σ_i is the convex envelope of matrix rank over the unit ball. Minimizing the nuclear norm induces low-rank sparsity in matrix completion algorithms."
    },
    {
        "id": "q_linalg_39",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In numerical optimization, what does the Hessian matrix H of a twice-differentiable multivariable function f(x) represent, and what does H being positive definite imply at a critical point?",
        "options": [
            {"id": "opt_a", "text": "H is the matrix of second partial derivatives H_ij = d^2 f / (d x_i d x_j); positive definiteness implies strictly positive local curvature in all directions, confirming a strict local minimum"},
            {"id": "opt_b", "text": "H is the vector of first derivatives, and positive definiteness confirms a saddle point"},
            {"id": "opt_c", "text": "H is the Jacobian matrix of constraints"},
            {"id": "opt_d", "text": "Positive definiteness of H guarantees that the function has no critical points"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Second-order Taylor series f(x+p) ≈ f(x) + g^T p + 1/2 p^T H p. At grad f = 0, H > 0 guarantees p^T H p > 0, confirming a strict local minimum.",
            "opt_b": "Misconception: First derivatives form the gradient vector, not Hessian matrix.",
            "opt_c": "Misconception: Constraint derivatives form the constraint Jacobian.",
            "opt_d": "Misconception: Hessian evaluates curvature at critical points."
        },
        "explanation": "The Hessian matrix contains all second-order partial derivatives. By the second derivative test in multivariable calculus, if ∇f(x*) = 0 and H(x*) is positive definite, x* is a strict local minimum."
    },
    {
        "id": "q_linalg_40",
        "skillId": "skill_linalg",
        "skillName": "Linear Algebra",
        "skillsTested": ["skill_linalg", "skill_ml"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the geometric meaning of the Singular Value Decomposition A = U Sigma V^T for any linear transformation A: R^n -> R^m?",
        "options": [
            {"id": "opt_a", "text": "Any linear transformation factors into: an initial orthogonal rotation in the domain (V^T), followed by coordinate-axis scaling by singular values (Sigma), followed by a second orthogonal rotation in the codomain (U)"},
            {"id": "opt_b", "text": "It decomposes the matrix into a sum of skew-symmetric components"},
            {"id": "opt_c", "text": "It maps circles into parabolas"},
            {"id": "opt_d", "text": "It rotates space by 180 degrees without scaling"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: SVD shows that every linear transformation maps an n-dimensional unit sphere into an m-dimensional hyper-ellipsoid via rotation, scaling, and rotation.",
            "opt_b": "Misconception: Additive decomposition, not SVD.",
            "opt_c": "Misconception: Linear maps map spheres into hyper-ellipsoids, never parabolas.",
            "opt_d": "Misconception: Singular values scale axes non-uniformly."
        },
        "explanation": "SVD proves that every linear map decomposes into an orthogonal coordinate rotation (Vᵀ), independent scaling along orthogonal axes (Σ), and a final orthogonal rotation (U), mapping unit spheres into ellipsoids."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/linearAlgebra.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const LINEAR_ALGEBRA_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Linear Algebra questions in {out_file}")

if __name__ == '__main__':
    main()
