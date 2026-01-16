import { createClient } from '@supabase/supabase-js';

const TABLE = 'portfolio_data';
const ROW_ID = 'default';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const enabled = Boolean(supabaseUrl && supabaseAnonKey);

const client = enabled ? createClient(supabaseUrl, supabaseAnonKey) : null;

console.log('[Supabase]', enabled ? 'ENABLED' : 'DISABLED', { url: supabaseUrl, hasKey: !!supabaseAnonKey });

export const isRemoteEnabled = () => enabled;

export const loadRemoteData = async () => {
  if (!enabled) throw new Error('Supabase not configured');
  console.log('[Supabase] Loading remote data...');
  const { data, error } = await client
    .from(TABLE)
    .select('payload')
    .eq('id', ROW_ID)
    .maybeSingle();
  if (error) {
    console.error('[Supabase] Load error:', error);
    throw error;
  }
  console.log('[Supabase] Load success:', data ? 'data found' : 'no data');
  return data?.payload || null;
};

export const saveRemoteData = async (payload) => {
  if (!enabled) throw new Error('Supabase not configured');
  console.log('[Supabase] Saving remote data...');
  const { error } = await client.from(TABLE).upsert({ id: ROW_ID, payload });
  if (error) {
    console.error('[Supabase] Save error:', error);
    throw error;
  }
  console.log('[Supabase] Save success');
};

export const resetRemoteData = async () => {
  if (!enabled) throw new Error('Supabase not configured');
  const { error } = await client.from(TABLE).delete().eq('id', ROW_ID);
  if (error) throw error;
};
