import { ReactNode, useState, useTransition } from "react";
import { RscChunkMessage } from "./message";
import { useFilterMessagesByEndTime } from "./hooks";
import { TimeScrubber } from "./TimeScrubber";

function Pill({ children }: { children: ReactNode }) {
  return <span className="bg-blue-700 px-1 rounded">{children}</span>;
}

export function RawStream({ messages }: { messages: RscChunkMessage[] }) {
  const [endTime, setEndTime] = useState(Date.now());

  const timeFilteredMessages = useFilterMessagesByEndTime(messages, endTime);

  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <TimeScrubber
        messages={messages}
        onEndTimeChange={(time) => {
          startTransition(() => {
            setEndTime(time);
          });
        }}
      />

      <div
        className={`transition-opacity duration-100 delay-[50] ${
          isPending ? "opacity-60" : ""
        }`}
      >
        <ul className="dark:text-white flex flex-col font-code divide-y divide-slate-500 darK:divide-slate-400 transition-opacity duration-100 delay-75">
          {timeFilteredMessages.map(({ data }) => (
            <li className="py-8 last:pb-0 first:pt-0">
              <div>
                <Pill>URL</Pill> {data.fetchUrl}
              </div>
              <div>
                <Pill>Headers</Pill>{" "}
                {/* <pre className="break-all whitespace-break-spaces">
              {JSON.stringify(data.fetchHeaders, null, 2)}
            </pre> */}
                <pre className="break-all whitespace-break-spaces">
                  {JSON.stringify(data.fetchHeaders).substring(0, 100)}
                </pre>
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
                {/* <Pill>Chunk value</Pill> {data.chunkValue} */}
                <Pill>Chunk value</Pill> {data.chunkValue.substring(0, 100)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
