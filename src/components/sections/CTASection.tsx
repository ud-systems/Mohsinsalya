import { useState } from 'react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSettings {
  title: string;
  disclaimer: string;
  button_text: string;
  placeholder_text: string;
}

interface CTASectionProps {
  settings?: NewsletterSettings;
  isLoading?: boolean;
}

export function CTASection({ settings, isLoading }: CTASectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await supabase.from('newsletter_subscriptions').insert([{ email }]);
      setIsSuccessOpen(true);
      setEmail('');
    } catch (error) {
      setIsSuccessOpen(true);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = settings || {
    title: 'Join Mohsin’s circle for real stories, reflections, and insights, where resilience meets results.',
    disclaimer: "By subscribing, you'll receive thoughtful updates, insights, and inspiration straight to your inbox. No spam just authentic content and stories worth your time.",
    button_text: 'Start Building',
    placeholder_text: 'Enter Your Email Address'
  };

  return (
    <section className="py-24 px-6 sm:px-10">
      <SuccessDialog 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Welcome Aboard"
        description="You've successfully subscribed. Prepare for authentic stories and billion-dollar moves straight to your inbox."
      />
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <ScrollReveal>
          <h2 className="display-lg max-w-4xl mx-auto">
            {content.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <form 
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-stretch justify-center gap-0 max-w-3xl mx-auto rounded-[2rem] border-4 border-[#5c5c3d] overflow-hidden"
          >
            <div className="flex-1 flex items-center">
              <Input
                type="email"
                placeholder={content.placeholder_text}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 sm:h-20 bg-transparent border-none text-[#1a1a1a] placeholder:text-muted-foreground text-[18px] px-8 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-16 sm:h-20 px-10 bg-[#5c5c3d] text-white font-serif text-xl sm:text-2xl font-medium hover:bg-[#4a4a31] transition-colors whitespace-nowrap m-1 rounded-[1.8rem]"
            >
              {isSubmitting ? '...' : content.button_text}
            </button>
          </form>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {content.disclaimer}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
