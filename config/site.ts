import { BadgeCheck, Bookmark, Heart, Home, Send, UserPlus, UserRoundCheck } from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + NextUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Role',
      href: '/rolemanage',
    },
    {
      label: 'Blog',
      href: '/find',
    },
    {
      label: 'About',
      href: '/about',
    },
  ],
  sideMenuItems: [
    {
      label: 'Home',
      href: '/profile',
      icon: Home,
    },
    {
      label: 'Approved Users',
      href: '/find',
      icon: BadgeCheck,
    },
    {
      label: 'My Bookmark',
      href: '/bookmark',
      icon: Bookmark,
    },
    {
      label: 'Requests',
      href: '/requests',
      icon: Send,
    },
    {
      label: 'Accepted',
      href: '/accepted',
      icon: Heart,
    },
  ],
  sideMenuAdminItems: [
    {
      label: 'Assign Admin',
      href: '/admin/rolemanage',
      icon: UserPlus,
    },
    {
      label: 'Request Approval',
      href: '/admin/requests',
      icon: Heart,
    },
    {
      label: 'User Approval',
      href: '/admin/approve',
      icon: UserRoundCheck,
    },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Find',
      href: '/find',
    },
    {
      label: 'Projects',
      href: '/projects',
    },
    {
      label: 'Team',
      href: '/team',
    },
    {
      label: 'Calendar',
      href: '/calendar',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
    },
    {
      label: 'Logout',
      href: '/logout',
    },
  ],
  links: {
    github: 'https://github.com/nextui-org/nextui',
    twitter: 'https://twitter.com/getnextui',
    docs: 'https://nextui.org',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
