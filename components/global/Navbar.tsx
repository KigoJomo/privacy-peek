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
import { AlertTriangleIcon, BarChart3Icon, ListIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  return (
    <NavigationMenu
      className="sticky top-0 z-50 max-w-full py-4 px-6 bg-background/10 backdrop-blur-lg"
      viewport={false}>
      <NavigationMenuList className="w-full">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href={'/'}>
              <Logo />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Nav links section */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/sites"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                pathname === '/sites'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <ListIcon className="size-4" />
              <span className="hidden sm:inline">Sites</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
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
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/stale"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors',
                pathname === '/stale'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              )}
            >
              <AlertTriangleIcon className="size-4" />
              <span className="hidden sm:inline">Stale</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
