import React from "react";
import { TabList, Tab, TabPanel } from "@ariakit/react";
import { RscEvent, isRscRequestEvent, isRscResponseEvent } from "../events";
import { TimeScrubber } from "./TimeScrubber";
import { EndTimeProvider, useEndTime } from "./EndTimeContext";
import {
  eventsFilterByMaxTimestamp,
  eventsFilterByRequestId,
  eventsGetMinMaxTimestamps,
  eventsSortByTimestamp,
  eventsUniqueRequestIds,
} from "../eventArrayHelpers";
import { useTabStoreWithTransitions } from "./useTabStoreWithTransitions";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getColorForFetch } from "../color";
import { RequestDetail } from "./RequestDetail";

export function ViewerStreams({ events }: { events: RscEvent[] }) {
  const { minStartTime, maxEndTime } = eventsGetMinMaxTimestamps(events);

  return (
    <EndTimeProvider maxEndTime={maxEndTime}>
      <div className="flex flex-col gap-4 dark:text-white">
        <TimeScrubber
          events={events}
          minStartTime={minStartTime}
          maxEndTime={maxEndTime}
        />

        <Requests events={events} />
      </div>
    </EndTimeProvider>
  );
}

function Requests({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();
  const { currentTab, isPending, tabStore } =
    useTabStoreWithTransitions(undefined);

  const sortedEvents = eventsSortByTimestamp(events);
  const timeFilteredEvents = eventsFilterByMaxTimestamp(sortedEvents, endTime);
  const tabs = eventsUniqueRequestIds(events);

  return (
    <PanelGroup direction="horizontal">
      <Panel id="sidebar" minSize={20} order={1} defaultSize={35}>
        <TabList store={tabStore} className="flex flex-col gap-2 pr-3">
          {tabs.map((tab) => {
            return (
              <Tab key={tab} id={tab} store={tabStore} className="group">
                <RequestTab
                  events={eventsFilterByRequestId(timeFilteredEvents, tab)}
                />
              </Tab>
            );
          })}
        </TabList>
      </Panel>

      <PanelResizeHandle className="w-1 rounded bg-slate-200 dark:bg-slate-800" />

      <Panel order={2} minSize={20} className="">
        <TabPanel
          store={tabStore}
          tabId={currentTab}
          alwaysVisible={true}
          className={`flex min-w-0 grow pl-3 transition-opacity delay-75 duration-100 ${
            isPending ? "opacity-60" : ""
          }`}
          aria-label="Paths"
          aria-busy={isPending}
        >
          {!currentTab ? (
            <span>Please select a url</span>
          ) : (
            <RequestDetail
              key={currentTab}
              events={eventsFilterByRequestId(sortedEvents, currentTab)}
            />
          )}
        </TabPanel>
      </Panel>
    </PanelGroup>
  );
}

function RequestTab({ events }: { events: RscEvent[] }) {
  const [requestEvent] = events.filter(isRscRequestEvent);
  const [responseEvent] = events.filter(isRscResponseEvent);

  if (!requestEvent) {
    return null;
  }

  const { method, url } = requestEvent.data;
  const { status } = responseEvent?.data ?? {};

  return (
    <div className="flex w-full flex-row items-center gap-2 rounded-md border-none px-1.5 py-1 text-left group-aria-selected:bg-slate-200 dark:group-aria-selected:bg-slate-700">
      <div
        className="h-5 min-h-5 w-1 min-w-1 rounded-md"
        style={{
          background: getColorForFetch(events[0].data.requestId),
        }}
      ></div>
      <div className="flex flex-row gap-1">
        <span className="inline-block min-w-[4ch] font-medium text-slate-500 dark:text-slate-400">
          {method} {status !== 200 && status !== undefined ? `(${status})` : ""}
        </span>
        <div>
          <span className="text-slate-900 dark:text-white">
            {new URL(url).pathname}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {new URL(url).search}
          </span>
        </div>
      </div>
    </div>
  );
}
