'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import apiClient from '@/lib/api';

export default function AdminSwitchPage() {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const ticket = new URLSearchParams(window.location.hash.slice(1)).get('ticket');
    window.history.replaceState(null, '', window.location.pathname);
    if (!ticket) {
      setError('This switch link is invalid or has expired. Please log in.');
      return;
    }

    apiClient
      .post('/admin/switch/redeem', { ticket })
      .then((data) => {
        Cookies.set('admin_token', data.access_token, { expires: 7 });
        Cookies.remove('token');
        router.replace('/admin/dashboard');
      })
      .catch((err) => setError(err.message));
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
        fontFamily: 'inherit',
      }}
    >
      {error ? (
        <>
          <p style={{ margin: 0, color: '#b91c1c' }}>{error}</p>
          <Link href="/admin/login" style={{ color: '#000', fontWeight: 600 }}>
            Go to admin login
          </Link>
        </>
      ) : (
        <p style={{ margin: 0, color: '#525252' }}>Switching admin panel…</p>
      )}
    </div>
  );
}
