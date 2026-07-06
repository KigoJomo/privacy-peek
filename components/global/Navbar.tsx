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
import { AlertTriangleIcon, BarChart3Icon, ListIcon, LayoutDashboardIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/sites', label: 'Sites', icon: ListIcon, ariaLabel: 'Browse all analyzed sites' },
    { href: '/compare', label: 'Compare', icon: BarChart3Icon, ariaLabel: 'Compare privacy scores across sites' },
    { href: '/stale', label: 'Stale', icon: AlertTriangleIcon, ariaLabel: 'View stale analyses that need refreshing' },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, ariaLabel: 'View privacy dashboard' },
  ];

  return (
    <NavigationMenu
      className="sticky top-0 z-50 max-w-full py-3 px-4 sm:px-6 bg-background/80 backdrop-blur-xl border-b border-border/40"
      viewport={false}
    >
      <NavigationMenuList className="w-full gap-1">
        <NavigationMenuItem className="mr-auto shrink-0">
          <NavigationMenuLink asChild>
            <Link href={'/'} aria-label="Privacy Peek home">
              <Logo />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Nav links — scrollable on mobile */}
        <div className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar -mx-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    aria-label={item.ariaLabel}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </div>

        <NavigationMenuItem className="shrink-0">
          <ModeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
