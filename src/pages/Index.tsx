import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { HeroSection } from '@/components/sections/HeroSection';
import { BiographySection } from '@/components/sections/BiographySection';
import { MarketsSection } from '@/components/sections/MarketsSection';
import { InsightsSection } from '@/components/sections/InsightsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { CharityWorksSection } from '@/components/sections/CharityWorksSection';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Fetch Hero Data
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();
      if (error) return null;
      return data;
    },
  });

  // Fetch Biography Data
  const { data: bioData, isLoading: bioLoading } = useQuery({
    queryKey: ['biography'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biography_content')
        .select('*')
        .single();
      if (error) return null;
      return data;
    },
  });

  // Fetch Quotes
  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biography_quotes')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Markets
  const { data: markets, isLoading: marketsLoading } = useQuery({
    queryKey: ['markets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) return [];
      return data;
    },
  });

  // Fetch Achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Charity Works
  const { data: charityWorks, isLoading: charityLoading } = useQuery({
    queryKey: ['charity_works'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charity_works')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Charity Quotes
  const { data: charityQuotes, isLoading: charityQuotesLoading } = useQuery({
    queryKey: ['charity_quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('charity_quotes')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  // Fetch Media Settings
  const { data: mediaData } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('media_settings').select('*');
      if (error) return [];
      return data;
    },
  });

  // Fetch CTA Data
  const { data: ctaData, isLoading: ctaLoading } = useQuery({
    queryKey: ['cta'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_settings')
        .select('*')
        .single();
      if (error) return null;
      return data;
    },
  });

  const heroVideo = mediaData?.find(m => m.key === 'hero_video')?.url;
  const charityVideo = mediaData?.find(m => m.key === 'charity_video')?.url;

  return (
    <div className="frame-outer">
      <SEO />
      <Navigation />
      
      <main className="space-y-4">
        <HeroSection data={heroData} isLoading={heroLoading} videoUrl={heroVideo} />
        <BiographySection 
          data={bioData} 
          quotes={quotes} 
          isLoading={bioLoading || quotesLoading} 
          tag="homepage"
          descriptionOverride="From UK fashion to Dubai real estate, Mohsin Salya has built ventures across continents with focus, foresight, and disciplined growth."
        />
        <MarketsSection 
          markets={markets} 
          stats={stats} 
          isLoading={marketsLoading || statsLoading} 
        />
        <InsightsSection insights={insights} isLoading={insightsLoading} />
        <AchievementsSection achievements={achievements} isLoading={achievementsLoading} />
        <CharityWorksSection 
          works={charityWorks} 
          quotes={quotes} 
          isLoading={charityLoading || charityQuotesLoading} 
          tag="charity"
        />
        <CTASection settings={ctaData} isLoading={ctaLoading} />
      </main>
      
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
