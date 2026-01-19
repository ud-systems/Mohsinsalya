import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/sections/CTASection';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn, resolveImageUrl } from '@/lib/utils';

const Contact = () => {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { data: contactSettings } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_settings').select('*').single();
      if (error) throw error;
      return data;
    }
  });

  const { data: bioData } = useQuery({
    queryKey: ['biography'],
    queryFn: async () => {
      const { data, error } = await supabase.from('biography_content').select('*').single();
      if (error) return null;
      return data;
    },
  });

  const { data: quotes } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('biography_quotes').select('*').order('order_index', { ascending: true });
      if (error) return [];
      return data;
    },
  });

  const { data: ctaData, isLoading: ctaLoading } = useQuery({
    queryKey: ['cta'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_settings').select('*').single();
      if (error) return null;
      return data;
    },
  });

  const allQuotes = quotes || [];

  const handlePrev = () => {
    setCurrentQuote((prev) => (prev === 0 ? allQuotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentQuote((prev) => (prev === allQuotes.length - 1 ? 0 : prev + 1));
  };

  const mutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([newData]);
      if (error) throw error;
    },
    onSuccess: () => {
      setIsSuccessOpen(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="frame-outer bg-background noise-overlay">
      <SEO />
      <Navigation />
      
      <SuccessDialog 
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Message Received"
        description="Your inquiry has been sent directly to Mohsin's team. Expect a response soon."
      />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Section */}
          <ScrollReveal>
            <div className="mb-20">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16">
                <div className="flex-1">
                  <p className="font-serif italic text-xl text-muted-foreground mb-2">Get in Touch</p>
                  <h1 className="display-xl mb-8 whitespace-nowrap">
                    Work With Me
                  </h1>
                </div>
                
                <div className="lg:max-w-md lg:pt-12">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {contactSettings?.description || 'Whether you have a specific venture in mind or simply wish to explore potential synergies, I am always open to discussing new opportunities.'}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal delay={0.1}>
              <div className="frame-container frame-container-light noise-overlay h-full min-h-[600px] flex flex-col justify-between p-8 md:p-12">
                <div>
                  <div className="section-label mb-8 uppercase tracking-widest text-xs font-sans">Quotes</div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl italic text-[#1a1a1a]/80 leading-relaxed mb-12">
                    "{allQuotes[currentQuote]?.quote || 'Building a legacy requires discipline and a vision that transcends boundaries.'}"
                  </h2>
                </div>

                <div className="pt-8 border-t border-black/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-black to-black/60 flex items-center justify-center text-white font-serif text-xl shadow-lg">
                        {bioData?.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <p className="font-serif text-lg font-medium">{bioData?.name || 'Mohsin Salya'}</p>
                        <p className="text-xs text-black/40 uppercase tracking-widest">{bioData?.title || 'Entrepreneur & Investor'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Previous quote"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Next quote"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-black/5">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-[10px] font-sans font-bold tracking-widest uppercase ml-1">Full Name</Label>
                      <Input 
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="h-14 px-6 rounded-xl border-black/5 bg-secondary/30 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-[10px] font-sans font-bold tracking-widest uppercase ml-1">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="h-14 px-6 rounded-xl border-black/5 bg-secondary/30 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-[10px] font-sans font-bold tracking-widest uppercase ml-1">Subject</Label>
                    <Input 
                      id="subject"
                      placeholder="Partnership Inquiry"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="h-14 px-6 rounded-xl border-black/5 bg-secondary/30 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-[10px] font-sans font-bold tracking-widest uppercase ml-1">Your Message</Label>
                    <Textarea 
                      id="message"
                      placeholder="How can we collaborate?"
                      rows={6}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="px-6 py-4 rounded-xl border-black/5 bg-secondary/30 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="w-full h-16 bg-black text-white hover:bg-accent rounded-xl text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                  >
                    {mutation.isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send size={16} />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <CTASection settings={ctaData} isLoading={ctaLoading} />
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
