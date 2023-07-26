import { useState, useTransition } from "react";
import { RscChunkMessage } from "./message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
  useTabs,
} from "./hooks";
import { TimeScrubber } from "./TimeScrubber";

export function StreamTabs({ messages }: { messages: RscChunkMessage[] }) {
  const [endTime, setEndTime] = useState(Date.now());

  const timeFilteredMessages = useFilterMessagesByEndTime(messages, endTime);
  const groupedMessages = useGroupedMessages(timeFilteredMessages);
  const tabs = useTabs(groupedMessages);

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
        <ul className="flex flex-col gap-1">
          {tabs.map((key) => (
            <li>
              <span className="text-slate-900 dark:text-white">
                {new URL(key).pathname}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {new URL(key).search}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
