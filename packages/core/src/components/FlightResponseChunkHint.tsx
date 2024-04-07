import React from "react";
import { HintChunk } from "../react/ReactFlightClient";

export function FlightResponseChunkHint({
  data,
}: {
  data: HintChunk["value"];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">
          Load asset of type &quot;{JSON.stringify(data[1])}&quot;
        </h3>
      </div>
      <p>Path: {data[0]}</p>
      {data[2] ? (
        <p>
          Settings: <pre>{JSON.stringify(data[2], null, 2)}</pre>
        </p>
      ) : null}
    </div>
  );
}
