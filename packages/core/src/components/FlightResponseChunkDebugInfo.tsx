import React from "react";
import { DebugInfoChunk } from "@rsc-parser/react-client";

export function FlightResponseChunkDebugInfo({
  data,
}: {
  data: DebugInfoChunk["value"];
}) {
  return <p>React component name: {data.name}</p>;
}
