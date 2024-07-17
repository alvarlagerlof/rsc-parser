import React from 'react';
import { TabList, Tab, TabPanel, TabProvider } from '@ariakit/react';
import { RscEvent, isRscRequestEvent, isRscResponseEvent } from '../events';
import { GenericErrorBoundaryFallback } from './GenericErrorBoundaryFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { RequestDetailTabRawPayload } from './RequestDetailTabRawPayload';
import { RequestDetailTabParsedPayload } from './RequestDetailTabParsedPayload';
import { RequestDetailTabNetwork } from './RequestDetailTabNetwork';
import { RequestDetailTabHeaders } from './RequestDetailTabHeaders';
import { useTabStoreWithTransitions } from './useTabStoreWithTransitions';
import { RequestDetailTabTimings } from './RequestDetailTabTimings';

export function RequestDetail({ events }: { events: RscEvent[] }) {
  const { currentTab, isPending, tabStore } = useTabStoreWithTransitions({
    defaultSelectedId: 'parsedPayload',
  });

  return (
    <TabProvider store={tabStore}>
      <div className="flex w-full flex-col gap-4">
        <TabList
          aria-label="Render modes"
          className="flex flex-row flex-wrap gap-2"
        >
          <Tab
            id="headers"
            className="rounded-md bg-slate-200 px-2 py-0.5 aria-disabled:opacity-50 aria-selected:bg-slate-300 dark:bg-slate-700 dark:aria-selected:text-black"
            disabled={
              !events.some(
                (event) =>
                  isRscRequestEvent(event) || isRscResponseEvent(event),
              )
            }
          >
            Headers
          </Tab>
          <Tab
            id="parsedPayload"
            className="rounded-md bg-slate-200 px-2 py-0.5 aria-disabled:opacity-50 aria-selected:bg-slate-300 dark:bg-slate-700 dark:aria-selected:text-black"
          >
            Parsed payload
          </Tab>
          <Tab
            id="rawPayload"
            className="rounded-md bg-slate-200 px-2 py-0.5 aria-disabled:opacity-50 aria-selected:bg-slate-300 dark:bg-slate-700 dark:aria-selected:text-black"
          >
            Raw payload
          </Tab>
          <Tab
            id="timings"
            className="rounded-md bg-slate-200 px-2 py-0.5 aria-disabled:opacity-50 aria-selected:bg-slate-300 dark:bg-slate-700 dark:aria-selected:text-black"
            disabled={
              !events.some(
                (event) =>
                  isRscRequestEvent(event) || isRscResponseEvent(event),
              )
            }
          >
            Timings
          </Tab>
          <Tab
            id="network"
            className="text-nowrap rounded-md bg-slate-200 px-2 py-0.5 aria-disabled:opacity-50 aria-selected:bg-slate-300 dark:bg-slate-700 dark:aria-selected:text-black"
          >
            Network (Beta)
          </Tab>
        </TabList>

        <TabPanel
          tabId={currentTab}
          className={`flex min-w-0 grow flex-col gap-4 transition-opacity delay-75 duration-100 ${
            isPending ? 'opacity-60' : ''
          }`}
          aria-busy={isPending}
          alwaysVisible={true}
        >
          {currentTab === 'headers' ? (
            <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
              <RequestDetailTabHeaders events={events} />
            </ErrorBoundary>
          ) : null}
          {currentTab === 'parsedPayload' ? (
            <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
              <RequestDetailTabParsedPayload events={events} />
            </ErrorBoundary>
          ) : null}
          {currentTab === 'rawPayload' ? (
            <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
              <RequestDetailTabRawPayload events={events} />
            </ErrorBoundary>
          ) : null}
          {currentTab === 'timings' ? (
            <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
              <RequestDetailTabTimings events={events} />
            </ErrorBoundary>
          ) : null}
          {currentTab === 'network' ? (
            <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
              <RequestDetailTabNetwork events={events} />
            </ErrorBoundary>
          ) : null}
        </TabPanel>
      </div>
    </TabProvider>
  );
}
