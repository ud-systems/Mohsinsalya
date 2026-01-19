import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://dbkwkdqxqhqmhkjzqxfd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRia3drZHF4cWhxbWhranpxeGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTMxOTcsImV4cCI6MjA4NDEyOTE5N30.BWPJ7m0HzgsMbAkcmDZmsC6WBfiR_7kJoHI6_admbnY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => !!supabase;
