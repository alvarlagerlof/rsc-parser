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
    <div className="divide-y-1">
      {rows.length === 0 ? null : (
        <>
          <div className="flex flex-col gap-2 pb-3">
            <div className="text-black dark:text-white">
              Total size: {stringToKiloBytes(payload)} KB (uncompressed)
            </div>

            <Ariakit.TabList
              store={tab}
              className="flex flex-row flex-wrap gap-2 md:pb-0"
            >
              {rows.map((row) => (
                <Ariakit.Tab
                  className="group rounded-md border-none text-left outline outline-2 outline-offset-2 outline-transparent transition-all duration-200"
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
          </div>

          <Ariakit.TabPanel
            store={tab}
            tabId={currentTab}
            alwaysVisible={true}
            className="pt-3 delay-100 duration-200 dark:bg-slate-800"
            aria-label="Rows"
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
              <p className="text-black dark:text-white">Please select a row</p>
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
      )}
    </div>
  );
}
