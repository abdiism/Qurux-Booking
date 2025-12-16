
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Diagnosing 'profiles' table schema...");

    // Try to select the specific columns we suspect might be missing
    const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name, phone_number')
        .limit(1);

    if (error) {
        console.error("❌ Error selecting columns:", error.message);
        if (error.message.includes('does not exist')) {
            console.log("   -> This likely means one of the columns (role, full_name, phone_number) is missing.");
        }
    } else {
        console.log("✅ Columns exist (Select successful). Sample data:", data);
    }
}

check();
