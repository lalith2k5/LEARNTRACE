import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  BarChart3,
  Brain
} from 'lucide-react';
import { SkillMastery } from '../../types';
import { MasteryChart } from '../MasteryChart';

interface ProgressOverviewProps {
  overallMastery: number; // 0 to 1
  goalProgress: number; // 0 to 1
  skillsMasteredCount: number;
  totalSkillsCount: number;
  skillsNeedingAttentionCount: number;
  masteries: SkillMastery[];
  onSelectSkill?: (skillId: string) => void;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  overallMastery,
  goalProgress,
  skillsMasteredCount,
  totalSkillsCount,
  skillsNeedingAttentionCount,
  masteries,
  onSelectSkill,
}) => {
  const [showDetailedChart, setShowDetailedChart] = useState(false);

  const overallPercent = Math.round(overallMastery * 100);
  const goalProgressPercent = Math.round(goalProgress * 100);

  return (
    <section 
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
      aria-labelledby="progress-overview-heading"
    >
      {/* Header with Title & Chart Toggle */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h2 id="progress-overview-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Your Progress
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time mastery assessment and curriculum completion
          </p>
        </div>

        <button
          onClick={() => setShowDetailedChart(!showDetailedChart)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#1877F2]" />
          <span>{showDetailedChart ? 'Hide Retention Chart' : 'View Retention Chart'}</span>
          {showDetailedChart ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Unified 4-Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 p-2 sm:p-4">
        {/* Metric 1: Overall Mastery */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-[#1877F2]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {overallPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#1877F2] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(4, overallPercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Based on recent learning evidence
          </p>
        </div>

        {/* Metric 2: Goal Progress */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Goal Progress</span>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {goalProgressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(4, goalProgressPercent))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Milestone progress towards target
          </p>
        </div>

        {/* Metric 3: Skills Mastered */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Skills Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {skillsMasteredCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {totalSkillsCount}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${totalSkillsCount > 0 ? (skillsMasteredCount / totalSkillsCount) * 100 : 0}%` 
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Topics meeting ≥60% threshold
          </p>
        </div>

        {/* Metric 4: Needs Attention */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Needs Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-600 font-mono tracking-tight">
              {skillsNeedingAttentionCount}
            </span>
            <span className="text-xs font-semibold text-slate-400">skills</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${totalSkillsCount > 0 ? (skillsNeedingAttentionCount / totalSkillsCount) * 100 : 0}%` 
              }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Gaps or decay below 60%
          </p>
        </div>
      </div>

      {/* Expandable Detailed Retention Chart */}
      {showDetailedChart && (
        <div className="p-6 border-t border-slate-100 bg-slate-50/40">
          <MasteryChart masteries={masteries} onSelectSkill={onSelectSkill} />
        </div>
      )}
    </section>
  );
};
