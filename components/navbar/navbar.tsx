import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
} from '@nextui-org/navbar';
import { ThemeSwitch } from '@/components/theme-switch';
import { NavLinks, NavLoginItem, NavLogo, NavUserMobileItem } from './navItemClient';
import Link from 'next/link';
import { Logo } from '../icons';

export const Navbar = () => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky" shouldHideOnScroll>
      <NavbarContent
        className="basis-1/5 sm:basis-full sm:hidden"
        justify="start"
      >
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavLogo />

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavLinks />
        <NavbarItem className="hidden lg:flex">
          <ThemeSwitch />
        </NavbarItem>

        <NavLoginItem />
      </NavbarContent>

      <NavUserMobileItem />
    </NextUINavbar>
  );
};
