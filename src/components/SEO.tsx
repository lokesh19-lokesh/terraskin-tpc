import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "TerraSkin | Premium | Skincare | Products",
  description = "Premium skincare products for healthy, radiant skin. Shop our collection of natural, effective skincare solutions.",
  canonical,
  ogType = "website",
  ogImage = "/src/images/terra-skin-logo.png",
  twitterHandle = "@terraskin"
}) => {
  const siteTitle = "TerraSkin";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
    </Helmet>
  );
};

export default SEO;
