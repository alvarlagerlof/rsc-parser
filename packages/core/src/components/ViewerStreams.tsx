import React, { useMemo } from "react";
import { TabList, Tab, TabPanel, TabProvider } from "@ariakit/react";
import { createFlightResponse } from "../createFlightResponse";
import { RscChunkMessage } from "../types";
import { FlightResponse } from "./FlightResponse";
import {
  FlightResponseSelector,
  useFlightResponseSelector,
} from "./FlightResponseSelector";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { useFilterMessagesByEndTime } from "./TimeScrubber";
import { EndTimeContext } from "./EndTimeContext";

export function ViewerStreams({ messages }: { messages: RscChunkMessage[] }) {
  const timeScrubber = useTimeScrubber(messages, {
    follow: true,
  });

  const timeFilteredMessages = useFilterMessagesByEndTime(
    messages,
    timeScrubber.endTime,
  );
  const groupedMessages = useGroupedMessages(messages);

  const pathTabs = useFlightResponseSelector(timeFilteredMessages, {
    follow: false,
  });

  const messagesForCurrentTab = pathTabs.currentTab
    ? groupedMessages.get(Number.parseInt(pathTabs.currentTab)) ?? []
    : [];

  const flightResponse = createFlightResponse(messagesForCurrentTab);

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
                  {messagesForCurrentTab[0] &&
                  messagesForCurrentTab[0].data.fetchResponseHeaders ? (
                    <HeadersTable
                      headers={
                        messagesForCurrentTab[0].data.fetchResponseHeaders
                      }
                    />
                  ) : (
                    "No response headers"
                  )}
                </section>
                <section className="flex flex-col gap-1">
                  <p>Response headers</p>
                  {messagesForCurrentTab[0] &&
                  messagesForCurrentTab[0].data.fetchRequestHeaders ? (
                    <HeadersTable
                      headers={
                        messagesForCurrentTab[0].data.fetchRequestHeaders
                      }
                    />
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

export function useGroupedMessages(messages: RscChunkMessage[]) {
  return useMemo(() => {
    const groupedMessages = new Map<number, RscChunkMessage[]>();

    for (const message of messages) {
      if (groupedMessages.has(message.data.fetchStartTime)) {
        groupedMessages.set(message.data.fetchStartTime, [
          ...(groupedMessages.get(message.data.fetchStartTime) ?? []),
          message,
        ]);
      } else {
        groupedMessages.set(message.data.fetchStartTime, [message]);
      }
    }
    return groupedMessages;
  }, [messages]);
}
