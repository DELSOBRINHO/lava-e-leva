import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Error initializing Supabase client:", error);
    }
} else {
    console.warn('Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set. The app will use mock data where applicable.');
}

export { supabase };
