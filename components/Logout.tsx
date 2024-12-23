'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

export function LogoutMobile({ withText }: { withText?: boolean }) {
  const { logout } = useAuth();
  const router = useRouter();
  async function handleSubmit() {
    try {
      const result = await logout();
      if (!result.success) {
        toast.error('Uh oh! Something went wrong.', {
          description: result.error,
        });
        return;
      }
      router.push('/');
    } catch (err: any) {
      toast.error('Uh oh! Something went wrong.', {
        description: err.message,
      });
    }
  }
  return (
    <Button
      variant={'ghost'}
      onClick={handleSubmit}
      className={cn(
        "w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md",
        withText && "w-full text-left justify-start p-0"
      )}
    >
      <LogOut className="size-5" />
      {withText && "Logout"}
    </Button>
  );
}
