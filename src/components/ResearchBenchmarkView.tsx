import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Download,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu,
  BarChart2,
  FileSpreadsheet,
  Settings2,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Upload,
  Database,
  Search,
  BookOpen,
  Award,
  Clock,
  Gauge,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { api } from '../api/client';
import { TraceSimulationPoint, ModelComparisonMetrics, Question } from '../types';

interface ResearchBenchmarkViewProps {
  onBackToDashboard?: () => void;
}

export const ResearchBenchmarkView: React.FC<ResearchBenchmarkViewProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'benchmark' | 'questions'>('simulation');

  const [bktData, setBktData] = useState<any | null>(null);
  const [traceData, setTraceData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  // Simulation Playground State
  const [simSequence, setSimSequence] = useState<Array<{ correct: boolean; confidence: number }>>([
    { correct: true, confidence: 5 },
    { correct: true, confidence: 4 },
    { correct: false, confidence: 4 }, // Confident mistake
    { correct: false, confidence: 2 }, // Uncertain mistake
    { correct: true, confidence: 4 },
    { correct: true, confidence: 5 },
  ]);

  const [bktParams, setBktParams] = useState({
    pL0: 0.15,
    pT: 0.20,
    pS: 0.10,
    pG: 0.25,
  });

  const [simulationPoints, setSimulationPoints] = useState<TraceSimulationPoint[]>([]);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Dataset Benchmark State
  const [benchmarkDataset, setBenchmarkDataset] = useState<'assistments' | 'ednet' | 'synthetic'>('assistments');
  const [evaluatingDataset, setEvaluatingDataset] = useState<boolean>(false);
  const [benchmarkResults, setBenchmarkResults] = useState<any | null>(null);
  const [customCsvInput, setCustomCsvInput] = useState<string>('');
  const [customCsvError, setCustomCsvError] = useState<string | null>(null);

  // Questions Bank State
  const [questionStats, setQuestionStats] = useState<any | null>(null);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [searchQuestion, setSearchQuestion] = useState<string>('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');

  // AI Question Generation Admin State
  const [showGenPanel, setShowGenPanel] = useState<boolean>(false);
  const [generatingQuestions, setGeneratingQuestions] = useState<boolean>(false);
  const [genSkillId, setGenSkillId] = useState<string>('all');
  const [genCount, setGenCount] = useState<number>(2);
  const [genDifficulty, setGenDifficulty] = useState<string>('all');
  const [genCategory, setGenCategory] = useState<string>('all');
  const [genStatusMessage, setGenStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true);
        const [bktRes, traceRes, statsRes, qListRes] = await Promise.all([
          api.getBktComparison(),
          api.getResearchTrace(),
          api.getQuestionStats().catch(() => null),
          api.getQuestions(undefined, true).catch(() => []),
        ]);
        setBktData(bktRes);
        setTraceData(traceRes);
        setQuestionStats(statsRes);
        setQuestionsList(qListRes);

        // Run default benchmark evaluation on assistments
        runBenchmarkEvaluation('assistments');
      } catch (err) {
        console.error('Failed to fetch research benchmark data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  // Run simulation whenever sequence or params change
  useEffect(() => {
    async function runSim() {
      try {
        setSimulating(true);
        const res = await api.simulateTrace({
          customSequence: simSequence,
          bktParams,
        });
        setSimulationPoints(res.simulationPoints || []);
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        setSimulating(false);
      }
    }
    runSim();
  }, [simSequence, bktParams]);

  const runBenchmarkEvaluation = async (type: 'assistments' | 'ednet' | 'synthetic') => {
    try {
      setEvaluatingDataset(true);
      setBenchmarkDataset(type);
      const sampleRes = await api.getBenchmarkSample(type);
      const evalRes = await api.evaluateDataset({
        datasetName: `${type.toUpperCase()} Benchmark Dataset Sample`,
        records: sampleRes.records,
        bktParams,
      });
      setBenchmarkResults(evalRes);
    } catch (err) {
      console.error('Failed to evaluate dataset:', err);
    } finally {
      setEvaluatingDataset(false);
    }
  };

  const handleCustomCsvEvaluation = async () => {
    if (!customCsvInput.trim()) return;
    setCustomCsvError(null);

    try {
      setEvaluatingDataset(true);
      const lines = customCsvInput.trim().split('\n');
      const records: any[] = [];

      // Simple CSV parser
      lines.slice(1).forEach((line) => {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length >= 3) {
          records.push({
            userId: parts[0],
            skillId: parts[1],
            correct: parts[2] === '1' || (parts[2] ? parts[2].toLowerCase() === 'true' : false),
            confidence: parts[3] ? parseInt(parts[3]) : 3,
            timeTakenSeconds: parts[4] ? parseInt(parts[4]) : 20,
          });
        }
      });

      if (records.length === 0) {
        setCustomCsvError('Could not parse any valid records from CSV. Expected header and format: userId,skillId,correct,confidence,timeTakenSeconds');
        return;
      }

      const evalRes = await api.evaluateDataset({
        datasetName: 'Custom User Uploaded Dataset',
        records,
        bktParams,
      });
      setBenchmarkResults(evalRes);
    } catch (err: any) {
      console.error('Custom CSV evaluation error:', err);
      setCustomCsvError(err?.message || 'Failed to evaluate custom CSV dataset.');
    } finally {
      setEvaluatingDataset(false);
    }
  };

  const handleToggleAttemptOutcome = (index: number) => {
    setSimSequence((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, correct: !item.correct } : item))
    );
  };

  const handleAddSimulationStep = (correct: boolean) => {
    setSimSequence((prev) => [
      ...prev,
      { correct, confidence: correct ? 4 : 2 },
    ]);
  };

  const handleRemoveSimulationStep = (index: number) => {
    if (simSequence.length <= 1) return;
    setSimSequence((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleResetSimulationSequence = () => {
    setSimSequence([
      { correct: true, confidence: 5 },
      { correct: true, confidence: 4 },
      { correct: false, confidence: 4 },
      { correct: false, confidence: 2 },
      { correct: true, confidence: 4 },
      { correct: true, confidence: 5 },
    ]);
    setBktParams({
      pL0: 0.15,
      pT: 0.20,
      pS: 0.10,
      pG: 0.25,
    });
  };

  const handleExportCsv = () => {
    if (!traceData || !traceData.records) return;
    setDownloading(true);

    const headers = [
      'interaction_id',
      'student_id',
      'question_id',
      'skill_id',
      'skill_name',
      'correct',
      'time_taken_seconds',
      'confidence',
      'cognitive_state',
      'timestamp',
    ];

    const rows = traceData.records.map((r: any) => [
      r.interaction_id,
      r.student_id,
      r.question_id,
      r.skill_id,
      `"${r.skill_name}"`,
      r.correct,
      r.time_taken_seconds,
      r.confidence,
      r.cognitive_state,
      r.timestamp,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `learntrace_student_interactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  };

  const handleExportJson = () => {
    if (!traceData) return;
    const jsonStr = JSON.stringify(traceData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `learntrace_research_dataset_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = simulationPoints.map((p: any) => ({
    step: `Step ${p.step}`,
    outcome: p.isCorrect !== undefined ? (p.isCorrect ? 'Correct' : 'Incorrect') : (p.correct ? 'Correct' : 'Incorrect'),
    'LearnTrace Heuristic': Math.round(((p.learnTraceScore !== undefined ? p.learnTraceScore : p.learnTraceHeuristic) || 0) * 100),
    'BKT (Bayesian KT)': Math.round(((p.bktScore !== undefined ? p.bktScore : p.bktProbability) || 0) * 100),
    'DKT (Recurrent Neural)': Math.round(((p.dktScore !== undefined ? p.dktScore : p.dktProbability) || 0) * 100),
  }));

  // Filtered questions
  const filteredQuestions = (questionsList || []).filter((q) => {
    if (!q) return false;
    const searchLower = (searchQuestion || '').trim().toLowerCase();
    const promptText = (q.text || (q as any).prompt || '').toLowerCase();
    const qId = (q.id || '').toLowerCase();
    const matchesSearch =
      !searchLower ||
      promptText.includes(searchLower) ||
      qId.includes(searchLower);
    const matchesSkill = selectedSkillFilter === 'all' || q.skillId === selectedSkillFilter;
    const matchesDiff = selectedDifficultyFilter === 'all' || (q.difficulty !== undefined && q.difficulty.toString() === selectedDifficultyFilter);
    return matchesSearch && matchesSkill && matchesDiff;
  });

  const handleGenerateQuestions = async () => {
    try {
      setGeneratingQuestions(true);
      setGenStatusMessage(null);

      const res = await api.enrichQuestionBank({
        skillId: genSkillId === 'all' ? undefined : genSkillId,
        count: genCount,
        difficulty: genDifficulty === 'all' ? undefined : Number(genDifficulty),
        cognitiveCategory: genCategory === 'all' ? undefined : genCategory,
      });

      if (res.success) {
        setGenStatusMessage({
          type: 'success',
          text: `Enriched bank with ${res.generatedQuestions.length} new question(s) via Gemini! Total bank size: ${res.totalInBank}.`,
        });

        // Refresh question list with answers included
        const updatedList = await api.getQuestions(undefined, true).catch(() => res.generatedQuestions);
        setQuestionsList(updatedList);
        if (res.stats) {
          setQuestionStats(res.stats);
        } else {
          const stats = await api.getQuestionStats().catch(() => null);
          if (stats) setQuestionStats(stats);
        }
      }
    } catch (err: any) {
      console.error('Failed to generate questions:', err);
      setGenStatusMessage({
        type: 'error',
        text: err.message || 'Failed to generate questions with Gemini. Please try again.',
      });
    } finally {
      setGeneratingQuestions(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Return to Dashboard when in research mode */}
      {onBackToDashboard && (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1877F2] hover:text-[#166fe5] cursor-pointer transition-colors"
          >
            <span>← Back to Learner Dashboard</span>
          </button>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Researcher / Benchmark Sandbox
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600">
              Psychometrics & Research Workbench
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              AUC-ROC • RMSE • DKT • BKT
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Knowledge Tracing Research & Benchmark Suite
          </h2>
          <p className="text-xs text-slate-500">
            Compare model sensitivity, run empirical evaluations on ASSISTments & EdNet datasets, and inspect the question repository.
          </p>
        </div>

        {/* Dataset Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-export-csv"
            onClick={handleExportCsv}
            disabled={!traceData || traceData.recordCount === 0 || downloading}
            className="px-3 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-export-json"
            onClick={handleExportJson}
            disabled={!traceData || traceData.recordCount === 0}
            className="px-3 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'simulation'
              ? 'bg-[#1877F2] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Model Simulation & Curves
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'benchmark'
              ? 'bg-[#1877F2] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Dataset Benchmark & Psychometrics
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-[#1877F2] text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Question Bank Repository
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            activeTab === 'questions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {questionStats?.totalQuestions || 24}
          </span>
        </button>
      </div>

      {/* ----------------- TAB 1: MODEL SIMULATION & TRACE ANALYSIS ----------------- */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Model Benchmark Architecture Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">1. LearnTrace Engine</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">
                  Heuristic + Ebbinghaus
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-factor recency weighted algorithm integrating time latency, confidence calibration, temporal forgetting, and DAG prerequisite propagation.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div>• Sensitivity: <strong className="text-slate-800">Immediate (1-step)</strong></div>
                <div>• Memory Retention: <strong className="text-slate-800">Ebbinghaus S(t)</strong></div>
                <div>• Prerequisite Gating: <strong className="text-slate-800">Enabled</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">2. Bayesian KT (BKT)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                  Hidden Markov Model
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Classic 4-parameter probability model updating latent mastery through prior P(L0), learning rate P(T), slip P(S), and guess P(G).
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div>• Sensitivity: <strong className="text-slate-800">Smooth Posterior</strong></div>
                <div>• Interpretability: <strong className="text-slate-800">Probabilistic</strong></div>
                <div>• Prerequisite Gating: <strong className="text-slate-800">Skill-Isolated</strong></div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700">3. Deep KT (DKT)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">
                  Neural Approximation
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulates LSTM/RNN hidden activation dynamics capturing non-linear sequence trajectories across multi-skill interactions.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div>• Sensitivity: <strong className="text-slate-800">Temporal Memory</strong></div>
                <div>• Latent Dynamics: <strong className="text-slate-800">Recurrent Gate</strong></div>
                <div>• Cross-Skill Transfer: <strong className="text-slate-800">Implicit</strong></div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Workbench */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  Live Multi-Model Trace Simulator
                </h3>
                <p className="text-xs text-slate-400">
                  Toggle attempt outcomes below, adjust BKT hyperparameters, and observe curve divergence in real-time.
                </p>
              </div>

              <button
                onClick={handleResetSimulationSequence}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Sequence</span>
              </button>
            </div>

            {/* Interactive Attempt Sequence Builder */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Interaction Sequence (Click to toggle outcome):
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {simSequence.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200"
                  >
                    <button
                      onClick={() => handleToggleAttemptOutcome(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.correct
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                      title="Click to toggle Correct / Incorrect"
                    >
                      {item.correct ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span>Step {idx + 1}: {item.correct ? 'Correct' : 'Incorrect'}</span>
                    </button>

                    {simSequence.length > 2 && (
                      <button
                        onClick={() => handleRemoveSimulationStep(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove step"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-1 pl-2">
                  <button
                    onClick={() => handleAddSimulationStep(true)}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Correct
                  </button>
                  <button
                    onClick={() => handleAddSimulationStep(false)}
                    className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Incorrect
                  </button>
                </div>
              </div>
            </div>

            {/* BKT Hyperparameter Sliders */}
            <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>BKT Hyperparameters Calibration</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Prior P(L₀):</span>
                    <strong className="font-mono text-slate-800">{bktParams.pL0}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={bktParams.pL0}
                    onChange={(e) => setBktParams({ ...bktParams, pL0: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Learning P(T):</span>
                    <strong className="font-mono text-slate-800">{bktParams.pT}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={bktParams.pT}
                    onChange={(e) => setBktParams({ ...bktParams, pT: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Slip P(S):</span>
                    <strong className="font-mono text-slate-800">{bktParams.pS}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.3"
                    step="0.01"
                    value={bktParams.pS}
                    onChange={(e) => setBktParams({ ...bktParams, pS: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Guess P(G):</span>
                    <strong className="font-mono text-slate-800">{bktParams.pG}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.4"
                    step="0.05"
                    value={bktParams.pG}
                    onChange={(e) => setBktParams({ ...bktParams, pG: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-200 rounded-lg accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Simulation Line Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="step" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="LearnTrace Heuristic"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4f46e5' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="BKT (Bayesian KT)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="DKT (Recurrent Neural)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Skill Portfolio: Multi-Model Evaluation
              </h3>
              <p className="text-xs text-slate-400">
                Learner scores evaluated across knowledge graph topics
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-2.5 px-3">Skill Name</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3 text-center">Interactions</th>
                    <th className="py-2.5 px-3 text-center text-indigo-600 font-bold">LearnTrace</th>
                    <th className="py-2.5 px-3 text-center text-emerald-600 font-bold">BKT</th>
                    <th className="py-2.5 px-3 text-center text-amber-600 font-bold">DKT</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bktData?.skills?.map((item: any) => (
                    <tr key={item.skillId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{item.skillName}</td>
                      <td className="py-3 px-3 text-slate-500">{item.domain}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">
                        {item.evidenceCount}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600">
                        {Math.round(item.learnTraceScore * 100)}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                        {Math.round(item.bktScore * 100)}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-600">
                        {item.dktScore !== undefined ? `${Math.round(item.dktScore * 100)}%` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.learnTraceInterpretation === 'Solid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.learnTraceInterpretation === 'Developing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.learnTraceInterpretation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: DATASET BENCHMARK & PSYCHOMETRICS ----------------- */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          {/* Dataset Selector Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Select Benchmark Dataset to Evaluate
                </h3>
                <p className="text-xs text-slate-500">
                  Standard educational data mining datasets with multi-student response sequences
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => runBenchmarkEvaluation('assistments')}
                  disabled={evaluatingDataset}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    benchmarkDataset === 'assistments'
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ASSISTments 2009-2010
                </button>
                <button
                  onClick={() => runBenchmarkEvaluation('ednet')}
                  disabled={evaluatingDataset}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    benchmarkDataset === 'ednet'
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  EdNet Dataset
                </button>
                <button
                  onClick={() => runBenchmarkEvaluation('synthetic')}
                  disabled={evaluatingDataset}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    benchmarkDataset === 'synthetic'
                      ? 'bg-[#1877F2] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Synthetic Cohort
                </button>
              </div>
            </div>

            {/* Custom CSV Upload Accordion */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Or Paste Custom CSV Data (userId, skillId, correct, confidence, timeTakenSeconds):
              </label>
              <div className="flex gap-2">
                <textarea
                  value={customCsvInput}
                  onChange={(e) => setCustomCsvInput(e.target.value)}
                  placeholder="student_01, skill_prob, 1, 5, 18&#10;student_01, skill_bayes, 0, 4, 35&#10;student_02, skill_python, 1, 4, 12"
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={handleCustomCsvEvaluation}
                  disabled={evaluatingDataset || !customCsvInput.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  Evaluate CSV
                </button>
              </div>

              {customCsvError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{customCsvError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomCsvError(null)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-medium cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Benchmark Metrics Comparison Scorecard */}
          {benchmarkResults && (
            <div className="space-y-6">
              {/* Dataset Summary Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Dataset</div>
                  <div className="text-sm font-bold text-slate-900 truncate">{benchmarkResults.datasetName}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Total Records</div>
                  <div className="text-base font-bold text-indigo-600">{benchmarkResults.totalRecords}</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Student Cohort</div>
                  <div className="text-base font-bold text-slate-800">{benchmarkResults.uniqueStudents} Learners</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 font-medium">Unique Skills</div>
                  <div className="text-base font-bold text-slate-800">{benchmarkResults.uniqueSkills} Topics</div>
                </div>
              </div>

              {/* 3 Model Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LearnTrace */}
                <div className="p-5 rounded-xl bg-white border-2 border-indigo-500/80 shadow-2xs space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700">LearnTrace Engine</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                      Proposed Method
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">AUC-ROC Score:</span>
                      <strong className="text-base font-bold text-indigo-600">
                        {(benchmarkResults.metrics?.learnTrace?.aucRoc ?? benchmarkResults.metrics?.learnTrace?.auc ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>RMSE (Error):</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.learnTrace?.rmse ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Accuracy:</span>
                      <strong className="font-mono text-slate-800">
                        {((benchmarkResults.metrics?.learnTrace?.accuracy ?? 0) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>F1-Score:</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.learnTrace?.f1Score ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Inference Latency:</span>
                      <span className="font-mono">{benchmarkResults.metrics?.learnTrace?.inferenceLatencyMs ?? benchmarkResults.metrics?.learnTrace?.latencyMs ?? 0} ms</span>
                    </div>
                  </div>
                </div>

                {/* BKT */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">Bayesian KT (BKT)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Baseline Markov
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">AUC-ROC Score:</span>
                      <strong className="text-base font-bold text-emerald-600">
                        {(benchmarkResults.metrics?.bkt?.aucRoc ?? benchmarkResults.metrics?.bkt?.auc ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>RMSE (Error):</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.bkt?.rmse ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Accuracy:</span>
                      <strong className="font-mono text-slate-800">
                        {((benchmarkResults.metrics?.bkt?.accuracy ?? 0) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>F1-Score:</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.bkt?.f1Score ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Inference Latency:</span>
                      <span className="font-mono">{benchmarkResults.metrics?.bkt?.inferenceLatencyMs ?? benchmarkResults.metrics?.bkt?.latencyMs ?? 0} ms</span>
                    </div>
                  </div>
                </div>

                {/* DKT */}
                <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">Deep KT (DKT)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                      Neural Approximation
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">AUC-ROC Score:</span>
                      <strong className="text-base font-bold text-amber-600">
                        {(benchmarkResults.metrics?.dkt?.aucRoc ?? benchmarkResults.metrics?.dkt?.auc ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>RMSE (Error):</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.dkt?.rmse ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Accuracy:</span>
                      <strong className="font-mono text-slate-800">
                        {((benchmarkResults.metrics?.dkt?.accuracy ?? 0) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>F1-Score:</span>
                      <strong className="font-mono text-slate-800">
                        {(benchmarkResults.metrics?.dkt?.f1Score ?? 0).toFixed(4)}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Inference Latency:</span>
                      <span className="font-mono">{benchmarkResults.metrics?.dkt?.inferenceLatencyMs ?? benchmarkResults.metrics?.dkt?.latencyMs ?? 0} ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Insights Box */}
              <div className="p-5 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  Key Research Findings & Empirical Observations:
                </h4>
                <ul className="space-y-1 text-xs text-indigo-950">
                  {benchmarkResults.keyFindings?.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- TAB 3: QUESTION BANK REPOSITORY ----------------- */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Question Bank Header */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Adaptive Question Bank & Diagnostic Item Repository
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  Automated Background Synthesis
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Psychometrically calibrated diagnostic items spanning all 8 curriculum competencies with automated distractor rationale mapping and difficulty tuning. Questions are generated automatically in the background as learners practice.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="btn-toggle-ai-gen-panel"
                onClick={() => setShowGenPanel(!showGenPanel)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{showGenPanel ? 'Close AI Generator' : 'Generate AI Questions'}</span>
              </button>
            </div>
          </div>

          {/* AI Question Generation Admin Panel */}
          {showGenPanel && (
            <div className="p-5 rounded-xl bg-white border border-indigo-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    On-Demand AI Question Synthesis & Validation
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  Strict schema validation enforced before bank insertion
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Target Skill</label>
                  <select
                    value={genSkillId}
                    onChange={(e) => setGenSkillId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">All Skills (Balanced Distribution)</option>
                    <option value="skill_python">Python Programming</option>
                    <option value="skill_prob">Probability Foundations</option>
                    <option value="skill_cond_prob">Conditional Probability</option>
                    <option value="skill_prob_dist">Probability Distributions</option>
                    <option value="skill_stats">Statistical Inference</option>
                    <option value="skill_linalg">Linear Algebra</option>
                    <option value="skill_model_eval">Model Evaluation</option>
                    <option value="skill_ml">Machine Learning</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Difficulty Level</label>
                  <select
                    value={genDifficulty}
                    onChange={(e) => setGenDifficulty(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">Varied / Auto</option>
                    <option value="1">1 - Beginner / Recall</option>
                    <option value="2">2 - Elementary</option>
                    <option value="3">3 - Intermediate Application</option>
                    <option value="4">4 - Advanced Analysis</option>
                    <option value="5">5 - Expert Synthesis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Cognitive Category</label>
                  <select
                    value={genCategory}
                    onChange={(e) => setGenCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="all">Varied / Auto</option>
                    <option value="Recall">Recall</option>
                    <option value="Comprehension">Comprehension</option>
                    <option value="Application">Application</option>
                    <option value="Analysis">Analysis</option>
                    <option value="Synthesis">Synthesis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Item Batch Count</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={genCount}
                      onChange={(e) => setGenCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="1">1 Item</option>
                      <option value="2">2 Items</option>
                      <option value="3">3 Items</option>
                      <option value="5">5 Items</option>
                    </select>
                    <button
                      id="btn-run-ai-gen"
                      onClick={handleGenerateQuestions}
                      disabled={generatingQuestions}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {generatingQuestions ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {genStatusMessage && (
                <div
                  className={`p-3 rounded-lg text-xs border flex items-center justify-between gap-2 ${
                    genStatusMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {genStatusMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{genStatusMessage.text}</span>
                  </div>
                  <button
                    onClick={() => setGenStatusMessage(null)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Question Bank Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
              <div className="text-[11px] text-slate-500 font-medium truncate">Total Assessment Items</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">{questionStats?.totalQuestions || questionsList.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
              <div className="text-[11px] text-slate-500 font-medium truncate">Skills Covered</div>
              <div className="text-xl font-bold text-[#1877F2] mt-0.5 truncate">
                {questionStats?.skillsCovered || 8} / 8 <span className="text-xs font-normal text-slate-400">Skills</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
              <div className="text-[11px] text-slate-500 font-medium truncate">Difficulty Tiers</div>
              <div className="text-xl font-bold text-slate-800 mt-0.5 truncate">5 Levels (1-5)</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs min-w-0">
              <div className="text-[11px] text-slate-500 font-medium truncate">Item Types</div>
              <div className="text-xl font-bold text-slate-800 mt-0.5 truncate">MCQ + Open</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuestion}
                onChange={(e) => setSearchQuestion(e.target.value)}
                placeholder="Search question prompts, concepts, or IDs..."
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20"
              />
            </div>

            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none"
            >
              <option value="all">All Skills (8 Core Skills)</option>
              <option value="skill_python">Python Programming (skill_python)</option>
              <option value="skill_prob">Probability Foundations (skill_prob)</option>
              <option value="skill_cond_prob">Conditional Probability (skill_cond_prob)</option>
              <option value="skill_prob_dist">Probability Distributions (skill_prob_dist)</option>
              <option value="skill_stats">Statistical Inference (skill_stats)</option>
              <option value="skill_linalg">Linear Algebra (skill_linalg)</option>
              <option value="skill_model_eval">Model Evaluation (skill_model_eval)</option>
              <option value="skill_ml">Machine Learning (skill_ml)</option>
            </select>

            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="1">Difficulty 1 (Beginner)</option>
              <option value="2">Difficulty 2 (Elementary)</option>
              <option value="3">Difficulty 3 (Intermediate)</option>
              <option value="4">Difficulty 4 (Advanced)</option>
              <option value="5">Difficulty 5 (Expert)</option>
            </select>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isAiGenerated = q.id?.startsWith('q_gemini') || q.id?.startsWith('q_ai');
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-[#1877F2] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {q.skillName || q.skillId}
                      </span>
                      {isAiGenerated && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1877F2] border border-blue-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#1877F2]" />
                          Gemini Generated
                        </span>
                      )}
                      {q.cognitiveCategory && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Cognitive: {q.cognitiveCategory}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Difficulty: {q.difficulty}/5
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {((q as any).questionType || (q as any).type || 'MCQ').toString().toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                    {q.text || (q as any).prompt}
                  </p>

                  {/* Multiple Choice Options */}
                  {((q as any).questionType === 'MULTIPLE_CHOICE' || (q as any).type === 'multiple_choice' || q.options) && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctAnswer;
                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg text-xs border flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className={`font-bold text-[11px] ${isCorrect ? 'text-emerald-700' : 'text-slate-600'}`}>
                              {opt.id}.
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {isCorrect && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Diagnostic Explanation */}
                  {q.explanation && (
                    <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 text-xs space-y-1">
                      <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                        <span>Diagnostic Solution & Pedagogical Principle:</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5">{q.explanation}</p>
                    </div>
                  )}

                  {/* Distractor Rationales (if provided) */}
                  {q.distractorRationales && Object.keys(q.distractorRationales).length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-50/40 border border-blue-100 text-xs space-y-1.5">
                      <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                        <span>Distractor Misconception Mapping:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                        {Object.entries(q.distractorRationales).map(([key, rationale]) => (
                          <div key={key} className="text-[11px] text-slate-600">
                            <span className="font-semibold text-blue-800">Option {key}:</span> {String(rationale)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- INTERACTION TRACE DATASET VIEWER (Always at bottom) ----------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#1877F2]" />
            Live Interaction Trace Stream ({traceData?.recordCount || 0} Total Records)
          </h3>
          <p className="text-xs text-slate-400">
            Raw interaction sequence records formatted with timestamps, latency, and confidence
          </p>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Question ID</th>
                <th className="py-2 px-3">Skill</th>
                <th className="py-2 px-3 text-center">Correct</th>
                <th className="py-2 px-3 text-center">Latency</th>
                <th className="py-2 px-3 text-center">Confidence</th>
                <th className="py-2 px-3">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {traceData?.records?.map((r: any) => (
                <tr key={r.interaction_id} className="hover:bg-slate-50/80">
                  <td className="py-2 px-3 text-slate-400 font-mono">{r.interaction_id}</td>
                  <td className="py-2 px-3 text-[#1877F2] font-mono">{r.question_id}</td>
                  <td className="py-2 px-3 font-medium text-slate-800">{r.skill_name}</td>
                  <td className="py-2 px-3 text-center">
                    {r.correct === 1 ? (
                      <span className="text-emerald-600 font-bold font-mono">1 (✓)</span>
                    ) : (
                      <span className="text-rose-600 font-bold font-mono">0 (✗)</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-slate-500">{r.time_taken_seconds}s</td>
                  <td className="py-2 px-3 text-center font-mono">{r.confidence}/5</td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {r.cognitive_state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
