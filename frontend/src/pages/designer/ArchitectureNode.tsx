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
  client: { bg: 'bg-[#06B6D4]/15 dark:bg-[#06B6D4]/10', border: 'border-[#06B6D4]/40', text: 'text-cyan-700 dark:text-[#06B6D4]', icon: Smartphone },
  cdn: { bg: 'bg-[#6366F1]/15 dark:bg-[#6366F1]/10', border: 'border-[#6366F1]/40', text: 'text-indigo-700 dark:text-[#6366F1]', icon: Globe },
  load_balancer: { bg: 'bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/10', border: 'border-[#8B5CF6]/40', text: 'text-purple-700 dark:text-[#8B5CF6]', icon: Network },
  compute: { bg: 'bg-[#3B82F6]/15 dark:bg-[#3B82F6]/10', border: 'border-[#3B82F6]/40', text: 'text-blue-700 dark:text-[#3B82F6]', icon: Cpu },
  cache: { bg: 'bg-[#10B981]/15 dark:bg-[#10B981]/10', border: 'border-[#10B981]/40', text: 'text-emerald-700 dark:text-[#10B981]', icon: Layers },
  messaging: { bg: 'bg-[#F59E0B]/15 dark:bg-[#F59E0B]/10', border: 'border-[#F59E0B]/40', text: 'text-amber-700 dark:text-[#F59E0B]', icon: Radio },
  database: { bg: 'bg-[#F43F5E]/15 dark:bg-[#F43F5E]/10', border: 'border-[#F43F5E]/40', text: 'text-rose-700 dark:text-[#F43F5E]', icon: Database },
  storage: { bg: 'bg-[#F97316]/15 dark:bg-[#F97316]/10', border: 'border-[#F97316]/40', text: 'text-orange-700 dark:text-[#F97316]', icon: HardDrive },
  security: { bg: 'bg-[#EF4444]/15 dark:bg-[#EF4444]/10', border: 'border-[#EF4444]/40', text: 'text-red-700 dark:text-[#EF4444]', icon: ShieldCheck },
};

export const ArchitectureNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ArchitectureNodeData;
  const category = nodeData.category || 'compute';
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.compute;
  const IconComponent = style.icon;

  const isWalkthrough = nodeData.isActiveWalkthrough;
  const isTraffic = nodeData.isSimulatingTraffic;

  return (
    <div
      className={`relative px-2.5 py-1.5 rounded-lg w-[125px] min-w-[115px] max-w-[135px] bg-white dark:bg-[#151C2E] border transition-all shadow-md backdrop-blur-md select-none cursor-pointer ${
        isWalkthrough
          ? 'border-amber-400 shadow-md shadow-amber-400/30 ring-2 ring-amber-400/60 z-30'
          : selected 
            ? 'border-[#6366F1] shadow-indigo-500/30 ring-2 ring-[#6366F1]' 
            : isTraffic
              ? 'border-cyan-400 dark:border-cyan-400/70 shadow-sm shadow-cyan-400/20'
              : `${style.border} hover:border-slate-400 dark:hover:border-slate-500`
      }`}
    >
      {/* Walkthrough Step Badge */}
      {isWalkthrough && nodeData.stepBadge && (
        <div className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[8px] shadow-sm flex items-center gap-0.5">
          <Play className="w-2 h-2 fill-current" />
          <span>Step {nodeData.stepBadge}</span>
        </div>
      )}

      {/* Traffic Pulse Badge */}
      {isTraffic && !isWalkthrough && (
        <div className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </div>
      )}

      {/* React Flow Handles - Compact 6px dots */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-2 !h-2 !bg-[#6366F1] !border !border-white dark:!border-[#0B1020]" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-[#6366F1] !border !border-white dark:!border-[#0B1020]" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-[#06B6D4] !border !border-white dark:!border-[#0B1020]" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-2 !h-2 !bg-[#06B6D4] !border !border-white dark:!border-[#0B1020]" 
      />

      {/* Main Node Card Body: Icon + Title + Tech + Status */}
      <div className="flex items-center gap-1.5">
        <div 
          className={`p-1 rounded-md shrink-0 ${style.bg} ${style.text}`}
          title={category.replace('_', ' ')}
        >
          <IconComponent className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div 
            className="font-semibold text-[11px] text-slate-900 dark:text-white leading-tight truncate"
            title={nodeData.label}
          >
            {nodeData.label}
          </div>
          <div 
            className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5"
            title={nodeData.techStack || category}
          >
            {nodeData.techStack || category.replace('_', ' ')}
          </div>
        </div>

        {nodeData.hasSpof ? (
          <span title="Single Point of Failure" className="shrink-0 flex items-center">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
          </span>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Healthy" />
        )}
      </div>

      {/* Micro-metric telemetry bar */}
      {(nodeData.qps || isTraffic) && (
        <div className="mt-1 pt-1 border-t border-slate-100 dark:border-[#1E293B]/70 flex items-center justify-between text-[8px] text-slate-500 dark:text-slate-400 font-mono">
          <span className="text-cyan-600 dark:text-cyan-400 truncate">{nodeData.qps || '35k QPS'}</span>
          {nodeData.replicas && <span className="text-slate-400 truncate max-w-[50px]">{nodeData.replicas}</span>}
        </div>
      )}
    </div>
  );
};

export default memo(ArchitectureNode);
