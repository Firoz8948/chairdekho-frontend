import { CONTACT, absoluteUrl } from '@/lib/seo';

export const whatsappUrl = (message) =>
  `https://wa.me/${CONTACT.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const productEnquiryUrl = (productName, productPath) => {
  const lines = [`Hi, I checked your website, I have an enquiry for ${productName}.`];
  if (productPath) lines.push(absoluteUrl(productPath));
  return whatsappUrl(lines.join('\n'));
};

/** Pre-filled message for catalogue chair codes (e.g. CHAIRDEKHO-02 → CHAIRDEKHO_02). */
export const catalogueEnquiryUrl = (chairCode) => {
  const token = String(chairCode || '')
    .trim()
    .toUpperCase()
    .replace(/-/g, '_');
  return whatsappUrl(`Hi Chairdekho, we want to know more about ${token}`);
};
