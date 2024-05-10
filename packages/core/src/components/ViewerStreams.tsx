import React, { useMemo } from "react";
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
            <FlightResponse flightResponse={flightResponse} />
          )}
        </FlightResponseSelector>
      </EndTimeContext.Provider>
    </div>
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
