import React, { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6 min-h-full bg-slate-100 dark:bg-slate-900 space-y-8">
      <h1 className="text-3xl dark:text-white">RSC Devtools</h1>

      {children}
    </div>
  );
}
