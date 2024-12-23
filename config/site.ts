import {
  BadgeCheck,
  Bookmark,
  Heart,
  LifeBuoy,
  Send,
  User,
  UserPlus,
  UserRoundCheck,
} from 'lucide-react';

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
  sideMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
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
      label: 'User Approval',
      href: '/admin/userapprove',
      icon: UserRoundCheck,
    },
    {
      label: 'Request Approval',
      href: '/admin/requests',
      icon: Heart,
    },
  ],
  supportMenuItems: [
    {
      label: 'Support',
      href: '#',
      icon: LifeBuoy,
    },
    {
      label: 'Feedback',
      href: '#',
      icon: Send,
    },
  ],

  links: {
    github: '#',
    twitter: '#',
    docs: '#',
    discord: '#',
    sponsor: '#',
  },
};
