import React, { useState, useTransition } from 'react';
import {
  Disclosure,
  DisclosureContent,
  useDisclosureStore,
  TabList,
  Tab,
  TabPanel,
  useTabStore,
} from '@ariakit/react';
import { ErrorBoundary } from 'react-error-boundary';
import { GenericErrorBoundaryFallback } from './GenericErrorBoundaryFallback';
import {
  Chunk,
  createFlightResponse,
  processBinaryChunk,
} from '@rsc-parser/react-client';
import { FlightResponseChunkModule } from './FlightResponseChunkModule';
import { FlightResponseChunkHint } from './FlightResponseChunkHint';
import { FlightResponseChunkModel } from './FlightResponseChunkModel';
import { DownArrowIcon, RightArrowIcon } from './FlightResponseIcons';
import { FlightResponseChunkDebugInfo } from './FlightResponseChunkDebugInfo';
import { FlightResponseChunkText } from './FlightResponseChunkText';
import { FlightResponseChunkConsole } from './FlightResponseChunkConsole';
import { FlightResponseChunkUnknown } from './FlightResponseChunkUnknown';
import { useEndTime } from './EndTimeContext';
import { RscEvent, isRscChunkEvent } from '../events';
import { RequestDetailTabEmptyState } from './RequestDetailTabEmptyState';
import { eventsFilterByMaxTimestamp } from '../eventArrayHelpers';
import { isDev } from './isDev';

export function RequestDetailTabParsedPayload({
  events,
}: {
  events: RscEvent[];
}) {
  const { endTime } = useEndTime();

  if (
    eventsFilterByMaxTimestamp(events, endTime).filter(isRscChunkEvent)
      .length === 0
  ) {
    return <RequestDetailTabEmptyState />;
  }

  const flightResponse = createFlightResponse(isDev(events));
  for (const event of events.filter(isRscChunkEvent)) {
    flightResponse._currentTimestamp = event.data.timestamp;
    processBinaryChunk(flightResponse, Uint8Array.from(event.data.chunkValue));
  }

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
          const { _response, ...chunkWithoutResponse } = chunk;
          return JSON.stringify(chunkWithoutResponse);
        })
        .join(''),
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
    for (const chunk of flightResponse._chunks) {
      if (id === chunk.id) {
        // TODO: Don't hard-code this
        window.scrollTo(0, 680);
        tab.setSelectedId(String(chunk.id));
      }
    }
  };

  const tab = useTabStore({
    selectedId: selectedTab,
    setSelectedId: selectTab,
  });

  const timeFilteredChunks = flightResponse._chunks.filter(
    (chunk) => chunk.timestamp <= endTime,
  );

  return (
    <div className="divide-y-1 dark:divide-slate-600">
      {timeFilteredChunks.length === 0 ? null : (
        <>
          <div className="flex flex-col gap-2 pb-3">
            <div>Total size: {payloadSize} KB (uncompressed)</div>

            <TabList
              store={tab}
              className="flex flex-row flex-wrap gap-2 md:pb-0"
            >
              {timeFilteredChunks.map((chunk) => (
                <Tab
                  className="group rounded-md border-none text-left outline outline-2 outline-offset-2 outline-transparent transition-all duration-200"
                  key={`${chunk.id}-${JSON.stringify(chunk.originalValue)}`}
                  id={String(chunk.id)}
                >
                  <ErrorBoundary
                    fallbackRender={({ error }) => (
                      <ChunkTabFallback
                        error={error}
                        chunk={chunk}
                        payloadSize={payloadSize}
                      />
                    )}
                  >
                    <ChunkTab chunk={chunk} payloadSize={payloadSize} />
                  </ErrorBoundary>
                </Tab>
              ))}
            </TabList>
          </div>

          <TabPanel
            store={tab}
            tabId={currentTab}
            alwaysVisible={true}
            className="pt-3 delay-100 duration-200"
            aria-label="Chunks"
            aria-busy={isPending}
            style={{
              opacity: isPending ? '0.6' : '1',
            }}
          >
            {timeFilteredChunks.length === 0 ? (
              <p>Please enter a payload to see results</p>
            ) : selectedTab === null || selectTab === undefined ? (
              <p>Please select a chunk</p>
            ) : null}

            {timeFilteredChunks
              .filter((chunk) => String(chunk.id) == currentTab)
              .map((chunk) => (
                <ErrorBoundary
                  FallbackComponent={GenericErrorBoundaryFallback}
                  key={`tab-panel-${chunk.id}-${JSON.stringify(chunk.originalValue)}`}
                >
                  <ChunkTabPanel
                    chunk={chunk}
                    payloadSize={payloadSize}
                    selectTabByID={selectTabByID}
                  />
                </ErrorBoundary>
              ))}
          </TabPanel>
        </>
      )}
    </div>
  );
}

function ChunkTab({
  chunk,
  payloadSize,
}: {
  chunk: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...chunkWithoutResponse } = chunk;
  const chunkSize = parseFloat(
    stringToKiloBytes(JSON.stringify(chunkWithoutResponse)),
  );

  return (
    <div className="flex flex-row gap-1.5 rounded-md border-2 border-transparent bg-slate-200 px-2 py-0.5 transition-all duration-100 group-aria-selected:border-slate-400 dark:bg-slate-800 dark:group-aria-selected:border-slate-500">
      <div className="-mt-px text-xl font-semibold">{chunk.id}</div>
      <div className="flex flex-col items-start">
        <div className="whitespace-nowrap">{chunk.type}</div>
        <Meter fraction={chunkSize / payloadSize} />
      </div>
    </div>
  );
}

