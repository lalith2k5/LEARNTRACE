import React, { useState, useEffect, useCallback } from 'react';
import { RecommendationCard } from '../components/RecommendationCard';
import { MasteryChart } from '../components/MasteryChart';
import { LearningPathView } from '../components/LearningPathView';
import { api } from '../api/client';
import { SkillMastery, Recommendation, LearningPathStep, Attempt } from '../types';
import { useAuth } from '../context/AuthContext';
import { Activity, Clock, CheckCircle2, XCircle, ShieldCheck, Target, Award, BookOpen, RotateCcw, FlaskConical, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardPageProps {
  onStartQuizForSkill: (skillId: string) => void;
  onNavigateToGraph: () => void;
  onNavigateToResearch?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartQuizForSkill,
  onNavigateToGraph,
  onNavigateToResearch,
}) => {
  const { currentGoal } = useAuth();
  const [masteries, setMasteries] = useState<SkillMastery[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recMessage, setRecMessage] = useState<string | undefined>(undefined);
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState<boolean>(false);
  const [activeGapSkillId, setActiveGapSkillId] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setDashboardError(null);
      const [masteryData, recData, pathData, attemptsData] = await Promise.all([
        api.getMastery(),
        api.getRecommendation(currentGoal?.goalId),
        api.getLearningPath(currentGoal?.goalId),
        api.getAttempts(),
      ]);

      setMasteries(masteryData);
      setRecommendation(recData.recommendation);
      setRecMessage(recData.message);
      setLearningPath(pathData);
      setRecentAttempts(attemptsData.slice(0, 6));
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setDashboardError(err?.message || 'Unable to load diagnostic data. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  }, [currentGoal]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      await api.recalculateMastery();
      await loadDashboardData();
    } catch (err) {
      console.error('Error recalculating:', err);
    } finally {
      setRecalculating(false);
    }
  };

  const masteredCount = masteries.filter((m) => m.masteryScore >= 0.6).length;
  const totalSkills = masteries.length || 6;
  const avgMastery = masteries.length 
    ? Math.round((masteries.reduce((acc, m) => acc + m.masteryScore, 0) / masteries.length) * 100) 
    : 0;

  return (
    <div className="w-full space-y-6">
      {dashboardError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{dashboardError}</span>
          </div>
          <button
            onClick={() => loadDashboardData()}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}
      
      {/* 1. Quick Stats Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Target Curriculum</span>
              <Target className="w-4 h-4 text-[#1877F2]" />
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 truncate" title={currentGoal?.goal?.name || 'Machine Learning'}>
              {currentGoal?.goal?.name || 'Machine Learning'}
            </div>
          </div>
          <div className="text-[11px] text-[#1877F2] font-medium mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
            <span>Active Goal Target</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Skills Mastered</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {masteredCount} <span className="text-xs font-normal text-slate-400">/ {totalSkills} topics</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{Math.round((masteredCount / (totalSkills || 1)) * 100)}% Milestone Progress</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Average Mastery</span>
              <BookOpen className="w-4 h-4 text-[#1877F2]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {avgMastery}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across prerequisite DAG
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold text-slate-500">Diagnostic Items</span>
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {recentAttempts.length} <span className="text-xs font-normal text-slate-400">logged</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Trace interaction evidence
          </div>
        </div>

      </div>

      {/* 2. Centerpiece: Top Prioritized Recommendation */}
      <section>
        <RecommendationCard
          recommendation={recommendation}
          loading={loading}
          message={recMessage}
          onStartQuizForSkill={onStartQuizForSkill}
          onStartLearningGap={(skillId) => setActiveGapSkillId(skillId)}
          onRecalculateMastery={handleRecalculate}
          recalculating={recalculating}
        />
      </section>

      {/* 3. Side-by-Side: Mastery Distribution & Topological Learning Path */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        <MasteryChart
          masteries={masteries}
          onSelectSkill={onStartQuizForSkill}
        />

        <LearningPathView
          pathSteps={learningPath}
          goalName={currentGoal?.goal?.name || 'Machine Learning Engineer'}
          onSelectSkill={onStartQuizForSkill}
          activeGapSkillId={activeGapSkillId}
          onCloseGapModal={() => setActiveGapSkillId(null)}
        />
      </section>

      {/* 4. Diagnostic Evidence & Attempt Log */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Diagnostic Evidence</h3>
            <p className="text-xs text-slate-400">Assessment attempts evaluated by the cognitive mastery tracing engine</p>
          </div>

          <div className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Auto-synced</span>
          </div>
        </div>

        {recentAttempts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No quiz attempts recorded yet. Start practicing to generate diagnostic evidence.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200/80 text-xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{attempt.skillName || 'Skill'}</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded-md ${
                        attempt.correct
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      {attempt.correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {attempt.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">
                    {attempt.questionText || 'Diagnostic question item'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {attempt.timeTakenSeconds}s
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <ShieldCheck className="w-3 h-3 text-[#1877F2]" />
                    Conf: {attempt.confidence}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Algorithmic Foundation & Model Verification Note (Quiet, Non-duplicate) */}
      <section className="bg-slate-50/70 rounded-xl p-4 sm:p-5 text-slate-700 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Empirical Knowledge Tracing Engine</div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              LearnTrace correlates student interactions using Bayesian Knowledge Tracing priors and Ebbinghaus memory retention decay.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600">
            AUC: 0.84 • BKT / DKT Evaluated
          </span>
        </div>
      </section>

    </div>
  );
};
