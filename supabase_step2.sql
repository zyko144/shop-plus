
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  color text,
  emoji text,
  subtitle text,
  logo text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Active RLS and Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.products (id, name, price, category, color, emoji, subtitle, logo) VALUES
('ytb', 'YouTube Premium', 1, 'Streaming', '#ff0033', '▶', '1 Mois', 'youtube'),
('deezer', 'Deezer Premium', 1, 'Streaming', '#a238ff', '♪', 'Lifetime', 'deezer'),
('netflix', 'Netflix', 1, 'Streaming', '#e50914', 'N', 'Premium', 'netflix'),
('disney', 'Disney+', 1, 'Streaming', '#113ccf', '✨', 'Premium', '/disney-user.png'),
('spotify', 'Spotify Premium', 1, 'Streaming', '#1db954', '🎧', '2 Mois', 'spotify'),
('crunchy', 'Crunchyroll', 1, 'Streaming', '#f47521', '🍥', 'Premium', 'crunchyroll'),
('nba', 'NBA League Pass', 1, 'Streaming', '#c9082a', '🏀', 'Premium', 'nba'),
('ufc', 'UFC Fight Pass', 1, 'Streaming', '#d20a0a', '🥋', 'Lifetime', 'ufc'),
('hbo', 'HBO Max', 1, 'Streaming', '#9b4dff', 'H', 'Premium', 'hbo'),
('dazn', 'DAZN', 1, 'Streaming', '#f8ff13', '⚡', 'Pays aléatoire', 'dazn'),
('cda', 'CDA', 1, 'Streaming', '#4ade80', '▶', 'Lifetime', 'https://icon.horse/icon/cda.pl'),
('polsat', 'Polsat Box Go', 1, 'Streaming', '#1e90ff', '📺', 'Lifetime', 'https://icon.horse/icon/polsatboxgo.pl'),
('paramount', 'Paramount+ EU', 1, 'Streaming', '#0064ff', '⛰', 'Lifetime', 'paramountplus'),
('capcut', 'CapCut Pro', 1, 'Streaming', '#25f4ee', '✂', 'Premium', 'https://icon.horse/icon/capcut.com'),
('nordvpn', 'NordVPN', 2, 'VPN', '#4687ff', '🛡', 'Premium', 'nordvpn'),
('ipvanish', 'IPVanish', 2, 'VPN', '#70b800', '🔒', 'Premium', NULL),
('twitch2k', '2 000 Followers Twitch', 3, 'Twitch', '#9146ff', '📈', NULL, 'twitch'),
('fn-2-10', 'Compte Fortnite 2 à 10 Skins', 0.6, 'Fortnite', '#00d2ff', '💎', NULL, NULL),
('fn-10-20', 'Compte 10 à 20 Skins', 1.2, 'Fortnite', '#00d2ff', '💎', NULL, NULL),
('fn-20-50', 'Compte 20 à 50 Skins', 3.5, 'Fortnite', '#00bfff', '💎', NULL, NULL),
('fn-50-100', 'Compte 50 à 100 Skins', 6.5, 'Fortnite', '#1fa7ff', '💎', NULL, NULL),
('fn-100-150', 'Compte 100 à 150 Skins', 8.5, 'Fortnite', '#1fa7ff', '💎', NULL, NULL),
('fn-150-250', 'Compte 150 à 250 Skins', 13, 'Fortnite', '#3b82f6', '💎', NULL, NULL),
('fn-250-400', 'Compte 250 à 400 Skins', 20, 'Fortnite', '#4f46e5', '💎', NULL, NULL),
('fn-400-550', 'Compte 400 à 550 Skins', 45, 'Fortnite', '#8b5cf6', '💎', NULL, NULL),
('fn-leviathan', 'Leviathan Axe', 15, 'Fortnite Rare', '#00ffd1', '🪓', '100-200 Skins', NULL),
('fn-minty', 'Minty Axe', 20, 'Fortnite Rare', '#7cffb2', '🪓', '100-250 Skins', NULL),
('fn-takel', 'Take The L', 17, 'Fortnite Rare', '#ff4dd2', '💃', '100-250 Skins', NULL),
('fn-reaper', 'The Reaper', 17, 'Fortnite Rare', '#9aa0a6', '🗡', '100-250 Skins', NULL),
('fn-travis', 'Travis Scott', 35, 'Fortnite Rare', '#ff7a00', '🎤', '100-250 Skins', NULL),
('fn-galaxy', 'Galaxy', 50, 'Fortnite Rare', '#7b00ff', '🌌', '70-150 Skins', NULL),
('fn-bk60', 'Black Knight', 70, 'Fortnite Rare', '#5c5cff', '🛡', '60-200 Skins', NULL),
('fn-bk50', 'Black Knight', 80, 'Fortnite Rare', '#3b3bff', '🛡', '50-200 Skins', NULL),
('vb-1000', '1000 - 2500 V-Bucks', 5, 'V-Bucks', '#f0b400', '💰', NULL, NULL),
('vb-2500', '2500 - 5000 V-Bucks', 14, 'V-Bucks', '#ffc933', '💰', NULL, NULL),
('dd-499', 'Décoration 4.99€', 1.99, 'Discord', '#5865f2', '✦', 'Au lieu de 4.99€', NULL),
('dd-599', 'Décoration 5.99€', 2.99, 'Discord', '#5865f2', '✦', 'Au lieu de 5.99€', NULL),
('dd-699', 'Décoration 6.99€', 3.99, 'Discord', '#5865f2', '✦', 'Au lieu de 6.99€', NULL),
('dd-799', 'Décoration 7.99€', 4.99, 'Discord', '#5865f2', '✦', 'Au lieu de 7.99€', NULL),
('dd-899', 'Décoration 8.99€', 5.99, 'Discord', '#5865f2', '✦', 'Au lieu de 8.99€', NULL),
('dd-999', 'Décoration 9.99€', 6.99, 'Discord', '#5865f2', '✦', 'Au lieu de 9.99€', NULL),
('dd-1199', 'Décoration 11.99€', 7.99, 'Discord', '#5865f2', '✦', 'Au lieu de 11.99€', NULL),
('dd-1299', 'Décoration 12.99€', 8.99, 'Discord', '#5865f2', '✦', 'Au lieu de 12.99€', NULL),
('dd-1599', 'Décoration 15.99€', 11.99, 'Discord', '#5865f2', '✦', 'Au lieu de 15.99€', NULL),
('dd-1799', 'Décoration 17.99€', 13.99, 'Discord', '#5865f2', '✦', 'Au lieu de 17.99€', NULL),
('steam-account', 'Compte Steam avec jeux', 5, 'Steam', '#1b2838', '🎮', 'Comptes avec jeux bonus inclus', NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, subtitle = EXCLUDED.subtitle, logo = EXCLUDED.logo, is_active = true;

NOTIFY pgrst, 'reload schema';
