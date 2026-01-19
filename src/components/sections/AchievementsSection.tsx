import { useState, useCallback, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import useEmblaCarousel from 'embla-carousel-react';
import { cn, resolveImageUrl } from '@/lib/utils';
import achievement1 from '@/assets/achievements/achievement1.webp';
import achievement2 from '@/assets/achievements/achievement2.webp';
import achievement3 from '@/assets/achievements/achievement3.webp';
import achievement4 from '@/assets/achievements/achievement4.webp';

interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image_url: string;
}

interface AchievementsSectionProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'POWER',
    category: 'ACHIEVEMENT',
    image_url: achievement1,
  },
  {
    id: '2',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'POWER',
    category: 'ACHIEVEMENT',
    image_url: achievement2,
  },
  {
    id: '3',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'POWER',
    category: 'ACHIEVEMENT',
    image_url: achievement3,
  },
  {
    id: '4',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'POWER',
    category: 'ACHIEVEMENT',
    image_url: achievement4,
  },
];

export function AchievementsSection({ achievements, isLoading }: AchievementsSectionProps) {
  const allAchievements = achievements && achievements.length > 0 ? achievements : defaultAchievements;
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { active: false } // Disable carousel on desktop/tablet
    }
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

  if (allAchievements.length === 0) return null;

  return (
    <section id="achievements" className="frame-container noise-overlay py-12 sm:py-16 md:py-20">
      <div className="px-6 sm:px-10 md:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-12 sm:mb-16">
          <div className="space-y-8">
            <div>
              <p className="font-serif italic text-lg sm:text-xl text-muted-foreground mb-2">Mohsin Salya's</p>
              <h2 className="display-xl">
                World Of Achievements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div>
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest mb-4">
                  <span>BUILT THROUGH TIME</span>
                </div>
              </div>
              <div>
                <p className="body-md text-muted-foreground leading-relaxed">
                  Across markets, Mohsin's success is measured not by scale alone but by endurance, the ability to adapt, diversify, and rise stronger with every challenge.
                </p>
              </div>
              <div className="md:text-right">
                <p className="body-md text-muted-foreground italic max-w-xs md:ml-auto">
                  Power is the quiet reward of perseverance, Each milestone reflects a single truth: great empires are built, not born.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel / Grid Container */}
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allAchievements.map((achievement, index) => (
              <div key={achievement.id} className="flex-[0_0_100%] min-w-0 sm:flex-none">
                <ScrollReveal delay={index * 0.1}>
                  <div className="group bg-white rounded-[12px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full mx-1 sm:mx-0">
                    {/* Image Container */}
                    <div className="p-3 aspect-[3/4] overflow-hidden">
                                  <img
                                    src={resolveImageUrl(achievement.image_url)}
                                    alt={achievement.title}
                                    className="w-full h-full object-contain rounded-[8px] transition-transform duration-700 group-hover:scale-[1.02]"
                                  />
                    </div>
                    {/* Content Container */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-serif text-lg leading-snug mb-4 text-[#1a1a1a]">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-black tracking-tighter text-[#1a1a1a] font-sans uppercase">
                          {achievement.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Dots Navigation - Mobile Only */}
          <div className="flex sm:hidden justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1 transition-all duration-300 rounded-full",
                  selectedIndex === index ? "w-8 bg-primary" : "w-4 bg-primary/20"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
