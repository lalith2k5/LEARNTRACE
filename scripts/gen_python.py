import json
import os

questions = [
    # Difficulty 1: Recall (q_py_01 to q_py_08)
    {
        "id": "q_py_01",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the average-case time complexity of looking up a key in a standard Python dictionary?",
        "options": [
            {"id": "opt_a", "text": "O(1) constant time"},
            {"id": "opt_b", "text": "O(log n) logarithmic time"},
            {"id": "opt_c", "text": "O(n) linear time"},
            {"id": "opt_d", "text": "O(n log n) linearithmic time"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Python dictionaries use open-addressing hash tables, giving amortized O(1) key lookups.",
            "opt_b": "Misconception: Believes Python dicts are implemented as binary search trees like C++ std::map.",
            "opt_c": "Misconception: Confuses dictionary lookup with linear scanning of an unsorted list.",
            "opt_d": "Misconception: Confuses dictionary lookup with sorting algorithms."
        },
        "explanation": "Python dictionaries are hash tables that map hashable keys to buckets with collision resolution via open addressing, achieving O(1) average lookup time."
    },
    {
        "id": "q_py_02",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "Which of the following built-in data structures in Python is immutable?",
        "options": [
            {"id": "opt_a", "text": "tuple"},
            {"id": "opt_b", "text": "list"},
            {"id": "opt_c", "text": "dict"},
            {"id": "opt_d", "text": "set"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Tuples cannot be modified in-place after creation.",
            "opt_b": "Misconception: Lists are mutable sequences that support append, extend, and slice assignment.",
            "opt_c": "Misconception: Dictionaries are mutable mappings allowing key insertion and deletion.",
            "opt_d": "Misconception: Sets are mutable collections supporting add and remove operations."
        },
        "explanation": "Tuples and strings are Python's primary immutable sequence types. Once instantiated, their length and element references cannot be altered."
    },
    {
        "id": "q_py_03",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What does the expression `bool([])` evaluate to in Python?",
        "options": [
            {"id": "opt_a", "text": "False"},
            {"id": "opt_b", "text": "True"},
            {"id": "opt_c", "text": "None"},
            {"id": "opt_d", "text": "Raises a TypeError"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In Python, empty collections (lists, tuples, dicts, sets, strings) evaluate to False in boolean contexts.",
            "opt_b": "Misconception: Assumes the existence of any object instance evaluates to True.",
            "opt_c": "Misconception: Confuses boolean False with NoneType.",
            "opt_d": "Misconception: Believes bool() requires an explicit boolean argument."
        },
        "explanation": "Python's truth value testing protocol defines empty containers (len == 0) as falsy, returning False."
    },
    {
        "id": "q_py_04",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the output of `type(lambda x: x)` in Python?",
        "options": [
            {"id": "opt_a", "text": "<class 'function'>"},
            {"id": "opt_b", "text": "<class 'lambda'>"},
            {"id": "opt_c", "text": "<class 'generator'>"},
            {"id": "opt_d", "text": "<class 'closure'>"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Anonymous lambda functions create standard function objects identical in type to def statements.",
            "opt_b": "Misconception: Believes Python has a dedicated 'lambda' type.",
            "opt_c": "Misconception: Confuses lambdas with generator functions containing yield.",
            "opt_d": "Misconception: Confuses function type with closure variable scopes."
        },
        "explanation": "In Python, both `def` and `lambda` construct instances of `types.FunctionType` (<class 'function'>)."
    },
    {
        "id": "q_py_05",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What will `len({'a': 1, 'b': 2, 'a': 3})` return?",
        "options": [
            {"id": "opt_a", "text": "2"},
            {"id": "opt_b", "text": "3"},
            {"id": "opt_c", "text": "1"},
            {"id": "opt_d", "text": "Raises a KeyError"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Dictionary keys must be unique; duplicate key 'a' overwrites value 1 with 3.",
            "opt_b": "Misconception: Counts raw lexical entries without recognizing key deduplication.",
            "opt_c": "Misconception: Assumes duplicates collapse the entire dictionary to 1 item.",
            "opt_d": "Misconception: Expects a syntax or runtime error when repeating literal keys."
        },
        "explanation": "Dictionaries enforce key uniqueness. Subsequent definitions of key 'a' overwrite earlier values, leaving {'a': 3, 'b': 2} with length 2."
    },
    {
        "id": "q_py_06",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What does Python's `pass` statement do?",
        "options": [
            {"id": "opt_a", "text": "Executes nothing as a syntactic null operation placeholder"},
            {"id": "opt_b", "text": "Terminates the current loop like break"},
            {"id": "opt_c", "text": "Skips to the next loop iteration like continue"},
            {"id": "opt_d", "text": "Exits the current function with None"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: pass is a no-op required when statement syntax is grammatically mandatory.",
            "opt_b": "Misconception: Confuses pass with break.",
            "opt_c": "Misconception: Confuses pass with continue.",
            "opt_d": "Misconception: Confuses pass with return None."
        },
        "explanation": "The `pass` statement is a null operation; nothing happens when it executes. It serves as a syntactic placeholder."
    },
    {
        "id": "q_py_07",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "What is the return type of the built-in `range(5)` in Python 3?",
        "options": [
            {"id": "opt_a", "text": "<class 'range'> immutable sequence"},
            {"id": "opt_b", "text": "<class 'list'>"},
            {"id": "opt_c", "text": "<class 'generator'>"},
            {"id": "opt_d", "text": "<class 'iterator'>"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Python 3 range() returns an immutable range object supporting membership tests and indexing.",
            "opt_b": "Misconception: Confuses Python 3 range with Python 2 range which returned a list.",
            "opt_c": "Misconception: Confuses range with a generator object created by yield.",
            "opt_d": "Misconception: Confuses range with an active iterator created by iter(range)."
        },
        "explanation": "In Python 3, range is an immutable sequence type that calculates values on demand without allocating full memory."
    },
    {
        "id": "q_py_08",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 1,
        "cognitiveCategory": "Recall",
        "text": "How does Python handle argument passing to functions?",
        "options": [
            {"id": "opt_a", "text": "Pass-by-object-reference (or pass-by-assignment)"},
            {"id": "opt_b", "text": "Strict pass-by-value for all objects"},
            {"id": "opt_c", "text": "Strict pass-by-reference using C-style pointers"},
            {"id": "opt_d", "text": "Pass-by-name through macro substitution"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Parameter names are bound to passed object references, mutating mutable objects in-place.",
            "opt_b": "Misconception: Assumes objects are deep-copied into function arguments.",
            "opt_c": "Misconception: Assumes variable identifiers themselves can be reassigned globally.",
            "opt_d": "Misconception: Confuses argument passing with preprocessor macros."
        },
        "explanation": "Python passes references to existing objects. Rebinding a parameter locally does not rebind the caller identifier, but mutating a mutable object alters it globally."
    },

    # Difficulty 2: Comprehension (q_py_09 to q_py_16)
    {
        "id": "q_py_09",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What will `[x**2 for x in range(5) if x % 2 == 0]` produce?",
        "options": [
            {"id": "opt_a", "text": "[0, 4, 16]"},
            {"id": "opt_b", "text": "[1, 9]"},
            {"id": "opt_c", "text": "[0, 1, 4, 9, 16]"},
            {"id": "opt_d", "text": "[4, 16]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Even numbers in range(5) are 0, 2, 4. Their squares are 0, 4, 16.",
            "opt_b": "Misconception: Selected the odd numbers 1, 3 squared.",
            "opt_c": "Misconception: Omitted the 'if x % 2 == 0' filter condition.",
            "opt_d": "Misconception: Overlooked 0 as an even number."
        },
        "explanation": "range(5) gives 0, 1, 2, 3, 4. Even values are 0, 2, 4. Squaring them yields [0, 4, 16]."
    },
    {
        "id": "q_py_10",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the key operational difference between a list comprehension and a generator expression `(x**2 for x in data)`?",
        "options": [
            {"id": "opt_a", "text": "A generator produces values lazily on demand, using O(1) memory instead of allocating the full array in RAM"},
            {"id": "opt_b", "text": "A list comprehension can only contain integers, whereas a generator expression can contain any object"},
            {"id": "opt_c", "text": "A generator expression runs in a separate CPU thread asynchronously"},
            {"id": "opt_d", "text": "List comprehensions are evaluated lazily while generator expressions are strictly evaluated"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Generators compute elements on-the-fly via iteration protocol, conserving memory.",
            "opt_b": "Misconception: Both comprehensions and generators accept any data types.",
            "opt_c": "Misconception: Confuses lazy evaluation with multithreading.",
            "opt_d": "Misconception: Inverts the evaluation semantics."
        },
        "explanation": "Generator expressions yield items one at a time using iterator protocol, avoiding full memory allocation."
    },
    {
        "id": "q_py_11",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the difference between `copy.copy(x)` (shallow copy) and `copy.deepcopy(x)` on nested data structures?",
        "options": [
            {"id": "opt_a", "text": "Shallow copy duplicates the outer container but keeps references to nested objects; deepcopy recursively duplicates all child objects"},
            {"id": "opt_b", "text": "Shallow copy works on lists, while deepcopy works only on dictionaries"},
            {"id": "opt_c", "text": "Deepcopy freezes the objects as immutables, whereas shallow copy allows edits"},
            {"id": "opt_d", "text": "There is no difference in Python 3; both perform full independent cloning"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Shallow copy clones the top-level container, referencing nested elements.",
            "opt_b": "Misconception: Both copy functions work on arbitrary compound objects.",
            "opt_c": "Misconception: Confuses deepcopy with immutability.",
            "opt_d": "Misconception: Overlooks nested mutability mutation bugs."
        },
        "explanation": "Shallow copy constructs a new collection and populates it with references to child objects; deep copy recursively copies all nested children."
    },
    {
        "id": "q_py_12",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What will `list(zip(['a', 'b', 'c'], [1, 2]))` return?",
        "options": [
            {"id": "opt_a", "text": "[('a', 1), ('b', 2)]"},
            {"id": "opt_b", "text": "[('a', 1), ('b', 2), ('c', None)]"},
            {"id": "opt_c", "text": "Raises a ValueError due to uneven lengths"},
            {"id": "opt_d", "text": "[('a', 1), ('b', 2), ('c', 0)]"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Built-in zip stops when the shortest input iterable is exhausted.",
            "opt_b": "Misconception: Confuses standard zip() with itertools.zip_longest(fillvalue=None).",
            "opt_c": "Misconception: Assumes zip requires strict equal-length sequences.",
            "opt_d": "Misconception: Assumes missing numeric fields default to 0."
        },
        "explanation": "Standard Python zip() terminates as soon as the shortest iterable is exhausted, yielding 2 pairs."
    },
    {
        "id": "q_py_13",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What does the `*args` syntax in a function parameter list accomplish?",
        "options": [
            {"id": "opt_a", "text": "Packs extra positional arguments into a single tuple"},
            {"id": "opt_b", "text": "Packs extra keyword arguments into a dictionary"},
            {"id": "opt_c", "text": "Enforces type checking on all positional arguments"},
            {"id": "opt_d", "text": "Passes arguments as pointers like in C"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: *args collects variable positional arguments into a tuple.",
            "opt_b": "Misconception: Confuses *args with **kwargs which packs keyword arguments into a dict.",
            "opt_c": "Misconception: Confuses asterisk syntax with type annotations.",
            "opt_d": "Misconception: Confuses Python unpacking with C pointer dereferencing."
        },
        "explanation": "In Python function signatures, *args packs any number of positional arguments into an immutable tuple."
    },
    {
        "id": "q_py_14",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What happens when a Python function does not contain an explicit `return` statement?",
        "options": [
            {"id": "opt_a", "text": "It implicitly returns None upon reaching the end"},
            {"id": "opt_b", "text": "It raises a SyntaxError at compile time"},
            {"id": "opt_c", "text": "It returns False by default"},
            {"id": "opt_d", "text": "It returns the value of the last evaluated expression"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: In Python, functions without an explicit return statement return None.",
            "opt_b": "Misconception: Believes return is syntactically mandatory.",
            "opt_c": "Misconception: Confuses default return with boolean False.",
            "opt_d": "Misconception: Confuses Python semantics with Ruby or Rust where the last expression is returned."
        },
        "explanation": "If control reaches the end of a function body without hitting a return statement, Python executes an implicit `return None`."
    },
    {
        "id": "q_py_15",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the result of `'hello'[::-1]` in Python?",
        "options": [
            {"id": "opt_a", "text": "'olleh'"},
            {"id": "opt_b", "text": "'hello'"},
            {"id": "opt_c", "text": "Raises an IndexError"},
            {"id": "opt_d", "text": "'-hello'"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Slicing with a step of -1 traverses the sequence in reverse order.",
            "opt_b": "Misconception: Misinterprets negative step as having no effect.",
            "opt_c": "Misconception: Assumes negative slice strides are out-of-bounds.",
            "opt_d": "Misconception: Assumes the minus sign prepends to the string."
        },
        "explanation": "Slice syntax [start:stop:step] with step=-1 and omitted start/stop reverses the sequence from end to beginning."
    },
    {
        "id": "q_py_16",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 2,
        "cognitiveCategory": "Comprehension",
        "text": "What is the time complexity of checking membership `item in collection` for a Python `set` versus a `list`?",
        "options": [
            {"id": "opt_a", "text": "O(1) average for set, O(n) linear for list"},
            {"id": "opt_b", "text": "O(log n) for set, O(1) for list"},
            {"id": "opt_c", "text": "O(n) for both set and list"},
            {"id": "opt_d", "text": "O(1) for both set and list"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Sets hash items for O(1) average lookup, while lists require O(n) sequential scanning.",
            "opt_b": "Misconception: Inverts or confuses list indexing with membership testing.",
            "opt_c": "Misconception: Believes sets scan sequentially.",
            "opt_d": "Misconception: Believes lists have instant item lookup without index."
        },
        "explanation": "Python sets are implemented with hash tables providing O(1) average membership tests, whereas lists scan elements sequentially in O(n) time."
    },

    # Difficulty 3: Application (q_py_17 to q_py_24)
    {
        "id": "q_py_17",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python", "skill_linalg"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Given NumPy arrays `a = np.array([1, 2, 3])` and `b = np.array([4, 5, 6])`, what does `a * b` compute?",
        "options": [
            {"id": "opt_a", "text": "Element-wise multiplication: array([4, 10, 18])"},
            {"id": "opt_b", "text": "Dot product scalar: 32"},
            {"id": "opt_c", "text": "Outer product matrix of shape (3, 3)"},
            {"id": "opt_d", "text": "Cross product vector"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: The * operator in NumPy computes the element-wise Hadamard product.",
            "opt_b": "Misconception: Confuses * with np.dot(a, b) or the @ matrix multiplication operator.",
            "opt_c": "Misconception: Confuses element-wise multiplication with np.outer(a, b).",
            "opt_d": "Misconception: Confuses with np.cross(a, b)."
        },
        "explanation": "In NumPy, `*` is strictly element-wise multiplication. Dot product is computed with `@` or `np.dot()`."
    },
    {
        "id": "q_py_18",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What does this code output?\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))\n```",
        "options": [
            {"id": "opt_a", "text": "4"},
            {"id": "opt_b", "text": "3"},
            {"id": "opt_c", "text": "Raises an AttributeError"},
            {"id": "opt_d", "text": "5"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: 'b = a' binds 'b' to the exact same list object in memory, so appending via b mutates a.",
            "opt_b": "Misconception: Assumes 'b = a' creates an independent copy of the list.",
            "opt_c": "Misconception: Doubts list methods.",
            "opt_d": "Misconception: Off-by-one error."
        },
        "explanation": "Assignment in Python creates a reference to the existing object rather than a new copy. Modifying the list via `b` changes the object referenced by `a`."
    },
    {
        "id": "q_py_19",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "How do you sort a list of tuples `records = [('Alice', 85), ('Bob', 92), ('Charlie', 78)]` by the numeric score descending?",
        "options": [
            {"id": "opt_a", "text": "sorted(records, key=lambda x: x[1], reverse=True)"},
            {"id": "opt_b", "text": "records.sort(reverse=True)"},
            {"id": "opt_c", "text": "sorted(records, key=1, descending=True)"},
            {"id": "opt_d", "text": "records.sort(by='score')"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Uses key extraction lambda for index 1 and reverse=True for descending order.",
            "opt_b": "Misconception: Default sort compares the first element (name string) rather than score.",
            "opt_c": "Misconception: key must be a callable function, not an integer, and parameter is reverse, not descending.",
            "opt_d": "Misconception: Tuples do not have named attributes."
        },
        "explanation": "The `key` parameter takes a callable that extracts the comparison key from each element (`x[1]`), and `reverse=True` orders results descending."
    },
    {
        "id": "q_py_20",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the benefit of using `with open('file.txt', 'r') as f:` instead of `f = open('file.txt', 'r')`?",
        "options": [
            {"id": "opt_a", "text": "The context manager guarantees file closure even if an exception is raised inside the block"},
            {"id": "opt_b", "text": "It automatically parses the file into a JSON object"},
            {"id": "opt_c", "text": "It opens the file in non-blocking asynchronous mode"},
            {"id": "opt_d", "text": "It prevents other operating system processes from reading the file"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Context manager guarantees __exit__ is called to close the file handle reliably.",
            "opt_b": "Misconception: open() returns a file stream, not a parsed JSON structure.",
            "opt_c": "Misconception: Built-in open() is synchronous blocking I/O.",
            "opt_d": "Misconception: Does not implement exclusive OS file locking by default."
        },
        "explanation": "The `with` statement utilizes the context manager protocol (`__enter__` and `__exit__`), ensuring resources are properly released even upon error."
    },
    {
        "id": "q_py_21",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What is the output of the following dictionary comprehension: `{k: k%2 == 0 for k in range(3)}`?",
        "options": [
            {"id": "opt_a", "text": "{0: True, 1: False, 2: True}"},
            {"id": "opt_b", "text": "{0: 0, 1: 1, 2: 0}"},
            {"id": "opt_c", "text": "[True, False, True]"},
            {"id": "opt_d", "text": "{0: False, 1: True, 2: False}"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Evaluates condition k % 2 == 0 for keys 0 (True), 1 (False), 2 (True).",
            "opt_b": "Misconception: Assumes the expression returns the remainder integer rather than a boolean.",
            "opt_c": "Misconception: Confuses dict comprehension with a list comprehension.",
            "opt_d": "Misconception: Inverts boolean parity evaluation."
        },
        "explanation": "Dict comprehension builds a dictionary mapping each key to the boolean result of `k % 2 == 0`, yielding {0: True, 1: False, 2: True}."
    },
    {
        "id": "q_py_22",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "What does the `set.intersection` or `&` operator compute between sets `A = {1, 2, 3}` and `B = {2, 3, 4}`?",
        "options": [
            {"id": "opt_a", "text": "{2, 3}"},
            {"id": "opt_b", "text": "{1, 4}"},
            {"id": "opt_c", "text": "{1, 2, 3, 4}"},
            {"id": "opt_d", "text": "{1, 2, 3, 2, 3, 4}"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Intersection yields elements common to both sets ({2, 3}).",
            "opt_b": "Misconception: Confuses intersection with symmetric difference (^).",
            "opt_c": "Misconception: Confuses intersection with union (|).",
            "opt_d": "Misconception: Assumes sets retain duplicate entries."
        },
        "explanation": "Intersection returns elements that exist in both operand sets, which are 2 and 3."
    },
    {
        "id": "q_py_23",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "In Python decorators, what is the primary purpose of `@functools.wraps(func)` inside a decorator function?",
        "options": [
            {"id": "opt_a", "text": "Preserves the original function's metadata (__name__, __doc__, annotations) on the wrapper"},
            {"id": "opt_b", "text": "Compiles the inner function into native C code for acceleration"},
            {"id": "opt_c", "text": "Locks the function to prevent concurrent execution in multithreading"},
            {"id": "opt_d", "text": "Caches the return value of the function like memoization"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: wraps copies docstrings, function names, and signature metadata to the wrapper function.",
            "opt_b": "Misconception: Confuses functools.wraps with JIT compilation libraries like Numba.",
            "opt_c": "Misconception: Confuses wraps with threading.Lock.",
            "opt_d": "Misconception: Confuses wraps with functools.lru_cache."
        },
        "explanation": "Without `@functools.wraps`, a decorated function adopts the name and docstring of the wrapper function, breaking introspection and debugging."
    },
    {
        "id": "q_py_24",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 3,
        "cognitiveCategory": "Application",
        "text": "Given a pandas DataFrame `df`, how do you filter for rows where column `'age'` is greater than 30 and column `'active'` is True?",
        "options": [
            {"id": "opt_a", "text": "df[(df['age'] > 30) & (df['active'] == True)]"},
            {"id": "opt_b", "text": "df[df['age'] > 30 and df['active'] == True]"},
            {"id": "opt_c", "text": "df.filter(age > 30 and active == True)"},
            {"id": "opt_d", "text": "df.where(age > 30 && active == True)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Pandas requires bitwise & operator with parentheses for vectorized boolean filtering.",
            "opt_b": "Misconception: Python 'and' evaluates truth value of whole Series, raising ValueError ('The truth value of a Series is ambiguous').",
            "opt_c": "Misconception: df.filter filters column/index labels, not row values.",
            "opt_d": "Misconception: Uses C-style && syntax which is invalid in Python."
        },
        "explanation": "In Pandas, vectorized boolean logic requires bitwise operators (`&`, `|`) with explicit parentheses to handle operator precedence."
    },

    # Difficulty 4: Analysis (q_py_25 to q_py_32)
    {
        "id": "q_py_25",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "Consider the code:\n```python\ndef append_item(val, items=[]):\n    items.append(val)\n    return items\nprint(append_item(1))\nprint(append_item(2))\n```\nWhat is printed?",
        "options": [
            {"id": "opt_a", "text": "[1] then [1, 2]"},
            {"id": "opt_b", "text": "[1] then [2]"},
            {"id": "opt_c", "text": "[1] then [2, 1]"},
            {"id": "opt_d", "text": "Raises a TypeError on second call"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Mutable default argument items=[] is evaluated once at def time, persisting state across invocations.",
            "opt_b": "Misconception: Assumes a fresh default list is allocated for each call.",
            "opt_c": "Misconception: Confuses append order.",
            "opt_d": "Misconception: Believes default arguments cannot be re-used."
        },
        "explanation": "Default arguments are evaluated once at function definition time. Using a mutable object (like a list) binds a single instance across all calls."
    },
    {
        "id": "q_py_26",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python", "skill_linalg"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the NumPy broadcasting outcome when adding array `A` of shape `(4, 1, 5)` and array `B` of shape `(3, 5)`?",
        "options": [
            {"id": "opt_a", "text": "Compatible: yields shape (4, 3, 5)"},
            {"id": "opt_b", "text": "Incompatible: raises ValueError because dimensions do not match"},
            {"id": "opt_c", "text": "Compatible: yields shape (4, 1, 5)"},
            {"id": "opt_d", "text": "Compatible: yields shape (12, 5)"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: B is prepended with 1 to become (1, 3, 5). Trailing dims (5,5) match; middle (1,3) stretches to 3; leading (4,1) stretches to 4.",
            "opt_b": "Misconception: Believes arrays must have identical dimensions or ranks to broadcast.",
            "opt_c": "Misconception: Thinks smaller dimension takes precedence.",
            "opt_d": "Misconception: Multiplies dimensions 4 * 3 incorrectly."
        },
        "explanation": "Broadcasting aligns trailing dimensions from right to left: (4, 1, 5) and (1, 3, 5). 5 matches 5, 1 broadcasts to 3, and 1 broadcasts to 4 -> (4, 3, 5)."
    },
    {
        "id": "q_py_27",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does the following snippet print?\n```python\nfuncs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])\n```",
        "options": [
            {"id": "opt_a", "text": "[2, 2, 2]"},
            {"id": "opt_b", "text": "[0, 1, 2]"},
            {"id": "opt_c", "text": "[0, 0, 0]"},
            {"id": "opt_d", "text": "Raises a NameError"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Closures in Python bind late (by variable name, not value). When executed, 'i' has finalized to 2.",
            "opt_b": "Misconception: Assumes lambda captures value of i at definition time (requires default arg lambda i=i: i).",
            "opt_c": "Misconception: Assumes i resets to initial loop value.",
            "opt_d": "Misconception: Assumes loop variable is out of scope."
        },
        "explanation": "Python closures exhibit late binding: functions look up variable values in surrounding scope when called, at which point loop variable `i` equals 2."
    },
    {
        "id": "q_py_28",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the primary constraint imposed by Python's Global Interpreter Lock (GIL) in CPython?",
        "options": [
            {"id": "opt_a", "text": "Only one native thread can execute Python bytecode at a time, preventing true multi-core parallel speedup for CPU-bound tasks"},
            {"id": "opt_b", "text": "It limits the maximum memory allocation of the Python process to 4GB"},
            {"id": "opt_c", "text": "It restricts I/O bound network requests to single-threaded sequential execution"},
            {"id": "opt_d", "text": "It prohibits multiple Python processes from running simultaneously on the same OS"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: CPython's GIL prevents multi-core parallelism for CPU-bound threads.",
            "opt_b": "Misconception: Confuses GIL with 32-bit architecture memory limits.",
            "opt_c": "Misconception: The GIL is released during I/O operations, making threading effective for I/O bound tasks.",
            "opt_d": "Misconception: Multiprocessing spawns separate Python interpreters with their own GILs."
        },
        "explanation": "The GIL is a mutex that protects CPython memory management. For CPU-intensive tasks, threads compete for the GIL without utilizing multiple CPU cores."
    },
    {
        "id": "q_py_29",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What does Python's Method Resolution Order (MRO) use to resolve attribute and method lookup in multiple inheritance hierarchies?",
        "options": [
            {"id": "opt_a", "text": "C3 Linearization algorithm"},
            {"id": "opt_b", "text": "Simple Depth-First Search with right-to-left traversal"},
            {"id": "opt_c", "text": "Breadth-First Search across all parent levels"},
            {"id": "opt_d", "text": "Random tie-breaking when collisions occur"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Python 2.3+ uses C3 linearization to guarantee monotonicity and adhere to local precedence orders.",
            "opt_b": "Misconception: Classic Python classes (<2.2) used DFS, but modern new-style classes use C3.",
            "opt_c": "Misconception: BFS does not guarantee monotonicity in diamond inheritance.",
            "opt_d": "Misconception: Python MRO is deterministic and consistent."
        },
        "explanation": "Python uses the C3 Linearization algorithm to construct a consistent, monotonic MRO for classes with multiple inheritance."
    },
    {
        "id": "q_py_30",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the difference in memory behavior between `a = [0] * 1000000` and `g = (0 for _ in range(1000000))`?",
        "options": [
            {"id": "opt_a", "text": "List allocates ~8MB upfront to store pointers to 1,000,000 integers; generator consumes ~100 bytes constant memory regardless of count"},
            {"id": "opt_b", "text": "Both consume identical memory because Python optimizes lists of identical elements"},
            {"id": "opt_c", "text": "Generator consumes more memory due to frame object overhead"},
            {"id": "opt_d", "text": "List allocates no memory until sliced"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Lists allocate contiguous arrays of pointers; generators maintain only internal frame state and current step.",
            "opt_b": "Misconception: Even with integer interning, the list must allocate an array of 1,000,000 pointers.",
            "opt_c": "Misconception: A generator frame has small fixed overhead compared to millions of pointers.",
            "opt_d": "Misconception: Lists allocate memory immediately upon creation."
        },
        "explanation": "A list allocates memory for all element pointers immediately, while a generator expression computes items lazily with constant O(1) memory overhead."
    },
    {
        "id": "q_py_31",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the consequence of modifying a dictionary while iterating over its keys (`for k in my_dict: my_dict[k + '_new'] = 1`)?",
        "options": [
            {"id": "opt_a", "text": "Raises `RuntimeError: dictionary changed size during iteration`"},
            {"id": "opt_b", "text": "Executes infinitely as new keys are continuously processed"},
            {"id": "opt_c", "text": "Modifications are buffered and applied only after the loop completes"},
            {"id": "opt_d", "text": "Silently drops existing keys"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Python checks dictionary mutation counter during iteration and raises RuntimeError.",
            "opt_b": "Misconception: Assumes iteration continues blindly into modified buckets.",
            "opt_c": "Misconception: Python dictionary iterators do not maintain transactional buffers.",
            "opt_d": "Misconception: Dicts do not drop keys without explicit deletion."
        },
        "explanation": "CPython tracks a dictionary mutation counter. Adding or deleting keys while iterating over the dictionary raises a `RuntimeError`."
    },
    {
        "id": "q_py_32",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 4,
        "cognitiveCategory": "Analysis",
        "text": "What is the difference between `is` and `==` in Python?",
        "options": [
            {"id": "opt_a", "text": "`is` tests object identity (memory address equality), while `==` tests value/equality via `__eq__`"},
            {"id": "opt_b", "text": "`is` is used for numbers and `==` is used for strings"},
            {"id": "opt_c", "text": "`==` checks memory addresses while `is` compares types"},
            {"id": "opt_d", "text": "They are synonymous aliases in modern Python"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: 'is' checks id(a) == id(b); '==' invokes a.__eq__(b).",
            "opt_b": "Misconception: Arbitrary type division.",
            "opt_c": "Misconception: Inverts the identities.",
            "opt_d": "Misconception: Overlooks object identity semantics."
        },
        "explanation": "`is` checks whether two variables point to the exact same object in memory (`id(a) == id(b)`), whereas `==` evaluates value equality via `__eq__`."
    },

    # Difficulty 5: Synthesis (q_py_33 to q_py_40)
    {
        "id": "q_py_33",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How do you implement a custom descriptor in Python that intercepts attribute access on instances of a class?",
        "options": [
            {"id": "opt_a", "text": "Define a class implementing `__get__`, `__set__`, and/or `__delete__` protocol methods"},
            {"id": "opt_b", "text": "Subclass `types.Descriptor` and override `dispatch()`"},
            {"id": "opt_c", "text": "Decorate the class with `@property.meta`"},
            {"id": "opt_d", "text": "Override `__new__` in the host class to return a proxy object"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Python's descriptor protocol is implemented by defining __get__, __set__, and/or __delete__ on an object assigned as a class attribute.",
            "opt_b": "Misconception: There is no types.Descriptor base class required in Python.",
            "opt_c": "Misconception: Invented decorator syntax.",
            "opt_d": "Misconception: Confuses instance construction with attribute lookup protocol."
        },
        "explanation": "Descriptors are objects that define `__get__`, `__set__`, or `__delete__`. When accessed as class attributes on an instance, Python invokes these descriptor methods."
    },
    {
        "id": "q_py_34",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "In a custom context manager class, how can the `__exit__(self, exc_type, exc_val, exc_tb)` method suppress an exception that occurred inside the `with` block?",
        "options": [
            {"id": "opt_a", "text": "Return a truthy value (such as `True`) from `__exit__`"},
            {"id": "opt_b", "text": "Call `sys.suppress_exception()` inside `__exit__`"},
            {"id": "opt_c", "text": "Set `exc_val = None` within `__exit__`"},
            {"id": "opt_d", "text": "Raise a `StopIteration` exception"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: If __exit__ returns True (or truthy), Python suppresses the exception and continues execution after the with statement.",
            "opt_b": "Misconception: Invented sys module method.",
            "opt_c": "Misconception: Modifying the exc_val argument does not alter Python's exception propagation.",
            "opt_d": "Misconception: Raising another exception replaces the original rather than suppressing."
        },
        "explanation": "When an exception occurs in a `with` block, Python passes the exception info to `__exit__`. If `__exit__` returns `True`, the exception is swallowed."
    },
    {
        "id": "q_py_35",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python", "skill_linalg"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does `numpy.lib.stride_tricks.as_strided` do, and what critical risk does it carry?",
        "options": [
            {"id": "opt_a", "text": "Creates a new view of an array with arbitrary shape and strides without copying memory; risk of accessing out-of-bounds unallocated RAM (segfault)"},
            {"id": "opt_b", "text": "Converts dense arrays to sparse CSR format; risk of slow column access"},
            {"id": "opt_c", "text": "Compresses arrays via zlib; risk of data corruption"},
            {"id": "opt_d", "text": "Transposes high-dimensional tensors; risk of changing array dtype"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: as_strided creates zero-copy strided views (e.g. for rolling windows), but incorrect strides read arbitrary process memory.",
            "opt_b": "Misconception: Confuses striding with scipy.sparse formats.",
            "opt_c": "Misconception: Not a compression tool.",
            "opt_d": "Misconception: Strides manipulation does not alter dtype."
        },
        "explanation": "`as_strided` constructs views with custom strides without copying data. Because memory bounds are not checked, incorrect strides cause segmentation faults or memory corruption."
    },
    {
        "id": "q_py_36",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What does a Python metaclass's `__new__(mcs, name, bases, attrs)` method do differently from `__init__`?",
        "options": [
            {"id": "opt_a", "text": "`__new__` creates and returns the class object itself before it exists, enabling modification of class attributes and namespace before class instantiation"},
            {"id": "opt_b", "text": "`__new__` initializes instance variables of classes, whereas `__init__` creates them"},
            {"id": "opt_c", "text": "`__new__` is only invoked during deserialization (pickle)"},
            {"id": "opt_d", "text": "`__new__` cannot alter class attributes"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Metaclass __new__ constructs the class type object itself, allowing attribute mutation, injection, or validation before class creation.",
            "opt_b": "Misconception: Inverts instance vs class construction roles.",
            "opt_c": "Misconception: Confuses metaclasses with pickle protocol (__reduce__).",
            "opt_d": "Misconception: attrs dictionary can be directly manipulated inside __new__."
        },
        "explanation": "A metaclass defines how classes are constructed. `__new__` is called to allocate and return the class type object itself, allowing custom transformations of the class definition."
    },
    {
        "id": "q_py_37",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What is the memory advantage of Python's `memoryview` object when slicing large binary buffers (like `bytes` or `bytearray`)?",
        "options": [
            {"id": "opt_a", "text": "It supports slicing without copying the underlying buffer, operating directly on existing memory (zero-copy)"},
            {"id": "opt_b", "text": "It automatically compresses data in L1 CPU cache"},
            {"id": "opt_c", "text": "It encrypts the buffer in RAM to prevent introspection"},
            {"id": "opt_d", "text": "It converts byte streams into UTF-32 unicode strings automatically"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: memoryview accesses the C-level buffer protocol of an object without copying bytes, achieving O(1) time and memory slicing.",
            "opt_b": "Misconception: Hardware cache management is controlled by the CPU, not memoryview.",
            "opt_c": "Misconception: memoryview provides no security encryption.",
            "opt_d": "Misconception: memoryview deals with raw binary bytes, not string decoding."
        },
        "explanation": "`memoryview` uses the buffer protocol to expose raw memory of an object. Slicing a `memoryview` creates a new view rather than copying the data, enabling high-performance zero-copy I/O."
    },
    {
        "id": "q_py_38",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "How does `asyncio` achieve concurrency in a single-threaded Python process?",
        "options": [
            {"id": "opt_a", "text": "Through an event loop coordinating cooperative multitasking: coroutines yield control via `await` while waiting for I/O operations"},
            {"id": "opt_b", "text": "By bypassing the GIL using micro-threads spawned at the kernel level"},
            {"id": "opt_c", "text": "By preemptively interrupting long-running CPU calculations every 5 milliseconds"},
            {"id": "opt_d", "text": "By compiling Python code into multi-threaded WebAssembly"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: asyncio uses an event loop and non-blocking sockets where coroutines explicitly yield control via await.",
            "opt_b": "Misconception: asyncio does not spawn kernel threads; it is single-threaded cooperative multitasking.",
            "opt_c": "Misconception: asyncio is cooperative, not preemptive; CPU-bound loops block the event loop entirely.",
            "opt_d": "Misconception: asyncio is pure Python standard library."
        },
        "explanation": "`asyncio` uses cooperative multitasking driven by an event loop. Coroutines yield control at `await` expressions during I/O waits, allowing other scheduled tasks to run."
    },
    {
        "id": "q_py_39",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "Why does adding `__slots__ = ('x', 'y')` to a Python class drastically reduce memory footprint when creating millions of instances?",
        "options": [
            {"id": "opt_a", "text": "It prevents the creation of a per-instance `__dict__` hash table, allocating a fixed-size array of attribute references instead"},
            {"id": "opt_b", "text": "It forces all attributes to be stored as 16-bit integers"},
            {"id": "opt_c", "text": "It automatically shares instance variable values across all instances"},
            {"id": "opt_d", "text": "It compiles instance method bytecode into static C structs"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: Standard Python objects have a ~150-byte dynamic __dict__; __slots__ replaces this with a lightweight fixed descriptor array.",
            "opt_b": "Misconception: __slots__ does not enforce primitive C-types; attributes can still hold any Python objects.",
            "opt_c": "Misconception: Attributes remain distinct per instance; only the lookup mechanism is fixed.",
            "opt_d": "Misconception: Methods are already class-level; __slots__ affects instance attribute storage."
        },
        "explanation": "Standard Python instances store attributes in a dynamic `__dict__` dictionary. Defining `__slots__` bypasses `__dict__` creation, replacing it with a fixed descriptor array that saves significant RAM per instance."
    },
    {
        "id": "q_py_40",
        "skillId": "skill_python",
        "skillName": "Python",
        "skillsTested": ["skill_python"],
        "difficulty": 5,
        "cognitiveCategory": "Synthesis",
        "text": "What happens if a generator function raises a `StopIteration` inside a `try...except` block, and what change was introduced in PEP 479?",
        "options": [
            {"id": "opt_a", "text": "PEP 479 converts an unhandled `StopIteration` raised inside a generator into a `RuntimeError` to prevent silent premature generator termination"},
            {"id": "opt_b", "text": "The generator restarts iteration from the beginning"},
            {"id": "opt_c", "text": "The StopIteration is automatically caught and converted into None"},
            {"id": "opt_d", "text": "Python ignores the exception and continues executing the next yield statement"}
        ],
        "correctAnswer": "opt_a",
        "distractorRationales": {
            "opt_a": "Correct: PEP 479 prevents bugs where a nested next() raising StopIteration accidentally terminates the outer generator, converting it into a RuntimeError.",
            "opt_b": "Misconception: Generators cannot restart without being re-instantiated.",
            "opt_c": "Misconception: PEP 479 intentionally raises an error rather than returning None.",
            "opt_d": "Misconception: Exceptions in Python are never silently ignored without explicit except."
        },
        "explanation": "Under PEP 479 (standard in Python 3.7+), if a `StopIteration` bubbles out of a generator without being caught, Python transforms it into a `RuntimeError`."
    }
]

def main():
    out_file = os.path.join(os.path.dirname(__file__), '../server/data/questions/python.ts')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write("import { SeedQuestionDefinition } from '../questionBank.js';\n\n")
        f.write("export const PYTHON_QUESTIONS: SeedQuestionDefinition[] = ")
        f.write(json.dumps(questions, indent=2))
        f.write(";\n")
    print(f"Generated {len(questions)} Python questions in {out_file}")

if __name__ == '__main__':
    main()
