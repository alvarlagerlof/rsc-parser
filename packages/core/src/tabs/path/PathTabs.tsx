import { ReactNode, useEffect, useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";

export function usePathTabs(
  tabs: string[],
  {
    follow,
  }: {
    follow: boolean;
  },
) {
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

  const tabStore = Ariakit.useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return {
    tabs,
    isPending,
    currentTab,
    tabStore,
  };
}

export function PathTabs({
  isPending,
  tabStore,
  tabs,
  currentTab,
  children,
}: ReturnType<typeof usePathTabs> & { children: ReactNode }) {
  return (
    <div className="flex grow flex-row divide-x-1 dark:divide-slate-600">
      <Ariakit.TabList
        store={tabStore}
        className="flex w-[30%] min-w-[30%] flex-col gap-1 pr-3"
      >
        {tabs.map((tab) => (
          <Ariakit.Tab className="group w-full text-left" key={tab} id={tab}>
            <div className="w-full rounded-md border-none px-1.5 py-0.5 group-aria-selected:bg-slate-200 dark:group-aria-selected:bg-slate-700">
              <span className="text-slate-900 dark:text-white">
                {new URL(tab).pathname}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {new URL(tab).search}
              </span>
            </div>
          </Ariakit.Tab>
        ))}
      </Ariakit.TabList>

      <Ariakit.TabPanel
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
      </Ariakit.TabPanel>
    </div>
  );
}
