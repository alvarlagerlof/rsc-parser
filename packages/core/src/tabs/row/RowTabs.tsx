import { useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";
import { lexer, parse, splitToCleanRows } from "../../parse";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../../GenericErrorBoundaryFallback";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { RowTabPanel } from "./RowTabPanel";
import { RowTab, RowTabFallback } from "./RowTab";

export function RowTabs({ payload }: { payload: string }) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    null,
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(null);

  const payloadSize = parseFloat(stringToKiloBytes(payload));
  const rows = splitToCleanRows(payload);

  const selectTab = (nextTab: string | null | undefined) => {
    if (nextTab !== selectedTab) {
      setSelectedTab(nextTab);
      startTransition(() => {
        setCurrentTab(nextTab);
      });
    }
  };

  const selectTabByIdentifier = (tabIdentifier: string) => {
    for (const row of rows) {
      const tokens = lexer(row);
      const { identifier } = parse(tokens);

      if (tabIdentifier === identifier) {
        // TODO: Don't hard-code this
        window.scrollTo(0, 680);
        tab.setSelectedId(row);
      }
    }
  };

  const tab = Ariakit.useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2 py-6">
        <Ariakit.TabList
          store={tab}
          className="flex max-w-full flex-row gap-2 overflow-x-auto rounded-2xl !p-2 outline outline-2 outline-offset-2 outline-transparent transition-all duration-200 focus:outline-blue-400 md:flex-wrap md:pb-0"
        >
          {rows.map((row) => (
            <Ariakit.Tab
              className="group rounded-xl border-none text-left outline outline-2 outline-offset-2 outline-transparent transition-all duration-200 focus:outline-blue-400"
              key={row}
              id={row}
            >
              <ErrorBoundary
                fallbackRender={({ error }) => (
                  <RowTabFallback
                    error={error}
                    row={row}
                    payloadSize={payloadSize}
                  />
                )}
              >
                <RowTab row={row} payloadSize={payloadSize} />
              </ErrorBoundary>
            </Ariakit.Tab>
          ))}
        </Ariakit.TabList>

        <div className="text-black dark:text-white">
          Total size: {stringToKiloBytes(payload)} KB (uncompressed)
        </div>
      </div>

      <Ariakit.TabPanel
        store={tab}
        tabId={currentTab}
        alwaysVisible={true}
        className="w-full rounded-3xl bg-slate-200 p-4 outline outline-2 outline-offset-2 outline-transparent transition-all delay-100 duration-200 focus:outline-blue-400 dark:bg-slate-800"
        aria-label="Lines"
        aria-busy={isPending}
        style={{
          opacity: isPending ? "0.6" : "1",
        }}
      >
        {payload === "" ? (
          <p className="text-black dark:text-white">
            Please enter a payload to see results
          </p>
        ) : selectedTab === null || selectTab === undefined ? (
          <p className="text-black dark:text-white">Please select a tab</p>
        ) : null}

        {rows
          .filter((row) => row == currentTab)
          .map((row) => (
            <ErrorBoundary
              FallbackComponent={GenericErrorBoundaryFallback}
              key={`tab-panel-${row}`}
            >
              <RowTabPanel
                row={row}
                payloadSize={payloadSize}
                selectTabByIdentifier={selectTabByIdentifier}
              />
            </ErrorBoundary>
          ))}
      </Ariakit.TabPanel>
    </>
  );
}
