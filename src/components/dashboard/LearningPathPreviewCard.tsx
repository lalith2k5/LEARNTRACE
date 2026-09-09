import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Network, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { LearningPathStep } from '../../types';

interface LearningPathPreviewCardProps {
  pathSteps: LearningPathStep[];
  goalName?: string;
  onStartQuiz: (skillId: string) => void;
  onOpenGapModal?: (skillId: string) => void;
  onNavigateToGraph: () => void;
}

export const LearningPathPreviewCard: React.FC<LearningPathPreviewCardProps> = ({
  pathSteps,
  goalName = 'Machine Learning Engineer',
  onStartQuiz,
  onOpenGapModal,
  onNavigateToGraph,
}) => {
  // Take up to 5 steps for compact preview
  const displaySteps = pathSteps.slice(0, 5);

  // Find the current active step (the first ready_to_learn step)
  const currentStep = pathSteps.find((s) => s.status === 'ready_to_learn') || pathSteps[0];

  return (
    <section 
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
      aria-labelledby="learning-path-heading"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1877F2]" />
            <h2 id="learning-path-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Learning Path
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Topologically sorted sequence for <span className="font-semibold text-slate-700">{goalName}</span>
          </p>
        </div>

        <button
          onClick={onNavigateToGraph}
          className="text-xs text-[#1877F2] hover:text-[#166fe5] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Full Graph</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stepper Timeline */}
      <div className="p-5 sm:p-6 space-y-3 flex-1">
        {displaySteps.map((step, idx) => {
          const isMastered = step.status === 'mastered';
          const isReady = step.status === 'ready_to_learn';
          const isLocked = step.status === 'locked';
          const isCurrentActive = currentStep?.skillId === step.skillId;
          const masteryPercent = Math.round(step.masteryScore * 100);

          return (
            <div
              key={step.skillId}
              className={`p-3 rounded-xl border transition-all ${
                isCurrentActive
                  ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                  : 'bg-white border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Status Indicator & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {isMastered ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : isReady ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isCurrentActive ? 'bg-[#1877F2] text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx + 1}
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isCurrentActive ? 'text-[#1877F2]' : 'text-slate-900'}`}>
                        {step.skillName}
                      </span>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {isMastered
                        ? `Mastered (${masteryPercent}%) • Foundation secure`
                        : isReady
                        ? `Ready to practice (${masteryPercent}%) • Prerequisites satisfied`
                        : 'Locked until prerequisite mastery improves'}
                    </p>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="shrink-0 flex items-center gap-1.5">
                  {isReady && (
                    <button
                      onClick={() => onStartQuiz(step.skillId)}
                      className="px-2.5 py-1 rounded-md bg-[#1877F2] hover:bg-[#166fe5] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {isMastered && onOpenGapModal && (
                    <button
                      onClick={() => onOpenGapModal(step.skillId)}
                      className="px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Notes
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {pathSteps.filter((s) => s.status === 'mastered').length} of {pathSteps.length} curriculum steps completed
        </span>

        {onOpenGapModal && currentStep && (
          <button
            onClick={() => onOpenGapModal(currentStep.skillId)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Study Current Notes</span>
          </button>
        )}
      </div>
    </section>
  );
};
