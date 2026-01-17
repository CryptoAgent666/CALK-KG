import { Helmet } from 'react-helmet-async';

interface HreflangTagsProps {
  path: string;
}

const BASE_URL = 'https://calk.kg';

const HreflangTags = ({ path }: HreflangTagsProps) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const ruUrl = cleanPath === '/' ? BASE_URL : `${BASE_URL}${cleanPath}`;
  const kyUrl = cleanPath === '/' ? `${BASE_URL}/ky` : `${BASE_URL}/ky${cleanPath}`;

  return (
    <Helmet>
      <link rel="alternate" hreflang="ru" href={ruUrl} />
      <link rel="alternate" hreflang="ky" href={kyUrl} />
      <link rel="alternate" hreflang="x-default" href={ruUrl} />
    </Helmet>
  );
};

export default HreflangTags;
