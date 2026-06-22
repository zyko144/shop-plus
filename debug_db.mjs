import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].replace(/['"]/g, '');
const supabaseKey = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)[1].replace(/['"]/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== CHECKING PRODUCTS ===");
  const { data: allProducts } = await supabase.from('products').select('id, name, category, emoji, logo');
  
  // Checking CDA and Polsat
  const streaming = allProducts.filter(p => p.category === 'Streaming');
  console.log("Streaming products:", streaming.map(p => p.name));
  
  // Checking Fortnite
  const fortnite = allProducts.filter(p => p.category.includes('Fortnite'));
  console.log("Fortnite products:", fortnite.map(p => ({name: p.name, emoji: p.emoji, logo: p.logo, cat: p.category})));

  // Checking V-Bucks
  const vbucks = allProducts.filter(p => p.category.includes('V-Bucks'));
  console.log("V-Bucks products:", vbucks.map(p => ({name: p.name, emoji: p.emoji, logo: p.logo, cat: p.category})));
}

run();
