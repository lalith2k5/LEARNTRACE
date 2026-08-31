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
import { BarChart3, Info } from 'lucide-react';

interface MasteryChartProps {
  masteries: SkillMastery[];
  onSelectSkill?: (skillId: string) => void;
}

export const MasteryChart: React.FC<MasteryChartProps> = ({ masteries, onSelectSkill }) => {
  const chartData = masteries.map((m) => {
    const score = Math.round(m.masteryScore * 100);
    return {
      skillId: m.skillId,
      name: m.skillName || m.skillId,
      mastery: score,
      rawScore: m.masteryScore,
      evidenceCount: m.evidenceCount,
      domain: m.domain || 'Data Science',
      isMastered: m.masteryScore >= 0.6,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-md text-xs space-y-1 z-50 font-sans">
          <div className="font-bold text-slate-900">{data.name}</div>
          <div className="text-slate-500">Domain: <span className="text-slate-700 font-medium">{data.domain}</span></div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-slate-500">Mastery:</span>
            <span className={`font-bold ${data.isMastered ? 'text-emerald-600' : 'text-amber-600'}`}>
              {data.mastery}% {data.isMastered ? '(Mastered)' : '(Skill Gap)'}
            </span>
          </div>
          <div className="text-slate-400 text-[10px]">
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
          <h3 className="font-bold text-sm text-slate-900">Skill Mastery Distribution</h3>
          <p className="text-xs text-slate-400">Current knowledge tracing levels across curriculum</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span className="text-slate-600 text-[11px]">Mastered (≥60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span className="text-slate-600 text-[11px]">Gap (&lt;60%)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -15, bottom: 20 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                const clickedSkillId = state.activePayload[0].payload.skillId;
                if (onSelectSkill) onSelectSkill(clickedSkillId);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              interval={0}
              angle={-12}
              textAnchor="end"
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

            <Bar dataKey="mastery" radius={[4, 4, 0, 0]} maxBarSize={40} className="cursor-pointer">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isMastered ? '#10b981' : '#f59e0b'}
                  className="hover:opacity-85 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any bar to start practice</span>
        <span>Recency-weighted confidence scoring</span>
      </div>

    </div>
  );
};
