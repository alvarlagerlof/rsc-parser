import { ReactNode } from "react";

export function IconButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-slate-300 p-1 text-black  dark:bg-slate-700 dark:text-white"
    >
      <div className="size-6">{children}</div>
    </button>
  );
}
