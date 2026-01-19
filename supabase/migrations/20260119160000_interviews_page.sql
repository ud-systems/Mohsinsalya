-- Create interviews content table
CREATE TABLE IF NOT EXISTS interviews_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_description TEXT NOT NULL,
    hero_image_url TEXT,
    philosophy_title TEXT NOT NULL,
    philosophy_subtitle TEXT NOT NULL,
    growth_title TEXT NOT NULL,
    growth_subtitle TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create interviews Q&A table
CREATE TABLE IF NOT EXISTS interviews_qa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE interviews_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews_qa ENABLE ROW LEVEL SECURITY;

-- Create policies (Assuming public read, admin write)
CREATE POLICY "Public read interviews_content" ON interviews_content FOR SELECT USING (true);
CREATE POLICY "Admin write interviews_content" ON interviews_content FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read interviews_qa" ON interviews_qa FOR SELECT USING (true);
CREATE POLICY "Admin write interviews_qa" ON interviews_qa FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO interviews_content (
    hero_title, 
    hero_subtitle, 
    hero_description,
    philosophy_title,
    philosophy_subtitle,
    growth_title,
    growth_subtitle
) VALUES (
    'Conversations With Mohsin (CEO)',
    'BUILDING BUSINESSES, REBUILDING STANDARDS',
    'This dialogue offers an inside look at the principles that shape Mohsin’s leadership, from the lessons forged through challenges to the frameworks that guide his decision-making today. It reflects his journey of rebuilding with clarity, cultivating disciplined systems, and leading an organisation where purpose, structure, and impact align.',
    '“Speed without structure is just debt.”',
    'Mohsin’s philosophy on growth is grounded in governance, not haste. He has often emphasised that acceleration without systems eventually collapses under its own momentum. His approach places structure first, financial discipline, clear incentives, and transparent audits, allowing speed to emerge as a by-product of stability rather than chaos.',
    'Your life choices shape your direction, choose with intention.',
    'At a pivotal point in his career, Mohsin recognised that the standards he expected from others were not the standards he was consistently applying to himself. That realisation became a reset; a return to clarity, discipline, and uncompromised structure. From simplifying his systems to insisting on transparent contracts and measurable work, he rebuilt with intention, proving that sustainable progress begins with personal alignment.'
);

INSERT INTO interviews_qa (question, answer, order_index) VALUES 
('Looking back, how do you describe the earlier chapter of your career?', 'In the early phase of my career, I chased pace. I prioritised outcomes over the method, which was a poor judgment. I’m not here to dramatise it or dilute it. I own it. The real lesson was simple: speed without structure eventually becomes a liability. Once I accepted that, I drew a clear line and rebuilt on clean ground with the operating system I should have had from day one.', 1),
('What do you believe led to the misjudgment in that phase?', 'Overconfidence from early wins. You start believing you’re the exception, not the rule. You imitate outliers and forget the graveyard beneath them. And you convince yourself that momentum will cover the gaps in the process. Today, I don’t rely on instinct alone; I rely on design. We run premortems, red-team assumptions, and apply a mandatory cooling-off period to anything that looks “too good to be true.” Intelligence helps, but it’s discipline that keeps you safe.', 2),
('Was there a specific moment that pushed you to reset?', 'Yes. It was the moment I realised the standard I expected from others wasn’t the standard I was holding myself to. That discomfort was enough. I paused, stripped my life back to essentials, and rebuilt from zero, small wins that could be audited, plain-language agreements, and a weekly rhythm anyone could inspect. No shortcuts. No grey areas. Just clean, verifiable work.', 3),
('You often speak about honesty without self-punishment. What does responsible transparency look like to you?', 'For me, it means naming my part clearly- “I made a bad call chasing speed” and then making sure the correction shows up in systems, not just speeches. I acknowledge the consequences, I completed what was required of me, and I returned with higher standards. Accountability doesn’t need theatrics; it needs consistency.', 4),
('How did your leadership approach change after that experience?', 'The tone changed first. I operate as if every major decision will be explained ten years later with every document on the table. Governance became non-negotiable, board-level oversight, aligned incentives, and quarterly independent checks. And culturally, we reinforced a simple rule: compliance isn’t admin. It’s part of the product. If something can’t pass audit, it can’t pass go.', 5),
('When you say “starting from zero,” what did that practically involve?', 'I focused on businesses grounded in real cash flow, not noise. I built rhythm: weekly KPI scorecards, monthly working-capital reviews, and quarterly third-party audits. Incentives were rewritten so people were rewarded for clean outcomes, not heroic stories. And everything moved from verbal to written. If it isn’t written, it doesn’t exist.', 6),
('How do you build a culture that avoids clever shortcuts?', 'Clarity and incentives. Ambiguous phrases like “do whatever it takes” are banned. We publish guardrails, legal, tax, and operational, so people know exactly where the line is. And pay is linked to audited KPIs, not narratives. People follow what you measure; so measure what protects the firm.', 7),
('What’s your personal “sleep test” as a CEO?', 'Two filters:\n1. Could I defend this decision to a regulator or board in ten years, with the documents on the table?\n2. Would I feel proud explaining it to my family tonight?\nIf either answer is no, the deal doesn’t move, no matter how attractive the upside seems.', 8),
('Where do structure and compliance create commercial value?', 'Uncertainty is where friction lives. When contracts, reporting, and controls are clean, partners move faster, banks price lower risk, and customers stay longer. Clean processes aren’t just ethical, they’re a competitive advantage.', 9),
('What principles now prevent you from repeating old mistakes?', 'I don’t operate in grey zones. I don’t outsource judgment to momentum. And I won’t trade reputation for velocity. If the method isn’t right, the result isn’t worth it.', 10),
('What do you optimise for as a CEO today?', 'Predictable cash flow, defensible moats, and teams that can operate independently. Our scoreboard is intentionally boring: cash conversion, retention, complaint rate, audit pass rate, and partner NPS. If those are healthy, growth compounds on their own.', 11),
('What advice would you give a founder tempted by “easy money”?', 'Easy money charges brutal interest. Build the system first, governance, incentives, cash discipline, audits, and then accelerate. Real speed is a by-product of structure.', 12),
('How did the setback change you personally, not just professionally?', 'It forced stillness. It stripped away noise, ego, and the illusion of invincibility. I had to examine the conditions I’d created around myself, and the blind spots I’d ignored. It rebuilt my relationship with discipline and clarified the kind of leader I wanted to become.', 13),
('How do you think about risk differently now?', 'Risk used to look like numbers and opportunity. Now I see it as behaviour and environment. If the people, incentives, and systems are misaligned, the risk is already baked in. Today, if something doesn’t feel structurally sound, we don’t proceed, even if the economics look perfect.', 14),
('What does discipline mean to you today?', 'Discipline is consistency without mood. It’s doing the work when no one is watching, documenting every step, and holding yourself to the same standards you expect from the organisation. It’s the backbone of trust.', 15),
('What kind of legacy do you want your leadership to leave?', 'A culture where clarity replaces chaos, and discipline outlives the founder. If the organisation can run with integrity without me, then I’ve done my job.', 16);
