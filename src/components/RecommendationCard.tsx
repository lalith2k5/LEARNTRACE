import React from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation | null;
  loading: boolean;
  message?: string;
  onStartQuizForSkill: (skillId: string) => void;
  onStartLearningGap?: (skillId: string) => void;
  onRecalculateMastery?: () => void;
  recalculating?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  loading,
  message,
  onStartQuizForSkill,
  onStartLearningGap,
  onRecalculateMastery,
  recalculating = false,
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
        <div className="h-4 w-36 bg-slate-100 rounded mb-3" />
        <div className="h-7 w-64 bg-slate-100 rounded mb-3" />
        <div className="h-4 w-full bg-slate-100 rounded mb-2" />
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Curriculum Target Reached</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                {message || 'You have achieved target mastery for all prerequisite topics in your selected learning goal.'}
              </p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Mastery automatically recalculates when you complete new diagnostic assessments.</span>
              </div>
            </div>
          </div>

          {onRecalculateMastery && (
            <button
              id="btn-recalculate-mastery-done"
              onClick={onRecalculateMastery}
              disabled={recalculating}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin text-[#1877F2]' : ''}`} />
              <span>{recalculating ? 'Refreshing...' : 'Refresh Progress'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const masteryPercent = Math.round((recommendation.masteryScore ?? 0) * 100);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Focus Details */}
        <div className="space-y-3.5 max-w-3xl">
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#1877F2] border border-blue-100">
              <Sparkles className="w-3 h-3 text-[#1877F2]" />
              Recommended Focus
            </span>

            {recommendation.downstreamCount !== undefined && recommendation.downstreamCount > 0 && (
              <span className="text-[11px] font-medium text-slate-600">
                • Unblocks {recommendation.downstreamCount} subsequent skill{recommendation.downstreamCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {recommendation.skillName}
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-600 mt-1.5 leading-relaxed">
              <span className="font-semibold text-slate-800">Why: </span>
              {recommendation.reasonText}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm pt-0.5">
            <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
              <span>Current Mastery</span>
              <span className={masteryPercent >= 60 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                {masteryPercent}% / 60% threshold
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  masteryPercent >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(masteryPercent, 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* Right CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:w-56 min-w-0">
          <button
            id="btn-start-recommended-quiz"
            onClick={() => onStartQuizForSkill(recommendation.skillId)}
            className="w-full py-2.5 px-4 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs min-w-0"
            title={`Practice ${recommendation.skillName}`}
          >
            <span className="truncate">Practice {recommendation.skillName}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          {onStartLearningGap && (
            <button
              id="btn-rec-start-learning-gap"
              onClick={() => onStartLearningGap(recommendation.skillId)}
              className="w-full py-2 px-3 rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-w-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">Review Learning Gap</span>
            </button>
          )}

          {onRecalculateMastery && (
            <button
              id="btn-rec-recalculate-mastery"
              onClick={onRecalculateMastery}
              disabled={recalculating}
              className="w-full py-1.5 px-3 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-w-0"
              title="Refresh learning progress"
            >
              <RotateCcw className={`w-3 h-3 ${recalculating ? 'animate-spin text-[#1877F2]' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">{recalculating ? 'Refreshing...' : 'Refresh Progress'}</span>
            </button>
          )}

          <div className="w-full py-1 px-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Mastery automatically updates when you complete new assessments.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
