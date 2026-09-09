import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  Check, 
  Code,
  GraduationCap
} from 'lucide-react';
import { LearningResource, LearningPathStep } from '../../types';
import { api } from '../../api/client';

interface LearningGapModalProps {
  skillId: string | null;
  onClose: () => void;
  onStartQuiz: (skillId: string) => void;
  pathSteps: LearningPathStep[];
}

export const LearningGapModal: React.FC<LearningGapModalProps> = ({
  skillId,
  onClose,
  onStartQuiz,
  pathSteps,
}) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'doc' | 'practice'>('guide');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const step = pathSteps.find((s) => s.skillId === skillId);

  useEffect(() => {
    if (!skillId) {
      setResources([]);
      return;
    }

    let isMounted = true;
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await api.getResources(skillId);
        if (isMounted) {
          setResources(data);
        }
      } catch (err) {
        console.error('Failed to load learning resources:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setActiveTab('guide');
    setShowHint(false);
    setShowSolution(false);
    fetchResources();

    return () => {
      isMounted = false;
    };
  }, [skillId]);

  if (!skillId || !step) return null;

  const guideResource = resources.find((r) => r.type === 'guide');
  const docResource = resources.find((r) => r.type === 'documentation');
  const practiceResource = resources.find((r) => r.type === 'practice');
  const masteryPercent = Math.round(step.masteryScore * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gap-modal-title"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Concept Deep Dive & Review
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Domain: {step.domain}
                </span>
              </div>

              <h2 id="gap-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {step.skillName}
              </h2>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="text-slate-500 font-medium">
                  Current Mastery:{' '}
                  <strong className="text-slate-900 font-bold font-mono">
                    {masteryPercent}%
                  </strong>{' '}
                  (Goal Threshold: 60%)
                </span>
                {step.prerequisites && step.prerequisites.length > 0 && (
                  <span className="text-slate-400">
                    • Dependencies: {step.prerequisites.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-5 sm:px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-[#1877F2] text-[#1877F2] bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Core Concept Guide</span>
              {guideResource?.readTimeMinutes && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                  {guideResource.readTimeMinutes}m
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('doc')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'doc'
                  ? 'border-[#1877F2] text-[#1877F2] bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Documentation & References</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'practice'
                  ? 'border-[#1877F2] text-[#1877F2] bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>3. Walkthrough Exercise</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <div className="w-6 h-6 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Loading concept guides and references...</p>
              </div>
            ) : (
              <>
                {/* TAB 1: GUIDE */}
                {activeTab === 'guide' && guideResource && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">
                          {guideResource.title}
                        </span>
                        {guideResource.readTimeMinutes && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {guideResource.readTimeMinutes} min read
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {guideResource.description}
                      </p>
                    </div>

                    {guideResource.keyConcepts && guideResource.keyConcepts.length > 0 && (
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Key Takeaways & Conceptual Foundations
                        </h4>
                        <ul className="space-y-1.5">
                          {guideResource.keyConcepts.map((kc, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] mt-1.5 shrink-0" />
                              <span>{kc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {guideResource.contentSummary && (
                      <div className="border border-slate-200 rounded-xl p-5 bg-white text-xs text-slate-700 space-y-2.5 leading-relaxed whitespace-pre-line font-sans">
                        {guideResource.contentSummary}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DOCUMENTATION */}
                {activeTab === 'doc' && docResource && (
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            Authoritative Reference
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {docResource.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {docResource.description}
                          </p>
                        </div>
                        {docResource.url && (
                          <a
                            href={docResource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: PRACTICE EXERCISE */}
                {activeTab === 'practice' && practiceResource?.practiceExercise && (
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Practice Problem Prompt
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {practiceResource.practiceExercise.prompt}
                      </p>

                      {practiceResource.practiceExercise.codeSnippet && (
                        <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
                          {practiceResource.practiceExercise.codeSnippet}
                        </pre>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        {practiceResource.practiceExercise.hint && (
                          <button
                            onClick={() => setShowHint(!showHint)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                          </button>
                        )}
                        {practiceResource.practiceExercise.solution && (
                          <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1877F2] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-[#1877F2]" />
                            <span>{showSolution ? 'Hide Solution' : 'Reveal Solution'}</span>
                          </button>
                        )}
                      </div>

                      {showHint && practiceResource.practiceExercise.hint && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                          <strong>Hint: </strong>{practiceResource.practiceExercise.hint}
                        </div>
                      )}

                      {showSolution && practiceResource.practiceExercise.solution && (
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-slate-800 space-y-1">
                          <strong className="text-emerald-800">Walkthrough Solution:</strong>
                          <p className="font-mono text-[11px] whitespace-pre-line bg-white/70 p-2.5 rounded border border-emerald-100">
                            {practiceResource.practiceExercise.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onStartQuiz(skillId);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Practice {step.skillName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
