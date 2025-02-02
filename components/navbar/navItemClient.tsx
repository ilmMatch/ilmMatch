'use client';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Mail } from 'lucide-react';
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/navbar';
import { ThemeSwitch } from '../theme-switch';
import { link as linkStyles } from '@nextui-org/theme';
import { DropdownMenuComponent } from './dropdown';
import { siteConfig } from '@/config/site';
import { Logo } from '../icons';
import clsx from 'clsx';

export function NavLoginItem() {
  const { currentUser } = useAuth();
  return (
    !currentUser && (
      <NavbarItem className="hidden lg:flex">
        <Link href="/login">
          <Button>
            <Mail /> Volunteer
          </Button>
        </Link>
      </NavbarItem>
    )
  );
}

export function NavUserMobileItem() {
  const { currentUser } = useAuth();
  return (
    <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
      <ThemeSwitch />
      {currentUser ? (
        <NavbarItem>
          <DropdownMenuComponent />
        </NavbarItem>
      ) : (
        <>
          <NavbarItem>
            <Link href="/login">
              <Button variant={'outline'} size={'sm'}>
                <Mail /> Volunteer
              </Button>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <NavbarMenuToggle />
          </NavbarItem>
          <NavbarMenu className='flex items-center p-16'>

            {siteConfig.navItems.map((item) => (
              <NavbarMenuItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium'
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>

        </>

      )}
    </NavbarContent>
  );
}

export function NavLogo() {
  const { currentUser } = useAuth();
  return (
    !currentUser && (
      <NavbarContent
        className="hidden lg:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link className="flex justify-start items-center gap-1" href="/">
            <Logo color='#ca8a04' />
            <p className="font-bold text-inherit text-yellow-600">IlmMatch</p>
          </Link>
        </NavbarBrand>

      </NavbarContent>
    )
  );
}

export function NavLinks() {
  const { currentUser } = useAuth();
  return (
    !currentUser && (
      <NavbarContent
        className="hidden lg:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>
    )
  );
}
