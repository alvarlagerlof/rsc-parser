import React, { ReactNode } from "react";

export function PanelLayout({
  header,
  closeButton,
  children,
}: {
  header: ReactNode;
  closeButton?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="sticky top-0 z-30 flex flex-row justify-between bg-slate-100 p-3 dark:bg-slate-900">
        <div className="flex flex-row items-center gap-4">{header}</div>
        {closeButton}
      </div>
      <div className="grow px-3">
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
}
