
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log("Verifying 'profiles' table schema...");
    const testId = '11111111-1111-1111-1111-111111111111'; // Dummy UUID

    // 1. Cleanup
    await supabase.from('profiles').delete().eq('id', testId);

    // 2. Insert with ALL columns
    const payload = {
        id: testId,
        email: 'verify_test@example.com',
        full_name: 'Verification User',
        role: 'MANAGER',
        phone_number: '9876543210'
    };

    const { data, error } = await supabase
        .from('profiles')
        .insert(payload)
        .select();

    if (error) {
        console.error("❌ VERIFICATION FAILED:", error.message);
        console.error("Details:", error);
    } else {
        console.log("✅ VERIFICATION SUCCESS! All columns exist and are writable.");
        // Cleanup
        await supabase.from('profiles').delete().eq('id', testId);
    }
}

verifySchema();
