-- Colonne ticker (LTC/ETH/SOL...) : distingue les moyens de paiement crypto
-- (conversion de prix en direct au checkout) des autres (ex: PayPal, gere a
-- part et pas stocke dans cette table).
alter table public.payment_methods add column if not exists ticker text;

create unique index if not exists payment_methods_name_key on public.payment_methods (name);

insert into public.payment_methods (name, details, icon, ticker) values
  ('Litecoin (LTC)', 'ltc1q6yauncm7v66zgxeglhcjdd6a7jj6t0j4839sym', 'litecoin', 'LTC'),
  ('Ethereum (ETH)', '0x9E885659296D8D987D6F9397Ad7295cc85770b95', 'ethereum', 'ETH'),
  ('Solana (SOL)', 'AUTM4ZbJt6mdmUHBFs1UWvsAnvE8UJ2NbfHom1yfwMhG', 'solana', 'SOL')
on conflict (name) do update set details = excluded.details, icon = excluded.icon, ticker = excluded.ticker;

notify pgrst, 'reload schema';