function ChunkTabFallback({
  error,
  chunk,
  payloadSize,
}: {
  error: Error;
  chunk: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...chunkWithoutResponse } = chunk;
  const chunkSize = parseFloat(
    stringToKiloBytes(JSON.stringify(chunkWithoutResponse)),
  );

  if (error instanceof Error) {
    return (
      <div className="flex h-full flex-col rounded-md border-2 border-transparent bg-red-200 px-2 py-0.5 transition-all duration-200 group-aria-selected:border-red-600 group-aria-selected:text-white">
        <div>Error</div>
        <Meter fraction={chunkSize / payloadSize} />
      </div>
    );
  }

  return <span>Error</span>;
}

export function ChunkTabPanel({
  chunk,
  payloadSize,
  selectTabByID,
}: {
  chunk: Chunk;
  payloadSize: number;
  selectTabByID: (id: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y-1 dark:divide-slate-600">
      <div className="flex flex-row justify-between pb-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`meta-${chunk.id}`}
        >
          <ChunkTabPanelMeta chunk={chunk} />
        </ErrorBoundary>
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`size-${chunk.id}`}
        >
          <ChunkTabPanelSize chunk={chunk} payloadSize={payloadSize} />
        </ErrorBoundary>
      </div>

      <div className="py-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`chunk-${chunk.id}`}
        >
          <ChunkTabPanelExplorer chunk={chunk} selectTabByID={selectTabByID} />
        </ErrorBoundary>
      </div>

      <div className="pt-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`tree-${chunk.id}`}
        >
          <ChunkTabPanelGenericData chunk={chunk} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function ChunkTabPanelMeta({ chunk }: { chunk: Chunk }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="inline-block rounded-md text-xl font-bold">{chunk.id}</h3>
      <h4 className="font-medium">{chunk.type}</h4>
    </div>
  );
}

function ChunkTabPanelSize({
  chunk,
  payloadSize,
}: {
  chunk: Chunk;
  payloadSize: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...chunkWithoutResponse } = chunk;
  const chunkSize = parseFloat(
    stringToKiloBytes(JSON.stringify(chunkWithoutResponse)),
  );

  return (
    <div className="text-right ">
      <div className="whitespace-nowrap">
        {chunkSize} KB chunk (uncompressed)
      </div>
      <div>{((chunkSize / payloadSize) * 100).toFixed(2)}% of total</div>
      <Meter fraction={chunkSize / payloadSize} />
    </div>
  );
}

function ChunkTabPanelExplorer({
  chunk,
  selectTabByID,
}: {
  chunk: Chunk;
  selectTabByID: (id: string) => void;
}) {
  switch (chunk.type) {
    case 'model': {
      return (
        <FlightResponseChunkModel
          data={chunk.value}
          onClickID={(id) => {
            selectTabByID(id);
          }}
        />
      );
    }
    case 'module': {
      return <FlightResponseChunkModule data={chunk.value} />;
    }
    case 'hint': {
      return <FlightResponseChunkHint data={chunk.value} />;
    }
    case 'text':
      return <FlightResponseChunkText data={chunk.value} />;
    case 'debugInfo':
      return (
        <FlightResponseChunkDebugInfo
          data={chunk.value}
          onClickID={(id) => {
            selectTabByID(id);
          }}
        />
      );
    case 'console': {
      return (
        <FlightResponseChunkConsole
          data={chunk.value}
          onClickID={(id) => {
            selectTabByID(id);
          }}
        />
      );
    }
    default: {
      return <FlightResponseChunkUnknown chunk={chunk} />;
    }
  }
}

function ChunkTabPanelGenericData({ chunk }: { chunk: Chunk }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const disclosure = useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      startTransition(() => {
        setIsOpen(open);
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Disclosure
        store={disclosure}
        style={{ opacity: isPending ? 0.7 : 1 }}
        className="flex cursor-pointer items-center gap-1"
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}
        Raw data
      </Disclosure>
      <DisclosureContent store={disclosure}>
        {isOpen ? <ChunkTabRawJson chunk={chunk} /> : null}
      </DisclosureContent>
    </div>
  );
}

function ChunkTabRawJson({ chunk }: { chunk: Chunk }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...chunkWithoutResponse } = chunk;

  return (
    <pre className="overflow-hidden whitespace-break-spaces break-all">
      {JSON.stringify(chunkWithoutResponse, null, 1)}
    </pre>
  );
}

function stringToKiloBytes(data: string) {
  return ((encodeURI(data).split(/%..|./).length - 1) / 1024).toFixed(2);
}

function Meter({ fraction }: { fraction: number }) {
  const percent = (fraction * 100).toFixed(2);

  return (
    <div
      className="h-2 w-14 bg-slate-300 dark:bg-slate-600 rounded-lg overflow-hidden"
      role="meter"
      aria-valuemin={0}
      aria-valuenow={Number.parseInt(percent)}
      aria-valuemax={100}
    >
      <div
        className="bg-slate-600 dark:bg-white h-full w-4"
        style={{
          width: `${percent}%`,
        }}
      />
      <span className="sr-only">{percent}%</span>
    </div>
  );
}
