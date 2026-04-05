import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Loader2, Trash2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCoachHistory, sendCoachMessage, clearCoachHistory } from '@/services/coach.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const QUICK_PROMPTS = [
  { label: 'Tired today', text: "I'm feeling tired — how should I adjust today's training?" },
  { label: 'Diet help', text: 'Give me one high-protein Indian meal idea that fits a busy workday.' },
  { label: 'Motivation', text: "I'm losing motivation. What’s a small win I can chase this week?" },
  { label: 'Leg day', text: 'Outline a smart leg day warmup and top 3 compound lifts with rep ranges.' },
];

export function Coach() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['coach', user?.id],
    queryFn: () => fetchCoachHistory(user!.id),
    enabled: Boolean(user),
  });

  const sendMut = useMutation({
    mutationFn: async (text: string) => {
      if (!user) throw new Error('Auth');
      return sendCoachMessage(user.id, text);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coach', user?.id] });
      setInput('');
    },
    onError: () => {
      toast.error('Coach hit a snag. Your message is saved; try again in a moment.');
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, sendMut.isPending]);

  const onClear = async () => {
    if (!user) return;
    await clearCoachHistory(user.id);
    qc.invalidateQueries({ queryKey: ['coach', user.id] });
    toast.success('Chat cleared');
  };

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-accent-primary" />
            AI Coach
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Multi-model OpenRouter with fallback — history stored in Supabase.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <Button
              key={p.label}
              type="button"
              variant="secondary"
              size="sm"
              disabled={sendMut.isPending}
              onClick={() => sendMut.mutate(p.text)}
            >
              {p.label}
            </Button>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="text-accent-danger">
            <Trash2 className="w-4 h-4" />
            Clear history
          </Button>
        </div>

        <Card className="min-h-[420px] flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg">Conversation</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-4 min-h-0">
            <ScrollArea className="flex-1 h-[360px] pr-3">
              {isLoading ? (
                <p className="text-text-secondary text-sm">Loading history…</p>
              ) : (
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-text-secondary text-sm">Ask anything training- or nutrition-related.</p>
                  )}
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-accent-primary text-white'
                            : 'bg-white/5 border border-border text-text-primary'
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {sendMut.isPending && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl px-4 py-3 bg-white/5 border border-border flex items-center gap-2 text-text-secondary text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Coach is typing…
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </ScrollArea>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const t = input.trim();
                if (!t || sendMut.isPending) return;
                sendMut.mutate(t);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message your coach…"
                className="flex-1 rounded-xl bg-white/5 border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-primary/50"
              />
              <Button type="submit" disabled={sendMut.isPending || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
