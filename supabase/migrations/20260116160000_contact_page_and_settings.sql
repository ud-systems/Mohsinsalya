-- Create contact settings table
CREATE TABLE IF NOT EXISTS contact_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receive_email TEXT NOT NULL DEFAULT 'office@mohsinsalya.com',
  title TEXT NOT NULL DEFAULT 'Let''s Build Something Great',
  description TEXT NOT NULL DEFAULT 'Whether you have a specific venture in mind or simply wish to explore potential synergies, I am always open to discussing new opportunities.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default contact settings
INSERT INTO contact_settings (receive_email, title, description)
VALUES ('office@mohsinsalya.com', 'Let''s Build Something Great', 'Whether you have a specific venture in mind or simply wish to explore potential synergies, I am always open to discussing new opportunities.')
ON CONFLICT DO NOTHING;

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
