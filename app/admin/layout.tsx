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
  if (!userDataPrivate || !userDataProfile) return <>Loading</>;
  return <>
    {(userDataPrivate.role === "admin" || userDataPrivate.role === "volunteer") ? children : <>
      <div className='w-full h-full flex items-center justify-center text-center'>
        Only for Admin and Volunteers
        <p>would you like to be a volunteer? email us.</p>
      </div>
    </>}
  </>
}
