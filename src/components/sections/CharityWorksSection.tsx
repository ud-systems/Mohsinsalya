import { useState, useCallback, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import useEmblaCarousel from 'embla-carousel-react';
import { cn, resolveImageUrl } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import heroPortrait from '@/assets/hero-portrait.jpg';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface CharityWork {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image_url: string;
  location?: string;
  work_date?: string;
  description?: string;
}

interface CharityQuote {
  id: string;
  quote: string;
  author_name?: string;
  author_title?: string;
}

interface CharityWorksSectionProps {
  works?: CharityWork[];
  quotes?: CharityQuote[];
  isLoading?: boolean;
}

const defaultWorks: CharityWork[] = [
  {
    id: '1',
    title: 'Supporting global education initiatives for underprivileged children',
    subtitle: 'IMPACT',
    category: 'CHARITY',
    image_url: '/src/assets/podcast-interview.jpg',
    location: 'Africa - Tanzania',
    work_date: '2021-05-15',
    description: 'Providing quality education and learning materials to children in remote areas, ensuring they have the tools to build a better future.'
  },
  {
    id: '2',
    title: 'Sustainable water projects in arid regions',
    subtitle: 'HOPE',
    category: 'CHARITY',
    image_url: '/src/assets/real-estate.jpg',
    location: 'Middle East',
    work_date: '2019-11-20',
    description: 'Developing infrastructure for clean water access, including solar-powered wells and water purification systems.'
  },
  {
    id: '3',
    title: 'Healthcare accessibility programs in emerging markets',
    subtitle: 'CARE',
    category: 'CHARITY',
    image_url: '/src/assets/luxury-retail.jpg',
    location: 'South Asia',
    work_date: '2025-01-10',
    description: 'Improving healthcare infrastructure and providing medical supplies to underserved communities.'
  },
  {
    id: '4',
    title: 'Community development and local entrepreneurship support',
    subtitle: 'GROWTH',
    category: 'CHARITY',
    image_url: '/src/assets/fashion-model.jpg',
    location: 'Global',
    work_date: '2023-08-25',
    description: 'Empowering local entrepreneurs through micro-loans and business training programs.'
  }
];

const defaultQuotes: CharityQuote[] = [
  {
    id: '1',
    quote: 'My true measure of wealth has always been time, the freedom to choose what I build next. Success, for me, is not counted in numbers but in the ability to decide where my energy, discipline, and purpose go next',
    author_name: 'Mohsin Salya',
    author_title: 'Faith in Action',
  },
  {
    id: '2',
    quote: 'True wealth is not measured by what we accumulate, but by what we give back to the world that sustained us.',
    author_name: 'Mohsin Salya',
    author_title: 'Faith in Action',
  },
];

export function CharityWorksSection({ works, quotes, isLoading, videoUrl }: CharityWorksSectionProps) {
  const isMobile = useIsMobile();
  const allWorks = works && works.length > 0 ? works : defaultWorks;
  const allQuotes = quotes && quotes.length > 0 ? quotes : defaultQuotes;
  
  const [currentQuote, setCurrentQuote] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: allWorks.length > 1,
    align: 'start',
    slidesToScroll: 1,
    watchDrag: false, // Only move via arrows as requested
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
  }, [emblaApi, onSelect, allWorks.length]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const handlePrevQuote = () => {
    setCurrentQuote((prev) => (prev === 0 ? allQuotes.length - 1 : prev - 1));
  };

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev === allQuotes.length - 1 ? 0 : prev + 1));
  };

  if (allWorks.length === 0) return null;

  return (
    <section id="charity" className="frame-container frame-container-light noise-overlay py-12 sm:py-16 md:py-20 space-y-12 sm:space-y-16">
      <div className="px-6 sm:px-10 md:px-16 max-w-7xl mx-auto">
        <ScrollReveal className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end items-start gap-6">
            <div className="text-left">
              <p className="font-serif italic text-lg sm:text-xl text-muted-foreground mb-2">Impact Beyond Markets</p>
              <h2 className="display-xl">
                Charity Works
              </h2>
            </div>
            {/* Carousel Navigation Arrows - Hidden on mobile */}
            {!isMobile && (
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={scrollPrev}
                  className="arrow-btn w-12 h-12 border-black/20 text-black hover:bg-black hover:text-white"
                  aria-label="Previous work"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={scrollNext}
                  className="arrow-btn w-12 h-12 border-black/20 text-black hover:bg-black hover:text-white"
                  aria-label="Next work"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Carousel / Grid Container */}
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-8">
            {allWorks.map((work, index) => (
              <div key={work.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-8">
                <ScrollReveal delay={index * 0.1}>
                  <div className="group bg-[#7c7c5c] p-4 rounded-[20px] flex flex-col h-full shadow-lg">
                    {/* Top Row: Index and Title Pill in unified background */}
                    <div className="bg-[#f5f0e8]/90 backdrop-blur-sm px-6 py-2 rounded-full flex items-center justify-between mb-4 gap-4 min-h-[3.5rem]">
                      <span className="font-serif text-2xl font-bold text-black/80">{String(index + 1).padStart(2, '0')}</span>
                      <div className="bg-black/10 w-px h-8 hidden sm:block" />
                      <span className="font-serif text-sm md:text-base font-medium text-black leading-tight flex-1 text-center line-clamp-2">
                        {work.title}
                      </span>
                    </div>

                    {/* Content Area: Image and Details */}
                    <div className="flex flex-col md:flex-row gap-4 flex-1">
                      {/* Left: Image */}
                      <div className="w-full md:w-1/2 aspect-square md:aspect-auto rounded-[15px] overflow-hidden bg-black/5">
                                    <img
                                      src={resolveImageUrl(work.image_url) || '/assets/podcast-interview.jpg'}
                                      alt={work.title}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                                    />
                      </div>

                      {/* Right: Details */}
                      <div className="w-full md:w-1/2 bg-[#f5f0e8] rounded-[15px] p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-serif text-xs font-bold text-black tracking-wide uppercase">{work.location || 'Charity Year'}</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-black" />
                              <span className="font-sans text-xs font-bold text-black">
                                {work.work_date ? new Date(work.work_date).getFullYear() : (2025 - index * 3)}
                              </span>
                            </div>
                          </div>
                          <p className="font-sans text-[11px] leading-[1.6] text-black/80 line-clamp-6">
                            {work.description || 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.'}
                          </p>
                        </div>
                        <Link to="/charity-works" className="flex items-center gap-1 font-serif text-xs font-bold text-black hover:translate-x-1 transition-transform group/btn mt-4">
                          Read More <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Dots Navigation - Hidden on desktop */}
          <div className="flex justify-center gap-2 mt-12 md:hidden">
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

      {/* Charity Quote Carousel - Integrated into same container style */}
      <div className="px-6 sm:px-10 md:px-16 max-w-7xl mx-auto">
        <div className="pt-12 sm:pt-16 border-t-2 border-[#1a1a1a]/10">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
              {/* Author Info */}
              <div className="flex items-center gap-4 min-w-fit">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-border/50">
                  <img src={heroPortrait} alt="Mohsin Salya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif text-lg sm:text-xl font-medium text-black">Mohsin Salya</p>
                  <p className="text-xs sm:text-sm font-bold text-black/80">Faith in Action</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-16 bg-black/20" />

              {/* Quote Carousel */}
              <div className="flex-1">
                <p className="font-sans text-sm sm:text-base md:text-lg text-black/80 leading-relaxed">
                  "{allQuotes[currentQuote]?.quote}"
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevQuote}
                  className="arrow-btn w-12 h-12 border-black/20 text-black hover:bg-black hover:text-white"
                  aria-label="Previous quote"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextQuote}
                  className="arrow-btn w-12 h-12 border-black/20 text-black hover:bg-black hover:text-white"
                  aria-label="Next quote"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
