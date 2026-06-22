DELETE FROM public.users WHERE id NOT IN (SELECT id FROM auth.users);
ALTER TABLE public.users ADD CONSTRAINT users_auth_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
