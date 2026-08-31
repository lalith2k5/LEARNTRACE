import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, ArrowRight, Sparkles, Layers, Cpu } from 'lucide-react';
import { api } from '../api/client';
import { LearningGoal } from '../types';
import { useAuth } from '../context/AuthContext';

interface GoalSelectorProps {
  onGoalSelected: () => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({ onGoalSelected }) => {
  const { currentGoal, refreshCurrentGoal } = useAuth();
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingGoalId, setSavingGoalId] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true);
        const data = await api.getGoals();
        setGoals(data);
      } catch (err) {
        console.error('Failed to load learning goals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Select Your Curriculum Goal</h2>
            <p className="text-xs text-slate-500">
              The recommendation engine and topological learning path dynamically orient toward your target milestone.
            </p>
          </div>
        </div>
      </div>

      {/* Goal Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">
          <Cpu className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-xs">Fetching curriculum goals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isCurrent = currentGoal?.goalId === goal.id;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-2xs ${
                  isCurrent
                    ? 'bg-indigo-50/30 border-indigo-400 ring-1 ring-indigo-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      Domain: {goal.targetSkill?.domain || 'Data Science'}
                    </span>

                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active Goal
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{goal.name}</h3>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="text-slate-600 font-medium">
                      Target Milestone Skill: <strong className="text-indigo-700">{goal.targetSkill?.name}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {goal.targetSkill?.description || 'Builds full prerequisite chain across probability, linear algebra, and inference.'}
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
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                  }`}
                >
                  {savingGoalId === goal.id ? (
                    <>
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Learning Goal...</span>
                    </>
                  ) : isCurrent ? (
                    <span>Currently Active</span>
                  ) : (
                    <>
                      <span>Set as Active Goal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
