import React from 'react';
import { AlertCircle, ArrowRight, BookOpen, Network, CheckCircle2, ChevronRight } from 'lucide-react';
import { SkillGap } from '../../types';

interface SkillsNeedingAttentionCardProps {
  skillGaps: SkillGap[];
  downstreamSkillMap?: Record<string, string>;
  onStartQuiz: (skillId: string) => void;
  onOpenGapModal?: (skillId: string) => void;
  onNavigateToGraph: () => void;
}

export const SkillsNeedingAttentionCard: React.FC<SkillsNeedingAttentionCardProps> = ({
  skillGaps,
  downstreamSkillMap = {},
  onStartQuiz,
  onOpenGapModal,
  onNavigateToGraph,
}) => {
  // Top 3 priority gaps
  const topGaps = skillGaps.slice(0, 3);

  return (
    <section 
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
      aria-labelledby="skills-needing-attention-heading"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 id="skills-needing-attention-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Skills Needing Attention
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Top prioritized knowledge gaps based on prerequisite impact
          </p>
        </div>

        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
          {skillGaps.length} Total Gaps
        </span>
      </div>

      {/* List of Top 3 Skill Gaps */}
      <div className="p-5 sm:p-6 divide-y divide-slate-100 flex-1">
        {topGaps.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No urgent skill gaps detected!</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All currently evaluated curriculum topics meet or exceed the 60% mastery threshold.
            </p>
          </div>
        ) : (
          topGaps.map((gap, idx) => {
            const masteryPercent = Math.round(gap.masteryScore * 100);
            const isHighPriority = gap.downstreamCount > 0 || gap.prerequisiteCount > 0;
            const dependentSkill = downstreamSkillMap[gap.skillId];

            let reason = 'Curriculum milestone practice';
            if (dependentSkill) {
              reason = `Prerequisite for ${dependentSkill}`;
            } else if (gap.downstreamCount > 0) {
              reason = `Unblocks ${gap.downstreamCount} downstream topic${gap.downstreamCount > 1 ? 's' : ''}`;
            } else if (gap.unmetPrerequisites && gap.unmetPrerequisites.length > 0) {
              reason = `Needs foundation in ${gap.unmetPrerequisites[0]}`;
            }

            return (
              <div 
                key={gap.skillId} 
                className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">
                      {gap.skillName}
                    </h3>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
                      {masteryPercent}% mastery
                    </span>
                    <span 
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isHighPriority
                          ? 'bg-amber-100/70 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {isHighPriority ? 'High priority' : 'Medium priority'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{reason}</span>
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenGapModal && (
                    <button
                      onClick={() => onOpenGapModal(gap.skillId)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                      title="Review learning guide & notes"
                    >
                      Review Gap
                    </button>
                  )}
                  <button
                    onClick={() => onStartQuiz(gap.skillId)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Targeted practice addresses root prerequisite bottlenecks
        </span>

        <button
          onClick={onNavigateToGraph}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#1877F2] hover:text-[#166fe5] transition-colors cursor-pointer"
        >
          <span>View All in Knowledge Graph</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
