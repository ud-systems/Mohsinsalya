import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl, cn } from '@/lib/utils';
import { Plus, ArrowDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect, useCallback } from 'react';

const Insights = () => {
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const { data: insights, isLoading } = useQuery({
    queryKey: ['all-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="frame-outer min-h-screen flex items-center justify-center bg-background">
        <p className="body-md animate-pulse">Loading insights...</p>
      </div>
    );
  }

  const featuredInsight = insights?.[0];
  const otherInsights = insights?.slice(1) || [];

  return (
    <div className="frame-outer bg-background noise-overlay">
      <SEO />
      <Navigation />
      
      <main className="pt-32 pb-16 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">
              <div className="flex-1">
                <p className="font-serif italic text-xl text-muted-foreground mb-2">Mohsin Salya's</p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-serif font-medium leading-[1.1] tracking-tight mb-8 whitespace-nowrap">
                  Expert Insights
                </h1>
              </div>
              
              <div className="lg:max-w-xs lg:pt-12">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  In a world of constant change, Mohsin shares grounded perspectives shaped by three decades of building, adapting, and leading.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Insights Grid */}
        <div className="space-y-6">
          {/* First Row: Featured + 1 Normal Card (Same Height) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Featured Insight */}
            {featuredInsight && (
              <ScrollReveal className="lg:col-span-3">
                <Link 
                  to={`/insights/${featuredInsight.id}`} 
                  className="group block relative h-full aspect-[16/9] lg:aspect-auto rounded-[2rem] overflow-hidden bg-muted"
                >
                  <img 
                    src={resolveImageUrl(featuredInsight.image_url) || '/placeholder.svg'} 
                    alt={featuredInsight.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white max-w-xl">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2 md:mb-4 opacity-80">
                      {new Date(featuredInsight.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-medium mb-2 md:mb-4 leading-tight">
                      {featuredInsight.title}
                    </h2>
                    <p className="text-[10px] md:text-sm opacity-80 line-clamp-2">
                      {featuredInsight.excerpt}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* ONE Normal Card next to it */}
            {otherInsights[0] && (
              <ScrollReveal className="hidden lg:block lg:col-span-1 h-full">
                <Link to={`/insights/${otherInsights[0].id}`} className="group block bg-white rounded-[2rem] overflow-hidden h-full border border-black/5 hover:border-black/10 transition-colors">
                  <div className="p-8 flex flex-col h-full">
                    <div className="relative flex-shrink-0 aspect-square rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={resolveImageUrl(otherInsights[0].image_url) || '/placeholder.svg'} 
                        alt={otherInsights[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Plus size={20} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        {new Date(otherInsights[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h3 className="text-2xl font-serif font-medium leading-tight mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                        {otherInsights[0].title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {otherInsights[0].excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}
          </div>

          {/* Remaining Insights Grid (4 columns or Carousel on Mobile) */}
          {isMobile ? (
            <div className="space-y-6">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                  {otherInsights.map((insight) => (
                    <div key={insight.id} className="flex-[0_0_85%] min-w-0">
                      <ScrollReveal>
                        <Link to={`/insights/${insight.id}`} className="group block bg-white rounded-[1.5rem] overflow-hidden h-full border border-black/5">
                          <div className="p-5 flex flex-col h-full">
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-6">
                              <img 
                                src={resolveImageUrl(insight.image_url) || '/placeholder.svg'} 
                                alt={insight.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                                  <Plus size={14} />
                                </div>
                              </div>
                            </div>
                            <div className="mt-auto">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                                {new Date(insight.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </p>
                              <h3 className="text-lg font-serif font-medium leading-tight mb-3 line-clamp-2">
                                {insight.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {insight.excerpt}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </ScrollReveal>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Flattened Dots Navigation */}
              <div className="flex justify-center gap-2 mt-4">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={cn(
                      "h-1 transition-all duration-300 rounded-full",
                      selectedIndex === index ? "w-8 bg-black" : "w-4 bg-black/10"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherInsights.slice(1).map((insight) => (
                <ScrollReveal key={insight.id}>
                  <Link to={`/insights/${insight.id}`} className="group block bg-white rounded-[1.5rem] overflow-hidden h-full border border-black/5 hover:border-black/10 transition-colors">
                    <div className="p-5 flex flex-col h-full">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-6">
                        <img 
                          src={resolveImageUrl(insight.image_url) || '/placeholder.svg'} 
                          alt={insight.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Plus size={14} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                          {new Date(insight.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <h3 className="text-lg font-serif font-medium leading-tight mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                          {insight.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {insight.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Read More Section */}
        <div className="mt-20 text-center">
          <button className="inline-flex items-center gap-3 text-sm font-sans font-bold tracking-[0.2em] uppercase hover:text-accent transition-colors group">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all">
              <ArrowDown size={18} />
            </div>
            Read More Blogs
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Insights;
