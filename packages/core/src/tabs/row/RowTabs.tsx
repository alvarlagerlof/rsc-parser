import { useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../../GenericErrorBoundaryFallback";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { RowTabPanel } from "./RowTabPanel";
import { RowTab, RowTabFallback } from "./RowTab";
import { Chunk } from "../../react/ReactFlightClient";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export function RowTabs({ chunks }: { chunks: Chunk[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    null,
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(null);

  const payloadSize = parseFloat(
    stringToKiloBytes(
      chunks
        .map((chunk) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _response, ...rowWithoutResponse } = chunk;
          return JSON.stringify(rowWithoutResponse);
        })
        .join(""),
    ),
  );

  const selectTab = (nextTab: string | null | undefined) => {
    if (nextTab !== selectedTab) {
      setSelectedTab(nextTab);
      startTransition(() => {
        setCurrentTab(nextTab);
      });
    }
  };

  const selectTabByID = (id: string) => {
    for (const row of chunks) {
      if (id === row.id) {
        // TODO: Don't hard-code this
        window.scrollTo(0, 680);
        tab.setSelectedId(String(row.id));
      }
    }
  };

  const tab = Ariakit.useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  return (
    <div className="divide-y-1 dark:divide-slate-600">
      {chunks.length === 0 ? null : (
        <>
          <div className="flex flex-col gap-2 pb-3">
            <div className="text-black dark:text-white">
              Total size: {payloadSize} KB (uncompressed)
            </div>

            <Ariakit.TabList
              store={tab}
              className="flex flex-row flex-wrap gap-2 md:pb-0"
            >
              {chunks.map((row) => (
                <Ariakit.Tab
                  className="group rounded-md border-none text-left outline outline-2 outline-offset-2 outline-transparent transition-all duration-200"
                  key={row.id}
                  id={String(row.id)}
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
            className="pt-3 delay-100 duration-200"
            aria-label="Rows"
            aria-busy={isPending}
            style={{
              opacity: isPending ? "0.6" : "1",
            }}
          >
            {chunks.length === 0 ? (
              <p className="text-black dark:text-white">
                Please enter a payload to see results
              </p>
            ) : selectedTab === null || selectTab === undefined ? (
              <p className="text-black dark:text-white">Please select a row</p>
            ) : null}

            {chunks
              .filter((row) => String(row.id) == currentTab)
              .map((row) => (
                <ErrorBoundary
                  FallbackComponent={GenericErrorBoundaryFallback}
                  key={`tab-panel-${row}`}
                >
                  <RowTabPanel
                    row={row}
                    payloadSize={payloadSize}
                    selectTabByID={selectTabByID}
                  />
                </ErrorBoundary>
              ))}
          </Ariakit.TabPanel>
        </>
      )}
    </div>
  );
}
