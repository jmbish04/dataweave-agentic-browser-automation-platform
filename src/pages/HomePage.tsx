import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, History, Activity, Sparkles, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { ScrapeWizard } from '@/components/scrape/ScrapeWizard';
import { LiveConsole } from '@/components/scrape/LiveConsole';
type ViewState = 'dashboard' | 'wizard' | 'execution';
export function HomePage() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [sessions, setSessions] = useState<any[]>([]);
  const handleStartAgent = (config: any) => {
    setView('execution');
    setSessions(prev => [{
      id: crypto.randomUUID(),
      title: config.intent.slice(0, 30) + '...',
      status: 'active',
      timestamp: Date.now()
    }, ...prev]);
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
                        <span className="text-sm font-semibold uppercase tracking-wider">Success Rate</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">98.2%</div>
                      <p className="text-xs text-muted-foreground font-mono">Based on last 50 runs</p>
                   </Card>
                   <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-2">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Database className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Rows Extracted</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">12,402</div>
                      <p className="text-xs text-muted-foreground font-mono">+12% from last week</p>
                   </Card>
                   <Card className="p-6 bg-card/50 backdrop-blur-sm space-y-2">
                      <div className="flex items-center gap-2 text-purple-500">
                        <History className="w-4 h-4" />
                        <span className="text-sm font-semibold uppercase tracking-wider">Credits Remaining</span>
                      </div>
                      <div className="text-3xl font-bold font-mono">840</div>
                      <p className="text-xs text-muted-foreground font-mono">Refills in 4 days</p>
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
                        <Card key={s.id} className="p-4 flex items-center justify-between hover:bg-accent/50 cursor-pointer transition-colors group">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                 <Database className="w-5 h-5 text-orange-500" />
                              </div>
                              <div>
                                 <p className="font-semibold group-hover:text-orange-500 transition-colors">{s.title}</p>
                                 <p className="text-xs text-muted-foreground font-mono">{new Date(s.timestamp).toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <Badge variant={s.status === 'active' ? 'default' : 'secondary'} className={s.status === 'active' ? 'bg-orange-500' : ''}>
                                {s.status}
                              </Badge>
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
                  <LiveConsole />
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