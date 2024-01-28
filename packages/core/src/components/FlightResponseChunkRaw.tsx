import { Chunk } from "../react/ReactFlightClient";

export function FlightResponseChunkRaw({ data }: { data: Chunk }) {
  return (
    <pre className="w-full whitespace-break-spaces break-all">
      {data.originalValue}
    </pre>
  );
}
