import React, { ReactNode } from 'react';

export function PanelLayout({
  header,
  buttons,
  children,
}: {
  header: ReactNode;
  buttons?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col text-sm">
      <div className="sticky top-0 z-30 flex flex-row justify-between gap-4 bg-slate-100 p-3 dark:bg-slate-900">
        <div className="flex flex-row items-center gap-4">{header}</div>
        <div className="flex flex-row items-center gap-2">{buttons}</div>
      </div>
      <div className="grow px-3">
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
}
