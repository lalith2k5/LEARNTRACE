import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import { Network, Sparkles, Target, CheckCircle2, AlertCircle, ArrowRight, Play, Info, Layers, Activity } from 'lucide-react';
import { api } from '../api/client';
import { Skill } from '../types';

// Custom Node for React Flow
const SkillNodeComponent = ({ data }: { data: any }) => {
  const masteryPct = Math.round((data.mastery || 0) * 100);
  const isMastered = masteryPct >= 60;
  const isAssessed = data.mastery !== undefined && data.evidenceCount > 0;
  const isGap = isAssessed && !isMastered;

  let borderStyle = 'bg-white border-slate-200 hover:border-slate-300';
  if (data.isRecommended) {
    borderStyle = 'bg-gradient-to-b from-blue-50/90 to-white border-[#1877F2] ring-2 ring-[#1877F2]/40 shadow-xs';
  } else if (data.isTarget) {
    borderStyle = 'bg-purple-50/50 border-purple-400 shadow-xs';
  } else if (isMastered) {
    borderStyle = 'bg-white border-emerald-400 shadow-xs';
  } else if (isGap) {
    borderStyle = 'bg-white border-amber-400 shadow-xs';
  }

  return (
    <div
      className={`min-w-[230px] max-w-[260px] p-4 rounded-xl border transition-all cursor-pointer select-none ${borderStyle}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-[#1877F2] !w-2.5 !h-2.5 !border-2 !border-white" />

      {/* Header tags */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
          {data.domain}
        </span>

        {data.isRecommended ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#1877F2] border border-blue-200">
            <Sparkles className="w-2.5 h-2.5 text-[#1877F2]" />
            Recommended
          </span>
        ) : data.isTarget ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
            <Target className="w-2.5 h-2.5 text-purple-600" />
            Goal Target
          </span>
        ) : isMastered ? (
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Mastered
          </span>
        ) : isGap ? (
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-2.5 h-2.5" />
            Skill Gap
          </span>
        ) : (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            Not Assessed
          </span>
        )}
      </div>

      {/* Title */}
      <div className="font-bold text-sm text-slate-900 mb-2 truncate leading-snug" title={data.label}>
        {data.label}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-600">Mastery</span>
          <span className={isMastered ? 'text-emerald-600 font-bold' : isGap ? 'text-amber-600 font-bold' : 'text-slate-500 font-medium'}>
            {isAssessed ? `${masteryPct}%` : 'Not tested'}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isMastered ? 'bg-emerald-500' : isGap ? 'bg-amber-500' : 'bg-slate-300'
            }`}
            style={{ width: isAssessed ? `${Math.min(masteryPct, 100)}%` : '0%' }}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-[#1877F2] !w-2.5 !h-2.5 !border-2 !border-white" />
    </div>
  );
};

const nodeTypes = {
  skillNode: SkillNodeComponent,
};

interface SkillGraphViewProps {
  onStartQuizForSkill: (skillId: string) => void;
}

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({ onStartQuizForSkill }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      const graphData = await api.getGraph();
      setNodes(graphData.nodes || []);
      setEdges(graphData.edges || []);

      // Auto select first or recommended node
      const rec = graphData.nodes?.find((n: any) => n.data?.isRecommended) || graphData.nodes?.[0];
      if (rec) {
        setSelectedSkill(rec.data);
      }
    } catch (err) {
      console.error('Error fetching graph:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedSkill(node.data);
  }, []);

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1877F2]">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Prerequisite Knowledge Graph</h2>
            <p className="text-xs text-slate-500">
              Interactive visual skill map showing prerequisite relationships and foundational concept blockers.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3.5 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] ring-2 ring-blue-200" />
            <span className="text-slate-700 font-medium">Recommended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Mastered (≥60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-700 font-medium">Skill Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-700 font-medium">Goal Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-600 font-medium">Not Assessed</span>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* React Flow Container */}
        <div className="lg:col-span-2 h-[520px] xl:h-[580px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs relative">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              <Network className="w-8 h-8 animate-pulse text-[#1877F2] mb-2" />
              <span>Building Knowledge Graph...</span>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              proOptions={{ hideAttribution: true }}
              className="bg-slate-50"
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#cbd5e1" />
              <Controls position="bottom-right" />
            </ReactFlow>
          )}

          {/* Quick Flow Hint */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs text-[11px] text-slate-600 flex items-center gap-2 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-[#1877F2]" />
            <span>Click any node to inspect details and launch diagnostic quiz</span>
          </div>
        </div>

        {/* Node Inspection Drawer */}
        <div className="h-full bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-5">
          {selectedSkill ? (
            <div className="space-y-4">
              
              <div>
                <span className="text-[10px] uppercase font-bold text-[#1877F2] tracking-wider">
                  {selectedSkill.domain}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">{selectedSkill.label}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {selectedSkill.description || 'No description available for this skill.'}
                </p>
              </div>

              {/* Status & Mastery Card */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Mastery:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      Math.round((selectedSkill.mastery || 0) * 100) >= 60
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {Math.round((selectedSkill.mastery || 0) * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSkill.interpretation?.label || (
                      Math.round((selectedSkill.mastery || 0) * 100) >= 60
                        ? 'Mastered'
                        : selectedSkill.evidenceCount > 0
                        ? 'Progressing'
                        : 'Not Assessed'
                    )}
                  </span>
                </div>

                {/* Evidence Section */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Evidence:</span>
                  </div>
                  <div className="text-[11px] text-slate-600 pl-5 space-y-0.5">
                    <div>{selectedSkill.evidenceCount || 0} attempts • {selectedSkill.correctCount || 0} correct</div>
                    <div>
                      {selectedSkill.avgConfidence && selectedSkill.avgConfidence > 0
                        ? `${selectedSkill.avgConfidence >= 4 ? 'High' : selectedSkill.avgConfidence >= 2.5 ? 'Medium' : 'Low'} confidence (${selectedSkill.avgConfidence}/5)`
                        : 'No confidence ratings recorded'}
                    </div>
                  </div>
                </div>

                {/* Prerequisites Section */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Prerequisites:</span>
                  </div>
                  {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 ? (
                    <div className="space-y-1 pl-1">
                      {selectedSkill.prerequisites.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded border border-slate-200">
                          <span className="font-medium text-slate-800">{p.name}</span>
                          <span className={p.isMastered ? 'text-emerald-600 font-bold' : 'text-amber-600 font-medium'}>
                            {p.isMastered ? '✓ (Mastered)' : `${Math.round(p.mastery * 100)}% (In Progress)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 pl-5">
                      Foundational topic (no prior prerequisites).
                    </p>
                  )}
                </div>

                {selectedSkill.isTarget && (
                  <div className="text-[11px] text-purple-700 font-medium pt-2 border-t border-slate-200 flex items-center gap-1">
                    <Target className="w-3 h-3 text-purple-600" />
                    Target Milestone for Selected Goal
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Network className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              Select any skill node on the canvas to inspect its prerequisites and mastery.
            </div>
          )}

          {selectedSkill && (
            <button
              id={`btn-inspect-practice-${selectedSkill.id}`}
              onClick={() => onStartQuizForSkill(selectedSkill.id)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice {selectedSkill.label}</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
