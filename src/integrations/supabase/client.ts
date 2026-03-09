import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn(
        'Supabase environment variables are missing. Please check your .env file and ensure they are prefixed with VITE_. ' +
        'If you just added them, you may need to restart your development server.'
    );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey
);
