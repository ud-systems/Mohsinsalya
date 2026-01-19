-- Add is_featured column to insights table
ALTER TABLE insights ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Ensure only one insight is featured at a time (optional but recommended for this UX)
-- We can handle this in the application logic or with a trigger. 
-- For now, let's just add the column and a helper function.

-- Let's set the first insight as featured by default
UPDATE insights SET is_featured = true WHERE id IN (SELECT id FROM insights ORDER BY created_at DESC LIMIT 1);
