-- Add missing columns to charity_works table
ALTER TABLE charity_works ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE charity_works ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE charity_works ADD COLUMN IF NOT EXISTS work_date DATE DEFAULT CURRENT_DATE;

-- Update existing records with some dummy data if needed
UPDATE charity_works SET 
  description = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
  location = 'Global',
  work_date = '2025-01-01'
WHERE description IS NULL;
