import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export function Tracking() {
  const location = useLocation();

  const { data: seo } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').single();
      return data;
    }
  });

  // Google Analytics 4
  useEffect(() => {
    if (seo?.ga_measurement_id && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${seo.ga_measurement_id}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', seo.ga_measurement_id, {
        page_path: location.pathname + location.search,
      });
    }
  }, [seo?.ga_measurement_id, location]);

  // Microsoft Clarity
  useEffect(() => {
    if (seo?.clarity_id && typeof window !== 'undefined') {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", seo.clarity_id);
    }
  }, [seo?.clarity_id]);

  return null;
}

// Add dataLayer type to window
declare global {
  interface Window {
    dataLayer: any[];
  }
}
