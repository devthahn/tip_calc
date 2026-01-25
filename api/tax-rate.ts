import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In Vercel Serverless Functions, process.env is populated from Environment Variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(request: Request) {
    // Parse query parameters from the URL
    // In Vercel Edge/Serverless functions with Request/Response standard API
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zip');

    if (!zipCode) {
        return new Response(
            JSON.stringify({ error: 'Zip code is required' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }

    const cleanZip = zipCode.split('-')[0];

    try {
        const { data, error } = await supabase
            .from('tax_rates')
            .select('combined_rate')
            .eq('zip_code', cleanZip)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            // Return 404 if not found, or 500 for other errors
            if (error.code === 'PGRST116') { // JSON object not returned (not found)
                return new Response(
                    JSON.stringify({ rate: 0, message: 'Tax rate not found for zip' }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (data && data.combined_rate) {
            return new Response(
                JSON.stringify({ rate: data.combined_rate }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ rate: 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('Server error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
