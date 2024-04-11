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
    <div className="flex flex-col min-h-full">
      <div className="flex flex-row justify-between p-3 top-0 sticky dark:bg-slate-900 bg-slate-100 z-30">
        <div className="flex flex-row items-center gap-4">{header}</div>
        {closeButton}
      </div>
      {/* eslint-disable-next-line tailwindcss/classnames-order */}
      <div className="scrollbar-gutter-stable flex-grow px-3">
        <div className="pb-3">{children}</div>
      </div>
    </div>
  );
}
