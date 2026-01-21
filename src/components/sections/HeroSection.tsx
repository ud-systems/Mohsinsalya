import heroMain from '@/assets/hero-main.webp';
import { VideoPlayer } from '@/components/ui/video-player';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface HeroData {
  name: string;
  title_line1: string;
  title_line2: string;
  description: string;
  bottom_left_text: string;
  bottom_left_subtext: string;
}

interface HeroSectionProps {
  data?: HeroData | null;
  isLoading?: boolean;
  videoUrl?: string;
}

export function HeroSection({ data, isLoading, videoUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const content = data || {
    name: 'MOHSIN SALYA',
    title_line1: 'VISIONARY',
    title_line2: 'ENTREPRENEUR',
    description: 'REBUILDING STANDARDS ACROSS INDUSTRIES FROM THE FABRIC OF FASHION TO THE FOUNDATIONS OF REAL ESTATE',
    bottom_left_text: 'GLOBAL',
    bottom_left_subtext: 'INVESTOR',
  };

  return (
    <section ref={containerRef} className="frame-container-hero noise-overlay min-h-[90vh] relative overflow-hidden">
      {/* Full Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <img
          src={heroMain}
          alt="Mohsin Salya"
          className="w-full h-full object-cover object-top scale-110"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/70 via-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
      </motion.div>
      
      <motion.div 
        className="relative z-10 h-full min-h-[90vh] flex flex-col"
        style={{ y: contentY }}
      >
        {/* Main content area - Text on right, staggered */}
        <div className="flex-1 flex items-center p-6 sm:p-10 md:p-16 pt-24 sm:pt-28">
          <div className="ml-auto max-w-xl lg:max-w-2xl text-right text-primary-foreground pr-4 sm:pr-6 md:pr-8">
            {/* Name label */}
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] mb-2 sm:mb-3 font-sans text-primary-foreground/70">
              {content.name}
            </p>
            
            {/* Staggered titles */}
            <h1 className="display-xl mb-1 sm:mb-2 text-primary-foreground leading-none">
              {content.title_line1}
            </h1>
            <h2 className="display-lg font-light italic text-primary-foreground/90 leading-none">
              {content.title_line2}
            </h2>
            
            {/* Description with embedded link */}
            <p className="body-sm sm:body-md uppercase tracking-wide leading-relaxed max-w-md ml-auto mt-8 sm:mt-12 text-primary-foreground/80">
              {(() => {
                const target = 'ACROSS INDUSTRIES';
                const parts = content.description.split(new RegExp(`(${target})`, 'i'));
                return parts.map((part, i) => 
                  part.toUpperCase() === target ? (
                    <Link key={i} to="/markets" className="text-white border-b border-white/30 hover:border-white transition-colors">
                      {part}
                    </Link>
                  ) : part
                );
              })()}
            </p>
          </div>
        </div>

        {/* Bottom section - Text left, Video right */}
        <div className="p-6 sm:p-10 md:p-16 pt-0">
          <div className="flex items-end justify-between gap-6">
            {/* Bottom left text */}
            <div className="text-primary-foreground">
              <h3 className="display-lg leading-none">{content.bottom_left_text}</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light italic text-primary-foreground/80">
                {content.bottom_left_subtext}
              </p>
            </div>
            
            {/* Bottom right - Video autoplay */}
            <div className="relative">
              <div className="w-40 sm:w-52 md:w-64 lg:w-72 shadow-2xl">
                <VideoPlayer 
                  src={videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-11-large.mp4"} 
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
