import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].replace(/['"]/g, '');
const supabaseKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].replace(/['"]/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Updating logos...");
  
  await supabase.from('products').update({ logo: 'discord', emoji: null }).eq('category', 'Discord');
  await supabase.from('products').update({ logo: 'fortnite', emoji: null }).eq('category', 'Fortnite');
  await supabase.from('products').update({ logo: 'epicgames', emoji: null }).eq('category', 'V-Bucks');

  const { data: rare } = await supabase.from('products').select('name').eq('category', 'Fortnite Rare');
  console.log("Rare skins:", rare.map(r => r.name));
  
  console.log("Done.");
}

run();
