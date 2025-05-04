import { ElementType, ReactNode } from 'react';

export function IconButton({
  children,
  onClick,
  as = 'button',
}: {
  children: ReactNode;
  onClick: () => void;
  as?: ElementType;
}) {
  const Component = as;

  return (
    <Component
      onClick={onClick}
      className="rounded-full bg-slate-300 p-1 text-black  dark:bg-slate-700 dark:text-white"
    >
      <div className="size-6">{children}</div>
    </Component>
  );
}
