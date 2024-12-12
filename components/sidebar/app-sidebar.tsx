'use client';
import {
  Calendar,
  ChevronDown,
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

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/profile',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '/find',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

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

export function AppSidebar() {
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
          {/* <SidebarMenuItem>
            <SidebarTrigger />
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <SidebarGroup>
          <span className="max-sm:hidden">
            <SidebarTrigger />
          </span>
        </SidebarGroup> */}
        <SidebarGroup>
          <SidebarGroupLabel>Ilm Match</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="text-popover-foreground">
                Help
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <AppSidebar />
      <span className="block sm:hidden fixed top-20 left-4 z-10">
        <SidebarTrigger />
      </span>
    </>
  ) : (
    ''
  );
}
