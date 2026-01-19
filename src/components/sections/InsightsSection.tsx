import { useState, useCallback, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveImageUrl, cn } from '@/lib/utils';
import realEstate from '@/assets/real-estate.jpg';
import luxuryRetail from '@/assets/luxury-retail.jpg';
import fashionModel from '@/assets/fashion-model.jpg';
import podcastInterview from '@/assets/podcast-interview.jpg';
import heroPortrait from '@/assets/hero-portrait.jpg';

interface Insight {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date?: string;
  image_url?: string | null;
}

interface InsightsSectionProps {
  insights?: Insight[];
  isLoading?: boolean;
}

const defaultInsights: Insight[] = [
  {
    id: '1',
    title: 'The Future of Luxury Retail in the Digital Age',
    excerpt: 'How traditional luxury brands are adapting to meet the expectations of a new generation of conscious consumers.',
    category: 'Retail',
    date: '15th November 2025',
  },
  {
    id: '2',
    title: 'Building Sustainable Real Estate Ventures',
    excerpt: 'Strategic approaches to developing properties that balance profitability with environmental responsibility.',
    category: 'Real Estate',
    date: '22nd September 2025',
  },
  {
    id: '3',
    title: 'How does Money affect the output of businesses and how to avoid it',
    excerpt: 'Teaching young entrepreneurs how to be rich through struggles.',
    category: 'Business',
    date: '1st October 2025',
  },
  {
    id: '4',
    title: 'Fashion Industry Transformation',
    excerpt: 'From fast fashion to sustainable style: the evolution of consumer consciousness and brand adaptation.',
    category: 'Fashion',
    date: '8th August 2025',
  },
  {
    id: '5',
    title: 'Investment Strategies for 2026',
    excerpt: 'Navigating volatile markets with a long-term vision and disciplined approach.',
    category: 'Investment',
    date: '3rd July 2025',
  },
  {
    id: '6',
    title: 'Leadership Principles for Modern Entrepreneurs',
    excerpt: 'Essential qualities and mindsets that separate successful leaders from the rest in today\'s competitive landscape.',
    category: 'Leadership',
    date: '18th June 2025',
  },
  {
    id: '7',
    title: 'Global Market Expansion Strategies',
    excerpt: 'Lessons learned from expanding businesses across continents and navigating diverse cultural and economic landscapes.',
    category: 'Business',
    date: '5th May 2025',
  },
  {
    id: '8',
    title: 'The Art of Building Lasting Brands',
    excerpt: 'Creating brand value that transcends trends and builds genuine connections with customers over decades.',
    category: 'Branding',
    date: '12th April 2025',
  },
  {
    id: '9',
    title: 'Technology Integration in Traditional Industries',
    excerpt: 'How to leverage modern technology while preserving the core values and craftsmanship of traditional business models.',
    category: 'Technology',
    date: '28th March 2025',
  },
];

const insightImages = [podcastInterview, heroPortrait, realEstate, luxuryRetail, fashionModel, podcastInterview, heroPortrait, realEstate, luxuryRetail];

