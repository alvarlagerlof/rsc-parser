import React from "react";
import { Chunk } from "@rsc-parser/react-client";

export function FlightResponseChunkRaw({ data }: { data: Chunk }) {
  return (
    <pre className="w-full whitespace-break-spaces break-all">
      {typeof data.originalValue === "string"
        ? data.originalValue
        : JSON.stringify(data.originalValue, null, 2)}
    </pre>
  );
}
