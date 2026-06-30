'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import Logo from './Logo';
import { ModeToggle } from '@/components/ModeToggle';

export function NavBar() {
  return (
    <NavigationMenu
      className="sticky top-0 z-50 max-w-full py-4 px-6 bg-background/80 backdrop-blur-lg border-b border-border/40"
      viewport={false}>
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={'/'} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Logo />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                Privacy Peek
              </span>
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
