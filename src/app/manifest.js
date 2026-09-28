import { BRAND, HOME_DESCRIPTION } from '@/lib/seo';

export default function manifest() {
  return {
    name: BRAND,
    short_name: 'Lansdowne',
    description: HOME_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4a2c17',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
