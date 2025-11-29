import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hhuiqyqjmhnttavtuyyv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWlxeXFqbWhudHRhdnR1eXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjcxOTIsImV4cCI6MjA3OTk0MzE5Mn0.vk86_7iJJr4piaYKkJzp-O9Ky8bi3aqvEmlz4gAQvSk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
