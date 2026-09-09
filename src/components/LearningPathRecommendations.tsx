import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
  FileText,
  HelpCircle,
  ChevronRight,
  AlertCircle,
  GraduationCap,
  Layers,
  Code,
  Check,
} from 'lucide-react';
import { LearningPathStep, LearningResource, getMasteryInterpretation } from '../types';
import { api } from '../api/client';

interface LearningPathRecommendationsProps {
  pathSteps: LearningPathStep[];
  goalName?: string;
  onSelectSkill: (skillId: string) => void;
  activeGapSkillId?: string | null;
  onCloseGapModal?: () => void;
}

export const LearningPathRecommendations: React.FC<LearningPathRecommendationsProps> = ({
  pathSteps,
  goalName = 'Machine Learning Engineer',
  onSelectSkill,
  activeGapSkillId,
  onCloseGapModal,
}) => {
  const [selectedStep, setSelectedStep] = useState<LearningPathStep | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loadingResources, setLoadingResources] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'doc' | 'practice'>('guide');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Sync external activeGapSkillId if supplied
  useEffect(() => {
    if (activeGapSkillId) {
      const step = pathSteps.find((s) => s.skillId === activeGapSkillId);
      if (step) {
        handleOpenGap(step);
      }
    }
  }, [activeGapSkillId, pathSteps]);

  const handleOpenGap = async (step: LearningPathStep) => {
    setSelectedStep(step);
    setActiveTab('guide');
    setShowHint(false);
    setShowSolution(false);
    setLoadingResources(true);

    try {
      const res = await api.getSkillResources(step.skillId);
      setResources(res);
    } catch (err) {
      console.error('Failed to load learning resources for skill:', step.skillId, err);
    } finally {
      setLoadingResources(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedStep(null);
    setShowHint(false);
    setShowSolution(false);
    if (onCloseGapModal) {
      onCloseGapModal();
    }
  };

  const handleStartRetest = (skillId: string) => {
    handleCloseModal();
    onSelectSkill(skillId);
  };

  // Extract guide, doc, practice resources
  const guideResource = resources.find((r) => r.type === 'guide') || resources[0];
  const docResource = resources.find((r) => r.type === 'documentation');
  const practiceResource = resources.find((r) => r.type === 'practice');

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between min-w-0 overflow-hidden">
      {/* Sequence Header */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Learning Path Recommendations</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1877F2] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-[#1877F2]" />
                Adaptive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized prerequisite sequence toward <strong className="text-slate-700 font-medium">{goalName}</strong>
            </p>
          </div>

          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            {pathSteps.length} Steps
          </span>
        </div>

        {/* Steps List */}
        {pathSteps.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-slate-800 text-sm">All curriculum steps mastered</p>
            <p className="text-slate-400 mt-1 max-w-sm mx-auto">
              Your foundational mastery requirements for this learning milestone are complete.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pathSteps.map((step, index) => {
              const masteryPct = Math.round(step.masteryScore * 100);
              const isFirst = index === 0;
              const isGap = step.masteryScore < 0.6;
              const interp = getMasteryInterpretation(step.masteryScore);

              return (
                <div
                  key={step.skillId}
                  className={`flex flex-col xl:flex-row xl:items-center justify-between p-3.5 rounded-lg border gap-3 transition-all min-w-0 overflow-hidden ${
                    isFirst
                      ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Step Left Info */}
                  <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 sm:mt-0 ${
                        isFirst
                          ? 'bg-[#1877F2] text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {step.order}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate max-w-full" title={step.skillName}>
                          {step.skillName}
                        </span>
                        {isFirst && (
                          <span className="text-[10px] font-semibold text-[#1877F2] bg-blue-100/80 px-1.5 py-0.5 rounded shrink-0">
                            Next Focus
                          </span>
                        )}
                        {isGap && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded shrink-0">
                            Skill Gap
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 overflow-hidden">
                        <span className="shrink-0">{step.domain}</span>
                        {step.prerequisites && step.prerequisites.length > 0 && (
                          <>
                            <span className="text-slate-300 shrink-0">•</span>
                            <span className="truncate text-slate-400">
                              Requires: {step.prerequisites.join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step Right Actions & Mastery */}
                  <div className="flex items-center justify-between xl:justify-end gap-2.5 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-200/60">
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 xl:justify-end">
                        <span className={`text-xs font-bold font-mono ${interp.color}`}>
                          {masteryPct}%
                        </span>
                        <span className="text-[10px] text-slate-400">/ 60%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {interp.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Review Learning Gap Button */}
                      <button
                        id={`btn-learning-gap-${step.skillId}`}
                        onClick={() => handleOpenGap(step)}
                        title="Read concept guide and practice exercises before taking re-test"
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="whitespace-nowrap">Review Gap</span>
                      </button>

                      {/* Immediate Retake Assessment Button */}
                      <button
                        id={`btn-path-practice-${step.skillId}`}
                        onClick={() => onSelectSkill(step.skillId)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                          isFirst
                            ? 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-2xs'
                            : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current shrink-0" />
                        <span className="whitespace-nowrap">Retake Assessment</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          Ordered by prerequisite sequence (foundational topics first)
        </span>
        <span className="text-slate-500">Click &quot;Review Gap&quot; to study theory before retaking assessments</span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* START LEARNING GAP MODAL & DRAWER                             */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Learning Gap Review
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Domain: {selectedStep.domain}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedStep.skillName}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="text-slate-500 font-medium">
                      Current Mastery:{' '}
                      <strong className="text-slate-900 font-bold font-mono">
                        {Math.round(selectedStep.masteryScore * 100)}%
                      </strong>{' '}
                      (Threshold: 60%)
                    </span>
                    {selectedStep.prerequisites && selectedStep.prerequisites.length > 0 && (
                      <span className="text-slate-400">
                        • Dependencies: {selectedStep.prerequisites.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  id="btn-close-gap-modal"
                  onClick={handleCloseModal}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Resource Tabs */}
              <div className="px-5 sm:px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
                <button
                  id="tab-gap-guide"
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
                  id="tab-gap-doc"
                  onClick={() => setActiveTab('doc')}
                  className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'doc'
                      ? 'border-[#1877F2] text-[#1877F2] bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>2. Official Docs & Reference</span>
                </button>

                <button
                  id="tab-gap-practice"
                  onClick={() => setActiveTab('practice')}
                  className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'practice'
                      ? 'border-[#1877F2] text-[#1877F2] bg-blue-50/50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>3. Practice Exercise</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                    Interactive
                  </span>
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {loadingResources ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Sparkles className="w-6 h-6 animate-spin text-[#1877F2]" />
                    <p className="text-xs font-medium">Loading curated learning resources...</p>
                  </div>
                ) : (
                  <>
                    {/* TAB 1: CORE CONCEPT GUIDE */}
                    {activeTab === 'guide' && guideResource && (
                      <div className="space-y-4">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-blue-900">
                              {guideResource.title}
                            </span>
                            {guideResource.readTimeMinutes && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#1877F2] font-medium">
                                <Clock className="w-3 h-3" />
                                {guideResource.readTimeMinutes} min read
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {guideResource.description}
                          </p>
                        </div>

                        {/* Key Takeaways & Concepts */}
                        {guideResource.keyConcepts && guideResource.keyConcepts.length > 0 && (
                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Key Concepts to Master Before Re-Test
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

                        {/* Detailed Content / Markdown text */}
                        {guideResource.contentSummary && (
                          <div className="border border-slate-200 rounded-xl p-5 bg-white text-xs text-slate-700 space-y-3 leading-relaxed whitespace-pre-line font-sans">
                            {guideResource.contentSummary}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: DOCUMENTATION LINKS & REFERENCES */}
                    {activeTab === 'doc' && (
                      <div className="space-y-4">
                        {docResource ? (
                          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  Authoritative Reference
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {docResource.title}
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {docResource.description}
                                </p>
                              </div>

                              {docResource.url && (
                                <a
                                  id="link-official-docs"
                                  href={docResource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3.5 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                >
                                  <span>Open Docs</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            {docResource.contentSummary && (
                              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                                {docResource.contentSummary}
                              </div>
                            )}

                            {docResource.keyConcepts && (
                              <div className="pt-2">
                                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                                  Topics Covered in Reference:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {docResource.keyConcepts.map((item, i) => (
                                    <span
                                      key={i}
                                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            Documentation reference is being prepared for this skill.
                          </div>
                        )}

                        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-900 space-y-0.5 leading-relaxed">
                            <strong>Study Tip:</strong> Skim the formal mathematical definitions and code examples in the official documentation before initiating your diagnostic re-test.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: PRACTICE EXERCISE WITH HINT & SOLUTION */}
                    {activeTab === 'practice' && (
                      <div className="space-y-4">
                        {practiceResource && practiceResource.practiceExercise ? (
                          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs space-y-4">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1877F2] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded mb-2">
                                Warm-up Challenge
                              </span>
                              <h4 className="text-sm font-bold text-slate-900">
                                {practiceResource.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {practiceResource.description}
                              </p>
                            </div>

                            {/* Prompt text */}
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                              {practiceResource.practiceExercise.prompt}
                            </div>

                            {/* Optional Code Snippet */}
                            {practiceResource.practiceExercise.codeSnippet && (
                              <div className="rounded-lg bg-slate-900 text-slate-200 p-3.5 text-xs font-mono overflow-x-auto">
                                <pre>{practiceResource.practiceExercise.codeSnippet}</pre>
                              </div>
                            )}

                            {/* Hint and Solution Controls */}
                            <div className="space-y-3 pt-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {practiceResource.practiceExercise.hint && (
                                  <button
                                    id="btn-toggle-practice-hint"
                                    onClick={() => setShowHint(!showHint)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                                  </button>
                                )}

                                {practiceResource.practiceExercise.solution && (
                                  <button
                                    id="btn-toggle-practice-solution"
                                    onClick={() => setShowSolution(!showSolution)}
                                    className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1877F2] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 text-[#1877F2]" />
                                    <span>{showSolution ? 'Hide Solution' : 'Reveal Solution & Walkthrough'}</span>
                                  </button>
                                )}
                              </div>

                              {/* Collapsible Hint */}
                              {showHint && practiceResource.practiceExercise.hint && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="p-3.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2"
                                >
                                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-semibold block mb-0.5">Hint:</strong>
                                    {practiceResource.practiceExercise.hint}
                                  </div>
                                </motion.div>
                              )}

                              {/* Collapsible Solution */}
                              {showSolution && practiceResource.practiceExercise.solution && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line"
                                >
                                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>Detailed Solution & Step-by-Step Walkthrough:</span>
                                  </div>
                                  <div className="font-mono text-slate-700 bg-white/80 p-3 rounded border border-emerald-100 text-[11px]">
                                    {practiceResource.practiceExercise.solution}
                                  </div>
                                  {practiceResource.practiceExercise.solutionExplanation && (
                                    <p className="text-slate-600 text-[11px] pt-1 italic">
                                      {practiceResource.practiceExercise.solutionExplanation}
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            No practice exercise loaded for this skill.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Footer with Re-Test CTA */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Finished reviewing? Solidify your knowledge with diagnostic evidence.
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 sm:flex-none py-2 px-3.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close Review
                  </button>

                  <button
                    id="btn-modal-start-retest"
                    onClick={() => handleStartRetest(selectedStep.skillId)}
                    className="flex-1 sm:flex-none py-2.5 px-5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Retake Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
