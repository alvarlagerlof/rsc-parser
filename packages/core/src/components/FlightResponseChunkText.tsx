import React from "react";
import { TextChunk } from "@rsc-parser/react-client";

export function FlightResponseChunkText({
  data,
}: {
  data: TextChunk["value"];
}) {
  return <p>{data}</p>;
}
