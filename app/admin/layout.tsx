'use client';

import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, userDataPrivate, userDataProfile } = useAuth();

  if (!currentUser) return <LoginModal />;
  if (!userDataPrivate && !userDataProfile) return <>Loading</>;
  return children;
}
