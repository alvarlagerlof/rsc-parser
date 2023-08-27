import { RscChunkMessage } from "../stream/message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
} from "../stream/hooks";
import { TimeScrubber, useTimeScrubber } from "../stream/TimeScrubber";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import { PathTabs, usePathTabs } from "../tabs/path/PathTabs";
import { RowTabs } from "../tabs/row/RowTabs";
import * as Ariakit from "@ariakit/react";
import { RawStream } from "../stream/RawStream";
import { RowStream } from "../stream/RowStream";

export function StreamViewer({ messages }: { messages: RscChunkMessage[] }) {
  const defaultSelectedId = "parsed";
  const tab = Ariakit.useTabStore({ defaultSelectedId });

  const timeScrubber = useTimeScrubber(messages, {
    follow: true,
  });

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime,
  );
  const groupedMessages = useGroupedMessages(timeFilteredMessages);

  const pathTabs = usePathTabs(timeFilteredMessages, {
    follow: false,
  });

  const messagesForCurrentTab = pathTabs.currentTab
    ? groupedMessages.get(pathTabs.currentTab) ?? []
    : [];

  return (
    <div className="flex h-full min-h-full flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <PathTabs {...pathTabs}>
        {!pathTabs.currentTab ? (
          <span className="dark:text-white">Please select a url</span>
        ) : (
          <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
            <div className="flex flex-row items-center justify-between">
              {messagesForCurrentTab.length === 0 ? (
                <span className="dark:text-white">
                  No data for current time frame, please select a url
                </span>
              ) : (
                <span className="dark:text-white">
                  Data from {messagesForCurrentTab.length} fetch chunk
                  {messagesForCurrentTab.length === 1 ? "" : "s"}
                </span>
              )}

              <Ariakit.TabList
                store={tab}
                aria-label="Render modes"
                className="flex flex-row gap-2"
              >
                <Ariakit.Tab
                  id="parsed"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Parsed
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="rows"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Rows
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="raw"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:text-white dark:aria-selected:text-black"
                >
                  Raw
                </Ariakit.Tab>
              </Ariakit.TabList>
            </div>
            <div>
              <Ariakit.TabPanel store={tab} tabId={defaultSelectedId}>
                <RowTabs
                  payload={messagesForCurrentTab
                    .map((message) => message.data.chunkValue)
                    .join()}
                />
              </Ariakit.TabPanel>
              <Ariakit.TabPanel store={tab}>
                <RowStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
              <Ariakit.TabPanel store={tab}>
                <RawStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
            </div>
          </ErrorBoundary>
        )}
      </PathTabs>
    </div>
  );
}
