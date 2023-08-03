import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RowTabs } from "../tabs/row/RowTabs";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";

export function PayloadViewer({ defaultPayload }: { defaultPayload: string }) {
  const [payload, setPayload] = useState(defaultPayload);

  useEffect(() => {
    const previous = localStorage.getItem("payload");
    setPayload(previous ?? defaultPayload);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <form className="flex w-full flex-col gap-2">
        <label htmlFor="payload" className="font-medium">
          Payload
        </label>

        <textarea
          name="payload"
          placeholder="RCS payload"
          className="resize-none rounded-md bg-slate-200 p-3 dark:bg-slate-800 dark:text-slate-200"
          rows={16}
          value={payload}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            setPayload(event.target.value);
            localStorage.setItem("payload", event.target.value);
          }}
          spellCheck="false"
        />
      </form>
      <div className="w-full">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={payload}
        >
          <RowTabs payload={payload} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
