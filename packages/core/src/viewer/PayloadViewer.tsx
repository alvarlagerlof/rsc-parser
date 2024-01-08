import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RowTabs } from "../tabs/row/RowTabs";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { messagesToResponse } from "../rows/messagesToResponse";
import { RscChunkMessage } from "../main";

export function PayloadViewer({ defaultPayload }: { defaultPayload: string }) {
  const [payload, setPayload] = useState(defaultPayload);

  useEffect(() => {
    const previous = localStorage.getItem("payload");
    setPayload(previous ?? defaultPayload);
  }, []);

  const messages = [
    {
      type: "RSC_CHUNK",
      tabId: 0,
      data: {
        fetchUrl: "https://example.com",
        fetchHeaders: {
          "Content-Type": "application/json",
        },
        fetchStartTime: 0,
        chunkStartTime: 0,
        chunkEndTime: 0,
        chunkValue: uint8ArrayToRecord(new TextEncoder().encode(payload)),
      },
    } satisfies RscChunkMessage,
  ];

  const response = messagesToResponse(messages);
  const chunks = response?._chunks ?? [];

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
          <RowTabs chunks={chunks} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function uint8ArrayToRecord(data: Uint8Array): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, value] of data.entries()) {
    result[key.toString()] = value;
  }
  return result;
}
