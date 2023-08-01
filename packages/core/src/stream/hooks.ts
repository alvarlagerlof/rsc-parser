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

export function useTabs(
  groupedMessages: ReturnType<typeof useGroupedMessages>,
) {
  return useMemo(() => {
    return Array.from(groupedMessages.keys());
  }, [groupedMessages]);
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
