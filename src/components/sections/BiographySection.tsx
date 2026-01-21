import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Link } from 'react-router-dom';

interface BiographyData {
  name: string;
  title: string;
  subtitle: string;
  avatar_url?: string | null;
}

interface Quote {
  id: string;
  quote: string;
}

interface BiographySectionProps {
  data?: BiographyData | null;
  quotes?: Quote[];
  isLoading?: boolean;
  tag?: string;
  descriptionOverride?: string;
}

export function BiographySection({ data, quotes = [], isLoading, tag, descriptionOverride }: BiographySectionProps) {
  const [currentQuote, setCurrentQuote] = useState(0);

  const content = data || {
    name: 'Mohsin Salya',
    title: 'The Man Behind the Markets',
    subtitle: '',
    avatar_url: null,
  };

  const defaultQuotes = [
    {
      id: '1',
      quote: 'Every chapter of my life has taught me the same enduring truth: discipline builds durability. Talent may start the journey, but only discipline carries you through the storms, the risks, and the rebuilding. It is the quiet force that keeps success standing long after momentum fades.',
    },
    {
      id: '2',
      quote: 'Innovation without integrity is merely disruption. True transformation comes from building something that lasts, something that serves, something that elevates everyone it touches.',
    },
  ];

  // Filter quotes by tag if provided
  const filteredQuotes = tag 
    ? (quotes as any[]).filter(q => q.tags?.includes(tag))
    : quotes;

  const allQuotes = filteredQuotes.length > 0 ? filteredQuotes : defaultQuotes;

  const handlePrev = () => {
    setCurrentQuote((prev) => (prev === 0 ? allQuotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentQuote((prev) => (prev === allQuotes.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="biography" className="frame-container frame-container-light noise-overlay">
      <div className="p-6 sm:p-10 md:p-16">
        {/* Section Label */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-8 sm:mb-12">
            <div className="section-label mb-0 uppercase tracking-widest text-xs font-sans">About</div>
          </div>
        </ScrollReveal>

        {/* Main Content */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left - Arrow Link */}
            <div className="hidden lg:block pt-4">
              <Link to="/biography" className="text-black hover:translate-x-1 hover:-translate-y-1 transition-transform duration-300 block">
                <ArrowUpRight className="w-12 h-12" strokeWidth={1} />
              </Link>
            </div>

            {/* Center - Main Text */}
            <div className="flex-1">
              <p className="text-xs sm:text-sm italic text-muted-foreground mb-2">
                (An inside Look)
              </p>
              <h2 className="display-md leading-tight">
                {descriptionOverride || "Mohsin Salya is an entrepreneur and investor with ventures spanning fashion, property, distribution, and luxury assets. His career reflects one principle- discipline builds durability."}
              </h2>
            </div>
          </div>
        </ScrollReveal>

        {/* Author & Quotes Section */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 sm:mt-16 pt-8 border-t border-border">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">
              {/* Author Info */}
              <div className="flex items-center gap-4 min-w-fit">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-serif text-lg">
                  {content.name.charAt(0)}
                </div>
                <div>
                  <p className="font-serif text-base sm:text-lg font-medium">{content.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{content.title}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-16 bg-border" />

              {/* Quote Carousel */}
              <div className="flex-1">
                <p className="body-md text-muted-foreground italic">
                  "{allQuotes[currentQuote]?.quote}"
                </p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="arrow-btn w-10 h-10"
                  aria-label="Previous quote"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="arrow-btn w-10 h-10"
                  aria-label="Next quote"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
