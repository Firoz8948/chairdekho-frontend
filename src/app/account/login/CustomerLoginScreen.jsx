'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import authService from '@/lib/services/auth';
import styles from './login.module.css';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

export default function CustomerLoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/account';
  const safeNext =
    nextPath.startsWith('/') && !nextPath.startsWith('//') && nextPath !== '/account/login'
      ? nextPath
      : '/account';

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otpDigits, setOtpDigits] = useState(() => Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);
  const nameRef = useRef(null);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      router.replace(safeNext === '/' ? '/account' : safeNext);
      return;
    }
    setCheckingAuth(false);
  }, [router, safeNext]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const otp = otpDigits.join('');
  const mobile = digitsOnly(phone);

  const focusOtp = (index) => {
    const el = otpRefs.current[index];
    if (el) el.focus();
  };

  const resetOtp = () => setOtpDigits(Array(OTP_LENGTH).fill(''));

  const handleOtpChange = (index, raw) => {
    const value = digitsOnly(raw).slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < OTP_LENGTH - 1) focusOtp(index + 1);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) focusOtp(index - 1);
    if (e.key === 'ArrowLeft' && index > 0) focusOtp(index - 1);
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) focusOtp(index + 1);
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = digitsOnly(e.clipboardData.getData('text')).slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => {
      next[i] = d;
    });
    setOtpDigits(next);
    focusOtp(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const requestOtp = async () => {
    const data = await authService.sendOtp(mobile, '', 'auto');
    if (data?.debug && data?.otp) {
      toast(`Debug OTP: ${data.otp}`, { icon: '🔑' });
    }
    resetOtp();
    setResendIn(RESEND_SECONDS);
    setTimeout(() => focusOtp(0), 50);
    return data;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setLoading(true);
      const data = await requestOtp();
      toast.success(data?.message || 'OTP sent');
      setStep('otp');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    try {
      setLoading(true);
      const data = await requestOtp();
      toast.success(data?.message || 'OTP resent');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const finishLogin = (isNew) => {
    toast.success(isNew ? 'Welcome to ChairDekho!' : 'Logged in');
    router.replace(safeNext);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Please enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }
    try {
      setLoading(true);
      const data = await authService.verifyOtp(mobile, otp, '', 'auto');
      if (data?.needs_name) {
        setStep('name');
        setTimeout(() => nameRef.current?.focus(), 50);
        return;
      }
      finishLogin(false);
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitName = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('Please enter your name');
      return;
    }
    try {
      setLoading(true);
      await authService.verifyOtp(mobile, otp, trimmed, 'auto');
      finishLogin(true);
    } catch (err) {
      const msg = err.message || 'Something went wrong';
      if (/expired|no otp/i.test(msg)) {
        toast.error('Your OTP expired. Please request a new one.');
        setStep('otp');
        resetOtp();
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeNumber = () => {
    setStep('phone');
    resetOtp();
    setName('');
  };

  const heading = {
    phone: { title: 'Login', subtitle: 'Enter your mobile number to continue' },
    otp: { title: 'Verify OTP', subtitle: `Code sent to +91 ${mobile}` },
    name: { title: 'Almost done', subtitle: 'Tell us your name to finish setting up' },
  }[step];

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <Image
          src="/images/login/chairdekhohero1.webp"
          alt="ChairDekho chairs"
          width={1600}
          height={600}
          priority
          sizes="(max-width: 960px) 100vw, 960px"
          className={styles.heroImage}
        />
        <Link href="/" className={styles.backLink} aria-label="Back to store">
          <ArrowLeft size={18} strokeWidth={1.9} />
        </Link>
      </div>

      <main className={styles.main}>
        {checkingAuth ? (
          <p className={styles.subtitle}>Loading…</p>
        ) : (
          <>
            <h1 className={styles.title}>{heading.title}</h1>
            <p className={styles.subtitle}>{heading.subtitle}</p>

            {step === 'phone' && (
              <form className={styles.form} onSubmit={handleSendOtp}>
                <label className={styles.label} htmlFor="login-phone">
                  Mobile Number
                </label>
                <div className={styles.phoneRow}>
                  <span className={styles.phonePrefix}>+91</span>
                  <input
                    id="login-phone"
                    type="tel"
                    inputMode="numeric"
                    className={styles.phoneInput}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
                    autoComplete="tel-national"
                    autoFocus
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || mobile.length !== 10}
                >
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form className={styles.form} onSubmit={handleVerifyOtp}>
                <span className={styles.label} id="login-otp-label">
                  Enter OTP
                </span>
                <div
                  className={styles.otpBoxes}
                  role="group"
                  aria-labelledby="login-otp-label"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      className={styles.otpBox}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || otp.length !== OTP_LENGTH}
                >
                  {loading ? 'Verifying…' : 'Verify OTP'}
                </button>
                <div className={styles.otpActions}>
                  <button type="button" className={styles.textBtn} onClick={changeNumber}>
                    Change number
                  </button>
                  <button
                    type="button"
                    className={styles.textBtn}
                    onClick={handleResend}
                    disabled={resendIn > 0 || loading}
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}

            {step === 'name' && (
              <form className={styles.form} onSubmit={handleSubmitName}>
                <label className={styles.label} htmlFor="login-name">
                  Full Name
                </label>
                <input
                  id="login-name"
                  ref={nameRef}
                  type="text"
                  className={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || !name.trim()}
                >
                  {loading ? 'Please wait…' : 'Continue'}
                </button>
              </form>
            )}

            <p className={styles.legalNote}>
              By continuing, you agree to our{' '}
              <Link href="/policy/terms-and-conditions">Terms</Link> and{' '}
              <Link href="/policy/privacy-policy">Privacy Policy</Link>.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
