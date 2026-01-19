import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const MarketDetail = () => {
  const { id } = useParams();

  const { data: market, isLoading } = useQuery({
    queryKey: ['market-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('markets')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="frame-outer min-h-screen flex items-center justify-center">
        <p className="body-md animate-pulse">Loading venture details...</p>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="frame-outer min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="body-md text-muted-foreground">Venture not found.</p>
        <Link to="/markets" className="tab-pill tab-pill-inactive">Back to Markets</Link>
      </div>
    );
  }

  return (
    <div className="frame-outer">
      <SEO 
        title={`${market.title} | Mohsin Salya`}
        description={market.description}
        image={resolveImageUrl(market.image_url)}
      />
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Section */}
          <ScrollReveal>
            <div className="text-center mb-16 relative">
              <h1 className="display-lg mb-6 uppercase tracking-wider">{market.title}</h1>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                {market.description}
              </p>
              
              {/* Back Button - Centered under description as requested */}
              <div className="flex justify-center mt-4">
                <Link 
                  to="/markets" 
                  className="inline-flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.2em] text-black/40 hover:text-black transition-colors"
                >
                  <ArrowLeft size={14} />
                  BACK TO MARKETS
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Content Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start relative">
            {/* Left Side: Sticky Sideboard */}
            <div className="lg:sticky lg:top-32 space-y-12">
              {/* Metadata Table - Now sticky on the left while keeping its original layout */}
              <ScrollReveal delay={0.1}>
                <div className="border-y border-black/10">
                  <div className="grid grid-cols-3 divide-x divide-black/10">
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Year</span>
                      <span className="body-md font-medium">{market.year || '—'}</span>
                    </div>
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Industry</span>
                      <span className="body-md font-medium">{market.industry || '—'}</span>
                    </div>
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Timeline</span>
                      <span className="body-md font-medium">{market.timeline || '—'}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/5 bg-muted">
                  <img 
                    src={resolveImageUrl(market.image_url) || '/placeholder.svg'} 
                    alt={market.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 right-6">
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black/40 hover:text-black transition-colors shadow-sm">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Side: Scrolling Content */}
            <div className="space-y-12 pb-20">
              <ScrollReveal delay={0.3}>
                <div className="space-y-8">
                  <h2 className="display-md uppercase tracking-tight leading-tight">
                    {market.title}
                  </h2>
                  <div 
                    className="prose prose-neutral max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: market.page_content || `
                      <p class="text-sm font-sans mb-6">The standard Lorem Ipsum passage, used since the 1500s</p>
                      <p class="mb-6">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                      <h3 class="text-xl font-serif text-black mb-6">Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC</h3>
                      <p class="mb-6">"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse cillum dolore eu fugiat quo voluptas nulla pariatur?"</p>
                    `}}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketDetail;
