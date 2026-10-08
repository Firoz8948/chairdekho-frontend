import AccountScreen from './AccountScreen';

export const metadata = {
  title: 'My Account',
  description: 'Manage your ChairDekho profile, address, and orders.',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountScreen />;
}
