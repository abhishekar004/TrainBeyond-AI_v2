import { supabase } from '@/lib/supabase';
import type { DbCoachMessage } from '@/types/db';
import { OPENROUTER_MODEL_CHAIN, OPENROUTER_BASE_URL } from '@/lib/constants';

const TABLE = 'coach_messages';

const SYSTEM_PROMPT = `You are TrainBeyond AI Coach: concise, motivating, practical fitness guidance.
Keep answers under 180 words unless the user asks for detail. No medical diagnosis; suggest consulting professionals for pain or injury.
The user may ask about diet, tiredness, motivation, or specific workouts. Be supportive and specific.`;

async function callOpenRouterChat(
  model: string,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      'X-Title': 'TrainBeyond-AI Coach',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.75,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const t = await response.text();
    throw new Error(`Coach API ${response.status}: ${t}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('No coach reply');
  }
  return content;
}

export async function fetchCoachHistory(userId: string, limit = 40): Promise<DbCoachMessage[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[coach] history:', error.message);
    return [];
  }
  const rows = (data ?? []) as DbCoachMessage[];
  return rows.slice().reverse();
}

async function insertMessage(
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  modelUsed?: string
): Promise<void> {
  const { error } = await supabase.from(TABLE).insert({
    user_id: userId,
    role,
    content,
    model_used: modelUsed ?? null,
  });
  if (error) console.warn('[coach] insert:', error.message);
}

/** Send user text; stores user + assistant messages. Tries primary model twice then fallback. */
export async function sendCoachMessage(userId: string, text: string): Promise<string> {
  await insertMessage(userId, 'user', text);

  const history = await fetchCoachHistory(userId, 30);
  const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const models = [...OPENROUTER_MODEL_CHAIN];
  let lastErr = 'AI unavailable';

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const reply = await callOpenRouterChat(model, apiMessages);
      await insertMessage(userId, 'assistant', reply, model);
      return reply;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      console.warn('[coach] attempt failed', model, lastErr);
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  const fallback =
    "I'm having trouble reaching the AI right now. Try again in a moment — meanwhile: hydrate, sleep 7–8h, and pick one light 20‑minute movement session today.";
  await insertMessage(userId, 'assistant', fallback, 'local-fallback');
  return fallback;
}

export async function clearCoachHistory(userId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('user_id', userId);
  if (error) console.warn('[coach] clear:', error.message);
}
