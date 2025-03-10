
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ddfmzymamtoaabjnkjwu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZm16eW1hbXRvYWFiam5rand1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzA0MDMsImV4cCI6MjA1NjkwNjQwM30.P3szgw_NcdKZAzzrzHZhieSqWLy7XEWaUjtm_Sv9_Uo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
