import {
  BadgeCheck,
  Bookmark,
  Handshake,
  Heart,
  LifeBuoy,
  Send,
  User,
  UserPlus,
  UserRoundCheck,
  UserRoundPlus,
} from 'lucide-react';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Ilm Match',
  description: 'Connecting Hearts Of Knowledge.',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Rules',
      href: '/rules',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
    {
      label: 'Profiles',
      href: '/profiles',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Rules',
      href: '/rules',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
    {
      label: 'Profiles',
      href: '/profiles',
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
      label: 'Approve User',
      href: '/admin/userapprove',
      icon: UserRoundCheck,
    },
    {
      label: 'Add User',
      href: '/admin/adduser',
      icon: UserRoundPlus,
    },
    {
      label: 'Request Approval',
      href: '/admin/requests',
      icon: Heart,
    },
    {
      label: 'Volunteers Management',
      href: '/admin/rolemanage',
      icon: Handshake,
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
