import { useContext, useState, useTransition } from "react";
import * as Ariakit from "@ariakit/react";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "./GenericErrorBoundaryFallback";
import { FlightResponse } from "../react/ReactFlightClient";
import { Chunk } from "../react/ReactFlightClient";
import { FlightResponseChunkModule } from "./FlightResponseChunkModule";
import { FlightResponseChunkHint } from "./FlightResponseChunkHint";
import { FlightResponseChunkModel } from "./FlightResponseChunkModel";
import { DownArrowIcon, RightArrowIcon } from "./FlightResponseIcons";
import { EndTimeContext } from "./ViewerStreams";

export function FlightResponseTabSplit({
  flightResponse,
}: {
  flightResponse: FlightResponse;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedTab, setSelectedTab] = useState<string | null | undefined>(
    null,
  );
  const [currentTab, setCurrentTab] = useState<string | null | undefined>(null);

  const payloadSize = parseFloat(
    stringToKiloBytes(
      flightResponse._chunks
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
    for (const row of flightResponse._chunks) {
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

  const endTime = useContext(EndTimeContext);

  const timeFilteredChunks = flightResponse._chunks.filter(
    (chunk) => chunk.startTime <= endTime,
  );

  return (
    <div className="divide-y-1 dark:divide-slate-600">
      {timeFilteredChunks.length === 0 ? null : (
        <>
          <div className="flex flex-col gap-2 pb-3">
            <div>Total size: {payloadSize} KB (uncompressed)</div>

            <Ariakit.TabList
              store={tab}
              className="flex flex-row flex-wrap gap-2 md:pb-0"
            >
              {timeFilteredChunks.map((row) => (
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
            {timeFilteredChunks.length === 0 ? (
              <p>Please enter a payload to see results</p>
            ) : selectedTab === null || selectTab === undefined ? (
              <p>Please select a row</p>
            ) : null}

            {timeFilteredChunks
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

export function RowTab({
  row,
  payloadSize,
}: {
  row: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;
  const rowSize = parseFloat(
    stringToKiloBytes(JSON.stringify(rowWithoutResponse)),
  );

  return (
    <div className="flex flex-row gap-1.5 rounded-md border-2 border-transparent bg-slate-200 px-2 py-0.5 transition-all duration-100 group-aria-selected:border-slate-400 dark:bg-slate-800 dark:group-aria-selected:border-slate-500">
      <div className="-mt-px text-xl font-semibold">{row.id}</div>
      <div className="flex flex-col items-start">
        <div className="whitespace-nowrap">{row.type}</div>
        <Meter fraction={rowSize / payloadSize} />
      </div>
    </div>
  );
}

export function RowTabFallback({
  error,
  row,
  payloadSize,
}: {
  error: Error;
  row: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;
  const rowSize = parseFloat(
    stringToKiloBytes(JSON.stringify(rowWithoutResponse)),
  );

  if (error instanceof Error) {
    return (
      <div className="flex h-full flex-col rounded-md border-2 border-transparent bg-red-200 px-2 py-0.5 transition-all duration-200 group-aria-selected:border-red-600 group-aria-selected:text-white">
        <div>Error</div>
        <Meter fraction={rowSize / payloadSize} />
      </div>
    );
  }

  return <span>Error</span>;
}

export function RowTabPanel({
  row,
  payloadSize,
  selectTabByID,
}: {
  row: Chunk;
  payloadSize: number;
  selectTabByID: (id: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y-1 dark:divide-slate-600">
      <div className="flex flex-row justify-between pb-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`meta-${row.id}`}
        >
          <RowTabPanelMeta row={row} />
        </ErrorBoundary>
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`size-${row.id}`}
        >
          <RowTabPanelSize row={row} payloadSize={payloadSize} />
        </ErrorBoundary>
      </div>

      <div className="py-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`row-${row.id}`}
        >
          <RowTabPanelExplorer row={row} selectTabByID={selectTabByID} />
        </ErrorBoundary>
      </div>

      <div className="pt-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`tree-${row.id}`}
        >
          <RowTabPanelGenericData row={row} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function RowTabPanelMeta({ row }: { row: Chunk }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="inline-block rounded-md text-xl font-bold">{row.id}</h3>
      <h4 className="font-medium">{row.type}</h4>
    </div>
  );
}

function RowTabPanelSize({
  row,
  payloadSize,
}: {
  row: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;
  const rowSize = parseFloat(
    stringToKiloBytes(JSON.stringify(rowWithoutResponse)),
  );

  return (
    <div className="text-right ">
      <div className="whitespace-nowrap">{rowSize} KB row (uncompressed)</div>
      <div>{((rowSize / payloadSize) * 100).toFixed(2)}% of total</div>
      <Meter fraction={rowSize / payloadSize} />
    </div>
  );
}

export function RowTabPanelExplorer({
  row,
  selectTabByID,
}: {
  row: Chunk;
  selectTabByID: (id: string) => void;
}) {
  switch (row.type) {
    case "model": {
      return (
        <FlightResponseChunkModel
          data={row.value}
          onClickID={(id) => {
            selectTabByID(id);
          }}
        />
      );
    }
    case "module": {
      return <FlightResponseChunkModule data={row.value} />;
    }
    case "hint": {
      return <FlightResponseChunkHint data={row.value} />;
    }
    case "text":
      return <p>{row.value}</p>;
    default: {
      return null;
    }
  }
}

function RowTabPanelGenericData({ row }: { row: Chunk }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const disclosure = Ariakit.useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      startTransition(() => {
        setIsOpen(open);
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Ariakit.Disclosure
        store={disclosure}
        style={{ opacity: isPending ? 0.7 : 1 }}
        className="flex cursor-pointer items-center gap-1"
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}
        Raw data
      </Ariakit.Disclosure>
      <Ariakit.DisclosureContent store={disclosure}>
        {isOpen ? <RowTabRawJson row={row} /> : null}
      </Ariakit.DisclosureContent>
    </div>
  );
}

function RowTabRawJson({ row }: { row: Chunk }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;

  return (
    <pre className="overflow-hidden whitespace-break-spaces break-all text-sm">
      {JSON.stringify(rowWithoutResponse, null, 1)}
    </pre>
  );
}

export function stringToKiloBytes(data: string) {
  return ((encodeURI(data).split(/%..|./).length - 1) / 1024).toFixed(2);
}

export function Meter({ fraction }: { fraction: number }) {
  return (
    <meter
      value={fraction}
      min="0"
      max="1"
      className={[
        "h-3 w-14",
        "[&::-webkit-meter-bar]:rounded-lg",
        "[&::-webkit-meter-optimum-value]:rounded-lg",
        "[&::-webkit-meter-bar]:border-0",
        "[&::-webkit-meter-optimum-value]:border-0",
        "[&::-webkit-meter-bar]:bg-slate-300",
        "dark:[&::-webkit-meter-bar]:bg-slate-500",
        "[&::-webkit-meter-optimum-value]:bg-black",
        "dark:[&::-webkit-meter-optimum-value]:bg-white",
      ].join(" ")}
    >
      {(fraction * 100).toFixed(2)}%
    </meter>
  );
}
