-- Ensure newsletter_settings table exists
CREATE TABLE IF NOT EXISTS newsletter_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    disclaimer TEXT NOT NULL,
    button_text TEXT DEFAULT 'Start Building' NOT NULL,
    placeholder_text TEXT DEFAULT 'Enter Your Email Address' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE newsletter_settings ENABLE ROW LEVEL SECURITY;

-- Create public select policy
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_settings' AND policyname = 'Allow public select'
    ) THEN
        CREATE POLICY "Allow public select" ON newsletter_settings FOR SELECT USING (true);
    END IF;
END $$;

-- Insert default record if none exists
INSERT INTO newsletter_settings (title, disclaimer, button_text, placeholder_text)
SELECT 'For The Ones Climbing Back, Turn Bruises Into Billion-Dollar Moves', 'By subscribing, you''ll receive thoughtful updates, insights, and inspiration straight to your inbox. No spam just authentic content and stories worth your time.', 'Start Building', 'Enter Your Email Address'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_settings);
