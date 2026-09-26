import { Suspense } from 'react';
import CustomerLoginScreen from './CustomerLoginScreen';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your Lansdowne Leather account with mobile OTP.',
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
            background: '#0f172a',
            color: '#fff',
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
