-- Create a function that automatically inserts a new user into the public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, avatar_url, joined_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'משתמש חדש'),
    new.email,
    'https://ui-avatars.com/api/?name=' || COALESCE(new.raw_user_meta_data->>'full_name', 'User') || '&background=random',
    to_char(now(), 'TMMonth YYYY')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function every time a user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
