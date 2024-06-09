import { RscEvent } from "./events";

export function eventsSortByTimestamp(events: RscEvent[]) {
  return events.sort((a, b) => a.data.timestamp - b.data.timestamp);
}

export function eventsFilterByMaxTimestamp(
  events: RscEvent[],
  endTime: number,
) {
  return events.filter((event) => event.data.timestamp <= endTime);
}

export function eventsGetMinMaxTimestamps(events: RscEvent[]) {
  let minStartTime = Number.MAX_SAFE_INTEGER;
  let maxEndTime = 0;

  for (const event of events) {
    minStartTime = Math.min(minStartTime, event.data.timestamp);
    maxEndTime = Math.max(maxEndTime, event.data.timestamp);
  }

  return {
    minStartTime,
    maxEndTime,
  };
}

export function eventsUniqueRequestIds(events: RscEvent[]) {
  const requestIds: string[] = [];

  for (const event of events) {
    if (requestIds.includes(event.data.requestId)) {
      continue;
    }

    requestIds.push(event.data.requestId);
  }

  return requestIds;
}

export function eventsFilterByRequestId(events: RscEvent[], requestId: string) {
  return events.filter((event) => event.data.requestId === requestId);
}
