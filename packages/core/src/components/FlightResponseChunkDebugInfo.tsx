import { DebugInfoChunk } from "../react/ReactFlightClient";

export function FlightResponseChunkDebugInfo({
  data,
}: {
  data: DebugInfoChunk["value"];
}) {
  return <p>React component name: {data.name}</p>;
}
