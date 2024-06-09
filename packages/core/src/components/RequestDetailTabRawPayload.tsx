import React from "react";
import { useEndTime } from "./EndTimeContext";
import { RscEvent, isRscChunkEvent } from "../events";
import { eventsFilterByMaxTimestamp } from "../eventArrayHelpers";
import { RequestDetailTabEmptyState } from "./RequestDetailTabEmptyState";

const textDecoder = new TextDecoder();

export function RequestDetailTabRawPayload({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();

  const filteredEvents = eventsFilterByMaxTimestamp(events, endTime).filter(
    isRscChunkEvent,
  );
  if (filteredEvents.length === 0) {
    return <RequestDetailTabEmptyState />;
  }

  return (
    <ul className="flex flex-col gap-4 font-code">
      {filteredEvents.map((event) => {
        const text = textDecoder.decode(Uint8Array.from(event.data.chunkValue));

        return (
          <li
            key={
              event.data.requestId +
              event.data.timestamp +
              text.substring(0, 10)
            }
          >
            <pre className="w-full whitespace-break-spaces break-all">
              {text}
            </pre>
          </li>
        );
      })}
    </ul>
  );
}
