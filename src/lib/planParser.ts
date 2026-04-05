import type { GeneratedPlan } from '@/types/workout';

/**
 * Strips markdown code fences from a string. Models often wrap JSON in ```json blocks.
 */
function stripMarkdown(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
}

/**
 * Attempts to extract JSON from a string by finding the outermost { ... } block.
 */
function extractJson(raw: string): string | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
}

/**
 * Parses a raw AI response string into a GeneratedPlan.
 * Returns null on any parsing failure.
 */
export function parsePlanResponse(raw: string): GeneratedPlan | null {
  if (!raw || typeof raw !== 'string') return null;

  // Attempt 1: strip markdown fences + direct parse
  try {
    const stripped = stripMarkdown(raw);
    const parsed = JSON.parse(stripped);
    return parsed as GeneratedPlan;
  } catch {
    // fall through
  }

  // Attempt 2: extract JSON block from arbitrary text
  try {
    const extracted = extractJson(raw);
    if (extracted) {
      const parsed = JSON.parse(extracted);
      return parsed as GeneratedPlan;
    }
  } catch {
    // fall through
  }

  console.error('[planParser] Failed to parse AI response:', raw.slice(0, 500));
  return null;
}
