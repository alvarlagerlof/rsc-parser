import React from "react";
import { eventsFilterByMaxTimestamp } from "../eventArrayHelpers";
import { RscEvent, isRscRequestEvent, isRscResponseEvent } from "../events";
import { useEndTime } from "./EndTimeContext";
import { RequestDetailTabEmptyState } from "./RequestDetailTabEmptyState";

export function RequestDetailTabHeaders({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();

  const timeFilteredEvents = eventsFilterByMaxTimestamp(events, endTime);

  if (timeFilteredEvents.length === 0) {
    return <RequestDetailTabEmptyState />;
  }

  const requestEvent = timeFilteredEvents.filter(isRscRequestEvent)[0];
  const responseEvent = timeFilteredEvents.filter(isRscResponseEvent)[0];

  return (
    <div className="flex flex-col gap-6">
      {requestEvent ? (
        <Table
          header="General Information"
          data={{
            "Request URL": requestEvent.data.url,
            "Request Method": requestEvent.data.method,
            ...(responseEvent
              ? { "Status Code": responseEvent.data.status }
              : {}),
          }}
        />
      ) : (
        "No general information"
      )}

      {requestEvent ? (
        <Table header="Request Headers" data={requestEvent.data.headers} />
      ) : (
        "No response headers"
      )}

      {responseEvent ? (
        <Table header="Response Headers" data={responseEvent.data.headers} />
      ) : (
        "No response headers"
      )}
    </div>
  );
}

function Table({
  header,
  data,
}: {
  header: string;
  data: Record<string, string | number>;
}) {
  return (
    <details open className="max-w-2xl">
      <summary className="font-semibold">{header}</summary>
      <table className="ml-3 mt-1 w-full table-auto dark:text-white">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr
              key={key}
              className="block border-y border-slate-300 py-1 first:border-t-0 last:border-b-0 dark:border-slate-600"
            >
              <td className="min-w-52 border-slate-500">{key}</td>
              <td className="whitespace-pre-wrap break-all">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
