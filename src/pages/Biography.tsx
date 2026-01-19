import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { BiographyHero } from '@/components/sections/BiographyHero';
import { BiographySection } from '@/components/sections/BiographySection';
import { BiographyMilestones } from '@/components/sections/BiographyMilestones';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const Biography = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Fetch Milestones
  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['biography_milestones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biography_milestones')
        .select('*')
        .order('order_index', { ascending: true });
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

  return (
    <div className="frame-outer">
      <SEO />
      <Navigation />
      
      <main className="space-y-4">
        <BiographyHero data={bioData} isLoading={bioLoading} />
        
        <div id="about">
          <BiographySection 
            data={bioData} 
            quotes={quotes} 
            isLoading={bioLoading || quotesLoading} 
          />
        </div>

        <BiographyMilestones 
          milestones={milestones || []} 
          isLoading={milestonesLoading} 
        />

        <CTASection settings={ctaData} isLoading={ctaLoading} />
      </main>
      
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Biography;
