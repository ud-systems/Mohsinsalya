import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonShimmer } from '@/components/ui/skeleton-shimmer';
import { useState, useEffect } from 'react';

interface Slide {
  description: string;
  quote: string;
}

interface BiographyHeroProps {
  data: {
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    hero_quote: string;
    hero_image_url: string;
  } | null;
  isLoading: boolean;
  slides?: Slide[];
}

export function BiographyHero({ data, isLoading, slides }: BiographyHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const allSlides = slides || (data ? [{
    description: data.hero_description,
    quote: data.hero_quote
  }] : []);

  useEffect(() => {
    if (allSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [allSlides.length, currentSlide]);

  if (isLoading) {
    return (
      <div className="relative min-h-[90vh] flex items-end p-6 sm:p-10 md:p-16">
        <SkeletonShimmer className="absolute inset-0 w-full h-full" />
      </div>
    );
  }

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden rounded-2xl shadow-2xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${data?.hero_image_url || '/assets/biographyhero.webp'})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative w-full p-6 sm:p-10 md:p-16 z-10">
        <div className="flex flex-col md:flex-row items-center gap-0 relative">
          {/* Main Title Card */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20"
          >
            <div className="bg-white p-8 sm:p-12 md:p-14 lg:p-16 max-w-xl shadow-2xl rounded-2xl sm:rounded-3xl md:rounded-[40px] overflow-hidden">
              <p className="text-xs sm:text-sm tracking-[0.2em] font-sans mb-3 sm:mb-4 text-black/60 uppercase">
                {data?.hero_title || 'BUILDING BUSINESSES,'}
              </p>
              <h1 className="display-xl text-black break-words">
                {data?.hero_subtitle?.split(' ')[0] || 'REBUILDING'}<br />
                {data?.hero_subtitle?.split(' ')[1] || 'STANDARDS'}
              </h1>
            </div>
          </motion.div>

          {/* Quote Card (Carousel) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="bg-black/90 backdrop-blur-md p-8 sm:p-10 md:p-12 w-full max-w-md lg:max-w-2xl text-white md:-ml-12 md:pl-20 rounded-2xl sm:rounded-3xl md:rounded-tr-[60px] md:rounded-br-[60px] min-h-[280px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-base sm:text-lg lg:text-base font-serif mb-6 leading-relaxed opacity-90">
                    {allSlides[currentSlide]?.description || 'Business becomes meaningful when it stands for something bigger than profit, when it raises expectations and resets what’s possible'}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-white/40" />
                    <p className="font-serif italic text-white/80">
                      {allSlides[currentSlide]?.quote || 'Mohsin Salya'}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Bar for Carousel */}
              {allSlides.length > 1 && (
                <div className="absolute bottom-6 left-20 right-12 flex gap-2 z-30">
                  {allSlides.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className="group flex-1 h-4 flex items-center"
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <div 
                        className={`h-0.5 w-full transition-all duration-500 ${idx === currentSlide ? 'bg-white' : 'bg-white/20 group-hover:bg-white/40'}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
