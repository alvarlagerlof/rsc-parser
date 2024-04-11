import React from "react";

export function RecordButton({
  isRecording,
  onClickRecord,
}: {
  isRecording: boolean;
  onClickRecord: () => void;
}) {
  if (isRecording) {
    return (
      <div className="flex flex-row w-fit items-center gap-2 rounded-md bg-red-200 dark:bg-red-700 px-2 py-0.5 font-medium">
        <div className="size-3 animate-pulse rounded-full bg-red-500 dark:bg-red-400" />
        <span className="text-red-600 dark:text-red-100">Recording...</span>
      </div>
    );
  }

  return (
    <button
      className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
      onClick={async () => {
        onClickRecord();
      }}
    >
      Start recording
    </button>
  );
}
