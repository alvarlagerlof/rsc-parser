import React, { useContext } from "react";
import { FlightResponse } from "../react/ReactFlightClient";
import { FlightResponseChunkRaw } from "./FlightResponseChunkRaw";
import { EndTimeContext } from "./EndTimeContext";

export function FlightResponseTabRaw({
  flightResponse,
}: {
  flightResponse: FlightResponse;
}) {
  const endTime = useContext(EndTimeContext);

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
