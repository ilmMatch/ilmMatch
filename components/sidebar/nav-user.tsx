'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { LogoutMobile } from '../Logout';

export function NavUser() {
  const { logout, userDataObj } = useAuth();
  const router = useRouter();
  async function handleSubmit() {
    try {
      await logout();
      router.push('/');
    } catch (err: any) {
      console.log(err.message);
    }
  }

  if (!userDataObj) {
    return <>Loading...</>;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-center">
        <SidebarMenuButton size="lg" className="hover:bg-transparent">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={userDataObj.avatar}
              alt={
                userDataObj.firstName.charAt(0) + userDataObj.lastName.charAt(0)
              }
            />
            <AvatarFallback className="rounded-lg">
              {userDataObj.firstName.charAt(0) + userDataObj.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {userDataObj.firstName} {userDataObj.lastName}
            </span>
            <span className="truncate text-xs w-40 sm:w-32 ">
              {userDataObj.email}
            </span>
          </div>
        </SidebarMenuButton>

        <div className="hover:bg-transparent">
          <LogoutMobile />
          {/* <Button size="icon" variant="ghost" onClick={handleSubmit}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md"
          >
            <LogOutIcon className="size-5" />
          </Button> */}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
