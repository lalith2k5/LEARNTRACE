import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  History, 
  Target,
  Sparkles,
  Brain
} from 'lucide-react';
import { Attempt } from '../../types';
import { formatCognitiveState } from '../../utils/cognitiveStates';
import { formatActivityTimestamp } from '../../utils/dashboardHelpers';

interface RecentActivityFeedProps {
  attempts: Attempt[];
  onStartDiagnostic: () => void;
  onStartQuizForSkill?: (skillId: string) => void;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  attempts,
  onStartDiagnostic,
  onStartQuizForSkill,
}) => {
  const displayAttempts = attempts.slice(0, 6);

  return (
    <section 
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
      aria-labelledby="recent-activity-heading"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h2 id="recent-activity-heading" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Learning Activity
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged diagnostic attempts, response latencies, and cognitive tracing
          </p>
        </div>

        {attempts.length > 0 && (
          <span className="text-xs font-mono font-medium text-slate-500">
            {attempts.length} Total Attempts
          </span>
        )}
      </div>

      {/* Body */}
      {attempts.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1877F2] flex items-center justify-center mx-auto border border-blue-100">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-900">
              No recent learning activity yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Take your diagnostic assessment to establish your baseline and initialize knowledge tracing.
            </p>
          </div>
          <button
            onClick={onStartDiagnostic}
            className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <span>Take Diagnostic Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {displayAttempts.map((attempt) => {
            const cognitiveInfo = formatCognitiveState(attempt.cognitiveState);

            return (
              <div 
                key={attempt.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Correct / Incorrect Badge */}
                    <span 
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        attempt.correct
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {attempt.correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {attempt.correct ? 'Correct' : 'Incorrect'}
                    </span>

                    {/* Skill Badge */}
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {attempt.skillName || attempt.skillId}
                    </span>

                    {/* Cognitive State Label */}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cognitiveInfo.badgeClass}`}>
                      {cognitiveInfo.label}
                    </span>

                    {/* Relative Timestamp */}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatActivityTimestamp(attempt.createdAt)}
                    </span>
                  </div>

                  {/* Question Excerpt */}
                  {attempt.questionText && (
                    <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">
                      {attempt.questionText}
                    </p>
                  )}
                </div>

                {/* Metrics & Retake Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {attempt.timeTakenSeconds}s
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      Confidence: <strong className="font-mono text-slate-800">{attempt.confidence}/5</strong>
                    </span>
                  </div>

                  {onStartQuizForSkill && (
                    <button
                      onClick={() => onStartQuizForSkill(attempt.skillId)}
                      className="text-xs font-semibold text-[#1877F2] hover:text-[#166fe5] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
