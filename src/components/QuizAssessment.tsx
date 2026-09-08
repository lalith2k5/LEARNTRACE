import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Cpu,
  Brain,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  AlertTriangle,
  Lightbulb,
  PenTool,
  Check,
  Send,
  ListChecks,
} from 'lucide-react';
import { api } from '../api/client';
import { Question, Skill, AiExplainResponse, CognitiveState, OpenEndedEvaluationResponse } from '../types';

interface QuizAssessmentProps {
  initialSkillId?: string;
  onAssessmentCompleted?: () => void;
}

export const QuizAssessment: React.FC<QuizAssessmentProps> = ({
  initialSkillId,
  onAssessmentCompleted,
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>(initialSkillId || '');
  const [assessmentMode, setAssessmentMode] = useState<'multiple_choice' | 'open_ended'>('multiple_choice');

  // MC Question state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [generatingAiQuestion, setGeneratingAiQuestion] = useState<boolean>(false);

  // Active MC question state
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(3);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [gradingResult, setGradingResult] = useState<{
    correct: boolean;
    correctAnswerText?: string;
    explanation?: string;
    updatedMastery?: number;
    cognitiveState?: CognitiveState;
  } | null>(null);

  // Open-Ended state
  const [openEndedPrompt, setOpenEndedPrompt] = useState<string>('');
  const [studentTextResponse, setStudentTextResponse] = useState<string>('');
  const [openEndedConfidence, setOpenEndedConfidence] = useState<number>(3);
  const [gradingOpenEnded, setGradingOpenEnded] = useState<boolean>(false);
  const [openEndedResult, setOpenEndedResult] = useState<OpenEndedEvaluationResponse | null>(null);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // AI Explain state
  const [aiExplanation, setAiExplanation] = useState<AiExplainResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Pre-configured open-ended conceptual challenges by skill
  const openEndedPromptsBySkill: Record<string, string[]> = {
    skill_python: [
      'Explain the difference between mutable and immutable objects in Python, and describe how memory references behave when passing lists into functions.',
      'Explain how NumPy broadcasting works under the hood when operating on arrays of differing dimensions.',
    ],
    skill_prob: [
      'Explain the Law of Total Probability and describe how prior probabilities and likelihoods interact when estimating uncertainty.',
      'What is the difference between mutually exclusive events and independent events? Provide an intuitive real-world scenario.',
    ],
    skill_cond_prob: [
      'Explain Bayes\' Theorem in your own words. Why is accounting for base rate prevalence critical when interpreting medical test results?',
      'How does the posterior distribution change when we observe strong contradictory evidence versus weak noisy evidence?',
    ],
    skill_prob_dist: [
      'Explain the difference between a Probability Density Function (PDF) and a Cumulative Distribution Function (CDF) for continuous variables.',
      'Under what conditions does a Binomial distribution approximate a Gaussian (Normal) distribution or a Poisson distribution?',
    ],
    skill_stats: [
      'Explain what a p-value represents and why a p-value < 0.05 does not imply a 95% probability that the research hypothesis is true.',
      'Explain the Central Limit Theorem and how it enables confidence interval estimation even when raw data is skewed.',
    ],
    skill_linalg: [
      'Explain the geometric and algebraic meaning of an eigenvector and eigenvalue for a transformation matrix, and how they relate to Principal Component Analysis (PCA).',
      'What is the dot product of two vectors geometrically, and why does an orthogonal pair have a dot product of zero?',
    ],
    skill_model_eval: [
      'Why is overall Accuracy a dangerous metric for heavily imbalanced classification problems? Explain the trade-off between Precision, Recall, and F1-score.',
      'Explain what the Area Under the ROC Curve (ROC-AUC) measures and why it remains invariant to changes in class distribution.',
    ],
    skill_ml: [
      'Explain the Bias-Variance tradeoff in supervised learning. How do L1 (Lasso) and L2 (Ridge) regularization help mitigate high variance?',
      'Explain the mechanics of Gradient Descent and how learning rate schedules prevent divergence or oscillation.',
    ],
  };

  // Load skills list
  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await api.getSkills();
        setSkills(data);
        if (!selectedSkillId && data.length > 0) {
          setSelectedSkillId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load skills for quiz:', err);
      }
    }
    loadSkills();
  }, []);

  // Update selectedSkillId if prop changes
  useEffect(() => {
    if (initialSkillId) {
      setSelectedSkillId(initialSkillId);
    }
  }, [initialSkillId]);

  // Load questions or prompt when skill changes
  useEffect(() => {
    if (!selectedSkillId) return;

    // Reset MC questions
    async function loadQuestions() {
      try {
        setLoadingQuestions(true);
        const data = await api.getQuestions(selectedSkillId);
        if (data.length === 0) {
          // Automatically fetch/synthesize questions in the background
          try {
            const gen = await api.generateAiQuestion(selectedSkillId);
            if (gen.question) {
              setQuestions([gen.question]);
            } else {
              setQuestions([]);
            }
          } catch {
            setQuestions([]);
          }
        } else {
          setQuestions(data);
        }
        setCurrentIndex(0);
        setSelectedOptionId('');
        setConfidence(3);
        setGradingResult(null);
        setAiExplanation(null);
        setTimerSeconds(0);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    }
    loadQuestions();

    // Set default open-ended prompt
    const prompts = openEndedPromptsBySkill[selectedSkillId] || [
      'Explain the core mechanism, mathematical formulation, and key applications of this skill in modern data science.',
    ];
    setOpenEndedPrompt(prompts[0]);
    setStudentTextResponse('');
    setOpenEndedResult(null);
  }, [selectedSkillId]);

  // Timer logic for active question
  useEffect(() => {
    if (gradingResult === null && !loadingQuestions && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gradingResult, loadingQuestions, questions.length, currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (gradingResult !== null) return;
    setSelectedOptionId(optionId);
    setSubmissionError(null);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !selectedOptionId) {
      setSubmissionError('Please select an answer choice before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmissionError(null);

      const response = await api.submitAttempt({
        questionId: currentQuestion.id,
        answer: selectedOptionId,
        timeTakenSeconds: timerSeconds,
        confidence: confidence,
      });

      setGradingResult({
        correct: response.correct,
        correctAnswerText: response.correctAnswerText,
        explanation: response.explanation || currentQuestion.explanation,
        updatedMastery: response.updatedMastery?.masteryScore,
        cognitiveState: response.attempt?.cognitiveState,
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmissionError(err.message || 'Failed to submit attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitOpenEnded = async () => {
    if (!studentTextResponse.trim() || studentTextResponse.trim().length < 10) {
      setSubmissionError('Please provide a substantive response (at least 1-2 sentences).');
      return;
    }

    try {
      setGradingOpenEnded(true);
      setSubmissionError(null);

      const res = await api.gradeOpenEnded({
        skillId: selectedSkillId,
        prompt: openEndedPrompt,
        studentResponse: studentTextResponse,
        selfConfidence: openEndedConfidence,
      });

      setOpenEndedResult(res);
    } catch (err: any) {
      console.error('Open-ended grading error:', err);
      setSubmissionError(err.message || 'Failed to grade conceptual response.');
    } finally {
      setGradingOpenEnded(false);
    }
  };

  const handleRequestAiExplanation = async () => {
    if (!currentQuestion) return;

    try {
      setLoadingAi(true);
      const isCorrect = gradingResult ? gradingResult.correct : false;
      const res = await api.explainQuestion(
        currentQuestion.id,
        selectedOptionId,
        confidence,
        isCorrect
      );
      setAiExplanation(res);
    } catch (err) {
      console.error('AI explanation error:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId('');
      setConfidence(3);
      setGradingResult(null);
      setAiExplanation(null);
      setTimerSeconds(0);
      setSubmissionError(null);
    } else {
      if (onAssessmentCompleted) {
        onAssessmentCompleted();
      }
    }
  };

  const handleGenerateAdaptiveAiQuestion = async () => {
    if (!selectedSkillId) return;

    try {
      setGeneratingAiQuestion(true);
      const res = await api.generateAiQuestion(selectedSkillId);
      if (res.question) {
        setQuestions((prev) => [res.question, ...prev]);
        setCurrentIndex(0);
        setSelectedOptionId('');
        setConfidence(3);
        setGradingResult(null);
        setAiExplanation(null);
        setTimerSeconds(0);
      }
    } catch (err: any) {
      console.error('Error synthesizing question:', err);
      setSubmissionError(err.message || 'Unable to generate dynamic question right now.');
    } finally {
      setGeneratingAiQuestion(false);
    }
  };

  const activeSkillObj = skills.find((s) => s.id === selectedSkillId);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Skill & Mode Selector Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#1877F2]">
                Diagnostic & Mastery Assessment
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {activeSkillObj?.name || 'Skill Assessment'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{activeSkillObj?.description}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setAssessmentMode('multiple_choice')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  assessmentMode === 'multiple_choice'
                    ? 'bg-[#1877F2] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Multiple Choice</span>
              </button>

              <button
                onClick={() => setAssessmentMode('open_ended')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  assessmentMode === 'open_ended'
                    ? 'bg-[#1877F2] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Open-Ended Challenge</span>
              </button>
            </div>

            {/* Skill Dropdown */}
            <select
              id="select-quiz-skill"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1877F2] cursor-pointer shadow-2xs"
            >
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.domain})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Assessment Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-2xs space-y-6">

        {/* ----------------- MODE 1: MULTIPLE CHOICE ----------------- */}
        {assessmentMode === 'multiple_choice' ? (
          loadingQuestions ? (
            <div className="py-20 text-center text-slate-500 space-y-3">
              <Cpu className="w-8 h-8 animate-spin text-[#1877F2] mx-auto" />
              <p className="text-sm">Loading diagnostic items for {activeSkillObj?.name}...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Cpu className="w-8 h-8 animate-spin text-[#1877F2] mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Preparing Diagnostic Questions</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Synthesizing diagnostic questions for {activeSkillObj?.name || 'this concept'}...
              </p>
            </div>
          ) : currentQuestion ? (
            <>
              {/* Question Meta & Timer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 uppercase tracking-wider border border-slate-200">
                    Difficulty L{currentQuestion.difficulty || 2}
                  </span>
                  {currentQuestion.skillsTested && currentQuestion.skillsTested.length > 1 && (
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-blue-50 text-[#1877F2] border border-blue-200 text-[10px] font-semibold">
                      Multi-Skill Diagnostic
                    </span>
                  )}
                </div>

                {/* Real-time Latency Tracker */}
                <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>{timerSeconds}s</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2 min-w-0 max-w-3xl">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed break-words">
                  {currentQuestion.text}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isSubmitted = gradingResult !== null;
                  
                  let optionStyles = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                  if (isSelected && !isSubmitted) {
                    optionStyles = 'border-[#1877F2] bg-blue-50/70 text-blue-950 ring-2 ring-[#1877F2]/30 shadow-2xs';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isSubmitted}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start sm:items-center justify-between gap-3 cursor-pointer min-w-0 ${optionStyles} ${
                        isSubmitted ? 'cursor-default opacity-90' : ''
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 sm:mt-0 ${
                            isSelected
                              ? 'border-[#1877F2] bg-[#1877F2] text-white'
                              : 'border-slate-300 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {opt.id.replace('opt_', '')}
                        </div>
                        <span className="break-words min-w-0">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Confidence Rating (1 to 5) */}
              {gradingResult === null && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#1877F2]" />
                      Self-Reported Confidence (1 = Guessing, 5 = Absolute Certainty)
                    </span>
                    <span className="font-mono text-[#1877F2] font-bold">{confidence} / 5</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfidence(lvl)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          confidence === lvl
                            ? 'bg-[#1877F2] text-white border-[#1877F2] shadow-2xs'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {submissionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2">
                  <span>{submissionError}</span>
                  <button
                    onClick={() => setSubmissionError(null)}
                    className="px-2 py-1 bg-rose-100 hover:bg-rose-200 rounded text-[11px] font-semibold text-rose-800 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Submit Button */}
              {gradingResult === null && (
                <button
                  id="btn-submit-answer"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOptionId || submitting}
                  className="w-full py-3 px-6 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin" />
                      <span>Grading on Server...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {/* Post-Grading Result & Diagnostic Explanation */}
              {gradingResult !== null && (
                <div className="space-y-4 pt-2">
                  <div
                    className={`p-5 rounded-xl border ${
                      gradingResult.correct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {gradingResult.correct ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="font-bold text-base">
                            {gradingResult.correct ? 'Correct! Excellent work.' : 'Incorrect Answer'}
                          </h4>

                          {gradingResult.cognitiveState && (
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                                gradingResult.cognitiveState === 'CONFIDENT_MISCONCEPTION'
                                   ? 'bg-amber-100 text-amber-900 border-amber-300'
                                   : gradingResult.cognitiveState === 'SOLID_MASTERY'
                                   ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                   : gradingResult.cognitiveState === 'FRAGILE_KNOWLEDGE'
                                   ? 'bg-yellow-100 text-yellow-900 border-yellow-300'
                                   : 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}
                            >
                              State: {gradingResult.cognitiveState.replace('_', ' ')}
                            </span>
                          )}
                        </div>

                        {!gradingResult.correct && gradingResult.correctAnswerText && (
                          <p className="text-xs text-slate-700">
                            Correct Answer: <strong className="text-emerald-700">{gradingResult.correctAnswerText}</strong>
                          </p>
                        )}

                        {gradingResult.explanation && (
                          <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-white/90 p-3 rounded-lg border border-slate-200">
                            {gradingResult.explanation}
                          </p>
                        )}

                        {gradingResult.updatedMastery !== undefined && (
                          <div className="text-xs text-[#1877F2] font-mono pt-1">
                            Recalculated Mastery in {currentQuestion.skillName}:{' '}
                            <strong>{Math.round(gradingResult.updatedMastery * 100)}%</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      id="btn-ai-explain"
                      onClick={handleRequestAiExplanation}
                      disabled={loadingAi}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-indigo-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <Brain className={`w-4 h-4 text-indigo-600 ${loadingAi ? 'animate-spin' : ''}`} />
                      <span>{loadingAi ? 'Generating AI Breakdown...' : 'Explain with AI Tutor'}</span>
                    </button>

                    <button
                      id="btn-next-question"
                      onClick={handleNextQuestion}
                      className="flex-1 py-2.5 px-5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Assessment'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {aiExplanation && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-blue-900 font-bold flex-wrap gap-2">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#1877F2]" />
                          AI Tutor Conceptual Breakdown
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {aiExplanation.keyConcept && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Concept: {aiExplanation.keyConcept}
                            </span>
                          )}
                          <span
                            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                              aiExplanation.source === 'gemini'
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : aiExplanation.source === 'ollama'
                                ? 'bg-purple-100 text-purple-800 border-purple-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200'
                            }`}
                          >
                            {aiExplanation.source === 'gemini'
                              ? 'Gemini 3.8 Flash'
                              : aiExplanation.source === 'ollama'
                              ? 'Ollama LLM'
                              : 'Curriculum Pedagogical Notes (Offline Fallback)'}
                          </span>
                        </div>
                      </div>

                      {aiExplanation.cognitiveDiagnosis && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{aiExplanation.cognitiveDiagnosis}</span>
                        </div>
                      )}

                      <p className="text-slate-800 leading-relaxed font-sans text-sm">
                        {aiExplanation.explanation}
                      </p>

                      {aiExplanation.correctAnswer && (
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-blue-100 flex items-center gap-1">
                          <span className="font-semibold text-slate-700">Target Accurate Concept:</span>
                          <span className="font-medium text-emerald-700">{aiExplanation.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null
        ) : (
          /* ----------------- MODE 2: OPEN-ENDED CONCEPTUAL CHALLENGE ----------------- */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="flex items-center gap-2 text-[#1877F2] text-xs font-bold uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>Open-Ended Cognitive Challenge ({activeSkillObj?.name})</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                "{openEndedPrompt}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Type your comprehensive explanation (evaluated with AI cognitive rubric):
              </label>
              <textarea
                value={studentTextResponse}
                onChange={(e) => setStudentTextResponse(e.target.value)}
                disabled={gradingOpenEnded || openEndedResult !== null}
                rows={5}
                placeholder="Explain the underlying principles, mathematical formulation, and why this concept matters..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-sans focus:outline-none focus:bg-white focus:border-[#1877F2] leading-relaxed disabled:opacity-60"
              />
            </div>

            {/* Confidence Slider */}
            {openEndedResult === null && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1877F2]" />
                    How confident are you in this explanation?
                  </span>
                  <span className="font-mono text-[#1877F2] font-bold">{openEndedConfidence} / 5</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setOpenEndedConfidence(lvl)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        openEndedConfidence === lvl
                          ? 'bg-[#1877F2] text-white border-[#1877F2] shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {submissionError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {submissionError}
              </div>
            )}

            {openEndedResult === null && (
              <button
                onClick={handleSubmitOpenEnded}
                disabled={gradingOpenEnded || !studentTextResponse.trim()}
                className="w-full py-3 px-6 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {gradingOpenEnded ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>Evaluating with Cognitive Rubric...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Cognitive Grading</span>
                  </>
                )}
              </button>
            )}

            {/* Open-Ended Grading Result */}
            {openEndedResult !== null && (
              <div className="space-y-4 pt-2">
                <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black font-mono text-[#1877F2]">
                        {Math.round(openEndedResult.score * 100)}%
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1877F2] border border-blue-200">
                        Grade: {openEndedResult.grade}
                      </span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Cognitive State: {openEndedResult.cognitiveState.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {openEndedResult.feedback}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                      <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Concepts Identified
                      </div>
                      <div className="text-xs text-slate-700">
                        {openEndedResult.conceptsIdentified.length > 0
                          ? openEndedResult.conceptsIdentified.join(', ')
                          : 'None detected'}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                      <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Missing / Refinements Needed
                      </div>
                      <div className="text-xs text-slate-700">
                        {openEndedResult.conceptsMissed.length > 0
                          ? openEndedResult.conceptsMissed.join(', ')
                          : 'No critical omissions detected'}
                      </div>
                    </div>
                  </div>

                  {openEndedResult.updatedMastery && (
                    <div className="text-xs font-mono text-[#1877F2] pt-2 border-t border-slate-100">
                      Updated Mastery in {activeSkillObj?.name}:{' '}
                      <strong>{Math.round(openEndedResult.updatedMastery.masteryScore * 100)}%</strong>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setStudentTextResponse('');
                    setOpenEndedResult(null);
                    const prompts = openEndedPromptsBySkill[selectedSkillId] || [];
                    const nextPrompt = prompts[1] || prompts[0];
                    setOpenEndedPrompt(nextPrompt);
                  }}
                  className="w-full py-2.5 px-5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Try Another Challenge
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
