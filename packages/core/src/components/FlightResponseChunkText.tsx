import React from "react";
import { TextChunk } from "../react/ReactFlightClient";

export function FlightResponseChunkText({
  data,
}: {
  data: TextChunk["value"];
}) {
  return <p>{data}</p>;
}
