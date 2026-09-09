import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, XCircle, Clock, Target, ArrowRight, Activity, Brain } from 'lucide-react';
import { Attempt } from '../../types';
import { formatCognitiveState } from '../../utils/cognitiveStates';
import { formatActivityTimestamp } from '../../utils/dashboardHelpers';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
  masteryScore: number;
  downstreamCount?: number;
  attempts: Attempt[];
  onStartQuiz: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  skillId,
  skillName,
  masteryScore,
  downstreamCount = 0,
  attempts,
  onStartQuiz,
}) => {
  if (!isOpen) return null;

  // Filter attempts relevant to this skill
  const skillAttempts = attempts.filter(
    (a) => a.skillId === skillId || (a.skillsTested && a.skillsTested.includes(skillId))
  );

  const totalAttempts = skillAttempts.length;
  const correctAttempts = skillAttempts.filter((a) => a.correct).length;
  const accuracyPercent = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const avgConfidence = totalAttempts > 0
    ? (skillAttempts.reduce((acc, a) => acc + (a.confidence || 3), 0) / totalAttempts).toFixed(1)
    : '—';

  const latestAttempt = skillAttempts[0];
  const cognitiveStateInfo = formatCognitiveState(latestAttempt?.cognitiveState);

  const masteryPercent = Math.round(masteryScore * 100);
  const isMastered = masteryScore >= 0.6;

  const prerequisiteImpact = downstreamCount > 1
    ? `High (Unblocks ${downstreamCount} skills)`
    : downstreamCount === 1
    ? 'Moderate (Unblocks 1 skill)'
    : 'Target Goal Milestone';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-modal-title"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1877F2] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                  <Activity className="w-3 h-3" />
                  Evidence Trace
                </span>
                <span className="text-xs text-slate-500">• {skillName}</span>
              </div>
              <h3 id="evidence-modal-title" className="text-base font-bold text-slate-900">
                Diagnostic Evidence & Performance History
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Current Mastery</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold font-mono ${isMastered ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {masteryPercent}%
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">/ 60%</span>
                </div>
                <span className={`text-[10px] font-medium mt-1 inline-block ${isMastered ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isMastered ? 'Target Reached' : 'Skill Gap'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Recent Accuracy</span>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {totalAttempts > 0 ? `${correctAttempts}/${totalAttempts}` : '0/0'}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1 inline-block">
                  {totalAttempts > 0 ? `${accuracyPercent}% accuracy` : 'No attempts'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Avg Confidence</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-slate-900 font-mono">{avgConfidence}</span>
                  {totalAttempts > 0 && <span className="text-[11px] text-slate-400 font-medium">/ 5</span>}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1 inline-block">
                  Self-reported
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-500 block mb-1">Prereq Impact</span>
                <div className="text-sm font-bold text-slate-900 truncate" title={prerequisiteImpact}>
                  {downstreamCount > 0 ? `Unblocks ${downstreamCount}` : 'Target Milestone'}
                </div>
                <span className="text-[10px] font-medium text-[#1877F2] mt-1 inline-block">
                  {downstreamCount > 0 ? 'High Dependency' : 'Direct Target'}
                </span>
              </div>
            </div>

            {/* Cognitive State Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#1877F2]" />
                  Diagnosed Cognitive State
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${cognitiveStateInfo.badgeClass}`}>
                  {cognitiveStateInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {cognitiveStateInfo.description}
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Model Classification: {cognitiveStateInfo.technical}
              </div>
            </div>

            {/* Recent Assessment Attempts */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Question Attempts ({skillAttempts.length})
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">
                  Latest 5 interactions
                </span>
              </div>

              {skillAttempts.length === 0 ? (
                <div className="text-center py-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
                  <p>No attempts recorded for {skillName} yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Taking a quick practice round will build initial evidence and calibrate your mastery score.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {skillAttempts.slice(0, 5).map((attempt) => (
                    <div key={attempt.id} className="p-3 bg-white hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
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
                          <span className="text-[11px] text-slate-400">
                            {formatActivityTimestamp(attempt.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px] line-clamp-2 leading-relaxed">
                          {attempt.questionText || 'Diagnostic curriculum question'}
                        </p>
                      </div>

                      <div className="text-right shrink-0 space-y-1 text-[11px] text-slate-500 font-mono">
                        <div className="flex items-center justify-end gap-1 text-slate-400 text-[10px]">
                          <Clock className="w-3 h-3" />
                          <span>{attempt.timeTakenSeconds}s</span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-sans">
                          Conf: <strong className="text-[#1877F2] font-mono">{attempt.confidence}/5</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onStartQuiz();
              }}
              className="px-4 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Practice {skillName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
