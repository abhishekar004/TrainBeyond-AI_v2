import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Loader2, Trash2, MessageCircle, Dumbbell, Apple, Heart, Zap, HelpCircle, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCoachHistory, sendCoachMessage, clearCoachHistory } from '@/services/coach.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const QUICK_PROMPTS = [
  { label: 'Tired today', text: "I'm feeling tired — how should I adjust today's training?" },
  { label: 'Diet help', text: 'Give me one high-protein Indian meal idea that fits a busy workday.' },
  { label: 'Motivation', text: "I'm losing motivation. What's a small win I can chase this week?" },
  { label: 'Leg day', text: 'Outline a smart leg day warmup and top 3 compound lifts with rep ranges.' },
];

const CAPABILITIES = [
  { icon: Dumbbell, label: 'Workout questions', color: 'text-accent-primary' },
  { icon: HelpCircle, label: 'Exercise substitutions', color: 'text-violet-400' },
  { icon: Heart, label: 'Recovery advice', color: 'text-pink-400' },
  { icon: Apple, label: 'Diet guidance', color: 'text-emerald-400' },
  { icon: Zap, label: 'Motivation', color: 'text-amber-400' },
];

const STARTER_CARDS = [
  { text: "What should I train if I'm sore?", icon: '💪' },
  { text: 'Help me eat more protein', icon: '🥩' },
  { text: 'Can you simplify my workout?', icon: '✨' },
  { text: 'What should I do on rest day?', icon: '🧘' },
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

        {/* Intro Panel */}
        <div className="rounded-2xl border border-accent-primary/20 bg-gradient-to-br from-accent-primary/[0.06] via-bg-card to-bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary mb-3">
            Your AI Coach can help with
          </p>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map((cap) => (
              <span
                key={cap.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-border text-text-primary"
              >
                <cap.icon className={`w-3.5 h-3.5 ${cap.color}`} />
                {cap.label}
              </span>
            ))}
          </div>
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
                    /* Premium empty chat state */
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="relative mb-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/20 flex items-center justify-center shadow-glow-violet">
                          <Bot className="w-10 h-10 text-accent-primary" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-secondary flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                        Hey! I'm your AI Coach
                      </h3>
                      <p className="text-sm text-text-secondary max-w-xs mb-6">
                        Ask me anything about training, nutrition, or recovery. I'm here to help you train smarter.
                      </p>

                      {/* Starter suggestion cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                        {STARTER_CARDS.map((card) => (
                          <button
                            key={card.text}
                            type="button"
                            disabled={sendMut.isPending}
                            onClick={() => sendMut.mutate(card.text)}
                            className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-white/[0.03] text-left text-sm text-text-primary hover:border-accent-primary/40 hover:bg-accent-primary/5 hover:shadow-glow-violet/20 transition-all duration-200 group"
                          >
                            <span className="text-lg">{card.icon}</span>
                            <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                              {card.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
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
