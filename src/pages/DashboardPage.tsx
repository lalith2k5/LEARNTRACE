import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/client';
import { 
  SkillMastery, 
  Recommendation, 
  LearningPathStep, 
  Attempt, 
  SkillGap 
} from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  RefreshCw, 
  FlaskConical,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { OnboardingCard } from '../components/dashboard/OnboardingCard';
import { NextBestActionCard } from '../components/dashboard/NextBestActionCard';
import { ProgressOverview } from '../components/dashboard/ProgressOverview';
import { SkillsNeedingAttentionCard } from '../components/dashboard/SkillsNeedingAttentionCard';
import { LearningPathPreviewCard } from '../components/dashboard/LearningPathPreviewCard';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { LearningGapModal } from '../components/dashboard/LearningGapModal';

interface DashboardPageProps {
  onStartQuizForSkill: (skillId: string) => void;
  onNavigateToGraph: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToGoals?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartQuizForSkill,
  onNavigateToGraph,
  onNavigateToResearch,
  onNavigateToGoals,
}) => {
  const { user, currentGoal } = useAuth();
  const [masteries, setMasteries] = useState<SkillMastery[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [allAttempts, setAllAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState<boolean>(false);
  const [activeGapSkillId, setActiveGapSkillId] = useState<string | null>(null);

  const goalName = currentGoal?.goal?.name || 'Machine Learning Engineer';

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setDashboardError(null);

      const [masteryData, recData, pathData, attemptsData, gapsData] = await Promise.all([
        api.getMastery(),
        api.getRecommendation(currentGoal?.goalId),
        api.getLearningPath(currentGoal?.goalId),
        api.getAttempts(),
        api.getSkillGaps(currentGoal?.goalId).catch(() => ({ skillGaps: [] as SkillGap[] })),
      ]);

      setMasteries(masteryData);
      setRecommendation(recData.recommendation);
      setLearningPath(pathData);
      setAllAttempts(attemptsData);

      // If backend returned skill gaps, use them; otherwise derive from masteries
      if (gapsData && gapsData.skillGaps && gapsData.skillGaps.length > 0) {
        setSkillGaps(gapsData.skillGaps);
      } else {
        const derivedGaps: SkillGap[] = masteryData
          .filter((m) => m.masteryScore < 0.6)
          .map((m) => ({
            skillId: m.skillId,
            skillName: m.skillName || m.skillId,
            domain: m.domain || 'Data Science',
            masteryScore: m.masteryScore,
            interpretation: m.interpretation,
            isReady: true,
            prerequisiteCount: 0,
            downstreamCount: 0,
          }));
        setSkillGaps(derivedGaps);
      }
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

  // Map prerequisite relationships to find downstream dependent skills
  const downstreamMap = useMemo(() => {
    const map: Record<string, string> = {};
    learningPath.forEach((step) => {
      if (step.prerequisites && step.prerequisites.length > 0) {
        step.prerequisites.forEach((prereqId) => {
          if (!map[prereqId]) {
            map[prereqId] = step.skillName;
          }
        });
      }
    });
    return map;
  }, [learningPath]);

  // Aggregate Metrics
  const totalSkills = masteries.length || 6;
  const masteredSkills = masteries.filter((m) => m.masteryScore >= 0.6);
  const masteredCount = masteredSkills.length;
  const skillsNeedingAttentionCount = skillGaps.length > 0 ? skillGaps.length : masteries.filter((m) => m.masteryScore < 0.6).length;

  const overallMastery = masteries.length
    ? masteries.reduce((acc, m) => acc + m.masteryScore, 0) / masteries.length
    : 0;

  const goalProgress = totalSkills > 0 ? masteredCount / totalSkills : 0;

  // Identify special learner states
  const isNewUser = allAttempts.length === 0 && masteredCount === 0;
  const isStrongMastery = masteredCount === totalSkills && totalSkills > 0;

  const recommendedDownstream = recommendation ? downstreamMap[recommendation.skillId] : undefined;

  return (
    <div className="w-full space-y-7">
      {/* 1. Network / Error Notice */}
      {dashboardError && (
        <div 
          role="alert" 
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
        >
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

      {/* 2. Personalized Header */}
      <DashboardHeader
        user={user}
        goalName={goalName}
        isNewUser={isNewUser}
        isStrongMastery={isStrongMastery}
        isRecalculating={recalculating}
        onRefresh={handleRecalculate}
        onChangeGoal={onNavigateToGoals}
      />

      {/* 3. Guided Onboarding Banner (if new user or collecting initial data) */}
      <OnboardingCard
        attemptsCount={allAttempts.length}
        goalName={goalName}
        onStartDiagnostic={() => onStartQuizForSkill('')}
      />

      {/* 4. Centerpiece: Primary "Next Best Action" */}
      <NextBestActionCard
        recommendation={recommendation}
        loading={loading}
        goalName={goalName}
        downstreamSkillName={recommendedDownstream}
        attempts={allAttempts}
        onStartQuiz={onStartQuizForSkill}
        onOpenGapModal={(skillId) => setActiveGapSkillId(skillId)}
        onNavigateToGraph={onNavigateToGraph}
      />

      {/* 5. Professional Progress Overview */}
      <ProgressOverview
        overallMastery={overallMastery}
        goalProgress={goalProgress}
        skillsMasteredCount={masteredCount}
        totalSkillsCount={totalSkills}
        skillsNeedingAttentionCount={skillsNeedingAttentionCount}
        masteries={masteries}
        onSelectSkill={onStartQuizForSkill}
      />

      {/* 6. Balanced 2-Column Section: Skills Needing Attention & Learning Path Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Top 3 Skills Needing Attention */}
        <SkillsNeedingAttentionCard
          skillGaps={skillGaps}
          downstreamSkillMap={downstreamMap}
          onStartQuiz={onStartQuizForSkill}
          onOpenGapModal={(skillId) => setActiveGapSkillId(skillId)}
          onNavigateToGraph={onNavigateToGraph}
        />

        {/* Right: Learning Path Preview */}
        <LearningPathPreviewCard
          pathSteps={learningPath}
          goalName={goalName}
          onStartQuiz={onStartQuizForSkill}
          onOpenGapModal={(skillId) => setActiveGapSkillId(skillId)}
          onNavigateToGraph={onNavigateToGraph}
        />
      </div>

      {/* 7. Recent Learning Activity Feed */}
      <RecentActivityFeed
        attempts={allAttempts}
        onStartDiagnostic={() => onStartQuizForSkill('')}
        onStartQuizForSkill={onStartQuizForSkill}
      />

      {/* 8. Algorithmic Foundation & Benchmark Note (Quiet, academic, non-intrusive) */}
      <section className="bg-slate-50/80 rounded-2xl p-5 text-slate-700 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1877F2] border border-blue-100 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">
              Evidence-Based Knowledge Tracing & Memory Modeling
            </div>
            <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
              Learner mastery is continuously estimated through response latencies, multi-skill dependencies, and Ebbinghaus retention decay, benchmarked against Bayesian Knowledge Tracing (BKT).
            </p>
          </div>
        </div>

        {onNavigateToResearch && (
          <button
            onClick={onNavigateToResearch}
            className="text-xs font-semibold text-[#1877F2] hover:text-[#166fe5] inline-flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
          >
            <span>Inspect BKT Benchmarks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </section>

      {/* 9. Interactive Concept Guide / Gap Modal */}
      <LearningGapModal
        skillId={activeGapSkillId}
        onClose={() => setActiveGapSkillId(null)}
        onStartQuiz={onStartQuizForSkill}
        pathSteps={learningPath}
      />
    </div>
  );
};
