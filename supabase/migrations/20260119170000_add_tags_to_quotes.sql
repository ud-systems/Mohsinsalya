-- Add tags column to biography_quotes
ALTER TABLE biography_quotes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Clear existing quotes to make room for the new set (optional, but requested new ones for homepage)
-- DELETE FROM biography_quotes;

-- Insert new quotes with 'homepage' tag
INSERT INTO biography_quotes (quote, order_index, tags) VALUES 
('Every chapter of my life has taught me the same enduring truth: discipline builds durability. Talent may start the journey, but only discipline carries you through the storms, the risks, and the rebuilding. It is the quiet force that keeps success standing long after momentum fades.', 0, ARRAY['homepage']),
('I didn’t inherit the opportunity; I built it, one risk at a time. Every decision, every shift, every leap came from believing in possibilities long before they were visible. The journey wasn’t handed down; it was carved out with conviction, consistency, and courage.', 1, ARRAY['homepage']),
('Setbacks didn’t break me; they refined my focus. Losses didn’t define me; they shaped my legacy. With each fall came a moment of clarity, a recalibration that made me sharper, steadier, and more certain of the path I was meant to build.', 2, ARRAY['homepage']),
('My true measure of wealth has always been time, the freedom to choose what I build next. Success, for me, is not counted in numbers but in the ability to decide where my energy, discipline, and purpose go next.', 3, ARRAY['homepage']),
('You can scale a company with strategy, but sustaining a legacy requires character. Growth can be engineered, but endurance, the kind that outlives you, comes only from integrity, patience, and the principles you refuse to compromise.', 4, ARRAY['homepage']);
