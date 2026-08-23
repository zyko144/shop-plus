-- Le bucket chat_attachments existe et est public (lecture ok via l'URL publique),
-- mais sans policy explicite sur storage.objects, aucun upload n'est autorise
-- (RLS bloque tout par defaut). Necessaire pour : les avis clients (capture
-- d'ecran obligatoire) et le chat support (upload d'images).
create policy "chat_attachments public read"
on storage.objects for select
using (bucket_id = 'chat_attachments');

create policy "chat_attachments authenticated upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'chat_attachments');
