'use client';

import { LogOutIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export function NavUser() {
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
  const { isMobile } = useSidebar();
  const user = {
    fname: 'Rahat',
    lname: 'Sayyed',
    email: 'email@gmail.com',
    avatar: 'string',
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.avatar}
              alt={user.fname.charAt(0) + user.lname.charAt(0)}
            />
            <AvatarFallback className="rounded-lg">
              {user.fname.charAt(0) + user.lname.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user.fname} {user.lname}
            </span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <Button size="icon" variant="ghost" onClick={handleSubmit}>
            <LogOutIcon className="ml-auto size-4" />
          </Button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
