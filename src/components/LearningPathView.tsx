import React from 'react';
import { Route, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { LearningPathStep } from '../types';

interface LearningPathViewProps {
  pathSteps: LearningPathStep[];
  goalName?: string;
  onSelectSkill: (skillId: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  pathSteps,
  goalName = 'Machine Learning Engineer',
  onSelectSkill,
}) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Learning Path Sequence</h3>
            <p className="text-xs text-slate-400">
              Dependency sequence toward <strong className="text-slate-700 font-medium">{goalName}</strong>
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {pathSteps.length} Steps
          </span>
        </div>

        {/* Path List */}
        {pathSteps.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1.5 opacity-80" />
            <p className="font-medium text-slate-800">All prerequisite steps mastered</p>
            <p className="text-slate-400 mt-0.5">Your foundational requirements for this milestone are complete.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pathSteps.map((step, index) => {
              const masteryPct = Math.round(step.masteryScore * 100);
              const isFirst = index === 0;

              return (
                <div
                  key={step.skillId}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isFirst
                      ? 'bg-indigo-50/40 border-indigo-200'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  
                  {/* Left Step details */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isFirst
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-500'
                      }`}
                    >
                      {step.order}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{step.skillName}</span>
                        {isFirst && (
                          <span className="text-[10px] font-medium text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded">
                            Next Up
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                        <span>{step.domain}</span>
                        {step.prerequisites && step.prerequisites.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[160px]">
                              Req: {step.prerequisites.join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Progress & Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-600 font-mono">
                        {masteryPct}%
                      </div>
                    </div>

                    <button
                      id={`btn-path-practice-${step.skillId}`}
                      onClick={() => onSelectSkill(step.skillId)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                        isFirst
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Practice</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Ordered by topological DAG dependencies</span>
        <span>Auto-syncs with quiz evidence</span>
      </div>

    </div>
  );
};
