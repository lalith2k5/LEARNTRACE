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
} from 'recharts';
import { api } from '../api/client';
import { TraceSimulationPoint, ModelComparisonMetrics } from '../types';

export const ResearchBenchmarkView: React.FC = () => {
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

  useEffect(() => {
    async function loadResearch() {
      try {
        setLoading(true);
        const [bktRes, traceRes] = await Promise.all([
          api.getBktComparison(),
          api.getResearchTrace(),
        ]);
        setBktData(bktRes);
        setTraceData(traceRes);
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

  const chartData = simulationPoints.map((p) => ({
    step: `Step ${p.step}`,
    outcome: p.correct ? 'Correct' : 'Incorrect',
    'LearnTrace Heuristic': Math.round(p.learnTraceHeuristic * 100),
    'BKT (Bayesian KT)': Math.round(p.bktProbability * 100),
    'DKT (Recurrent Neural)': Math.round(p.dktProbability * 100),
  }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600">
              Research & Tracing Engine
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              BKT vs DKT vs LearnTrace
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Knowledge Tracing Comparison & Simulation
          </h2>
          <p className="text-xs text-slate-500">
            Compare model sensitivity, convergence curves, and export interaction traces for educational data mining benchmarks.
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
            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Model Benchmark Architecture Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700">1. LearnTrace Engine</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700">
              Heuristic
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-factor recency weighted algorithm integrating time latency, self-reported confidence calibration, and DAG prerequisite propagation.
          </p>
          <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
            <div>• Sensitivity: <strong className="text-slate-800">Immediate (1-step)</strong></div>
            <div>• Interpretability: <strong className="text-slate-800">100% Deterministic</strong></div>
            <div>• Prerequisite Gating: <strong className="text-slate-800">Enabled</strong></div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">2. Bayesian KT (BKT)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
              Markov Model
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
              Neural Approx
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Simulates LSTM/RNN hidden activation dynamics capturing non-linear sequence trajectories across multi-skill interactions.
          </p>
          <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
            <div>• Sensitivity: <strong className="text-slate-800">Temporal Memory</strong></div>
            <div>• Interpretability: <strong className="text-slate-800">Latent Vectors</strong></div>
            <div>• Cross-Skill Transfer: <strong className="text-slate-800">Implicit</strong></div>
          </div>
        </div>
      </div>

      {/* ----------------- INTERACTIVE SIMULATION WORKBENCH ----------------- */}
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

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleAddSimulationStep(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Correct
              </button>
              <button
                onClick={() => handleAddSimulationStep(false)}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Incorrect
              </button>
            </div>
          </div>
        </div>

        {/* BKT Hyperparameters Configuration Sliders */}
        <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
              BKT Model Parameters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Prior P(L0)</span>
                <span className="font-mono text-indigo-600 font-bold">{bktParams.pL0}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={bktParams.pL0}
                onChange={(e) => setBktParams({ ...bktParams, pL0: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Learn Rate P(T)</span>
                <span className="font-mono text-emerald-600 font-bold">{bktParams.pT}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={bktParams.pT}
                onChange={(e) => setBktParams({ ...bktParams, pT: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Slip P(S)</span>
                <span className="font-mono text-amber-600 font-bold">{bktParams.pS}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.30"
                step="0.01"
                value={bktParams.pS}
                onChange={(e) => setBktParams({ ...bktParams, pS: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Guess P(G)</span>
                <span className="font-mono text-rose-600 font-bold">{bktParams.pG}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={bktParams.pG}
                onChange={(e) => setBktParams({ ...bktParams, pG: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>
          </div>
        </div>

        {/* Recharts Multi-Model Progression Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Estimated Mastery Progression (% over sequence)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> LearnTrace
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> BKT
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> DKT
              </span>
            </div>
          </div>

          <div className="w-full h-64 bg-slate-50/50 rounded-lg p-3 border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="step" stroke="#94a3b8" textAnchor="middle" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
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
                  dot={{ r: 3.5, fill: '#10b981' }}
                />
                <Line
                  type="monotone"
                  dataKey="DKT (Recurrent Neural)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ----------------- SKILL COMPARISON TABLE ----------------- */}
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
          <table className="w-full text-left text-xs border-collapse">
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

      {/* ----------------- INTERACTION TRACE DATASET VIEWER ----------------- */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            Interaction Trace Dataset ({traceData?.recordCount || 0} Total Records)
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
                  <td className="py-2 px-3 text-indigo-600 font-mono">{r.question_id}</td>
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
