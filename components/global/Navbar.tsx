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
import { cn } from '@/lib/utils';
import { BarChart3Icon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  return (
    <NavigationMenu
      className="sticky top-0 z-50 max-w-full py-4 px-6 bg-background/10 backdrop-blur-lg"
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

      <NavigationMenuItem className="ml-auto flex items-center gap-1 list-none">
        <NavigationMenuLink asChild>
          <Link
            href="/compare"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
              pathname === '/compare'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            )}
          >
            <BarChart3Icon className="size-4" />
            <span className="hidden sm:inline">Compare</span>
          </Link>
        </NavigationMenuLink>
        <ModeToggle />
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
