'use client';

import { useState } from 'react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import {
  Blocks,
  House,
  LucideIcon,
  PanelLeft,
  PanelRight,
  Sparkles,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const nav_links: { href: string; icon: LucideIcon; label: string }[] = [
    {
      href: '/',
      icon: House,
      label: 'Home',
    },
    {
      href: '/chat',
      icon: Sparkles,
      label: 'Chat',
    },
  ];

  return (
    <>
      <aside
        className={`bg-background h-dvh shrink-0 overflow-hidden z-50 
          flex flex-col gap-6
          ${open ? 'w-64 px-4 py-4' : 'w-0 px-0 py-4'}
          transition-all duration-300 
        *:text-nowrap *:whitespace-nowrap flex-nowrap *:shrink-0`}>
        <div className="w-full flex items-center justify-between">
          <Button href={'/'} variant="seamless" className="">
            <Logo size={24} />
          </Button>

          <Button
            onClick={toggleSidebar}
            className={` ${!open ? 'hidden' : 'flex py-4'}`}
            variant="seamless"
            size="sm">
            <PanelRight
              size={20}
              className="shrink-0 stroke-foreground-light"
            />
          </Button>
        </div>

        <hr />

        <nav className="w-full flex flex-col gap-4">
          {nav_links.map((link, index) => (
            <Button
              key={index}
              href={link.href}
              variant="seamless"
              className={`w-full flex items-center justify-start gap-2 ${link.href === pathname ? '!bg-accent/20' : ''}`}>
              <link.icon size={16} />
              <span className="text-sm">{link.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      <div className="w-full fixed top-0 z-40  flex items-center gap-2 justify-between">
        <div
          className={`${open ? 'hidden' : 'flex items-center gap-1 p-4 w-fit h-fit backdrop-blur-3xl rounded-br-2xl'}`}>
          <Button
            onClick={toggleSidebar}
            className=" w-fit h-fit"
            variant="seamless"
            size="sm">
            <PanelLeft size={20} className="shrink-0 stroke-foreground-light" />
          </Button>
          <Button
            variant="seamless"
            href={'/'}
            className="logo flex items-center gap-2 ">
            <Logo size={24} />
            <h4 className="whitespace-nowrap text-nowrap">Privacy Peek</h4>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-1 pr-4">
          <Button className='flex items-center gap-1'>
            <Blocks size={16} />
            <span className='text-sm'>Get The Extension</span>
          </Button>
        </div>
      </div>
    </>
  );
}
