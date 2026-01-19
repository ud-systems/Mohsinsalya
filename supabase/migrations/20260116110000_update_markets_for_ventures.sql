-- Update markets to match the screenshot and ensure "Philanthropy & Impact" is included
DELETE FROM markets WHERE title IN ('Fashion Industry Footprint', 'FMCG Networks', 'Property & Real Estate', 'Luxury Collectibles', 'LUXURY AND COLLECTIBLES', 'PHILANTHROPY & IMPACT');

INSERT INTO markets (name, title, description, image_url, order_index)
VALUES 
('Luxury and Collectibles', 'LUXURY AND COLLECTIBLES', 'Curating exceptional pieces from around the world, building collections that appreciate in value and tell stories of craftsmanship, heritage, and timeless design.', '/assets/luxury.webp', 0),
('Philanthropy & Impact', 'PHILANTHROPY & IMPACT', 'Dedicated to creating lasting positive change through strategic giving and impactful community initiatives worldwide.', '/assets/philanthropy.webp', 1),
('Property & Real Estate', 'PROPERTY & REAL ESTATE', 'Strategic investments across prime locations, developing properties that redefine urban living and commercial excellence.', '/assets/real-estate.webp', 2),
('Fashion & FMCG', 'FASHION & FMCG', 'Building distribution networks and brands that connect with consumers at scale across global markets.', '/assets/fashion.webp', 3);
