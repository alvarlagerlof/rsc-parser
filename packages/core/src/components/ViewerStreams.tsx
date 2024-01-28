import { createContext } from "react";
import { createFlightResponse } from "../createFlightResponse";
import { RscChunkMessage } from "../types";
import { FlightResponse } from "./FlightResponse";
import {
  FlightResponseSelector,
  useFlightResponseSelector,
} from "./FlightResponseSelector";
import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { useFilterMessagesByEndTime, useGroupedMessages } from "./TimeScrubber";

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
    <div className="flex h-full min-h-full flex-col gap-4">
      <TimeScrubber {...timeScrubber} />

      <p>{timeScrubber.endTime}</p>

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

export const EndTimeContext = createContext<number>(Infinity);
