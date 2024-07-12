import React, { ReactNode } from 'react';
import { MenuProvider, MenuButton, Menu } from '@ariakit/react';
import { IconButton } from './IconButton';

export function OverflowButton({ menuItems }: { menuItems: ReactNode }) {
  return (
    <MenuProvider>
      <MenuButton>
        <IconButton onClick={() => {}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="size-full"
          >
            <title>Three dots</title>
            <path d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z" />
          </svg>
        </IconButton>
      </MenuButton>
      <Menu
        gutter={8}
        className="flex flex-col items-start gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white shadow-lg dark:bg-slate-200 dark:text-black"
      >
        {menuItems}
      </Menu>
    </MenuProvider>
  );
}
