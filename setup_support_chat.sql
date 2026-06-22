-- Table: support_messages
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_admin_reply BOOLEAN NOT NULL DEFAULT false,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres messages
CREATE POLICY "Users can view their own messages" 
  ON public.support_messages FOR SELECT 
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent envoyer des messages (is_admin_reply doit être false)
CREATE POLICY "Users can insert their own messages" 
  ON public.support_messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND is_admin_reply = false);

-- Les admins (service_role ou RLS bypass) ont tous les droits via GRANT
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;

-- Setup notification (Optional but good for realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
