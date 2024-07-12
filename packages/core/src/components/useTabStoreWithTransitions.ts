import { useTabStore } from '@ariakit/react';
import { useState, useTransition } from 'react';

export function useTabStoreWithTransitions(
  useTabStoreArgs: Parameters<typeof useTabStore>[0],
) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    useTabStoreArgs?.defaultSelectedId ?? null,
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(
    useTabStoreArgs?.defaultSelectedId ?? null,
  );

  const selectTab = (nextTab: string | null | undefined) => {
    if (nextTab !== selectedTab) {
      setSelectedTab(nextTab);
      startTransition(() => {
        setCurrentTab(nextTab);
      });
    }
  };

  const tabStore = useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
    ...useTabStoreArgs,
  });

  return {
    isPending,
    currentTab,
    tabStore,
  };
}
