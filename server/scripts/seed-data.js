
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

async function seedData() {
    console.log('Signing in as Manager...');
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'manager@qurux.com',
        password: 'password123'
    });

    if (authError || !user) {
        console.error('Auth failed:', authError?.message);
        return;
    }

    const MANAGER_ID = user.id;
    console.log('Signed in as:', MANAGER_ID);

    console.log('Seeding Salons and Services...');

    // 1. Create Salon
    const { data: salon, error: salonError } = await supabase
        .from('salons')
        .insert([
            {
                name: 'Qurux Glow Spa',
                address: 'Maka Al Mukarama, Mogadishu',
                description: 'The premier destination for luxury beauty treatments in Mogadishu.',
                image_url: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                review_count: 124,
                owner_id: MANAGER_ID
            }
        ])
        .select()
        .single();

    if (salonError) {
        console.error('Error creating salon:', salonError.message);
        return;
    }
    console.log('Salon created:', salon.name);

    // 2. Create Services
    const services = [
        {
            salon_id: salon.id,
            name_somali: 'Cilaan Saar',
            name_english: 'Henna Application',
            price: 15,
            duration_min: 60,
            category: 'Body',
            icon_name: 'Sparkles'
        },
        {
            salon_id: salon.id,
            name_somali: 'Mikiyaajka',
            name_english: 'Full Face Makeup',
            price: 25,
            duration_min: 45,
            category: 'Face',
            icon_name: 'Sparkles'
        },
        {
            salon_id: salon.id,
            name_somali: 'Timo Dabis',
            name_english: 'Hair Weaving',
            price: 40,
            duration_min: 120,
            category: 'Hair',
            icon_name: 'Sparkles'
        }
    ];

    const { error: servicesError } = await supabase
        .from('services')
        .insert(services);

    if (servicesError) console.error('Error creating services:', servicesError.message);
    else console.log(`Created ${services.length} services`);
}

seedData();
