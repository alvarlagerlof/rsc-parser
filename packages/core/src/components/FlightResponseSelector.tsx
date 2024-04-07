import React, { ReactNode, useEffect, useState, useTransition } from "react";
import { TabList, Tab, TabPanel, useTabStore } from "@ariakit/react";
import { RscChunkMessage } from "../types";
import { getColorForFetch } from "../color";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSortedFetchPaths } from "./TimeScrubber";

export function useFlightResponseSelector(
  messages: RscChunkMessage[],
  {
    follow,
  }: {
    follow: boolean;
  },
) {
  const tabs = useSortedFetchPaths(messages);

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
        selectTab(lastTab);
      }
    }
  }, [tabs]);

  const tabStore = useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return {
    tabs,
    messages,
    isPending,
    currentTab,
    tabStore,
  };
}

export function FlightResponseSelector({
  isPending,
  tabStore,
  tabs,
  messages,
  currentTab,
  children,
}: ReturnType<typeof useFlightResponseSelector> & { children: ReactNode }) {
  return (
    <PanelGroup direction="horizontal">
      <Panel id="sidebar" minSize={35} order={1} defaultSize={35}>
        <TabList store={tabStore} className="flex flex-col gap-1 pr-3">
          {tabs.map((tab) => (
            <Tab className="group w-full text-left" key={tab} id={tab}>
              <div className="flex w-full flex-row items-center gap-3 rounded-md border-none px-1.5 py-0.5 group-aria-selected:bg-slate-200 dark:group-aria-selected:bg-slate-700">
                <div
                  className="size-[14px] min-h-[14px] min-w-[14px] rounded-full"
                  style={{
                    background: getColorForFetch(
                      messages.find((m) => m.data.fetchUrl === tab)?.data
                        .fetchStartTime ?? 0,
                    ),
                  }}
                ></div>
                <div>
                  <span className="text-slate-900 dark:text-white">
                    {new URL(tab).pathname}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {new URL(tab).search}
                  </span>
                </div>
              </div>
            </Tab>
          ))}
        </TabList>
      </Panel>

      <PanelResizeHandle className="w-1 rounded bg-slate-200 dark:bg-slate-800" />

      <Panel order={2} minSize={30} className="">
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
