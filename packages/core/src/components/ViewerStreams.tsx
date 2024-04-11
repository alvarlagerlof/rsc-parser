import React from "react";
import { createFlightResponse } from "../createFlightResponse";
import { RscChunkMessage } from "../types";
import { FlightResponse } from "./FlightResponse";
import {
  FlightResponseSelector,
  useFlightResponseSelector,
} from "./FlightResponseSelector";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { useFilterMessagesByEndTime, useGroupedMessages } from "./TimeScrubber";
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
    ? groupedMessages.get(pathTabs.currentTab) ?? []
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
            <FlightResponse flightResponse={flightResponse} />
          )}
        </FlightResponseSelector>
      </EndTimeContext.Provider>
    </div>
  );
}
