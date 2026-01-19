-- Add new fields to markets table for detailed page content and metadata
ALTER TABLE markets ADD COLUMN IF NOT EXISTS page_content TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE markets ADD COLUMN IF NOT EXISTS timeline TEXT;

-- Update existing records with some default values to match the reference
UPDATE markets SET 
  year = '2024',
  industry = 'Luxury',
  timeline = 'Ongoing'
WHERE title = 'LUXURY AND COLLECTIBLES';

UPDATE markets SET 
  year = '2023',
  industry = 'Philanthropy',
  timeline = 'Ongoing'
WHERE title = 'PHILANTHROPY & IMPACT';

UPDATE markets SET 
  year = '2022',
  industry = 'Real Estate',
  timeline = 'Strategic'
WHERE title = 'PROPERTY & REAL ESTATE';

UPDATE markets SET 
  year = '2021',
  industry = 'FMCG',
  timeline = 'Global'
WHERE title = 'FASHION & FMCG';
