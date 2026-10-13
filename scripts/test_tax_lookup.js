const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://hhuiqyqjmhnttavtuyyv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWlxeXFqbWhudHRhdnR1eXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjcxOTIsImV4cCI6MjA3OTk0MzE5Mn0.vk86_7iJJr4piaYKkJzp-O9Ky8bi3aqvEmlz4gAQvSk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testTaxRateLookup(zip, state) {
    const cleanZip = zip ? zip.split('-')[0].trim() : null;
    if (cleanZip) {
        const { data, error } = await supabase
            .from('tax_rates')
            .select('combined_rate')
            .eq('zip_code', cleanZip)
            .maybeSingle();

        if (!error && data && data.combined_rate !== undefined && data.combined_rate !== null) {
            return {
                rate: data.combined_rate * 100,
                isFallback: false,
                source: 'supabase',
                message: 'Database'
            };
        }
    }
    return {
        rate: 8.85,
        isFallback: true,
        source: 'state_avg',
        message: 'State Avg'
    };
}

async function run() {
    const testZips = [
        { zip: '92604', state: 'California', desc: 'Irvine, CA' },
        { zip: '92551', state: 'California', desc: 'Moreno Valley, CA (92551)' },
        { zip: '92553', state: 'California', desc: 'Moreno Valley, CA (92553)' },
        { zip: '92555', state: 'California', desc: 'Moreno Valley, CA (92555)' },
        { zip: '92557', state: 'California', desc: 'Moreno Valley, CA (92557)' },
        { zip: '10001', state: 'New York', desc: 'New York, NY' }
    ];

    for (const item of testZips) {
        const result = await testTaxRateLookup(item.zip, item.state);
        console.log(`[${item.desc}] zip: ${item.zip} => rate: ${result.rate}%, source: ${result.source}, isFallback: ${result.isFallback}`);
    }
}

run();
