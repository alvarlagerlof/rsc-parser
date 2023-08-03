import { useMemo } from "react";
import { RscChunkMessage } from "./message";

export function useGroupedMessages(messages: RscChunkMessage[]) {
  return useMemo(() => {
    const groupedMessages = new Map<string, RscChunkMessage[]>();

    for (const message of messages) {
      if (groupedMessages.has(message.data.fetchUrl)) {
        groupedMessages.set(message.data.fetchUrl, [
          ...(groupedMessages.get(message.data.fetchUrl) ?? []),
          message,
        ]);
      } else {
        groupedMessages.set(message.data.fetchUrl, [message]);
      }
    }
    return groupedMessages;
  }, [messages]);
}

export function useTimeRange(messages: RscChunkMessage[]) {
  return useMemo(() => {
    let minStartTime = Number.MAX_SAFE_INTEGER;
    let maxEndTime = 0;

    for (const message of messages) {
      minStartTime = Math.min(minStartTime, message.data.chunkStartTime);
      maxEndTime = Math.max(maxEndTime, message.data.chunkEndTime);
    }

    const timeRange = maxEndTime - minStartTime;

    return {
      minStartTime,
      maxEndTime,
      timeRange,
    };
  }, [messages]);
}

export function useFilterMessagesByEndTime(
  messages: RscChunkMessage[],
  endTime: number,
) {
  return useMemo(() => {
    return messages.filter((message) => message.data.chunkStartTime <= endTime);
  }, [messages, endTime]);
}

export function useSortedFetchPaths(messages: RscChunkMessage[]) {
  return useMemo(() => {
    const tabs: string[] = [];

    const sorted = messages.sort(
      (a, b) => a.data.chunkStartTime - b.data.chunkStartTime,
    );

    for (const message of sorted) {
      const tab = message.data.fetchUrl;
      if (!tabs.includes(tab)) {
        tabs.push(tab);
      }
    }

    return tabs;
  }, [messages]);
}
