import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Add Loader2 to the import list below
import { Send, Settings2, Code, Terminal, ChevronRight, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { chatService } from '@/lib/chat';
import { SchemaEditor } from './SchemaEditor';
import { CookieConfig } from './CookieConfig';
import { MOCK_SCHEMA } from '@/lib/mock-data';

interface ScrapeWizardProps {
  onStart: (config: any) => void;
}

export function ScrapeWizard({ onStart }: ScrapeWizardProps) {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState('');
  const [schema, setSchema] = useState(JSON.stringify(MOCK_SCHEMA, null, 2));
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeIntent = async () => {
    if (!intent.trim()) return;
    setIsAnalyzing(true);
    try {
      const prompt = `Based on this user intent: "${intent}", generate a valid JSON schema (using Zod format compatible JSON) that describes the structured data to be extracted. Return ONLY a valid JSON schema inside a markdown code block. Example: \`\`\`json { ... } \`\`\``;
      const response = await chatService.sendMessage(prompt);
      
      if (response.success && response.data?.messages) {
        const assistantMsg = response.data.messages[response.data.messages.length - 1].content;
        const jsonMatch = assistantMsg.match(/```json\n([\s\S]*?)\n```/) || assistantMsg.match(/```\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          setSchema(jsonMatch[1]);
          setStep(2);
        } else {
          setStep(2); // Fallback to mock but proceed
        }
      } else {
        setStep(2);
      }
    } catch (error) {
      toast.error("Failed to analyze intent automatically. Using template schema.");
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">What do you want to extract?</h2>
              <p className="text-muted-foreground">Describe your intent in natural language. Our agent will figure out the navigation.</p>
            </div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/10">
              <div className="space-y-4">
                <Textarea 
                  placeholder="e.g., Go to Amazon and find the top 5 trending laptops under $1000 with their ratings and prices."
                  className="min-h-[150px] text-lg bg-transparent border-none focus-visible:ring-0 resize-none p-0"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                />
                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button onClick={analyzeIntent} disabled={!intent.trim() || isAnalyzing} className="btn-gradient">
                    {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Analyze Intent {!isAnalyzing && <Send className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Product Prices", "News Articles", "Job Postings", "Real Estate Logs"].map((hint) => (
                <button 
                  key={hint}
                  onClick={() => setIntent(`Extract ${hint.toLowerCase()} from...`)}
                  className="px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-xs transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-6 h-[500px]">
              <div className="flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-orange-500" /> AI Proposal
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    I've generated a schema based on your request. You can refine the field names or types on the right.
                  </p>
                </div>
                <Card className="flex-1 p-4 bg-muted/30 border-dashed overflow-auto">
                   <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-background border text-sm">
                        "I will navigate to the search results page, identify the container elements for laptops, and map them to your schema."
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm">Advanced Settings (Auth)</AccordionTrigger>
                          <AccordionContent>
                            <CookieConfig />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                   </div>
                </Card>
              </div>
              <div className="flex-[1.5] rounded-xl overflow-hidden border shadow-2xl">
                <SchemaEditor value={schema} onChange={(v) => v && setSchema(v)} />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => onStart({ intent, schema })} size="lg" className="btn-gradient px-8">
                Initialize Agent <Terminal className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
