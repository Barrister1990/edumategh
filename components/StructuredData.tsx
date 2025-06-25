import { structuredData } from '@/config/seo';
import Script from 'next/script';

interface StructuredDataProps {
  page?: 'home' | 'features' | 'download' | 'contact';
}

export default function StructuredData({ page = 'home' }: StructuredDataProps) {
  const getSchemaForPage = () => {
    const baseSchemas = [
      structuredData.organization,
      structuredData.website,
      structuredData.mobileApplication,
      structuredData.educationalOrganization
    ];

    if (page === 'contact') {
      baseSchemas.push(structuredData.faqPage);
    }

    return baseSchemas;
  };

  return (
    <>
      {getSchemaForPage().map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${page}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}