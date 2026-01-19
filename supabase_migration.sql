-- Full Site Content Migration
-- Run this in your Supabase SQL Editor

-- 1. Hero Content
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title_line1 TEXT NOT NULL,
  title_line2 TEXT NOT NULL,
  description TEXT NOT NULL,
  bottom_left_text TEXT NOT NULL,
  bottom_left_subtext TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM hero_content;
INSERT INTO hero_content (name, title_line1, title_line2, description, bottom_left_text, bottom_left_subtext)
VALUES ('MOHSIN SALYA', 'VISIONARY', 'ENTREPRENEUR', 'REBUILDING STANDARDS ACROSS INDUSTRIES FROM THE FABRIC OF FASHION TO THE FOUNDATIONS OF REAL ESTATE', 'GLOBAL', 'INVESTOR');

-- 2. Biography Content
CREATE TABLE IF NOT EXISTS biography_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM biography_content;
INSERT INTO biography_content (name, title)
VALUES ('Mohsin Salya', 'The Man Behind the Markets');

CREATE TABLE IF NOT EXISTS biography_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM biography_quotes;
INSERT INTO biography_quotes (quote, order_index)
VALUES 
('Every chapter of my life has taught me the same enduring truth: discipline builds durability. Talent may start the journey, but only discipline carries you through the storms, the risks, and the rebuilding. It is the quiet force that keeps success standing long after momentum fades.', 0),
('Innovation without integrity is merely disruption. True transformation comes from building something that lasts, something that serves, something that elevates everyone it touches.', 1);

-- 3. Markets
CREATE TABLE IF NOT EXISTS markets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM markets;
INSERT INTO markets (name, title, description, image_url, order_index)
VALUES 
('Fashion Industry Footprint', 'FASHION INDUSTRY FOOTPRINT', 'Where it all began! From independent labels to large-scale retail distribution, building the foundation for future ventures. What started as a small creative pursuit soon evolved into a thriving network of fashion and apparel brands, setting the tone for a lifetime of enterprise and expansion.', '/assets/fashion.webp', 0),
('Luxury Collectibles', 'LUXURY COLLECTIBLES', 'Curating exceptional pieces from around the world, building collections that appreciate in value and tell stories of craftsmanship, heritage, and timeless design.', '/assets/luxury.webp', 1),
('Property & Real Estate', 'PROPERTY & REAL ESTATE', 'Strategic investments across prime locations, developing properties that redefine urban living and commercial excellence in emerging markets.', '/assets/real-estate.webp', 2),
('FMCG Networks', 'FMCG NETWORKS', 'Building distribution networks that bring quality consumer goods to markets across continents, connecting brands with consumers at scale.', '/assets/fmcg.webp', 3);

-- 4. Stats
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM stats;
INSERT INTO stats (value, label, order_index)
VALUES 
('25', 'YEARS IN BUSINESS', 0),
('1BN', 'REVENUE TURNOVER', 1),
('45', 'NEW BRANDS', 2);

-- 5. Insights
CREATE TABLE IF NOT EXISTS insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT, -- Long text for detail page
  category TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM insights;
INSERT INTO insights (title, excerpt, category, image_url, created_at)
VALUES 
('The Art of the Acquisition', 'Strategic moves that define market leadership and drive exponential growth.', 'Acquisitions', '/assets/acquisition-scaled.webp', now() - interval '1 day'),
('The Future of Luxury Retail in the Digital Age', 'How traditional luxury brands are adapting to meet the expectations of a new generation of conscious consumers.', 'Retail', '/assets/luxury-retail.jpg', now() - interval '2 days'),
('Building Sustainable Real Estate Ventures', 'Strategic approaches to developing properties that balance profitability with environmental responsibility.', 'Real Estate', '/assets/real-estate.jpg', now() - interval '3 days'),
('How does Money affect the output of businesses and how to avoid it', 'Teaching young entrepreneurs how to be rich through struggles.', 'Business', '/assets/podcast-interview.jpg', now() - interval '4 days');

-- 6. Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM achievements;
INSERT INTO achievements (title, subtitle, category, image_url, order_index)
VALUES 
('Built one of the largest fashion distribution networks across multiple continents.', 'POWER', 'ACHIEVEMENT', '/assets/achievements/achievement1.webp', 0),
('Strategic expansion into the luxury collectibles market with world-class curation.', 'POWER', 'ACHIEVEMENT', '/assets/achievements/achievement2.webp', 1),
('Redefined urban living through premium real estate developments in emerging markets.', 'POWER', 'ACHIEVEMENT', '/assets/achievements/achievement3.webp', 2),
('Established a multi-billion turnover enterprise through discipline and vision.', 'POWER', 'ACHIEVEMENT', '/assets/achievements/achievement4.webp', 3);

-- 7. Charity Works
CREATE TABLE IF NOT EXISTS charity_works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  work_date DATE DEFAULT CURRENT_DATE,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM charity_works;
INSERT INTO charity_works (title, subtitle, category, description, location, work_date, order_index, image_url)
VALUES 
('Supporting global education initiatives for underprivileged children', 'IMPACT', 'CHARITY', 'Providing quality education and learning materials to children in remote areas, ensuring they have the tools to build a better future.', 'Africa - Tanzania', '2021-05-15', 0, '/assets/philanthropy.webp'),
('Sustainable water projects in arid regions', 'HOPE', 'CHARITY', 'Developing infrastructure for clean water access, including solar-powered wells and water purification systems.', 'Middle East', '2019-11-20', 1, '/assets/real-estate.jpg'),
('Healthcare accessibility programs in emerging markets', 'CARE', 'CHARITY', 'Improving healthcare infrastructure and providing medical supplies to underserved communities.', 'South Asia', '2025-01-10', 2, '/assets/luxury-retail.jpg'),
('Community development and local entrepreneurship support', 'GROWTH', 'CHARITY', 'Empowering local entrepreneurs through micro-loans and business training programs.', 'Global', '2023-08-25', 3, '/assets/podcast-interview.jpg');

-- 8. Charity Quotes
CREATE TABLE IF NOT EXISTS charity_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author_name TEXT,
  author_title TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM charity_quotes;
INSERT INTO charity_quotes (quote, author_name, author_title, order_index)
VALUES 
('My true measure of wealth has always been time, the freedom to choose what I build next. Success, for me, is not counted in numbers but in the ability to decide where my energy, discipline, and purpose go next', 'Mohsin Salya', 'Faith in Action', 0),
('True wealth is not measured by what we accumulate, but by what we give back to the world that sustained us.', 'Mohsin Salya', 'Faith in Action', 1);

-- 9. Media Settings
CREATE TABLE IF NOT EXISTS media_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM media_settings;
INSERT INTO media_settings (key, url, description)
VALUES 
('hero_video', 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-11-large.mp4', 'Main homepage hero video'),
('charity_video', 'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-11-large.mp4', 'Video for the Charity Works section');

-- 10. Newsletter CTA
CREATE TABLE IF NOT EXISTS newsletter_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  disclaimer TEXT NOT NULL,
  button_text TEXT DEFAULT 'Start Building' NOT NULL,
  placeholder_text TEXT DEFAULT 'Enter Your Email Address' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM newsletter_settings;
INSERT INTO newsletter_settings (title, disclaimer, button_text, placeholder_text)
VALUES (
  'For The Ones Climbing Back, Turn Bruises Into Billion-Dollar Moves',
  'By subscribing, you''ll receive thoughtful updates, insights, and inspiration straight to your inbox. No spam just authentic content and stories worth your time.',
  'Start Building',
  'Enter Your Email Address'
);

-- 11. Newsletter Subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
