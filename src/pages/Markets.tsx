import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { MoreHorizontal } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import { MarketsSkeleton } from '@/components/ui/skeleton-shimmer';
import { Counter } from '@/components/ui/counter';

const Markets = () => {
  // Fetch Markets (Ventures)
  const { data: markets, isLoading: marketsLoading } = useQuery({
    queryKey: ['markets-page-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats-markets-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const isLoading = marketsLoading || statsLoading;

  return (
    <div className="frame-outer">
      <SEO />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Section */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="display-xl mb-6">MARKETS WE BUILD IN</h1>
              <p className="body-md text-muted-foreground max-w-3xl mx-auto">
                Mohsin Salya’s business journey spans continents, industries, and eras, evolving from fashion floors in India and the UK to billion-dirham real estate portfolios in Dubai. His approach is simple yet powerful: build with discipline, transform with clarity, and scale with purpose.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats Section */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-16 sm:mb-24">
              {stats?.map((stat, index) => {
                const numValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0;
                const suffix = stat.value.replace(/[0-9]/g, '');
                return (
                  <div key={stat.id} className="flex items-center gap-4 sm:gap-8 md:gap-12">
                    <div className="text-center">
                      <Counter from={0} to={numValue} suffix={suffix} className="stat-number" />
                      <p className="stat-label">{stat.label}</p>
                    </div>
                    {index < stats.length - 1 && (
                      <div className="divider-diagonal hidden sm:block" />
                    )}
                  </div>
                );
              })}
              {(!stats || stats.length === 0) && !isLoading && (
                <>
                  <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
                    <div className="text-center">
                      <Counter from={0} to={25} className="stat-number" />
                      <p className="stat-label">YEARS IN BUSINESS</p>
                    </div>
                    <div className="divider-diagonal hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
                    <div className="text-center">
                      <Counter from={0} to={1} suffix="BN" className="stat-number" />
                      <p className="stat-label">REVENUE TURNOVER</p>
                    </div>
                    <div className="divider-diagonal hidden sm:block" />
                  </div>
                  <div className="text-center">
                    <Counter from={0} to={45} className="stat-number" />
                    <p className="stat-label">NEW BRANDS</p>
                  </div>
                </>
              )}
            </div>
          </ScrollReveal>

          {/* Ventures Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {markets?.map((market, index) => (
                <ScrollReveal key={market.id} delay={index * 0.1}>
                  <Link 
                    to={`/markets/${market.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col h-full group transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="p-6 md:p-8 flex justify-between items-center">
                      <h3 className="text-xl md:text-2xl font-serif tracking-wide uppercase">{market.title}</h3>
                      <button className="text-black/40 hover:text-black transition-colors pointer-events-none">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>
                    <div className="px-4 md:px-6 pb-4 md:pb-6 flex-1">
                      <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-xl overflow-hidden">
                        <img 
                          src={resolveImageUrl(market.image_url) || '/placeholder.svg'} 
                          alt={market.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Markets;
