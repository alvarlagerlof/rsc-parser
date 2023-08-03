import React, { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full space-y-8 overflow-y-scroll bg-slate-100 p-6 dark:bg-slate-900">
      <h1 className="text-3xl dark:text-white">RSC Devtools</h1>

      {children}
    </div>
  );
}
