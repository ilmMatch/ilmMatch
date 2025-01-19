'use client';

import LoginModal from '@/components/modals/LoginModal';
import { useAuth } from '@/context/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, userDataPrivate, userDataProfile } = useAuth();

  if (!currentUser) return <LoginModal />;
  if (!userDataPrivate && !userDataProfile) return <>Loading</>;
  return <>
    <div className='w-full h-full flex items-center justify-center text-center'>
      We&apos;re Implementing this Sections, Thank you
    </div>
    {/* {children} */}
  </>
}
