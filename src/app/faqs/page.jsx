'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './faqs.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeroBanner from '@/components/PageHeroBanner/PageHeroBanner';
import { CONTACT } from '@/lib/seo';

const faqGroups = [
  {
    group: 'Orders & Shipping',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our collections, add items to your cart, and proceed to checkout. You can pay via UPI, credit/debit card, net banking, or Cash on Delivery. Once your order is confirmed, you will receive an email and SMS confirmation with your order details.',
      },
      {
        q: 'How do I track my order?',
        a: 'Once your order is dispatched, you will receive an SMS and email notification with a tracking link. You can click the link to view real-time shipment status from our courier partner.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are dispatched within 24–48 business hours of confirmation (Monday to Saturday). After dispatch, delivery takes 3–5 business days to metro cities, 4–6 business days to tier-2 cities, 5–8 business days to tier-3 cities and rural areas, and 7–10 business days to North-East India and remote locations.',
      },
      {
        q: 'Do you deliver across India?',
        a: 'Yes, we deliver to all serviceable pin codes across India. Enter your pin code at checkout to confirm availability and estimated delivery dates for your area.',
      },
      {
        q: 'Is there a shipping charge?',
        a: 'No. Shipping is free on every order, prepaid or Cash on Delivery, with no minimum order value.',
      },
      {
        q: 'Where should I come to buy chairs offline?',
        a: (
          <>
            Come to our shop at {CONTACT.address}.{' '}
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.faqLink}>
              Open in Google Maps
            </a>
            <br />
            Timings: 10 AM to 7 PM.
            <br />
            You can also call us on{' '}
            <a href={`tel:+${CONTACT.whatsapp}`} className={styles.faqLink}>
              {CONTACT.phone}
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    group: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Rupay), UPI (Google Pay, PhonePe, Paytm), net banking, and Cash on Delivery (COD). All online payments are processed through a secure, PCI-DSS compliant payment gateway.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, COD is available on eligible orders across most pin codes in India. There is no extra charge for Cash on Delivery. COD availability is displayed at checkout.',
      },
      {
        q: 'Are my payment details secure?',
        a: 'Absolutely. We use 256-bit SSL encryption and partner with RBI-compliant payment gateways to ensure your financial information is fully protected. We never store your card details on our servers.',
      },
    ],
  },
  {
    group: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'You can request a return within 7 days of delivery. The chair must be unused, free of scratches, cracks or stains, and returned in its original packaging. Products bought in a clearance or final sale cannot be returned. Received a damaged or wrong item? Contact us within 48 hours of delivery for a free replacement or full refund.',
      },
      {
        q: 'How do I initiate a return?',
        a: `Contact our support team at ${CONTACT.email} or call ${CONTACT.phone} with your order number. Once approved, we will schedule a pickup from your delivery address within 2–3 business days.`,
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are initiated within 48 hours of receiving and inspecting the returned item. The amount is credited to your original payment method within 5–7 business days. For COD orders, refunds are processed to your bank account.',
      },
      {
        q: 'Can I exchange a product instead of returning it?',
        a: 'Yes. Within the 7-day return window you can exchange for a different colour or model of chair, subject to stock availability. Contact our support team to start an exchange. If the chair you want is unavailable, we will refund you instead.',
      },
    ],
  },
  {
    group: 'Chairs & Care',
    items: [
      {
        q: 'What types of chairs do you sell?',
        a: 'All types of chairs – plastic chairs, arm chairs, armless chairs, dining chairs, garden and outdoor chairs, office chairs, kids chairs and stools – at affordable prices.',
      },
      {
        q: 'Do you deliver in Vasai, Virar and Nalasopara?',
        a: 'Yes. We are based in Nalasopara West and deliver quickly across Vasai, Virar, Nalasopara, Naigaon and nearby areas. We also ship to other serviceable pin codes across India.',
      },
      {
        q: 'Do you take bulk orders for shops, offices or events?',
        a: `Yes. For bulk quantities of chairs for shops, offices, restaurants, function halls or events, call or WhatsApp us on ${CONTACT.phone} for special rates.`,
      },
      {
        q: 'Are your chairs good quality?',
        a: 'Yes. Every chair sold on ChairDekho is checked for strength, finish and comfort, and sourced directly from trusted manufacturers. We stand behind the quality of every chair we sell.',
      },
      {
        q: 'How should I care for my chairs?',
        a: 'Wipe plastic chairs with a damp cloth and mild soap, and avoid sharp objects and long exposure to strong heat. For office chairs, check the screws and wheels from time to time. Care instructions are also provided on each product page.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
      <button
        type="button"
        className={styles.faqQuestion}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`}
        />
      </button>
      <div className={`${styles.faqAnswer} ${open ? styles.faqAnswerOpen : ''}`}>
        <p className={styles.faqAnswerText}>{a}</p>
      </div>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <div className={styles.container}>
      <Header />
      <PageHeroBanner
        title="Frequently Asked Questions"
        subtitle="Have questions? Here are quick answers to the most common inquiries about orders, payments, and more."
      />

      <main className={styles.main}>
        {faqGroups.map((group, gi) => (
          <section key={gi} className={styles.faqGroup}>
            <h2 className={styles.groupTitle}>{group.group}</h2>
            <div className={styles.faqList}>
              {group.items.map((faq, fi) => (
                <FAQItem key={fi} q={faq.q} a={faq.a} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
