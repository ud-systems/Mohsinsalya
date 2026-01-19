import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { ArrowLeft, MoreHorizontal, Share2, Bookmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveImageUrl } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

const InsightDetail = () => {
  const { id } = useParams();

  const { data: insight, isLoading } = useQuery({
    queryKey: ['insight-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="frame-outer min-h-screen flex items-center justify-center bg-background">
        <p className="body-md animate-pulse">Loading insight...</p>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="frame-outer min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <p className="body-md text-muted-foreground">Insight not found.</p>
        <Link to="/insights" className="tab-pill tab-pill-inactive">Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="frame-outer bg-background noise-overlay">
      <SEO 
        title={`${insight.title} | Mohsin Salya`}
        description={insight.excerpt}
        image={resolveImageUrl(insight.image_url)}
        type="article"
      />
      <Navigation />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Section */}
          <ScrollReveal>
            <div className="text-center mb-16 relative">
              <div className="flex justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-sans font-bold tracking-widest uppercase">
                  {insight.category}
                </span>
              </div>
              <h1 className="display-lg mb-6 uppercase tracking-wider max-w-4xl mx-auto">{insight.title}</h1>
              <p className="body-md text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                {insight.excerpt}
              </p>
              
              <div className="flex justify-center mt-4">
                <Link 
                  to="/insights" 
                  className="inline-flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.2em] text-black/40 hover:text-black transition-colors"
                >
                  <ArrowLeft size={14} />
                  BACK TO INSIGHTS
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Content Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start relative">
            {/* Left Side: Sticky Sideboard */}
            <div className="lg:sticky lg:top-32 space-y-12">
              <ScrollReveal delay={0.1}>
                <div className="border-y border-black/10">
                  <div className="grid grid-cols-3 divide-x divide-black/10">
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Date</span>
                      <span className="body-md font-medium">
                        {new Date(insight.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Author</span>
                      <span className="body-md font-medium">{insight.author_name || 'Mohsin Salya'}</span>
                    </div>
                    <div className="py-8 text-center">
                      <span className="block text-[10px] font-sans font-bold tracking-widest text-black/40 mb-2 uppercase">Read Time</span>
                      <span className="body-md font-medium">{insight.read_time || '5 min read'}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 bg-muted">
                  <img 
                    src={resolveImageUrl(insight.image_url) || '/placeholder.svg'} 
                    alt={insight.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black/40 hover:text-black transition-colors shadow-sm">
                      <Share2 size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-black/40 hover:text-black transition-colors shadow-sm">
                      <Bookmark size={18} />
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
                    Expert Perspective
                  </h2>
                  <div 
                    className="prose prose-neutral max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: insight.content || `
                      <p class="mb-6">Content for this insight is currently being curated. Mohsin Salya shares his deep expertise across multiple industries, providing actionable advice for the next generation of leaders.</p>
                      <p class="mb-6">"Success is not just about the destination, but the discipline you develop along the way. Every setback is an opportunity to refine your strategy and come back stronger."</p>
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

export default InsightDetail;
