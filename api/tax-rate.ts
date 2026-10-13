import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://hhuiqyqjmhnttavtuyyv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWlxeXFqbWhudHRhdnR1eXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjcxOTIsImV4cCI6MjA3OTk0MzE5Mn0.vk86_7iJJr4piaYKkJzp-O9Ky8bi3aqvEmlz4gAQvSk';
const supabase = createClient(supabaseUrl, supabaseKey);

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
};

export default async function handler(request: Request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: CORS_HEADERS,
        });
    }

    try {
        const { searchParams } = new URL(request.url);
        const zipCode = searchParams.get('zip');

        if (!zipCode) {
            return new Response(
                JSON.stringify({ error: 'Zip code is required' }),
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const cleanZip = zipCode.split('-')[0].trim();

        const { data, error } = await supabase
            .from('tax_rates')
            .select('combined_rate, city, state')
            .eq('zip_code', cleanZip)
            .maybeSingle();

        if (error) {
            console.error('Supabase query error:', error);
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: CORS_HEADERS }
            );
        }

        if (data && data.combined_rate !== undefined && data.combined_rate !== null) {
            return new Response(
                JSON.stringify({
                    rate: data.combined_rate,
                    city: data.city,
                    state: data.state
                }),
                { status: 200, headers: CORS_HEADERS }
            );
        }

        // Zip code not found in database
        return new Response(
            JSON.stringify({
                rate: 0,
                message: 'Tax rate not found for zip'
            }),
            { status: 200, headers: CORS_HEADERS }
        );

    } catch (err) {
        console.error('Server error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
