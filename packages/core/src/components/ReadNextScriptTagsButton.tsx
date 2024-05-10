import React from "react";

export function ReadNextScriptTagsButton({
  onClickRead,
}: {
  onClickRead: () => void;
}) {
  return (
    <button
      className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
      onClick={onClickRead}
    >
      Read Next.js script tag payload
    </button>
  );
}
