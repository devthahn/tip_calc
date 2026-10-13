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

// Vercel Serverless Function supporting both Node.js (req, res) and Edge (Request) runtimes
export default async function handler(req: any, res?: any) {
    // -------------------------------------------------------------
    // 1. Node.js Serverless Runtime (Standard Vercel Function)
    // -------------------------------------------------------------
    if (res && typeof res.status === 'function') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }

        try {
            const rawZip = req.query?.zip as string | undefined;
            if (!rawZip) {
                return res.status(400).json({ error: 'Zip code is required' });
            }

            const cleanZip = rawZip.split('-')[0].trim();

            const { data, error } = await supabase
                .from('tax_rates')
                .select('combined_rate, city, state')
                .eq('zip_code', cleanZip)
                .maybeSingle();

            if (error) {
                console.error('Supabase query error:', error);
                return res.status(500).json({ error: error.message });
            }

            if (data && data.combined_rate !== undefined && data.combined_rate !== null) {
                return res.status(200).json({
                    rate: data.combined_rate,
                    city: data.city,
                    state: data.state
                });
            }

            return res.status(200).json({
                rate: 0,
                message: 'Tax rate not found for zip'
            });

        } catch (err: any) {
            console.error('Server error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // -------------------------------------------------------------
    // 2. Web Standard / Edge Runtime (Request -> Response)
    // -------------------------------------------------------------
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    try {
        let zipParam: string | null = null;
        if (typeof req.url === 'string') {
            try {
                const url = new URL(req.url, 'http://localhost');
                zipParam = url.searchParams.get('zip');
            } catch {
                zipParam = null;
            }
        }

        if (!zipParam) {
            return new Response(
                JSON.stringify({ error: 'Zip code is required' }),
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const cleanZip = zipParam.split('-')[0].trim();

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
