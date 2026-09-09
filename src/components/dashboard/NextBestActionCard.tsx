import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  TrendingUp,
  Brain
} from 'lucide-react';
import { Recommendation, Attempt } from '../../types';
import { EvidenceModal } from './EvidenceModal';

interface NextBestActionCardProps {
  recommendation: Recommendation | null;
  loading: boolean;
  goalName?: string;
  downstreamSkillName?: string;
  attempts: Attempt[];
  onStartQuiz: (skillId: string) => void;
  onOpenGapModal?: (skillId: string) => void;
  onNavigateToGraph?: () => void;
}

export const NextBestActionCard: React.FC<NextBestActionCardProps> = ({
  recommendation,
  loading,
  goalName = 'Machine Learning Engineer',
  downstreamSkillName,
  attempts,
  onStartQuiz,
  onOpenGapModal,
  onNavigateToGraph,
}) => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-5 w-24 bg-slate-100 rounded-full" />
        </div>
        <div className="h-7 w-64 bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="pt-2 flex gap-3">
          <div className="h-10 w-44 bg-slate-200 rounded-lg" />
          <div className="h-10 w-28 bg-slate-100 rounded-lg" />
        </div>
      </div>
    );
  }

  // Strong Mastery / All targets reached state
  if (!recommendation) {
    return (
      <div className="w-full bg-linear-to-r from-emerald-50/70 via-white to-slate-50 rounded-2xl border border-emerald-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Goal Milestones Mastered</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              You're doing well 🎉
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Your current mastery is strong across the major skills in your <strong className="font-semibold text-slate-800">{goalName}</strong> curriculum. All foundational prerequisites meet or exceed the 60% mastery threshold.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {onNavigateToGraph && (
              <button
                onClick={onNavigateToGraph}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Inspect Knowledge Graph
              </button>
            )}
            <button
              onClick={() => onStartQuiz('skill_ml')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Practice Challenge Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const masteryScore = recommendation.masteryScore || 0;
  const masteryPercent = Math.round(masteryScore * 100);
  const downstreamCount = recommendation.downstreamCount || 0;

  // Build dynamic "Why this is recommended" bullet points based on actual data
  const reasonBullets = [
    `Current mastery is ${masteryPercent}%, which is below the recommended 60% mastery threshold.`,
    downstreamSkillName
      ? `${recommendation.skillName} is a foundational prerequisite for ${downstreamSkillName}.`
      : downstreamCount > 0
      ? `Mastering this topic directly unblocks ${downstreamCount} subsequent skill${downstreamCount > 1 ? 's' : ''} on your learning path.`
      : `This is the direct target milestone for your ${goalName} curriculum.`,
    downstreamCount > 0
      ? 'All prerequisite dependencies are satisfied and ready for focused diagnostic practice.'
      : 'Reinforcing this concept solidifies downstream retention and confidence.',
  ];

  return (
    <>
      <section 
        className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
        aria-labelledby="next-best-action-heading"
      >
        {/* Accent Banner / Header */}
        <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1877F2] animate-pulse" />
            <h2 id="next-best-action-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Next Best Action
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Priority Score:</span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
              {recommendation.priorityScore.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Main Focus Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {recommendation.skillName}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                  {masteryPercent}% Mastery
                </span>
                {downstreamCount > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    High Prerequisite Impact
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {downstreamSkillName ? (
                  <>
                    Master this foundational topic before advancing to <strong className="font-semibold text-slate-800">{downstreamSkillName}</strong>.
                  </>
                ) : (
                  <>
                    Targeted practice on this concept provides the highest leverage for your <strong className="font-semibold text-slate-800">{goalName}</strong> goal.
                  </>
                )}
              </p>
            </div>

            {/* Mastery Meter */}
            <div className="lg:w-64 shrink-0 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Current Mastery</span>
                <span className="font-bold text-slate-900 font-mono">{masteryPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    masteryScore >= 0.6 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, masteryPercent))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>0%</span>
                <span className="text-amber-700 font-semibold">Goal Threshold: 60%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Why this is recommended */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Why this is recommended
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-normal">
              {reasonBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Primary Dominant Action */}
              <button
                id="btn-practice-recommended"
                onClick={() => onStartQuiz(recommendation.skillId)}
                className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Practice {recommendation.skillName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* View Evidence Modal Action */}
              <button
                id="btn-view-evidence"
                onClick={() => setEvidenceOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>View Evidence</span>
              </button>
            </div>

            {/* Secondary Action: Review Gap Material */}
            {onOpenGapModal && (
              <button
                onClick={() => onOpenGapModal(recommendation.skillId)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Study Concept Notes</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        skillId={recommendation.skillId}
        skillName={recommendation.skillName || 'Skill'}
        masteryScore={masteryScore}
        downstreamCount={downstreamCount}
        attempts={attempts}
        onStartQuiz={() => onStartQuiz(recommendation.skillId)}
      />
    </>
  );
};
