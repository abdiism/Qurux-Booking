
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars! Check server/.env");
    console.log("URL:", supabaseUrl);
    console.log("KEY Length:", supabaseKey ? supabaseKey.length : 0);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugInsert() {
    console.log("Attempting direct insert into 'profiles' to catch DB error...");

    const testId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID

    // 1. Try to delete if exists (cleanup)
    await supabase.from('profiles').delete().eq('id', testId);

    // 2. Try Insert with minimal fields
    const payload = {
        id: testId,
        email: 'debug_test@example.com',
        full_name: 'Debug User',
        role: 'MANAGER',
        phone_number: '1234567890'
    };

    const { data, error } = await supabase
        .from('profiles')
        .insert(payload)
        .select();

    if (error) {
        console.error("❌ INSERT FAILED. Raw Error:");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("✅ INSERT SUCCESS! The table assumes these columns exist.");
        console.log("Inserted Data:", data);

        // Cleanup
        await supabase.from('profiles').delete().eq('id', testId);
        console.log("Cleanup done.");
    }
}

debugInsert();
