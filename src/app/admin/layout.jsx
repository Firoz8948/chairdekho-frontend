import AdminShell from './AdminShell';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: { absolute: 'Admin Hub | ChairDekho' },
  description: 'Store administration and operations',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
