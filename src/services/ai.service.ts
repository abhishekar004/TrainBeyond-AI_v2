import type { WorkoutFormData, GeneratedPlan } from '@/types/workout';
import { buildWorkoutPrompt } from '@/lib/promptEngine';
import { parsePlanResponse } from '@/lib/planParser';
import { validatePlan } from '@/lib/planValidator';
import { getFallbackPlan } from '@/lib/fallbackPlans';
import { supabase } from '@/lib/supabase';
import {
  GROQ_BASE_URL,
  GROQ_MODEL_CHAIN,
  OPENROUTER_MODEL_CHAIN,
  OPENROUTER_BASE_URL,
} from '@/lib/constants';

export type GenerateWorkoutPlanResult = {
  plan: GeneratedPlan;
  /** e.g. `groq:llama-3.3-70b-versatile` or `fallback:static` */
  modelUsed: string;
};

function extractChatContent(data: unknown): string {
  const content = (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0]?.message
    ?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('No content in API response');
  }
  return content;
}

async function callGroq(model: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key || typeof key !== 'string') {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch(GROQ_BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return extractChatContent(data);
}

async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'TrainBeyond-AI',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  return extractChatContent(data);
}

async function logGeneration(
  userId: string,
  requestPayload: object,
  responseStatus: string,
  modelUsed: string,
  errorMessage?: string
): Promise<void> {
  try {
    await supabase.from('generation_logs').insert({
      user_id: userId,
      request_payload: requestPayload,
      response_status: responseStatus,
      model_used: modelUsed,
      error_message: errorMessage ?? null,
    });
  } catch (err) {
    console.warn('[ai.service] Failed to log generation:', err);
  }
}

type Attempt = { label: string; run: () => Promise<string> };

function buildAttempts(systemPrompt: string, userPrompt: string): Attempt[] {
  const attempts: Attempt[] = [];
  const groqKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

  if (groqKey) {
    for (const model of GROQ_MODEL_CHAIN) {
      attempts.push({
        label: `groq:${model}`,
        run: () => callGroq(model, systemPrompt, userPrompt),
      });
    }
  }

  for (const model of OPENROUTER_MODEL_CHAIN) {
    attempts.push({
      label: `openrouter:${model}`,
      run: () => callOpenRouter(model, systemPrompt, userPrompt),
    });
  }

  return attempts;
}

export async function generateWorkoutPlan(
  form: WorkoutFormData,
  userId: string
): Promise<GenerateWorkoutPlanResult> {
  const { systemPrompt, userPrompt } = buildWorkoutPrompt(form);
  const requestPayload = { form, systemPrompt: systemPrompt.slice(0, 200) };

  const attempts = buildAttempts(systemPrompt, userPrompt);

  if (attempts.length === 0) {
    console.warn('[ai.service] No API attempts configured (add VITE_GROQ_API_KEY or VITE_OPENROUTER_API_KEY).');
    await logGeneration(userId, requestPayload, 'error', 'none', 'No LLM API keys configured');
    return { plan: getFallbackPlan(form), modelUsed: 'fallback:static' };
  }

  for (let i = 0; i < attempts.length; i++) {
    const { label, run } = attempts[i]!;
    try {
      console.log(`[ai.service] Attempt ${i + 1}/${attempts.length}: ${label}`);
      const raw = await run();
      const parsed = parsePlanResponse(raw);

      if (!parsed) {
        throw new Error('Failed to parse AI response as JSON');
      }

      if (!validatePlan(parsed)) {
        throw new Error('AI response failed schema validation');
      }

      await logGeneration(userId, requestPayload, 'success', label);
      return { plan: parsed, modelUsed: label };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[ai.service] Attempt ${i + 1} (${label}) failed:`, errorMsg);
      await logGeneration(userId, requestPayload, 'error', label, errorMsg);

      if (i < attempts.length - 1) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }

  console.warn('[ai.service] All attempts failed. Using fallback plan.');
  await logGeneration(userId, requestPayload, 'fallback', 'fallback:static', 'All LLM attempts failed');
  return { plan: getFallbackPlan(form), modelUsed: 'fallback:static' };
}
