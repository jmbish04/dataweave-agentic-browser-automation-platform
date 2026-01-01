import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, History, Activity, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { ScrapeWizard } from '@/components/scrape/ScrapeWizard';
import { LiveConsole } from '@/components/scrape/LiveConsole';
import { chatService } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';

type ViewState = 'dashboard' | 'wizard' | 'execution';

export function HomePage() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>();

  // FIX: Add session persistence using localStorage
  useEffect(() => {
    // Load from localStorage on mount
    const savedSessions = localStorage.getItem('dataweave_sessions');
    const savedActiveSession = localStorage.getItem('dataweave_active_session');

    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
      } catch (e) {
        console.error('Failed to parse saved sessions:', e);
      }
    }

    if (savedActiveSession) {
      setActiveSessionId(savedActiveSession);
    }
  }, []);

  useEffect(() => {
    const loadSessions = async () => {
      const res = await chatService.listSessions();
      if (res.success && res.data) {
        setSessions(res.data);
        // Save to localStorage
        localStorage.setItem('dataweave_sessions', JSON.stringify(res.data));
      }
    };
    loadSessions();
  }, [view]);

  // FIX: Save active session to localStorage whenever it changes
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('dataweave_active_session', activeSessionId);
    }
  }, [activeSessionId]);

  const handleStartAgent = async (config: any) => {
    const res = await chatService.createSession(config.intent.slice(0, 30) + '...', undefined, config.intent);
    if (res.success && res.data) {
      setActiveSessionId(res.data.sessionId);
      setView('execution');
      toast.success("Agent session started");
    } else {
      toast.error("Failed to initialize session");
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const res = await chatService.deleteSession(id);
    if (res.success) {
      const newSessions = sessions.filter(s => s.id !== id);
      setSessions(newSessions);
      // FIX: Update localStorage after deletion
      localStorage.setItem('dataweave_sessions', JSON.stringify(newSessions));
      if (activeSessionId === id) {
        localStorage.removeItem('dataweave_active_session');
      }
      toast.success("Session deleted");
    }
  };

  return (
    <AppLayout className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-10"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h1 className="text-4xl font-display font-bold tracking-tight">Command Center</h1>
                    <p className="text-muted-foreground text-lg">Orchestrate agentic browser automation at scale.</p>
                  </div>
                  <Button size="lg" className="btn-gradient shadow-lg" onClick={() => setView('wizard')}>
                    <Plus className="w-5 h-5 mr-2" /> New Extraction
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-2 border-orange-500/10">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Total Sessions</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">{sessions.length}</div>
                      <p className="text-xs text-muted-foreground font-mono">Active extraction sessions</p>
                   </Card>
                   <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-2">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Database className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Recent Activity</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">
                        {sessions.length > 0 ? new Date(Math.max(...sessions.map(s => new Date(s.lastActive).getTime()))).toLocaleDateString() : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">Last session activity</p>
                   </Card>
                   <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-2">
                      <div className="flex items-center gap-2 text-purple-500">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Agent Status</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">Ready</div>
                      <p className="text-xs text-muted-foreground font-mono">All systems operational</p>
                   </Card>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <History className="w-5 h-5 text-muted-foreground" /> Recent Sessions
                    </h2>
                  </div>
                  {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-muted/10 opacity-60">
                       <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                       <p className="text-lg font-medium">No sessions yet</p>
                       <p className="text-sm text-muted-foreground">Start your first automated scrape to see it here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {sessions.map((s) => (
                        <Card key={s.id} onClick={() => { setActiveSessionId(s.id); setView('execution'); }} className="p-4 flex items-center justify-between hover:bg-accent/50 cursor-pointer transition-colors group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                 <Database className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                 <p className="font-semibold group-hover:text-orange-500 transition-colors">{s.title}</p>
                                 <p className="text-xs text-muted-foreground font-mono">{new Date(s.lastActive).toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                Completed
                              </Badge>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => handleDeleteSession(e, s.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">View Data</Button>
                           </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {view === 'wizard' && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="py-4"
              >
                <div className="mb-8">
                  <Button variant="ghost" onClick={() => setView('dashboard')} className="mb-4">
                    ← Back to Dashboard
                  </Button>
                </div>
                <ScrapeWizard onStart={handleStartAgent} />
              </motion.div>
            )}
            {view === 'execution' && (
              <motion.div
                key="execution"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background flex flex-col"
              >
                <div className="h-14 border-b bg-card flex items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <Database className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">Live Execution Session</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setView('dashboard')}>
                    Exit Console
                  </Button>
                </div>
                <div className="flex-1">
                  <LiveConsole sessionId={activeSessionId} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <footer className="mt-auto py-10 border-t border-border/50 text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-500/5 px-4 py-2 rounded-full border border-amber-500/20 max-w-2xl">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p>
                  <strong>Note:</strong> There is a limit on AI requests across all user apps in a given time period. Please use tokens responsibly.
                </p>
             </div>
             <p className="text-sm text-muted-foreground font-mono">
                Powered by Cloudflare Workers & Stagehand
             </p>
          </div>
        </footer>
      </div>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}