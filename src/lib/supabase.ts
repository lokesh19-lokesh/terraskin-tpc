import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plimumjsgyvzuqjnqgme.supabase.co';
// The user provided this publishable key
const supabaseAnonKey = 'sb_publishable_vwR45VPIGwAWJvjS7Ot2ww_NEa35Bxd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
