import React from "react";
import { TabList, Tab, TabPanel, TabProvider } from "@ariakit/react";
import { createFlightResponse } from "../createFlightResponse";
import {
  RscEvent,
  isRscChunkEvent,
  isRscRequestEvent,
  isRscResponseEvent,
} from "../events";
import { FlightResponse } from "./FlightResponse";
import {
  FlightResponseSelector,
  useFlightResponseSelector,
} from "./FlightResponseSelector";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { useFilterEventsByEndTime } from "./TimeScrubber";
import { EndTimeContext } from "./EndTimeContext";

export function ViewerStreams({ events }: { events: RscEvent[] }) {
  const timeScrubber = useTimeScrubber(events, {
    follow: true,
  });

  const timeFilteredEvents = useFilterEventsByEndTime(
    events,
    timeScrubber.endTime,
  );

  const pathTabs = useFlightResponseSelector(timeFilteredEvents, {
    follow: false,
  });

  const eventsForCurrentTab = timeFilteredEvents.filter(
    (event) => event.data.requestId == pathTabs.currentTab,
  );

  const flightResponse = createFlightResponse(
    eventsForCurrentTab.filter(isRscChunkEvent),
  );

  const requestEvent = eventsForCurrentTab.filter(isRscRequestEvent)[0];
  const responseEvent = eventsForCurrentTab.filter(isRscResponseEvent)[0];

  return (
    <div className="flex flex-col gap-4 dark:text-white">
      <TimeScrubber {...timeScrubber} />

      <EndTimeContext.Provider value={timeScrubber.endTime}>
        <FlightResponseSelector {...pathTabs}>
          {!pathTabs.currentTab ? (
            <span>Please select a url</span>
          ) : (
            <TabProvider key={pathTabs.currentTab}>
              <TabList
                aria-label="Render modes"
                className="flex flex-row gap-2"
              >
                <Tab
                  id="flightResponse"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:aria-selected:text-black"
                >
                  Flight response
                </Tab>
                <Tab
                  id="headers"
                  className="rounded-md px-2 py-0.5 aria-selected:bg-slate-300 dark:aria-selected:text-black"
                >
                  Headers
                </Tab>
              </TabList>

              <TabPanel tabId="flightResponse">
                <FlightResponse flightResponse={flightResponse} />
              </TabPanel>

              <TabPanel tabId="headers" className="flex flex-col gap-4">
                <section className="flex flex-col gap-1">
                  <p>Request headers</p>
                  {requestEvent ? (
                    <HeadersTable headers={requestEvent.data.headers} />
                  ) : (
                    "No response headers"
                  )}
                </section>
                <section className="flex flex-col gap-1">
                  <p>Response headers</p>
                  {responseEvent ? (
                    <HeadersTable headers={responseEvent.data.headers} />
                  ) : (
                    "No request headers"
                  )}
                </section>
              </TabPanel>
            </TabProvider>
          )}
        </FlightResponseSelector>
      </EndTimeContext.Provider>
    </div>
  );
}

function HeadersTable({ headers }: { headers: Record<string, string> }) {
  return (
    <table className="w-full max-w-4xl table-fixed border-collapse border border-slate-500 dark:text-white">
      <tbody>
        {Object.entries(headers).map(([key, value]) => (
          <tr key={key}>
            <td className="border border-slate-500 px-1.5 py-0.5">{key}</td>
            <td className="whitespace-pre-wrap break-all border border-slate-500 px-1.5 py-0.5">
              {value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
