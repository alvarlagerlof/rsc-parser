import React from 'react';
import { eventsFilterByMaxTimestamp } from '../eventArrayHelpers';
import {
  RscEvent,
  isRscChunkEvent,
  isRscRequestEvent,
  isRscResponseEvent,
} from '../events';
import { useEndTime } from './EndTimeContext';
import { RequestDetailTabEmptyState } from './RequestDetailTabEmptyState';
import { getColorForFetch } from '../color';

export function RequestDetailTabTimings({ events }: { events: RscEvent[] }) {
  const { endTime } = useEndTime();

  const timeFilteredEvents = eventsFilterByMaxTimestamp(events, endTime);

  if (timeFilteredEvents.length === 0) {
    return <RequestDetailTabEmptyState />;
  }

  const requestEvent = timeFilteredEvents.filter(isRscRequestEvent)[0];
  const responseEvent = timeFilteredEvents.filter(isRscResponseEvent)[0];

  if (!requestEvent) {
    return <RequestDetailTabEmptyState />;
  }

  const startTimeStamp = requestEvent.data.timestamp;
  const endTimestamp = events.at(-1)?.data.timestamp;

  if (!endTimestamp) {
    return <RequestDetailTabEmptyState />;
  }

  const timings: {
    name: string;
    offset: number | null;
    color: string;
  }[] = [];

  timings.push({
    name: 'Request start',
    offset: startTimeStamp - startTimeStamp,
    color: getColorForFetch('1'),
  });

  if (responseEvent) {
    timings.push({
      name: 'Response start',
      offset: responseEvent.data.timestamp - startTimeStamp,
      color: getColorForFetch('20'),
    });

    timeFilteredEvents.filter(isRscChunkEvent).forEach((event, index) => {
      timings.push({
        name: `Chunk ${index}`,
        offset: event.data.timestamp - startTimeStamp,
        color: getColorForFetch('30'),
      });
    });

    if (
      timeFilteredEvents.find((event) => event.data.timestamp === endTimestamp)
    ) {
      timings.push({
        name: 'Response end',
        offset: endTimestamp ? endTimestamp - startTimeStamp : null,
        color: getColorForFetch('20'),
      });
    }
  }

  const maxOffset = (endTimestamp ?? 500) - startTimeStamp;

  return (
    <ul className="flex max-w-lg flex-col gap-3">
      {timings.map((timing) => {
        return (
          <li key={timing.name} className="flex flex-col gap-0">
            <p>{timing.name}</p>
            <div className="flex flex-row items-center gap-2">
              <div
                className="h-3 rounded-full"
                style={{
                  background: timing.color,
                  width: getWidthByOffset(timing.offset, maxOffset),
                }}
              />
              {timing.offset !== null ? <p>{timing.offset}ms</p> : <p>-</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function getWidthByOffset(offset: number | null, biggestOffset: number) {
  if (offset === null) {
    return '100%';
  }

  if (offset === 0) {
    return '3px';
  }

  return `${(offset / biggestOffset) * 100}%`;
}
