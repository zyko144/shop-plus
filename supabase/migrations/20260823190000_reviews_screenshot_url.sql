-- Ajoute la preuve (capture d'ecran) desormais obligatoire pour laisser un avis.
alter table public.reviews add column if not exists screenshot_url text;
