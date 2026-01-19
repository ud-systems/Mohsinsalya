-- Add metadata fields to insights table
ALTER TABLE insights ADD COLUMN IF NOT EXISTS read_time TEXT;
ALTER TABLE insights ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Mohsin Salya';
ALTER TABLE insights ADD COLUMN IF NOT EXISTS author_avatar TEXT;

-- Add more dummy data for the insights page
DELETE FROM insights;
INSERT INTO insights (title, excerpt, content, category, image_url, read_time, created_at)
VALUES 
(
  'How to pace yourself and become great just like me', 
  'Mohsin Salya is a billionaire philanthropist teaching young entrepreneurs how to make it.', 
  '<p>Pacing yourself is the secret to longevity in business. Many start with a sprint, but building a billion-dollar empire is a marathon...</p><p>In this article, I share my personal journey and the discipline required to maintain momentum over decades.</p>',
  'Entrepreneurship', 
  '/assets/hero-portrait.jpg', 
  '5 min read',
  '2025-10-15'
),
(
  'How to stop procrastinating and embress your full potential', 
  'Mohsin Salya is a billionaire philanthropist teaching young entrepreneurs how to make it.', 
  '<p>Procrastination is the enemy of progress. To reach your full potential, you must embrace the struggle and move with purpose...</p>',
  'Discipline', 
  '/assets/fashion-model.jpg', 
  '7 min read',
  '2025-10-15'
),
(
  'How to not be a quiter even after multiple setbacks', 
  'Mohsin Salya is a billionaire philanthropist teaching young entrepreneurs how to make it.', 
  '<p>Setbacks are merely setups for comebacks. Every failure I encountered in the fashion industry was a lesson that prepared me for real estate...</p>',
  'Resilience', 
  '/assets/podcast-interview.jpg', 
  '6 min read',
  '2025-10-15'
),
(
  'How to build a scalable business in 2025', 
  'Mohsin Salya is a billionaire philanthropist teaching young entrepreneurs how to make it.', 
  '<p>Scalability in the modern era requires a blend of traditional values and technological integration...</p>',
  'Business', 
  '/assets/hero-main.webp', 
  '8 min read',
  '2025-10-15'
),
(
  'How to build a scalable business in the 21st Century', 
  'Mohsin Salya is a billionaire philanthropist teaching young entrepreneurs how to make it.', 
  '<p>The 21st century offers unique challenges and opportunities. Understanding global networks is key...</p>',
  'Strategy', 
  '/assets/real-estate.jpg', 
  '10 min read',
  '2025-10-15'
);
