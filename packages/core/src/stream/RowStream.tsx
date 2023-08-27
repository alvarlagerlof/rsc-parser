import { RscChunkMessage } from "./message";

export function RowStream({ messages }: { messages: RscChunkMessage[] }) {
  const splitByRows = messages
    .map((message) => message.data.chunkValue)
    .join()
    .split("\n");

  return (
    <ul className="flex flex-col gap-4 font-code dark:text-white">
      {splitByRows.map((row) => (
        <li>
          <pre className="w-full whitespace-break-spaces break-all">{row}</pre>
        </li>
      ))}
    </ul>
  );
}
