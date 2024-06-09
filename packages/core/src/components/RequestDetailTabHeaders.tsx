import { eventsFilterByMaxTimestamp } from "../eventArrayHelpers";
import { RscEvent, isRscRequestEvent, isRscResponseEvent } from "../events";
import { useEndTime } from "./EndTimeContext";

export function RequestDetailTabHeaders({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();

  const timeFilteredEvents = eventsFilterByMaxTimestamp(events, endTime);

  const requestEvent = timeFilteredEvents.filter(isRscRequestEvent)[0];
  const responseEvent = timeFilteredEvents.filter(isRscResponseEvent)[0];

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-1">
        <p>Request headers</p>
        {requestEvent ? (
          <HeadersTable headers={requestEvent.data.headers} />
        ) : (
          "No response headers"
        )}
      </section>
      <section className="flex flex-col gap-1">
        <p>Response headers</p>
        {responseEvent ? (
          <HeadersTable headers={responseEvent.data.headers} />
        ) : (
          "No request headers"
        )}
      </section>
    </div>
  );
}

function HeadersTable({ headers }: { headers: Record<string, string> }) {
  return (
    <table className="w-full max-w-4xl table-fixed border-collapse border border-slate-500 dark:text-white">
      <tbody>
        {Object.entries(headers).map(([key, value]) => (
          <tr key={key}>
            <td className="border border-slate-500 px-1.5 py-0.5">{key}</td>
            <td className="whitespace-pre-wrap break-all border border-slate-500 px-1.5 py-0.5">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
