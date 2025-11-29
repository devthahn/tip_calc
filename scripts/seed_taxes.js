const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
const glob = require('glob');

// Hardcoded credentials for debugging
const SUPABASE_URL = 'https://hhuiqyqjmhnttavtuyyv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodWlxeXFqbWhudHRhdnR1eXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNjcxOTIsImV4cCI6MjA3OTk0MzE5Mn0.vk86_7iJJr4piaYKkJzp-O9Ky8bi3aqvEmlz4gAQvSk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.join(__dirname, '../tax_data/TAXRATES_ZIP5');
const BATCH_SIZE = 1000;

async function seed() {
    console.log('Starting seed process...');

    // Find all CSV files
    const files = glob.sync(`${DATA_DIR}/*.csv`);
    console.log(`Found ${files.length} CSV files.`);

    for (const file of files) {
        console.log(`Processing ${path.basename(file)}...`);
        const rows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(file)
                .pipe(csv())
                .on('data', (data) => {
                    // Map CSV columns to database columns
                    // CSV: State,ZipCode,TaxRegionName,EstimatedCombinedRate
                    // DB: state, zip_code, city, combined_rate
                    if (data.ZipCode && data.EstimatedCombinedRate) {
                        rows.push({
                            zip_code: data.ZipCode,
                            state: data.State,
                            city: data.TaxRegionName,
                            combined_rate: parseFloat(data.EstimatedCombinedRate)
                        });
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Insert in batches
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);
            const { error } = await supabase
                .from('tax_rates')
                .upsert(batch, { onConflict: 'zip_code' });

            if (error) {
                console.error(`Error inserting batch in ${path.basename(file)}:`, error);
            }
        }
        console.log(`Finished ${path.basename(file)} (${rows.length} records)`);
    }

    console.log('Seeding complete!');
}

seed().catch(console.error);
