import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].replace(/['"]/g, '');
const supabaseKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].replace(/['"]/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Deleting Polsat Box Go and CDA...");
  
  const { data, error } = await supabase
    .from('products')
    .delete()
    .in('name', ['Polsat Box Go', 'CDA Premium']);
    
  if (error) {
    console.error("Error deleting:", error);
  } else {
    console.log("Deleted successfully.");
  }
}

run();
