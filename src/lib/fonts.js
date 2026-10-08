import {
  Plus_Jakarta_Sans,
  Poppins,
  Montserrat,
  Outfit,
  Playfair_Display,
  DM_Serif_Display,
} from 'next/font/google';

export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

// Heading font options. The active one is chosen by --font-family-heading in globals.css;
// browsers only download a font that is actually used, so unused options cost nothing.
// next/font needs literal option objects, so options can't be shared via spread.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
  preload: false,
});

export const fontVariables = [fontSans, poppins, montserrat, outfit, playfair, dmSerif]
  .map((font) => font.variable)
  .join(' ');
