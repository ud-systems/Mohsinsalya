import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, resolveImageUrl } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Counter } from '@/components/ui/counter';
import { motion, AnimatePresence } from 'framer-motion';
import fashionModel from '@/assets/fashion-model.jpg';
import realEstate from '@/assets/real-estate.jpg';
import luxuryRetail from '@/assets/luxury-retail.jpg';

// Import logos for the marquee
import logo1 from '@/assets/logos/logos (1).webp';
import logo2 from '@/assets/logos/logos (2).webp';
import logo3 from '@/assets/logos/logos (3).webp';
import logo4 from '@/assets/logos/logos (4).webp';
import logo5 from '@/assets/logos/logos (5).webp';
import logo6 from '@/assets/logos/logos (6).webp';
import logo7 from '@/assets/logos/logos (7).webp';

const brandLogos = [
  logo1, logo2, logo3, logo4, logo5, logo6, logo7
];

interface Market {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url?: string | null;
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

interface MarketsSectionProps {
  markets?: Market[];
  stats?: Stat[];
  isLoading?: boolean;
}

const defaultMarkets: Market[] = [
  {
    id: '1',
    name: 'Fashion Industry Footprint',
    title: 'FASHION INDUSTRY FOOTPRINT',
    description: 'Where it all began! From independent labels to large-scale retail distribution, building the foundation for future ventures. What started as a small creative pursuit soon evolved into a thriving network of fashion and apparel brands, setting the tone for a lifetime of enterprise and expansion.',
  },
  {
    id: '2',
    name: 'Luxury Collectibles',
    title: 'LUXURY COLLECTIBLES',
    description: 'Curating exceptional pieces from around the world, building collections that appreciate in value and tell stories of craftsmanship, heritage, and timeless design.',
  },
  {
    id: '3',
    name: 'Property & Real Estate',
    title: 'PROPERTY & REAL ESTATE',
    description: 'Strategic investments across prime locations, developing properties that redefine urban living and commercial excellence in emerging markets.',
  },
  {
    id: '4',
    name: 'FMCG Networks',
    title: 'FMCG NETWORKS',
    description: 'Building distribution networks that bring quality consumer goods to markets across continents, connecting brands with consumers at scale.',
  },
];

const defaultStats: Stat[] = [
  { id: '1', value: '25', label: 'YEARS IN BUSINESS' },
  { id: '2', value: '1BN', label: 'REVENUE TURNOVER' },
  { id: '3', value: '45', label: 'NEW BRANDS' },
];

const marketImages: Record<string, string> = {
  '1': fashionModel,
  '2': luxuryRetail,
  '3': realEstate,
  '4': luxuryRetail,
};

export function MarketsSection({ markets, stats, isLoading }: MarketsSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  const allMarkets = markets && markets.length > 0 ? markets : defaultMarkets;
  const allStats = stats && stats.length > 0 ? stats : defaultStats;

  if (allMarkets.length === 0) return null;

  const currentMarket = allMarkets[activeTab] || allMarkets[0];

  return (
    <section id="markets" className="frame-container noise-overlay">
      <div className="p-6 sm:p-10 md:p-16 max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="display-xl mb-4 italic">MARKETS WE BUILD IN</h2>
            <p className="body-md text-muted-foreground max-w-2xl mx-auto">
              Ventures united by one constant, a commitment to progress, transforming industries through innovation, strategic foresight, and integrity.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Row */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-10 sm:mb-14">
            {allStats.map((stat, index) => {
              const numValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;
              const suffix = stat.value.replace(/[0-9]/g, '');
              
              return (
                <div key={stat.id} className="flex items-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <Counter 
                      from={0} 
                      to={numValue} 
                      suffix={suffix} 
                      className="stat-number" 
                    />
                    <p className="stat-label">{stat.label}</p>
                  </div>
                  {index < allStats.length - 1 && (
                    <div className="divider-diagonal hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Tab Pills */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
            {allMarkets.map((market, index) => (
              <button
                key={market.id}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'tab-pill',
                  activeTab === index ? 'tab-pill-active' : 'tab-pill-inactive'
                )}
              >
                {market.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Content Grid */}
        <ScrollReveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="relative mx-auto w-48 sm:w-56 md:w-64 lg:w-72">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMarket.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                    className="aspect-square rounded-full overflow-hidden bg-accent/20"
                  >
                    <img
                      src={resolveImageUrl(currentMarket.image_url) || fashionModel}
                      alt={currentMarket.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 md:order-2 text-center md:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMarket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <h3 className="display-md mb-4 sm:mb-6">{currentMarket.title}</h3>
                  <p className="body-md text-muted-foreground mb-6 sm:mb-8">
                    {currentMarket.description}
                  </p>
                  <Link to="/markets" className="tab-pill tab-pill-inactive inline-flex items-center gap-2">
                    Show More
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>

        {/* Brand Logos Marquee */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 sm:mt-16 pt-8 border-t border-border overflow-hidden relative">
            <div className="flex overflow-hidden">
              <motion.div 
                className="flex items-center gap-12 sm:gap-20 py-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  duration: 40, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                style={{ width: "fit-content" }}
              >
                {/* Duplicate the logos to create a seamless loop */}
                {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((logo, index) => (
                  <div key={index} className="flex-shrink-0 transition-transform duration-300 hover:scale-110">
                    <img 
                      src={logo} 
                      alt={`Partner Logo ${index}`} 
                      className="h-5 sm:h-7 w-auto object-contain"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
