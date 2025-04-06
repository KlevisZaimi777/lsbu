import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and Anon Key
const supabaseUrl = 'https://ybajzhglqplyfhlsnvfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWp6aGdscXBseWZobHNudmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODY0NTQsImV4cCI6MjA1OTQ2MjQ1NH0.P8Jq1SzRCB_j7XlhM1F1MTi8GKuLCAvVIyyASozxJSM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
