import { RscChunkMessage } from "./message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
  useTabs,
} from "./hooks";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import { PathTabs, usePathTabs } from "../tabs/path/PathTabs";

export function StreamTabs({ messages }: { messages: RscChunkMessage[] }) {
  const timeScrubber = useTimeScrubber(messages);

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime
  );
  const groupedMessages = useGroupedMessages(timeFilteredMessages);

  const tabs = useTabs(groupedMessages);
  const pathTabs = usePathTabs(tabs, {
    follow: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <PathTabs {...pathTabs}>
        {!pathTabs.currentTab ? (
          <p>Please select a tab</p>
        ) : (
          <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
            <p>Content will go here</p>
          </ErrorBoundary>
        )}
      </PathTabs>
    </div>
  );
}
