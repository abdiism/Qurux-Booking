
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsers() {
    console.log('Creating users...');

    // 1. Manager
    const { data: manager, error: managerError } = await supabase.auth.signUp({
        email: 'manager@qurux.com',
        password: 'password123',
        options: {
            data: {
                full_name: 'Amina Manager',
                role: 'MANAGER'
            }
        }
    });

    if (managerError) console.log('Manager creation result:', managerError.message);
    else console.log('Manager created:', manager.user?.email);

    // 2. Client
    const { data: client, error: clientError } = await supabase.auth.signUp({
        email: 'client@qurux.com',
        password: 'password123',
        options: {
            data: {
                full_name: 'Farah Client',
                role: 'CUSTOMER'
            }
        }
    });

    if (clientError) console.log('Client creation result:', clientError.message);
    else console.log('Client created:', client.user?.email);
}

createUsers();
