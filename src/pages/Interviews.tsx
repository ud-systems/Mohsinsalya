import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { BiographyHero } from '@/components/sections/BiographyHero';
import { CTASection } from '@/components/sections/CTASection';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Interviews = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: interviewContent, isLoading: contentLoading } = useQuery({
    queryKey: ['interviews_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews_content')
        .select('*')
        .single();
      if (error) return null;
      return data;
    },
  });

  const { data: qaData, isLoading: qaLoading } = useQuery({
    queryKey: ['interviews_qa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews_qa')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

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
      <SEO 
        title="Interviews | Mohsin Salya"
        description="Conversations With Mohsin (CEO) - A deep dive into the frameworks of discipline, governance, and rebuilding with intention."
        type="article"
      />
      <Navigation />
      
      <main className="space-y-4">
        {/* Reuse BiographyHero style with Carousel */}
        <BiographyHero 
          data={interviewContent ? {
            hero_title: interviewContent.hero_title,
            hero_subtitle: interviewContent.hero_subtitle,
            hero_description: interviewContent.hero_description,
            hero_quote: 'Mohsin Salya',
            hero_image_url: interviewContent.hero_image_url || '/assets/podcast-interview.jpg'
          } : null} 
          isLoading={contentLoading} 
          slides={interviewContent ? [
            { 
              description: interviewContent.hero_description, 
              quote: 'Mohsin Salya' 
            },
            { 
              description: interviewContent.philosophy_subtitle, 
              quote: interviewContent.philosophy_title 
            },
            { 
              description: interviewContent.growth_subtitle, 
              quote: interviewContent.growth_title 
            }
          ] : []}
        />
        
        {/* Q&A Section with Stacking Effect */}
        <section className="frame-container frame-container-light pt-32 pb-20 relative overflow-visible">
          {/* Section Title - Moves with scroll until cards start stacking */}
          <div className="max-w-4xl mx-auto px-6 mb-24 text-center">
            <ScrollReveal>
              <div className="section-label mx-auto mb-4 uppercase tracking-widest text-xs font-sans">The Dialogue</div>
              <h2 className="display-md font-serif">The Operating System of Leadership</h2>
              <p className="body-md text-muted-foreground mt-4 max-w-xl mx-auto">
                A deep dive into the frameworks of discipline, governance, and rebuilding with intention.
              </p>
            </ScrollReveal>
          </div>

          {/* Stacking Cards Container - This defines the scroll length */}
          <div 
            className="relative max-w-5xl mx-auto px-6" 
            style={{ 
              height: qaData ? `${(qaData.length * 50) + 100}vh` : 'auto' 
            }}
          >
            {qaLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="h-8 bg-black/5 rounded w-3/4" />
                    <div className="h-20 bg-black/5 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              qaData?.map((item, index) => (
                <div 
                  key={item.id} 
                  className="sticky" 
                  style={{ 
                    top: `calc(8rem + ${index * 5}px)`,
                    zIndex: index + 1,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-50px" }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      scale: 1 + (index * 0.005),
                    }}
                    className={cn(
                      "p-8 md:p-12 rounded-[40px] border border-black/[0.08] group min-h-[450px] md:min-h-[500px] flex flex-col justify-center transition-all duration-700",
                      index % 2 === 0 ? "bg-white" : "bg-[#FDFDFD]",
                      "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]"
                    )}
                  >
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <span className="text-accent font-serif text-2xl opacity-40">Q{index + 1}.</span>
                        <h3 className="text-2xl md:text-3xl font-serif leading-tight group-hover:text-accent transition-colors duration-500">
                          {item.question}
                        </h3>
                      </div>
                      
                      <div className="flex gap-8">
                        <div className="w-px bg-gradient-to-b from-accent to-transparent h-full min-h-[100px] opacity-20 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">MS RESPONDED</span>
                            <div className="h-px w-8 bg-accent/20" />
                          </div>
                          <p className="body-lg text-muted-foreground leading-relaxed whitespace-pre-line font-sans antialiased">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))
            )}
          </div>
          
          {/* Spacer to allow the final stack to be seen before next section */}
          <div className="h-[20vh]" />
        </section>

        <CTASection settings={ctaData} isLoading={ctaLoading} />
      </main>
      
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default Interviews;
