import React from 'react';
import { RefreshCw, Target, Calendar, Sparkles } from 'lucide-react';
import { User } from '../../types';
import { 
  getUserDisplayName, 
  getTimeBasedGreeting, 
  getContextDateString 
} from '../../utils/dashboardHelpers';

interface DashboardHeaderProps {
  user?: User | null;
  goalName?: string;
  isNewUser?: boolean;
  isStrongMastery?: boolean;
  isRecalculating?: boolean;
  onRefresh?: () => void;
  onChangeGoal?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  goalName = 'Machine Learning Engineer',
  isNewUser = false,
  isStrongMastery = false,
  isRecalculating = false,
  onRefresh,
  onChangeGoal,
}) => {
  const greeting = getTimeBasedGreeting();
  const displayName = getUserDisplayName(user);
  const contextDate = getContextDateString();

  let contextualMessage = "Here's what needs your attention today.";
  if (isNewUser) {
    contextualMessage = "Welcome to LEARNTRACE. Let's establish your baseline with a diagnostic assessment.";
  } else if (isStrongMastery) {
    contextualMessage = "Outstanding progress. Your core prerequisites and goal milestones are strong.";
  }

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/80 pb-5">
      {/* Greeting & Context */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {greeting}, {displayName} <span className="inline-block" role="img" aria-label="waving hand">👋</span>
          </h1>

          {/* Context Date Badge */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>{contextDate}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 flex items-center gap-2 flex-wrap font-normal">
          <span>You're making progress toward your <strong className="font-semibold text-slate-800">{goalName}</strong> goal.</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-slate-500">{contextualMessage}</span>
        </p>
      </div>

      {/* Right Controls: Goal Context & Refresh */}
      <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
        {onChangeGoal && (
          <button
            onClick={onChangeGoal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="Switch your active target goal"
          >
            <Target className="w-3.5 h-3.5 text-[#1877F2]" />
            <span className="max-w-[140px] truncate">{goalName}</span>
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRecalculating}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Recalculate Knowledge Tracing"
            aria-label="Refresh and recalculate mastery"
          >
            <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-[#1877F2]' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
};
