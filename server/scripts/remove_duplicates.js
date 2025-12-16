
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeDuplicates() {
    console.log('Fetching all salons...');

    // Fetch all salons
    const { data: salons, error } = await supabase
        .from('salons')
        .select('id, owner_id, created_at, name')
        .order('created_at', { ascending: false }); // Newest first

    if (error) {
        console.error('Error fetching salons:', error);
        return;
    }

    console.log(`Found ${salons.length} salons.`);

    const seenOwners = new Set();
    const duplicates = [];

    for (const salon of salons) {
        if (salon.owner_id) {
            if (seenOwners.has(salon.owner_id)) {
                duplicates.push(salon);
            } else {
                seenOwners.add(salon.owner_id);
            }
        }
    }

    console.log(`Found ${duplicates.length} duplicates to remove.`);

    for (const dup of duplicates) {
        console.log(`Removing duplicate salon: ${dup.name} (ID: ${dup.id})`);
        const { error: delError } = await supabase
            .from('salons')
            .delete()
            .eq('id', dup.id);

        if (delError) {
            console.error(`Failed to delete ${dup.id}:`, delError);
        } else {
            console.log(`Deleted ${dup.id}`);
        }
    }

    console.log('Cleanup complete.');
}

removeDuplicates();
