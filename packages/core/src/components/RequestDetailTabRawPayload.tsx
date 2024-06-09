import React from "react";
import { FlightResponseChunkRaw } from "./FlightResponseChunkRaw";
import { useEndTime } from "./EndTimeContext";
import { RscEvent, isRscChunkEvent } from "../events";
import {
  createFlightResponse,
  processBinaryChunk,
} from "@rsc-parser/react-client";
import { eventsFilterByMaxTimestamp } from "../eventArrayHelpers";
import { RequestDetailTabEmptyState } from "./RequestDetailTabEmptyState";

export function RequestDetailTabRawPayload({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();

  if (
    eventsFilterByMaxTimestamp(events, endTime).filter(isRscChunkEvent)
      .length === 0
  ) {
    return <RequestDetailTabEmptyState />;
  }

  const flightResponse = createFlightResponse();
  for (const event of events.filter(isRscChunkEvent)) {
    flightResponse._currentTimestamp = event.data.timestamp;
    processBinaryChunk(flightResponse, Uint8Array.from(event.data.chunkValue));
  }

  const timeFilteredChunks = flightResponse._chunks.filter(
    (chunk) => chunk.timestamp <= endTime,
  );

  return (
    <ul className="flex flex-col gap-4 font-code">
      {timeFilteredChunks.map((chunk) => (
        <li key={chunk.id}>
          <FlightResponseChunkRaw data={chunk} />
        </li>
      ))}
    </ul>
  );
}
