import { RscChunkMessage } from "../stream/message";
import {
  useFilterMessagesByEndTime,
  useGroupedMessages,
  useTabs,
} from "../stream/hooks";
import { TimeScrubber, useTimeScrubber } from "../TimeScrubber";
import { GenericErrorBoundaryFallback } from "../GenericErrorBoundaryFallback";
import { ErrorBoundary } from "react-error-boundary";
import { PathTabs, usePathTabs } from "../tabs/path/PathTabs";
import { RowTabs } from "../tabs/row/RowTabs";
import * as Ariakit from "@ariakit/react";
import { RawStream } from "../stream/RawStream";

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

  const tabs = useTabs(groupedMessages);
  const pathTabs = usePathTabs(tabs, {
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
          <p>Please select a url</p>
        ) : (
          <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
            <div className="flex flex-row items-center justify-between">
              {messagesForCurrentTab.length === 0 ? (
                <span>No data for current time frame, please select a url</span>
              ) : (
                <span>
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
                  className="rounded-md px-2 py-0.5  aria-selected:bg-slate-200"
                >
                  Parsed
                </Ariakit.Tab>
                <Ariakit.Tab
                  id="raw"
                  className="rounded-md px-2 py-0.5  aria-selected:bg-slate-200"
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
                <RawStream messages={messagesForCurrentTab} />
              </Ariakit.TabPanel>
            </div>
          </ErrorBoundary>
        )}
      </PathTabs>
    </div>
  );
}
