import { Chunk } from "../react/ReactFlightClient";

export function RowStream({ chunks }: { chunks: Chunk[] }) {
  return (
    <ul className="flex flex-col gap-4 font-code dark:text-white">
      {chunks.map((chunk) => (
        <li>
          <pre className="w-full whitespace-break-spaces break-all">
            {chunk.originalValue}
          </pre>
        </li>
      ))}
    </ul>
  );
}
