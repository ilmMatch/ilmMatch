'use client';

import { LogOutIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

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
  const { isMobile } = useSidebar();
  const user = {
    firstName: 'Rahat',
    lastName: 'Sayyed',
    email: 'email@gmail.com',
    avatar: 'string',
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-3 sm:gap-2 h-10">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={user.avatar}
              alt={
                userDataObj?.firstName.charAt(0) +
                userDataObj?.lastName.charAt(0)
              }
            />
            <AvatarFallback className="rounded-lg">
              {userDataObj?.firstName.charAt(0) +
                userDataObj?.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {userDataObj?.firstName} {userDataObj?.lastName}
            </span>
            <span className="truncate text-xs w-40 sm:w-36 ">
              {userDataObj?.email}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={handleSubmit}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-md"
              >
                {/* <Button size="icon" variant="ghost" onClick={handleSubmit} > */}
                <LogOutIcon className="size-5" />
                {/* </Button> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
