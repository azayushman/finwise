import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinWise — Smart Financial Planning',
    short_name: 'FinWise',
    description: 'Interactive financial calculators and AI-guided financial education.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07111F',
    theme_color: '#07111F',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
