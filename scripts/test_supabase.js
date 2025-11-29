const { createClient } = require('@supabase/supabase-js');

// Hardcoded credentials for debugging
const SUPABASE_URL = 'https://hhuiqyqjmhnttavtuyyv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWlxeXFqbWhudHRhdnR1eXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjcxOTIsImV4cCI6MjA3OTk0MzE5Mn0.vk86_7iJJr4piaYKkJzp-O9Ky8bi3aqvEmlz4gAQvSk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testQuery() {
    console.log('Querying Supabase for zip code 92604 (Irvine, CA)...');
    const { data: data1 } = await supabase.from('tax_rates').select('*').eq('zip_code', '92604');
    console.log('92604:', data1);

    console.log('Querying Supabase for zip code 10001 (New York, NY)...');
    const { data: data2 } = await supabase.from('tax_rates').select('*').eq('zip_code', '10001');
    console.log('10001:', data2);
}

testQuery();
