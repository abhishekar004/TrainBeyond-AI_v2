import { supabase } from '@/lib/supabase';
import { computeBmi } from '@/lib/bmi';
import type { BmiHistoryPoint, DbProfileExtended } from '@/types/db';

export type BiometricsPayload = {
  height_cm?: number | null;
  weight_kg?: number | null;
  age?: number | null;
  sex?: string | null;
  activity_level?: string | null;
};

export type FullProfilePayload = BiometricsPayload & {
  full_name?: string | null;
  avatar_url?: string | null;
  fitness_goal?: string | null;
  difficulty_level?: string | null;
  bio?: string | null;
  equipment_preference?: string | null;
  weekly_workout_days?: number | null;
};

function mergeBmiHistory(
  existing: BmiHistoryPoint[] | null | undefined,
  weightKg: number | null | undefined,
  heightCm: number | null | undefined,
  maxPoints = 16
): BmiHistoryPoint[] {
  if (weightKg == null || heightCm == null || weightKg <= 0 || heightCm <= 0) {
    return Array.isArray(existing) ? existing : [];
  }
  const bmi = computeBmi(weightKg, heightCm);
  if (bmi <= 0) return Array.isArray(existing) ? existing : [];

  const list = [...(existing ?? [])];
  const last = list[list.length - 1];
  const changed =
    !last ||
    Math.abs(last.bmi - bmi) >= 0.05 ||
    last.weight_kg !== weightKg ||
    last.height_cm !== heightCm;

  if (changed) {
    list.push({
      at: new Date().toISOString(),
      bmi,
      weight_kg: weightKg,
      height_cm: heightCm,
    });
  }

  return list.slice(-maxPoints);
}

export async function updateBiometrics(userId: string, payload: BiometricsPayload): Promise<void> {
  const clean = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>;

  const { error } = await supabase.from('profiles').update(clean).eq('id', userId);

  if (error) {
    throw new Error(`Failed to save biometrics: ${error.message}`);
  }
}

export async function fetchProfileExtended(userId: string): Promise<DbProfileExtended | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  const row = data as Record<string, unknown>;
  const bh = row.bmi_history;
  return {
    ...(row as unknown as DbProfileExtended),
    bmi_history: Array.isArray(bh) ? (bh as BmiHistoryPoint[]) : [],
  };
}

/** Persist extended profile; appends BMI history when height/weight change. */
export async function saveFullProfile(userId: string, payload: FullProfilePayload): Promise<void> {
  const current = await fetchProfileExtended(userId);
  const height = payload.height_cm !== undefined ? payload.height_cm : current?.height_cm;
  const weight = payload.weight_kg !== undefined ? payload.weight_kg : current?.weight_kg;

  const bmi_history = mergeBmiHistory(current?.bmi_history ?? [], weight ?? null, height ?? null);

  const body: Record<string, unknown> = {
    ...Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    ),
  };

  if (height != null && weight != null && height > 0 && weight > 0) {
    body.bmi_history = bmi_history;
  }

  const { error } = await supabase.from('profiles').update(body).eq('id', userId);
  if (!error) return;

  const msg = error.message.toLowerCase();
  const missingOptionalCol =
    msg.includes('weekly_workout_days') ||
    msg.includes('equipment_preference') ||
    (msg.includes('schema cache') &&
      (Object.prototype.hasOwnProperty.call(body, 'weekly_workout_days') ||
        Object.prototype.hasOwnProperty.call(body, 'equipment_preference')));

  if (missingOptionalCol) {
    const rest = { ...body };
    delete rest.weekly_workout_days;
    delete rest.equipment_preference;
    const { error: err2 } = await supabase.from('profiles').update(rest).eq('id', userId);
    if (!err2) {
      console.warn(
        '[TrainBeyond] Saved profile without equipment_preference / weekly_workout_days — add columns in Supabase (see supabase/HOTFIX_profiles_weekly_equipment.sql), then save again.'
      );
      return;
    }
    throw new Error(err2.message);
  }

  throw new Error(error.message);
}

/** Upload avatar to Storage bucket `avatars` at `{userId}/avatar.ext`. Returns public URL. */
export async function uploadAvatarFile(userId: string, file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: true,
    contentType: file.type || 'image/jpeg',
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
