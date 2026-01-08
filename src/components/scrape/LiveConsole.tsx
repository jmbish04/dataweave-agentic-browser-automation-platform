import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Globe, CheckCircle2, Loader2, Info, Brain } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { chatService } from '@/lib/chat';
import type { AgentLog } from '../../../worker/types';

interface LiveConsoleProps {
  sessionId?: string;
}

export function LiveConsole({ sessionId }: LiveConsoleProps) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!sessionId) return;

    // Initial log to show immediate feedback
    setLogs([{
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'Connecting to agent...'
    }]);
    setConnectionError(null);

    const pollStatus = async () => {
      const response = await chatService.getStatus(sessionId);
      if (response.success && response.data) {
        setConnectionError(null);
        if (response.data.logs && response.data.logs.length > 0) {
          setLogs(response.data.logs);
        }
      } else if (response.error) {
        setConnectionError(response.error);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial fetch

    return () => clearInterval(interval);
  }, [sessionId]);

  const getIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'thought': return <Brain className="w-3.5 h-3.5 text-orange-400" />;
      case 'error': return <Info className="w-3.5 h-3.5 text-destructive" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-full bg-zinc-950 text-zinc-300 font-mono text-sm overflow-hidden">
      <div className="lg:col-span-2 flex flex-col border-r border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-500" />
            <span className="text-xs uppercase tracking-widest font-bold">Execution Stream {sessionId && `(${sessionId.slice(0, 8)})`}</span>
          </div>
          {connectionError ? (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
              Connection Error
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 animate-pulse">
              Agent Active
            </Badge>
          )}
        </div>
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-3">
            {connectionError && (
              <div className="flex gap-3 text-red-400">
                <span className="text-zinc-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                <span className="shrink-0 mt-0.5"><Info className="w-3.5 h-3.5 text-red-500" /></span>
                <span>Connection issue: {connectionError}. Retrying...</span>
              </div>
            )}
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                <span className="shrink-0 mt-0.5">{getIcon(log.level)}</span>
                <span className={log.level === 'thought' ? 'text-orange-200/80 italic' : ''}>
                  {log.message}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2 text-zinc-500 italic">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Awaiting next event...</span>
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="hidden lg:flex flex-col bg-zinc-900/50">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <Globe className="w-4 h-4 text-zinc-400" />
          <span className="text-xs uppercase tracking-widest font-bold">Viewport Snapshot</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-full aspect-video rounded-md border border-zinc-800 bg-zinc-950 flex items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
             <div className="text-zinc-600 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                <span>Synchronizing DOM...</span>
             </div>
          </div>
          <p className="text-xs text-zinc-500 max-w-[200px]">
            Real-time interactive snapshot of the headless browser instance.
          </p>
        </div>
      </div>
    </div>
  );
}