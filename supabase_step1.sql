CREATE TABLE public.promo_codes (
  code text PRIMARY KEY,
  discount_percentage integer DEFAULT 0,
  max_uses integer DEFAULT 100,
  current_uses integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE POLICY "Public can read promo codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Admins can manage promo codes" ON public.promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION increment_promo_use(promo_code text)
RETURNS void AS $$
BEGIN
  UPDATE public.promo_codes
  SET current_uses = current_uses + 1
  WHERE code = promo_code;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE public.store_settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO public.store_settings (key, value) VALUES
  ('maintenance_mode', 'false'),
  ('banner_text', 'SOLDES EXCEPTIONNELLES : -20% sur Netflix & Spotify aujourd''hui avec le code BIENVENUE20 !'),
  ('discord_link', 'https://discord.gg/UUBFjjCp')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

CREATE POLICY "Public can read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.store_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
