
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers() {
    console.log('Seeding users...');

    // 1. Create Manager
    const managerEmail = 'manager@qurux.com';
    const managerPassword = 'password123';

    console.log(`Creating Manager: ${managerEmail}`);
    const { data: managerData, error: managerError } = await supabase.auth.signUp({
        email: managerEmail,
        password: managerPassword,
        options: {
            data: {
                full_name: 'Amina Manager',
                role: 'MANAGER'
            }
        }
    });

    if (managerError) console.error('Error creating manager:', managerError.message);
    else console.log('Manager created ID:', managerData.user?.id);

    // 2. Create Customer
    const customerEmail = 'client@qurux.com';
    const customerPassword = 'password123';

    console.log(`Creating Customer: ${customerEmail}`);
    const { data: customerData, error: customerError } = await supabase.auth.signUp({
        email: customerEmail,
        password: customerPassword,
        options: {
            data: {
                full_name: 'Farah Client',
                role: 'CUSTOMER'
            }
        }
    });

    if (customerError) console.error('Error creating customer:', customerError.message);
    else console.log('Customer created ID:', customerData.user?.id);
}

seedUsers();
