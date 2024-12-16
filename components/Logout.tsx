'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      <LogOut /> Logout
    </Button>
  );
}

export function LogoutMobile() {
  const { logout } = useAuth();
  const router = useRouter();
  async function handleSubmit() {
    try {
      const result = await logout();
      if (!result.success) {
        toast.error("Uh oh! Something went wrong.", {
          description: result.error,
        })
        return
      }
      toast.success("Success.", {
        description: "Logged Out Successfully",
      })
      router.push('/');
    } catch (err: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: err.message,
      })
    }
  }
  return (
    <Button
      variant={'ghost'}
      onClick={handleSubmit}
      className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md"
    >
      <LogOut className="size-5" />
    </Button>
  );
}
