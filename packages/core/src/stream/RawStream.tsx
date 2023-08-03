import { ReactNode } from "react";
import { RscChunkMessage } from "./message";
import { useFilterMessagesByEndTime } from "./hooks";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-blue-300 px-1 dark:bg-blue-700">
      {children}
    </span>
  );
}

export function RawStream({ messages }: { messages: RscChunkMessage[] }) {
  const timeScrubber = useTimeScrubber(messages, { follow: true });

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime,
  );

  return (
    <div className="flex flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <ul className="flex flex-col divide-y divide-slate-500 font-code transition-opacity delay-75 duration-100 dark:divide-slate-400 dark:text-white">
        {timeFilteredMessages.map(({ data }) => (
          <li className="py-8 first:pt-0 last:pb-0">
            <div>
              <Pill>URL</Pill> {data.fetchUrl}
            </div>
            <div>
              <Pill>Headers</Pill>{" "}
              <pre className="w-full overflow-hidden whitespace-break-spaces break-all">
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
              <pre className="w-full overflow-hidden whitespace-break-spaces break-all">
                {data.chunkValue}
              </pre>
              {/* <Pill>Chunk value</Pill> {data.chunkValue.substring(0, 100)} */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
