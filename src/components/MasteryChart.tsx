import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { SkillMastery } from '../types';
import { BarChart3, Info, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

interface MasteryChartProps {
  masteries: SkillMastery[];
  onSelectSkill?: (skillId: string) => void;
}

const getShortSkillName = (name: string, id: string): string => {
  const lower = (name || id).toLowerCase();
  if (lower.includes('python')) return 'Python';
  if (lower.includes('distributions')) return 'Distributions';
  if (lower.includes('conditional')) return 'Cond. Prob';
  if (lower.includes('probability') || lower.includes('prob foundations')) return 'Probability';
  if (lower.includes('inference') || lower.includes('statistical')) return 'Statistics';
  if (lower.includes('linear')) return 'Linear Alg';
  if (lower.includes('evaluation') || lower.includes('model eval')) return 'Model Eval';
  if (lower.includes('machine') || lower.includes('learning')) return 'Machine Learn';
  return name.length > 12 ? name.substring(0, 11) + '…' : name;
};

export const MasteryChart: React.FC<MasteryChartProps> = ({ masteries, onSelectSkill }) => {
  const chartData = masteries.map((m) => {
    const score = Math.round(m.masteryScore * 100);
    const rawScore = m.rawMasteryScore !== undefined ? Math.round(m.rawMasteryScore * 100) : score;
    const retention = m.retentionRate !== undefined ? Math.round(m.retentionRate * 100) : 100;
    const fullName = m.skillName || m.skillId;
    const shortName = getShortSkillName(fullName, m.skillId);

    return {
      skillId: m.skillId,
      name: fullName,
      shortName,
      mastery: score,
      rawMastery: rawScore,
      retention,
      daysSince: m.daysSinceLastAttempt || 0,
      needsReview: Boolean(m.needsSpacedReview),
      evidenceCount: m.evidenceCount,
      domain: m.domain || 'Data Science',
      isMastered: m.masteryScore >= 0.6,
    };
  });

  const spacedReviewCount = chartData.filter((d) => d.needsReview).length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-md text-xs space-y-1.5 z-50 font-sans max-w-xs">
          <div className="font-bold text-slate-900">{data.name}</div>
          <div className="text-slate-500">Domain: <span className="text-slate-700 font-medium">{data.domain}</span></div>
          
          <div className="pt-1.5 border-t border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Effective Retained Mastery:</span>
              <span className={`font-bold ${data.isMastered ? 'text-emerald-600' : 'text-amber-600'}`}>
                {data.mastery}% {data.isMastered ? '(Mastered)' : '(Skill Gap)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Historical Raw Score:</span>
              <span className="font-semibold text-slate-700">{data.rawMastery}%</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Ebbinghaus Memory Retention:</span>
              <span className={`font-semibold ${data.retention >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {data.retention}%
              </span>
            </div>
            {data.daysSince > 0 && (
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Last practiced:</span>
                <span>{data.daysSince} days ago</span>
              </div>
            )}
          </div>

          {data.needsReview && (
            <div className="mt-1.5 p-1.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] flex items-center gap-1 font-medium">
              <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
              Spaced repetition review recommended to consolidate retention
            </div>
          )}

          <div className="text-slate-400 text-[10px] pt-1">
            {data.evidenceCount} assessment attempts logged
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">Evidence-Based Mastery & Memory Retention</h3>
            {spacedReviewCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                <RefreshCw className="w-3 h-3 text-amber-600" />
                {spacedReviewCount} Needs Spaced Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Production evidence-based estimation with time-decayed Ebbinghaus retention and recency weighting</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span className="text-slate-600 text-[11px]">Mastered (≥60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span className="text-slate-600 text-[11px]">Gap / Decayed (&lt;60%)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      {chartData.length === 0 ? (
        <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
          <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-700">No skill mastery evidence yet</p>
          <p className="text-[11px] text-slate-400 max-w-xs mt-1">
            Complete diagnostic assessments to populate evidence-based knowledge tracing and retention analytics.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -15, bottom: 35 }}
              onClick={(state: any) => {
                if (state && state.activePayload && state.activePayload.length) {
                  const clickedSkillId = state.activePayload[0].payload.skillId;
                  if (onSelectSkill) onSelectSkill(clickedSkillId);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                interval={0}
                angle={-22}
                textAnchor="end"
                height={42}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                unit="%"
                ticks={[0, 25, 50, 60, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
              
              {/* 60% Target Mastery Reference Line */}
              <ReferenceLine
                y={60}
                stroke="#4f46e5"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '60% Target',
                  position: 'insideTopRight',
                  fill: '#4f46e5',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              <Bar dataKey="mastery" radius={[4, 4, 0, 0]} maxBarSize={36} className="cursor-pointer">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isMastered ? (entry.needsReview ? '#f59e0b' : '#10b981') : '#f59e0b'}
                    className="hover:opacity-85 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>Click any bar to start practice</span>
        <span className="truncate max-w-full">Ebbinghaus Retention S(t) = S₀ · (1 + 0.25N)</span>
      </div>

    </div>
  );
};

