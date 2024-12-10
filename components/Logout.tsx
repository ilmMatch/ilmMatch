'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  async function handleSubmit() {
    try {
      await logout();
      router.push('/');
    } catch (err: any) {
      console.log(err.message);
    }
  }
  return (
    <Button onClick={handleSubmit}>
      <LogOut /> Loutout
    </Button>
  );
}

export function LogoutMobile() {
  const { logout } = useAuth();
  const router = useRouter();
  async function handleSubmit() {
    try {
      await logout();
      router.push('/');
    } catch (err: any) {
      console.log(err.message);
    }
  }
  return (
    <Button onClick={handleSubmit}>
      <LogOut />
    </Button>
  );
}