export function InsightsSection({ insights, isLoading }: InsightsSectionProps) {
  const isMobile = useIsMobile();
  const allInsights = insights && insights.length > 0 ? insights : defaultInsights;
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: allInsights.length > 1,
      align: 'center',
      containScroll: false,
      slidesToScroll: 1,
      duration: 30, // Slightly slower for better control
    }
  );
  
  const centerIndex = Math.floor(allInsights.length / 2);
  const [selectedIndex, setSelectedIndex] = useState(centerIndex);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // Update selected index and scroll progress on scroll
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    const onScroll = () => {
      const progress = emblaApi.scrollProgress();
      setScrollProgress(progress);
    };
    
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    onSelect(); // Initial call
    onScroll(); // Initial call
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
    };
  }, [emblaApi]);

  // Initialize to center card on mount
  useEffect(() => {
    if (emblaApi && allInsights.length > 0) {
      emblaApi.scrollTo(centerIndex, false); // false = no animation on initial load
    }
  }, [emblaApi, centerIndex, allInsights.length]);

  if (allInsights.length === 0) return null;

  return (
    <section id="insights" className="frame-container bg-[#1a1a1a] text-white noise-overlay relative overflow-hidden w-full">
      <div className="py-12 sm:py-16 md:py-20 px-6 sm:px-10 md:px-16 max-w-6xl mx-auto overflow-hidden">
        {/* Header */}
        <ScrollReveal className="mb-10 sm:mb-14">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-12">
            <div>
              <p className="font-serif italic text-lg sm:text-xl text-gray-300 mb-2">Mohsin Salya's</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[0.95] tracking-tight mb-4">
                Expert Insights
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Entrepreneurship. Discipline. Legacy.</span>
              </div>
            </div>
            <p className="max-w-sm text-gray-400 text-sm sm:text-base leading-relaxed lg:text-right">
              In a world of constant change, Mohsin shares grounded perspectives shaped by three decades of building, adapting, and leading.
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden">
          {/* Navigation Arrows - Hidden on Mobile */}
          {!isMobile && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#2a2a2a]/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#2a2a2a]/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Embla Carousel with Coverflow */}
          <div 
            className="overflow-hidden px-2 sm:px-4 py-8 w-full relative" 
            ref={emblaRef} 
            style={{ perspective: '1200px' }}
          >
            <div className="flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              {allInsights.map((insight, index) => {
                // Calculate circular distance for loop support
                let offset = index - selectedIndex;
                if (allInsights.length > 2) {
                  const half = allInsights.length / 2;
                  if (offset > half) offset -= allInsights.length;
                  if (offset < -half) offset += allInsights.length;
                }
                
                const absOffset = Math.abs(offset);
                const isActive = absOffset < 0.5;
                
                // Remove remnant: If the card is too far from center, hide it
                // We only want to see the active one and the two immediate neighbors
                const isVisible = absOffset <= 1.5;
                
                // Calculate 3D transform values for coverflow effect
                const rotateY = offset * 35; 
                const scale = isActive ? 1 : Math.max(0.75, 1 - absOffset * 0.15);
                const translateZ = isActive ? 0 : -absOffset * 150; // More depth
                const opacity = isActive ? 1 : (isVisible ? Math.max(0.2, 0.8 - absOffset * 0.3) : 0);
                
                // Pull cards inward for overlap on desktop
                const translateX = isMobile ? 0 : offset * -40; 
                
                return (
                  <div
                    key={insight.id}
                    className="flex-shrink-0 flex justify-center"
                    style={{ 
                      flex: isMobile ? '0 0 100%' : '0 0 33.333%',
                      position: 'relative',
                      zIndex: isActive ? 20 : Math.max(1, 20 - Math.floor(absOffset * 2)),
                      transformStyle: 'preserve-3d',
                      visibility: isVisible ? 'visible' : 'hidden', // Ensure far away cards are hidden
                    }}
                  >
                    <Link
                      to={`/insights/${insight.id}`}
                      className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-500 ease-out mx-auto block"
                      style={{
                        width: isMobile ? '85%' : '100%', // Bigger cards on mobile
                        maxWidth: isMobile ? '450px' : '450px', // Increased from 400px
                        aspectRatio: '1 / 1',
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity: opacity,
                        filter: isActive ? 'grayscale(0) brightness(1)' : 'grayscale(0.5) brightness(0.6)',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                      }}
                      onClick={(e) => {
                        if (!isActive) {
                          e.preventDefault();
                          emblaApi?.scrollTo(index);
                        }
                      }}
                    >
                      {/* Image */}
                      <img
                        src={resolveImageUrl(insight.image_url) || insightImages[index % insightImages.length]}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay - only visible on active */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                      )}
                      
                      {/* Content - only on active card */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-1.5">{insight.date || '1st October 2025'}</p>
                          <h3 className="font-serif text-base sm:text-lg font-medium leading-snug mb-1.5 line-clamp-2">
                            {insight.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {insight.excerpt}
                          </p>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation - Mobile Only */}
          {isMobile && (
            <div className="flex justify-center gap-2 mt-4">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-1 transition-all duration-300 rounded-full",
                    selectedIndex === index ? "w-8 bg-[#9b9b6b]" : "w-4 bg-[#9b9b6b]/20"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.2} className="mt-10 sm:mt-14 text-center">
          <Link 
            to="/insights" 
            className="inline-flex items-center gap-2 text-lg sm:text-xl font-serif hover:text-[#9b9b6b] transition-colors group"
          >
            <span>Learn More From my Insights</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
