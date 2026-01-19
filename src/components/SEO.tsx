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
  const seoDescription = description || pageMeta?.description || 'Official website of Mohsin Salya - Visionary Entrepreneur and Global Investor.';
  const seoImage = image || pageMeta?.og_image || globalSeo?.default_og_image || '/favicon.png';
  const twitterHandle = globalSeo?.twitter_handle || '';
  const googleVerification = globalSeo?.google_search_console_id || '';
  const siteUrl = 'https://mohsinsalya.com';
  const canonicalUrl = `${siteUrl}${path === '/' ? '' : path}`;

  // Schema.org Structured Data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohsin Salya",
    "url": siteUrl,
    "image": `${siteUrl}/assets/hero-portrait.jpg`,
    "sameAs": [
      "https://twitter.com/mohsinsalya",
      "https://www.linkedin.com/in/mohsinsalya"
    ],
    "jobTitle": "Entrepreneur & Investor",
    "description": seoDescription
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": path.split('/').filter(Boolean).reduce((acc: any[], curr, idx, arr) => {
      const url = `/${arr.slice(0, idx + 1).join('/')}`;
      acc.push({
        "@type": "ListItem",
        "position": idx + 1,
        "name": curr.charAt(0).toUpperCase() + curr.slice(1).replace(/-/g, ' '),
        "item": `${siteUrl}${url}`
      });
      return acc;
    }, [])
  };

  // Add home to breadcrumbs if not on home
  if (path !== '/' && breadcrumbSchema.itemListElement.length > 0) {
    breadcrumbSchema.itemListElement.unshift({
      "@type": "ListItem",
      "position": 0,
      "name": "Home",
      "item": siteUrl
    });
    // Adjust positions
    breadcrumbSchema.itemListElement.forEach((item, i) => item.position = i + 1);
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/insights?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Standard tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="robots" content="index, follow" />
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}
      {twitterHandle && <meta name="twitter:creator" content={`@${twitterHandle}`} />}
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      {path === '/' && <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>}
      {path !== '/' && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": seoTitle,
            "image": seoImage,
            "description": seoDescription,
            "author": {
              "@type": "Person",
              "name": "Mohsin Salya"
            },
            "publisher": {
              "@type": "Person",
              "name": "Mohsin Salya"
            },
            "url": canonicalUrl,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
