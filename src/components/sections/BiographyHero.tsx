import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { SkeletonShimmer } from '@/components/ui/skeleton-shimmer';

interface BiographyHeroProps {
  data: {
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    hero_quote: string;
    hero_image_url: string;
  } | null;
  isLoading: boolean;
}

export function BiographyHero({ data, isLoading }: BiographyHeroProps) {
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${data?.hero_image_url || '/assets/biographyhero.webp'})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative w-full p-6 sm:p-10 md:p-16 z-10">
        <div className="flex flex-col md:flex-row items-center gap-0 relative">
          {/* Main Title Card */}
          <ScrollReveal className="relative z-20">
            <div className="bg-white p-8 sm:p-12 md:p-14 lg:p-16 max-w-xl shadow-2xl rounded-2xl sm:rounded-3xl md:rounded-[40px] overflow-hidden">
              <p className="text-xs sm:text-sm tracking-[0.2em] font-sans mb-3 sm:mb-4 text-black/60 uppercase">
                {data?.hero_title || 'BUILDING BUSINESSES,'}
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extralight leading-[0.9] text-black tracking-tight break-words">
                {data?.hero_subtitle?.split(' ')[0] || 'REBUILDING'}<br />
                {data?.hero_subtitle?.split(' ')[1] || 'STANDARDS'}
              </h1>
            </div>
          </ScrollReveal>

          {/* Quote Card */}
          <ScrollReveal delay={0.2} className="relative z-10">
            <div className="bg-black/90 backdrop-blur-md p-8 sm:p-10 md:p-12 max-w-md text-white md:-ml-12 md:pl-20 rounded-2xl sm:rounded-3xl md:rounded-tr-[60px] md:rounded-br-[60px]">
              <p className="text-base sm:text-lg lg:text-xl font-serif mb-6 leading-relaxed opacity-90">
                {data?.hero_description || 'Business becomes meaningful when it stands for something bigger than profit, when it raises expectations and resets what’s possible'}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-white/40" />
                <p className="font-serif italic text-white/80">
                  {data?.hero_quote || 'Mohsin Salya'}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
