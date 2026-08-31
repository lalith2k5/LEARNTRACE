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
import { Network, Sparkles, Target, CheckCircle2, AlertCircle, ArrowRight, Play, Info, Layers } from 'lucide-react';
import { api } from '../api/client';
import { Skill } from '../types';

// Custom Node for React Flow
const SkillNodeComponent = ({ data }: { data: any }) => {
  const masteryPct = Math.round((data.mastery || 0) * 100);
  const isMastered = masteryPct >= 60;

  return (
    <div
      className={`min-w-[200px] max-w-[240px] p-3.5 rounded-xl border shadow-md transition-all cursor-pointer ${
        data.isRecommended
          ? 'bg-gradient-to-b from-indigo-50/90 to-white border-indigo-500 ring-2 ring-indigo-400/40 shadow-indigo-100'
          : data.isTarget
          ? 'bg-purple-50/50 border-purple-400'
          : isMastered
          ? 'bg-white border-emerald-300 shadow-emerald-50'
          : 'bg-white border-slate-200'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-indigo-600 !w-2.5 !h-2.5 !border-2 !border-white" />

      {/* Header tags */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          {data.domain}
        </span>

        {data.isRecommended ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse">
            <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
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
        ) : null}
      </div>

      {/* Title */}
      <div className="font-bold text-sm text-slate-900 mb-2 truncate">
        {data.label}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Mastery</span>
          <span className={isMastered ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
            {masteryPct}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all ${
              isMastered ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(masteryPct, 100)}%` }}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-indigo-600 !w-2.5 !h-2.5 !border-2 !border-white" />
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
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Prerequisite Knowledge Graph</h2>
            <p className="text-xs text-slate-500">
              Interactive topological directed acyclic graph (DAG) modeling prerequisite relationships.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-200" />
            <span className="text-slate-700 font-medium">Recommended</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-700 font-medium">Mastered (≥60%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-700 font-medium">Skill Gap</span>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* React Flow Container */}
        <div className="lg:col-span-2 h-[520px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
              <Network className="w-8 h-8 animate-pulse text-indigo-600 mb-2" />
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
              attributionPosition="bottom-left"
              className="bg-slate-50"
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#cbd5e1" />
              <Controls position="bottom-right" />
            </ReactFlow>
          )}

          {/* Quick Flow Hint */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-[11px] text-slate-600 flex items-center gap-2 pointer-events-none">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Click any skill node to inspect prerequisites & start practice</span>
          </div>
        </div>

        {/* Node Inspection Drawer */}
        <div className="h-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          {selectedSkill ? (
            <div className="space-y-4">
              
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                  {selectedSkill.domain}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedSkill.label}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedSkill.description || 'No description available for this skill.'}
                </p>
              </div>

              {/* Status & Mastery Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mastery Level:</span>
                  <span
                    className={`font-mono font-bold ${
                      Math.round((selectedSkill.mastery || 0) * 100) >= 60
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {Math.round((selectedSkill.mastery || 0) * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Prerequisite Readiness:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      selectedSkill.isReady ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {selectedSkill.isReady ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready to Learn
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        Prerequisites Weak
                      </>
                    )}
                  </span>
                </div>

                {selectedSkill.isTarget && (
                  <div className="text-[11px] text-purple-700 font-medium pt-1 border-t border-slate-200 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Target Milestone for Selected Goal
                  </div>
                )}
              </div>

              {/* Dependency Relationship Visualizer */}
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Graph Traversal Logic
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Directed edges represent strict dependencies: <code className="text-indigo-700 font-bold bg-indigo-50 px-1 rounded">A → B</code> means{' '}
                  <strong className="text-slate-800">B depends on A</strong>.
                </p>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Network className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              Select any skill node on the canvas to inspect its prerequisites.
            </div>
          )}

          {selectedSkill && (
            <button
              id={`btn-inspect-practice-${selectedSkill.id}`}
              onClick={() => onStartQuizForSkill(selectedSkill.id)}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Practice {selectedSkill.label} Quiz</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
