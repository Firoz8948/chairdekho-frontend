import { Suspense } from 'react';
import CustomerLoginScreen from './CustomerLoginScreen';

export const metadata = {
  title: 'Login',
  description: 'Log in to ChairDekho with your mobile number and OTP.',
  robots: { index: false, follow: true },
};

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#ffffff',
            color: '#000000',
          }}
        >
          Loading…
        </div>
      }
    >
      <CustomerLoginScreen />
    </Suspense>
  );
}
