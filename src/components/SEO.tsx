import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export function SEO({ title, description, image, type = 'website' }: SEOProps) {
  const location = useLocation();
  const path = location.pathname;

  // Fetch Global SEO Settings
  const { data: globalSeo } = useQuery({
    queryKey: ['seo-settings'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').single();
      return data;
    }
  });

  // Fetch Page-specific Metadata
  const { data: pageMeta } = useQuery({
    queryKey: ['page-metadata', path],
    queryFn: async () => {
      const { data } = await supabase.from('page_metadata').select('*').eq('page_path', path).single();
      return data;
    }
  });

  const siteName = globalSeo?.site_name || 'Mohsin Salya';
  const seoTitle = title || pageMeta?.title || siteName;
  const seoDescription = description || pageMeta?.description || 'Visionary Entrepreneur and Global Investor.';
  const seoImage = image || pageMeta?.og_image || globalSeo?.default_og_image || '/favicon.png';
  const twitterHandle = globalSeo?.twitter_handle || '';
  const googleVerification = globalSeo?.google_search_console_id || '';

  return (
    <Helmet>
      {/* Standard tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
}
