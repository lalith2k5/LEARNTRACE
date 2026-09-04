import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ArrowRight, Sparkles, Layers, Cpu, Plus, X } from 'lucide-react';
import { api } from '../api/client';
import { LearningGoal, Skill } from '../types';
import { useAuth } from '../context/AuthContext';

interface GoalSelectorProps {
  onGoalSelected: () => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({ onGoalSelected }) => {
  const { currentGoal, refreshCurrentGoal } = useAuth();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingGoalId, setSavingGoalId] = useState<string | null>(null);

  // Custom Goal Modal State
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customTargetSkillId, setCustomTargetSkillId] = useState<string>('skill_ml');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [creatingCustom, setCreatingCustom] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [goalsData, skillsData] = await Promise.all([
          api.getGoals(),
          api.getSkills(),
        ]);
        setGoals(goalsData);
        setSkills(skillsData);
        if (skillsData.length > 0) {
          setCustomTargetSkillId(skillsData[skillsData.length - 1].id);
        }
      } catch (err) {
        console.error('Failed to load learning goals and skills:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectGoal = async (goalId: string) => {
    try {
      setSavingGoalId(goalId);
      await api.selectGoal(goalId);
      await refreshCurrentGoal();
      onGoalSelected();
    } catch (err) {
      console.error('Failed to select goal:', err);
    } finally {
      setSavingGoalId(null);
    }
  };

  const handleCreateCustomGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setErrorMsg('Please enter a goal title.');
      return;
    }

    try {
      setCreatingCustom(true);
      setErrorMsg(null);
      const res = await api.createCustomGoal({
        name: customName.trim(),
        targetSkillId: customTargetSkillId,
        description: customDescription.trim() || undefined,
      });

      // Refresh goals
      const updatedGoals = await api.getGoals();
      setGoals(updatedGoals);
      await refreshCurrentGoal();
      setShowCustomModal(false);
      setCustomName('');
      setCustomDescription('');
      onGoalSelected();
    } catch (err: any) {
      console.error('Failed to create custom goal:', err);
      setErrorMsg(err?.message || 'Failed to create custom curriculum goal.');
    } finally {
      setCreatingCustom(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header with Custom Goal trigger */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-50 text-[#1877F2] border border-blue-100">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Select or Build Your Curriculum Goal</h2>
            <p className="text-xs text-slate-500">
              Your personalized learning path and prerequisite checks automatically adapt to this target goal.
            </p>
          </div>
        </div>

        <button
          id="btn-open-custom-goal"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Custom Goal
        </button>
      </div>

      {/* Goal Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <Cpu className="w-8 h-8 animate-spin text-[#1877F2] mx-auto mb-2" />
          <p className="text-xs">Fetching curriculum goals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isCurrent = currentGoal?.goalId === goal.id;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-2xs min-w-0 ${
                  isCurrent
                    ? 'bg-blue-50/30 border-[#1877F2] ring-1 ring-[#1877F2]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-full">
                      Domain: {goal.targetSkill?.domain || 'Data Science'}
                    </span>

                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active Goal
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">{goal.name}</h3>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1 min-w-0">
                    <div className="text-slate-600 font-medium truncate">
                      Target Milestone Skill: <strong className="text-[#1877F2]">{goal.targetSkill?.name}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed break-words">
                      {goal.description || goal.targetSkill?.description || 'Builds full prerequisite chain across probability, linear algebra, and inference.'}
                    </p>
                  </div>
                </div>

                <button
                  id={`btn-select-goal-${goal.id}`}
                  onClick={() => handleSelectGoal(goal.id)}
                  disabled={isCurrent || savingGoalId !== null}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                      : 'bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-2xs'
                  }`}
                >
                  {savingGoalId === goal.id ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      Setting Goal...
                    </>
                  ) : isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Current Selected Path
                    </>
                  ) : (
                    <>
                      Activate Goal
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Goal Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1877F2]" />
                <h3 className="font-bold text-slate-900 text-base">Create Custom Curriculum Goal</h3>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCustomGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Computer Vision & Spatial Math, Deep Learning Researcher"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Milestone Skill <span className="text-rose-500">*</span>
                </label>
                <select
                  value={customTargetSkillId}
                  onChange={(e) => setCustomTargetSkillId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2] bg-white"
                >
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.domain})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  LearnTrace will automatically detect and prioritize all foundational skills needed for this goal.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Custom Objective / Description
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Describe your learning focus or target mastery milestone..."
                  rows={3}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCustom}
                  className="px-4 py-2 text-xs font-semibold bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {creatingCustom ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Save & Activate Goal'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
