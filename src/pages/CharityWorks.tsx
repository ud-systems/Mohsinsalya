import { useEffect, useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { VideoPlayer } from '@/components/ui/video-player';
import { useIsMobile } from '@/hooks/use-mobile';
import { Counter } from '@/components/ui/counter';

interface CharityWork {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  location: string;
  work_date: string;
  image_url: string;
  order_index: number;
}

const CharityWorks = () => {
  const isMobile = useIsMobile();
  const [works, setWorks] = useState<CharityWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    skipSnaps: false,
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
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('charity_works')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setWorks(data || []);
      } catch (error) {
        console.error('Error fetching charity works:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchVideo = async () => {
      const { data } = await supabase
        .from('media_settings')
        .select('url')
        .eq('key', 'charity_video')
        .single();
      if (data) setVideoUrl(data.url);
    };

    fetchWorks();
    fetchVideo();
  }, []);

  return (
    <div className="frame-outer min-h-screen bg-[#f5f0e8]">
      <SEO />
      <Navigation />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
            <ScrollReveal>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary font-serif italic justify-start">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  <span>Impact Beyond Borders</span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium leading-none tracking-tight text-[#1a1a1a]">
                  Charity Works
                </h1>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="max-w-md text-left md:text-right pb-2">
              <p className="text-[#1a1a1a]/70 font-sans text-sm md:text-base leading-relaxed">
                A legacy built on compassion and strategic giving. Explore the journey of making a difference across continents.
              </p>
            </ScrollReveal>
          </div>

          {/* Video Section */}
          <ScrollReveal delay={0.25} className="mb-20">
            <VideoPlayer 
              src={videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-11-large.mp4"} 
              className="w-full aspect-video rounded-[20px] md:rounded-[30px] shadow-2xl"
            />
          </ScrollReveal>

          {/* Carousel Section */}
          <div className="relative mb-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="display-sm md:display-md uppercase tracking-tight text-left">Philanthropic Initiatives</h2>
              {!isMobile && (
                <div className="flex gap-4">
                  <button 
                    onClick={scrollPrev}
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={scrollNext}
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4 md:-ml-8">
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex-[0_0_88%] md:flex-[0_0_33.33%] min-w-0 pl-4 md:pl-8">
                      <div className="h-[450px] md:h-[500px] rounded-[30px] md:rounded-[40px] bg-black/5 animate-pulse" />
                    </div>
                  ))
                ) : (
                  works.map((work, index) => (
                    <div key={work.id} className="flex-[0_0_88%] md:flex-[0_0_33.33%] min-w-0 pl-4 md:pl-8">
                      <ScrollReveal delay={index * 0.1}>
                        <div className="flex flex-col h-[500px] md:h-[600px] group cursor-grab active:cursor-grabbing">
                          {/* Header - Dark Green/Black */}
                          <div className="bg-[#1a2e26] text-white rounded-t-[30px] md:rounded-t-[40px] pt-10 md:pt-12 pb-6 md:pb-8 px-6 md:px-8 relative overflow-hidden flex flex-col items-center text-center">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-sans font-semibold leading-tight tracking-tight max-w-[280px] line-clamp-2 min-h-[3rem] md:min-h-[4.5rem]">
                              {work.title}
                            </h3>
                          </div>

                          {/* Body - Light Green/Sage */}
                          <div className="bg-[#d4e6d9] flex-1 rounded-b-[30px] md:rounded-b-[40px] p-6 md:p-8 flex flex-col items-center text-center space-y-4 md:space-y-6">
                            <div className="w-full">
                              <p className="text-xs md:text-base font-sans font-medium text-[#1a2e26]/80 leading-relaxed line-clamp-2 md:line-clamp-none">
                                {work.subtitle}
                              </p>
                            </div>

                            {/* Dotted Divider */}
                            <div className="w-full border-t border-dashed border-[#1a2e26]/20" />

                            <div className="overflow-y-auto pr-1 md:pr-2 custom-scrollbar flex-1 text-left md:text-center w-full">
                              <p className="text-xs md:text-sm font-sans text-[#1a2e26]/70 leading-relaxed">
                                {work.description}
                              </p>
                            </div>

                            {/* Optional: Second Dotted Divider if content is long */}
                            <div className="w-full border-t border-dashed border-[#1a2e26]/20" />
                            
                            <div className="pt-2">
                               <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-[#1a2e26]/40">
                                 Impact Area: {work.location}
                               </p>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Navigation dots - mobile only, limited to 4 for better UIUX */}
            {isMobile && (
              <div className="flex justify-center gap-2 mt-8">
                {scrollSnaps.slice(0, 4).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    className={cn(
                      "h-1 transition-all duration-300 rounded-full",
                      selectedIndex % 4 === index ? "w-8 bg-[#1a2e26]" : "w-2 bg-[#1a2e26]/20"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Statistics Summary */}
          <ScrollReveal delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-black/10">
              <div className="text-center space-y-1">
                <Counter from={0} to={3} suffix="M+" className="block text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a]" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 font-sans">Pounds Donated</span>
              </div>
              <div className="text-center space-y-1">
                <Counter from={0} to={27} suffix="+" className="block text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a]" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 font-sans">Countries</span>
              </div>
              <div className="text-center space-y-1">
                <Counter from={0} to={100} suffix="M+" className="block text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a]" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 font-sans">Crowd Funded</span>
              </div>
              <div className="text-center space-y-1">
                <Counter from={0} to={4} suffix="+" className="block text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a]" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 font-sans">Continents</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CharityWorks;
