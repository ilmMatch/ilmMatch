'use client';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Command,
  Home,
  Inbox,
  LifeBuoy,
  Search,
  Send,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/context/AuthProvider';
import { NavUser } from '@/components/sidebar/nav-user';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { siteConfig } from '@/config/site';

const navSecondary = [
  {
    title: 'Support',
    url: '#',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send,
  },
];

export function AppSidebar({ isAdminorVolunteer }: { isAdminorVolunteer: boolean }) {
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating" hidden={isMobile}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem
            className={`flex items-center justify-center ${state === 'collapsed' ? 'flex-col gap-3' : ''}`}
          >
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ilm Match</span>
                  {/* <span className="truncate text-xs">description</span> */}
                </div>
              </a>
            </SidebarMenuButton>
            <span
              className={`flex items-center justify-center ${state === 'collapsed' ? 'self-start' : ''}`}
            >
              {' '}
              <SidebarTrigger />
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ilm Match</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {siteConfig.sideMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        {isAdminorVolunteer && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="text-popover-foreground">
                  Admin/ Volunteer
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {siteConfig.sideMenuAdminItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild tooltip={item.label}>
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {siteConfig.supportMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

export function SidebarComponent() {
  const { currentUser, userDataPrivate } = useAuth();
  return currentUser && userDataPrivate ? (
    <>
      <AppSidebar isAdminorVolunteer={userDataPrivate?.role === 'admin' || userDataPrivate?.role === 'volunteer'} />
    </>
  ) : (
    ''
  );
}
