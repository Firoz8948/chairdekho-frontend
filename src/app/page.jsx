import HomeScreen from './home/HomeScreen';
import { HOME_DESCRIPTION, HOME_TITLE, SITE_KEYWORDS, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: '/',
  keywords: SITE_KEYWORDS,
});

export default function Page() {
  return <HomeScreen />;
}
