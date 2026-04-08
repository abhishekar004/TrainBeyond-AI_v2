import { supabase } from '@/lib/supabase';
import type { LoginCredentials, SignupCredentials } from '@/types/auth';

export async function signUp({ email, password, full_name }: SignupCredentials) {
  const redirectTo = window.location.origin;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signIn({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar_url?: string }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Keeps JWT user_metadata in sync with profiles.full_name (optional UX). */
export async function syncAuthDisplayName(fullName: string) {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  if (error) throw new Error(error.message);
}
