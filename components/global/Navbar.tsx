'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  // NavigationMenuTrigger,
  // NavigationMenuContent,
  NavigationMenuLink,
  // navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Logo from './Logo';
import { ModeToggle } from '@/components/ModeToggle';

export function NavBar() {
  return (
    <NavigationMenu
      className="sticky top-0 z-50 max-w-full py-4 px-6 bg-background"
      viewport={false}>
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={'/'}>
              <Logo />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuItem className="ml-auto list-none">
        <ModeToggle />
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
