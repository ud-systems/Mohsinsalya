-- Ensure newsletter_subscriptions table exists
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (so people can sign up)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscriptions' AND policyname = 'Allow public insert'
    ) THEN
        CREATE POLICY "Allow public insert" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Allow public to select (for Admin panel viewing)
-- In a production app, you would restrict this to authenticated admins only.
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscriptions' AND policyname = 'Allow public select'
    ) THEN
        CREATE POLICY "Allow public select" ON newsletter_subscriptions FOR SELECT USING (true);
    END IF;
END $$;

-- Allow public to delete (for Admin panel management)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscriptions' AND policyname = 'Allow public delete'
    ) THEN
        CREATE POLICY "Allow public delete" ON newsletter_subscriptions FOR DELETE USING (true);
    END IF;
END $$;
