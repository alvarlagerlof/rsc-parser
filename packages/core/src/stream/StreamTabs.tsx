import { RscChunkMessage } from "./message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
  useTabs,
} from "./hooks";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";

export function StreamTabs({ messages }: { messages: RscChunkMessage[] }) {
  const timeScrubber = useTimeScrubber(messages);

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime
  );
  const groupedMessages = useGroupedMessages(timeFilteredMessages);
  const tabs = useTabs(groupedMessages);

  return (
    <div className="flex flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <ul className="flex flex-col gap-1">
        {tabs.map((tab) => (
          <li className="flex flex-col gap-2">
            <div className="text-2xl">
              <span className="text-slate-900  dark:text-white">
                {new URL(tab).pathname}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {new URL(tab).search}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
