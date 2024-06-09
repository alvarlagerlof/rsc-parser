import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TabList, Tab, TabPanel, TabProvider } from "@ariakit/react";

import { GenericErrorBoundaryFallback } from "./GenericErrorBoundaryFallback";
import type { FlightResponse } from "../react/ReactFlightClient";
import { FlightResponseTabSplit } from "./FlightResponseTabSplit";
import { FlightResponseTabNetwork } from "./FlightResponseTabNetwork";
import { FlightResponseTabRaw } from "./FlightResponseTabRaw";

export function FlightResponse({
  flightResponse,
}: {
  flightResponse: FlightResponse;
}) {
  return (
    <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
      <div className="flex flex-col gap-6">
        <TabProvider defaultSelectedId="split">
          <div className="flex flex-row items-center justify-between">
            {flightResponse._chunks.length === 0 ? (
              <span>No data for current time frame</span>
            ) : (
              <span>
                Data from {flightResponse._chunks.length} fetch chunk
                {flightResponse._chunks.length === 1 ? "" : "s"}
              </span>
            )}

            <TabList aria-label="Render modes" className="flex flex-row gap-2">
              <Tab
                id="split"
                className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:aria-selected:text-black"
              >
                Split
              </Tab>
              <Tab
                id="rows"
                className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:aria-selected:text-black"
              >
                Raw
              </Tab>
              <Tab
                id="network"
                className="text-nowrap rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:aria-selected:text-black"
              >
                Network (Beta)
              </Tab>
            </TabList>
          </div>
          <div>
            <TabPanel tabId="split">
              <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
                <FlightResponseTabSplit flightResponse={flightResponse} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel tabId="rows">
              <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
                <FlightResponseTabRaw flightResponse={flightResponse} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel tabId="network">
              <ErrorBoundary FallbackComponent={GenericErrorBoundaryFallback}>
                <FlightResponseTabNetwork
                  flightResponse={flightResponse}
                  // TODO: Find a way to remove this reseting key
                  key={flightResponse._chunks.length}
                />
              </ErrorBoundary>
            </TabPanel>
          </div>
        </TabProvider>
      </div>
    </ErrorBoundary>
  );
}
