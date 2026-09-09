import React from 'react';
import { Sparkles, ArrowRight, Brain, Target, ShieldCheck } from 'lucide-react';

interface OnboardingCardProps {
  attemptsCount: number;
  goalName?: string;
  onStartDiagnostic: () => void;
}

export const OnboardingCard: React.FC<OnboardingCardProps> = ({
  attemptsCount,
  goalName = 'Machine Learning Engineer',
  onStartDiagnostic,
}) => {
  // Brand new learner with 0 attempts
  if (attemptsCount === 0) {
    return (
      <section 
        className="w-full bg-linear-to-br from-blue-50/80 via-white to-slate-50 rounded-2xl border border-blue-200/80 p-6 sm:p-8 shadow-xs"
        aria-labelledby="onboarding-heading"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100/70 text-[#1877F2] border border-blue-200">
              <Brain className="w-3.5 h-3.5" />
              <span>Initial Diagnostic Calibration</span>
            </div>

            <h2 id="onboarding-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome to LEARNTRACE 👋
            </h2>

            <div className="space-y-1 text-sm text-slate-600 leading-relaxed font-normal">
              <p className="font-semibold text-slate-800">
                Let's understand what you already know.
              </p>
              <p>
                Take your diagnostic assessment to evaluate foundational prerequisites for your <strong className="font-semibold text-slate-800">{goalName}</strong> goal. We'll trace your knowledge, identify any gaps, and map out your optimal learning sequence.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onStartDiagnostic}
              className="px-6 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Take Diagnostic Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Early stage learner (1-2 attempts)
  if (attemptsCount < 3) {
    return (
      <div className="w-full bg-blue-50/50 border border-blue-200/70 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700">
          <div className="w-2 h-2 rounded-full bg-[#1877F2] animate-pulse shrink-0" />
          <p>
            <strong className="font-semibold text-slate-900">Building your learning profile:</strong>{' '}
            LEARNTRACE is collecting diagnostic evidence to refine your personalized recommendations.
          </p>
        </div>
        <button
          onClick={onStartDiagnostic}
          className="shrink-0 font-bold text-[#1877F2] hover:underline cursor-pointer"
        >
          Continue Practice →
        </button>
      </div>
    );
  }

  return null;
};
