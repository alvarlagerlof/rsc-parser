import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { TabList, Tab, TabPanel, useTabStore } from "@ariakit/react";
import { RscEvent, isRscRequestEvent, isRscResponseEvent } from "../types";
import { getColorForFetch } from "../color";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export function useFlightResponseSelector(
  events: RscEvent[],
  {
    follow,
  }: {
    follow: boolean;
  },
) {
  const tabs = useMemo(() => {
    const tabs: string[] = [];

    const sorted = events.sort((a, b) => a.data.timestamp - b.data.timestamp);

    for (const message of sorted) {
      if (tabs.find((tab) => tab === String(message.data.requestId))) {
        continue;
      }
      tabs.push(String(message.data.requestId));
    }

    return tabs;
  }, [events]);

  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    null,
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(null);

  const selectTab = (nextTab: string | null | undefined) => {
    if (nextTab !== selectedTab) {
      setSelectedTab(nextTab);
      startTransition(() => {
        setCurrentTab(nextTab);
      });
    }
  };

  useEffect(() => {
    if (follow) {
      const lastTab = tabs.at(-1);
      if (lastTab !== selectedTab) {
        selectTab(String(lastTab));
      }
    }
  }, [tabs]);

  const tabStore = useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return {
    tabs,
    events,
    isPending,
    currentTab,
    tabStore,
  };
}

export function FlightResponseSelector({
  isPending,
  tabStore,
  tabs,
  events,
  currentTab,
  children,
}: ReturnType<typeof useFlightResponseSelector> & { children: ReactNode }) {
  return (
    <PanelGroup direction="horizontal">
      <Panel id="sidebar" minSize={20} order={1} defaultSize={35}>
        <TabList store={tabStore} className="flex flex-col gap-1 pr-3">
          {tabs.map((tab) => {
            const eventsForTab = events.filter(
              (event) => event.data.requestId === tab,
            );
            const [requestEvent] = eventsForTab.filter(isRscRequestEvent);
            const [responseEvent] = eventsForTab.filter(isRscResponseEvent);

            if (!requestEvent) {
              return null;
            }

            const { method, url } = requestEvent.data;
            const { status } = responseEvent?.data ?? {};

            return (
              <Tab className="group w-full text-left" key={tab} id={tab}>
                <div className="flex w-full flex-row items-center gap-3 rounded-md border-none px-1.5 py-0.5 group-aria-selected:bg-slate-200 dark:group-aria-selected:bg-slate-700">
                  <div
                    className="size-[14px] min-h-[14px] min-w-[14px] rounded-full"
                    style={{
                      background: getColorForFetch(
                        events.find((event) => event.data.requestId === tab)
                          ?.data.requestId ?? "0",
                      ),
                    }}
                  ></div>
                  <div>
                    <span className="inline-block w-[10ch] text-slate-500 dark:text-slate-400">
                      {method} ({status ?? "..."})
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {new URL(url).pathname}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {new URL(url).search}
                    </span>
                  </div>
                </div>
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
          className={`flex min-w-0 grow flex-col gap-4 pl-3 transition-opacity delay-75 duration-100 ${
            isPending ? "opacity-60" : ""
          }`}
          aria-label="Paths"
          aria-busy={isPending}
        >
          {children}
        </TabPanel>
      </Panel>
    </PanelGroup>
  );
}
