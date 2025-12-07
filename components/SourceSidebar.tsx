import React from 'react';
import { PanelLeftClose, Plus, FileText, Globe, Youtube, File, Loader2, CheckCircle2, AlertCircle, Trash2, PanelLeft } from 'lucide-react';
import { Source, SourceType, SourceStatus } from '../types';
import { Button, Checkbox, Tooltip } from './ui/Components';

interface SourceSidebarProps {
  sources: Source[];
  onToggleSource: (id: string) => void;
  onDeleteSource: (id: string) => void;
  onAddSource: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SourceIcon = ({ type }: { type: SourceType }) => {
  switch (type) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    case 'doc': return <File className="w-4 h-4 text-blue-500" />;
    case 'web': return <Globe className="w-4 h-4 text-emerald-500" />;
    case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
    default: return <File className="w-4 h-4 text-slate-500" />;
  }
};

const StatusIcon = ({ status }: { status: SourceStatus }) => {
  switch (status) {
    case 'processing': return <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />;
    case 'ready': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
  }
};

const SourceSidebar: React.FC<SourceSidebarProps> = ({
  sources,
  onToggleSource,
  onDeleteSource,
  onAddSource,
  isCollapsed,
  onToggleCollapse
}) => {
  // Stats
  const usedTokens = sources.reduce((acc, s) => acc + s.tokensUsed, 0);
  const totalLimit = 1000000;
  const percentage = (usedTokens / totalLimit) * 100;

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-slate-50 border-r border-slate-200 flex flex-col items-center py-4 space-y-4">
        <button onClick={onToggleCollapse} className="p-2 hover:bg-slate-200 rounded-md text-slate-600">
           <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-full h-px bg-slate-200" />
        {sources.map(s => (
          <Tooltip key={s.id} content={s.name}>
             <div className="relative">
                <SourceIcon type={s.type} />
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${s.status === 'ready' ? 'bg-green-500' : 'bg-slate-300'}`} />
             </div>
          </Tooltip>
        ))}
        <button onClick={onAddSource} className="p-2 hover:bg-slate-200 rounded-md text-primary-600 mt-auto">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[260px] h-full bg-slate-50 border-r border-slate-200 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 font-sans uppercase tracking-wider">
          NGUỒN TÀI LIỆU
        </span>
        <button onClick={onToggleCollapse} className="text-slate-400 hover:text-slate-600">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Add Source Button */}
      <div className="p-4 pb-2">
        <Button variant="dashed" className="w-full gap-2 text-sm" onClick={onAddSource}>
          <Plus className="w-4 h-4" />
          Thêm nguồn
        </Button>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {sources.length === 0 ? (
           <div className="text-center py-8 text-slate-400 text-xs">
             Chưa có tài liệu nào.<br/>Thêm nguồn để bắt đầu.
           </div>
        ) : (
          sources.map((source) => (
            <div 
              key={source.id}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 transition-colors relative"
            >
              <Checkbox 
                checked={source.isSelected} 
                onChange={() => onToggleSource(source.id)}
                className="flex-shrink-0"
              />
              
              <div className="flex-shrink-0">
                <SourceIcon type={source.type} />
              </div>

              <div className="flex-1 min-w-0">
                <Tooltip content={source.name}>
                  <p className="text-sm text-slate-700 truncate">{source.name}</p>
                </Tooltip>
              </div>

              <div className="flex-shrink-0">
                <div className="group-hover:hidden">
                  <StatusIcon status={source.status} />
                </div>
                <button 
                  onClick={() => onDeleteSource(source.id)}
                  className="hidden group-hover:block text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Stats */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Used Tokens</span>
          <span>{(usedTokens / 1000).toFixed(1)}k / {(totalLimit / 1000)}k</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-400 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SourceSidebar;
