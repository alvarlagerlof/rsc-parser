import { ReactNode } from "react";
import { RscChunkMessage } from "./message";

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-blue-300 px-1 dark:bg-blue-700">
      {children}
    </span>
  );
}

export function RawStream({ messages }: { messages: RscChunkMessage[] }) {
  return (
    <ul className="flex flex-col divide-y divide-slate-500 font-code transition-opacity delay-75 duration-100 dark:divide-slate-400 dark:text-white">
      {messages.map(({ data }) => (
        <li className="py-8 first:pt-0 last:pb-0">
          <div>
            <Pill>URL</Pill> {data.fetchUrl}
          </div>
          <div>
            <Pill>Headers</Pill>{" "}
            <pre className="w-full whitespace-break-spaces break-all">
              {JSON.stringify(data.fetchHeaders, null, 2)}
            </pre>
            {/* <pre className="break-all whitespace-break-spaces">
                {JSON.stringify(data.fetchHeaders).substring(0, 100)}
              </pre> */}
          </div>
          <div>
            <Pill>Fetch start</Pill> {data.fetchStartTime}
          </div>
          <div>
            <Pill>Chunk start</Pill> {data.chunkStartTime}
          </div>
          <div>
            <Pill>Chunk end</Pill> {data.chunkEndTime}
          </div>
          <div>
            <Pill>Chunk value</Pill>{" "}
            <pre className="w-full whitespace-break-spaces break-all">
              {Object.entries(data.chunkValue)
                .map(([key, value]) => `${key} - ${value}`)
                .join("\n")}
            </pre>
          </div>
        </li>
      ))}
    </ul>
  );
}
