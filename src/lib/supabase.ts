import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plimumjsgyvzuqjnqgme.supabase.co';
// The user provided this publishable key
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaW11bWpzZ3l2enVxam5xZ21lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MTY0NTksImV4cCI6MjA4OTk5MjQ1OX0.iIs5nIWPASnHtzBgCWgQjEzl68tiWZTtQc86HTOVomE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
