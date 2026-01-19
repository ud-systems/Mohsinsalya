-- SEO Settings Table
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ga_measurement_id TEXT,
  clarity_id TEXT,
  google_search_console_id TEXT,
  site_name TEXT DEFAULT 'Mohsin Salya',
  default_og_image TEXT,
  twitter_handle TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default SEO settings
INSERT INTO seo_settings (site_name)
VALUES ('Mohsin Salya')
ON CONFLICT DO NOTHING;

-- Page Metadata Table for static pages
CREATE TABLE IF NOT EXISTS page_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL, -- e.g. '/', '/biography', '/markets'
  title TEXT NOT NULL,
  description TEXT,
  og_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert metadata for static pages
INSERT INTO page_metadata (page_path, title, description)
VALUES 
('/', 'Mohsin Salya | Visionary Entrepreneur & Global Investor', 'Rebuilding standards across industries from the fabric of fashion to the foundations of real estate.'),
('/biography', 'Biography | Mohsin Salya', 'The man behind the markets. Discover the journey and discipline of Mohsin Salya.'),
('/markets', 'Ventures & Markets | Mohsin Salya', 'Strategic investments and market leadership across fashion, property, and luxury assets.'),
('/insights', 'Expert Insights | Mohsin Salya', 'Entrepreneurship, discipline, and legacy. Grounded perspectives on building scalable businesses.'),
('/charity-works', 'Charity & Impact | Mohsin Salya', 'A legacy built on compassion and strategic giving. Explore philanthropic initiatives across borders.'),
('/contact', 'Work With Me | Mohsin Salya', 'Connect with Mohsin Salya for partnerships and strategic collaborations.')
ON CONFLICT (page_path) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description;
