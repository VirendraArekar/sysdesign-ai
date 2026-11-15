import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Server, 
  Database, 
  Cpu, 
  Layers, 
  HardDrive, 
  Radio, 
  Network, 
  Globe, 
  Smartphone, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Play
} from 'lucide-react';

export interface ArchitectureNodeData {
  label: string;
  category?: 'client' | 'cdn' | 'load_balancer' | 'compute' | 'cache' | 'messaging' | 'database' | 'storage' | 'security';
  techStack?: string;
  qps?: string;
  replicas?: string;
  notes?: string;
  hasSpof?: boolean;
  isSimulatingTraffic?: boolean;
  isActiveWalkthrough?: boolean;
  stepBadge?: number;
  latency?: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; icon: React.ElementType }> = {
  client: { bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/40', text: 'text-[#06B6D4]', icon: Smartphone },
  cdn: { bg: 'bg-[#6366F1]/10', border: 'border-[#6366F1]/40', text: 'text-[#6366F1]', icon: Globe },
  load_balancer: { bg: 'bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/40', text: 'text-[#8B5CF6]', icon: Network },
  compute: { bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/40', text: 'text-[#3B82F6]', icon: Cpu },
  cache: { bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/40', text: 'text-[#10B981]', icon: Layers },
  messaging: { bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/40', text: 'text-[#F59E0B]', icon: Radio },
  database: { bg: 'bg-[#F43F5E]/10', border: 'border-[#F43F5E]/40', text: 'text-[#F43F5E]', icon: Database },
  storage: { bg: 'bg-[#F97316]/10', border: 'border-[#F97316]/40', text: 'text-[#F97316]', icon: HardDrive },
  security: { bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/40', text: 'text-[#EF4444]', icon: ShieldCheck },
};

export const ArchitectureNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ArchitectureNodeData;
  const category = nodeData.category || 'compute';
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.compute;
  const IconComponent = style.icon;

  const isWalkthrough = nodeData.isActiveWalkthrough;
  const isTraffic = nodeData.isSimulatingTraffic;

  return (
    <div className={`relative px-4 py-3 rounded-xl min-w-[210px] bg-[#151C2E] border-2 transition-all shadow-xl backdrop-blur-md ${
      isWalkthrough
        ? 'border-amber-400 shadow-2xl shadow-amber-400/50 ring-4 ring-amber-400/60 scale-105 z-30'
        : selected 
          ? 'border-[#6366F1] shadow-[#6366F1]/25 ring-2 ring-[#6366F1]/30' 
          : isTraffic
            ? 'border-cyan-400/80 shadow-lg shadow-cyan-400/25 ring-2 ring-cyan-400/30'
            : `${style.border} hover:border-slate-500`
    }`}>
      {/* Walkthrough Step Badge */}
      {isWalkthrough && nodeData.stepBadge && (
        <div className="absolute -top-3.5 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[11px] shadow-lg flex items-center gap-1 animate-bounce">
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Step {nodeData.stepBadge}</span>
        </div>
      )}

      {/* Traffic Pulse Badge */}
      {isTraffic && !isWalkthrough && (
        <div className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-[9px] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Active</span>
        </div>
      )}

      {/* React Flow Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-[#6366F1] !border-2 !border-[#0B1020]" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-[#6366F1] !border-2 !border-[#0B1020]" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-[#06B6D4] !border-2 !border-[#0B1020]" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-[#06B6D4] !border-2 !border-[#0B1020]" 
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1E293B]">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-lg ${style.bg} ${style.text}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            {category.replace('_', ' ')}
          </span>
        </div>

        {nodeData.hasSpof ? (
          <span title="Single Point of Failure Warning" className="text-amber-400 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          </span>
        ) : (
          <span className="text-emerald-400 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {/* Label & Tech Stack */}
      <div>
        <div className="font-semibold text-sm text-white tracking-tight leading-snug">
          {nodeData.label}
        </div>
        {nodeData.techStack && (
          <div className="text-xs text-slate-400 mt-0.5 truncate">
            {nodeData.techStack}
          </div>
        )}
      </div>

      {/* Metrics Footer */}
      {(nodeData.qps || nodeData.replicas || isTraffic) && (
        <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-[#1E293B]/70 text-[10px] text-slate-300">
          {isTraffic ? (
            <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 font-mono text-cyan-300 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              {nodeData.qps || '35k QPS'}
            </span>
          ) : (
            nodeData.qps && (
              <span className="px-1.5 py-0.5 rounded bg-[#1E293B] font-mono text-[#06B6D4]">
                {nodeData.qps}
              </span>
            )
          )}
          {nodeData.replicas && (
            <span className="px-1.5 py-0.5 rounded bg-[#1E293B] font-mono text-[#A78BFA]">
              {nodeData.replicas}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(ArchitectureNode);
