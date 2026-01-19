-- Biography Page Content
CREATE TABLE IF NOT EXISTS biography_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_number TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO biography_milestones (milestone_number, title, content, order_index)
VALUES 
('01', 'The Foundation', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 0),
('02', 'The Rise', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 1),
('03', 'The Reckoning', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 2),
('04', 'The Legacy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 3),
('05', 'The Interview', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 4);

CREATE TABLE IF NOT EXISTS biography_turning_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO biography_turning_points (category, title, description, image_url, order_index)
VALUES 
('01.', 'CAUSE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus necf.', '/assets/podcast-interview.jpg', 0),
('02.', 'EFFECT', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus necf.', '/assets/hero-main.webp', 1),
('03.', 'CONSEQUENCE', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus necf.', '/assets/hero-portrait.jpg', 2);

-- Update biography_content to include more fields if needed
ALTER TABLE biography_content ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE biography_content ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE biography_content ADD COLUMN IF NOT EXISTS hero_description TEXT;
ALTER TABLE biography_content ADD COLUMN IF NOT EXISTS hero_quote TEXT;
ALTER TABLE biography_content ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

UPDATE biography_content SET 
  hero_title = 'BUILDING BUSINESSES,',
  hero_subtitle = 'REBUILDING STANDARDS',
  hero_description = 'Business becomes meaningful when it stands for something bigger than profit, when it raises expectations and resets what’s possible',
  hero_quote = 'Mohsin Salya',
  hero_image_url = '/assets/biographyhero.webp'
WHERE name = 'Mohsin Salya';
