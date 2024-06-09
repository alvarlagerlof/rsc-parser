import React, { useEffect, useMemo, useState, useTransition } from "react";
import { RscEvent } from "../events";
import { getColorForFetch } from "../color";

export function useTimeScrubber(
  events: RscEvent[],
  { follow }: { follow: boolean },
) {
  const { minStartTime, maxEndTime } = useTimeRange(events);
  const [endTime, setEndTime] = useState(maxEndTime);

  const [visibleEndTime, setVisibleEndTime] = useState(endTime);
  const [isPending, startTransition] = useTransition();

  const changeEndTime = (value: number) => {
    setVisibleEndTime(value);
    startTransition(() => {
      setEndTime(value);
    });
  };

  useEffect(() => {
    if (follow) {
      if (endTime !== maxEndTime) {
        changeEndTime(maxEndTime);
      }
    }
  }, [events]);

  return {
    events,
    endTime,
    visibleEndTime,
    changeEndTime,
    isPending,
    startTransition,
    minStartTime,
    maxEndTime,
  };
}

function useTracks(events: RscEvent[]) {
  return useMemo(() => {
    const tracks: Array<Array<RscEvent>> = [[]];

    for (const message of events) {
      // Find a track that doesn't overlap with the current message
      const track = tracks.find((track) => {
        const lastMessage = track[track.length - 1];

        if (!lastMessage) {
          return true;
        }

        if (lastMessage.data.requestId === message.data.requestId) {
          return true;
        }

        const lastMessageWithSameRequestId = events
          .filter((m) => m.data.requestId === lastMessage.data.requestId)
          .at(-1);

        if (
          lastMessage.data.requestId !== message.data.requestId &&
          typeof lastMessageWithSameRequestId !== "undefined" &&
          lastMessageWithSameRequestId.data.timestamp < message.data.timestamp
        ) {
          return true;
        }

        return false;
      });

      if (track) {
        track.push(message);
      } else {
        tracks.push([message]);
      }
    }

    return tracks;
  }, [events]);
}

export function TimeScrubber({
  events,
  endTime,
  visibleEndTime,
  changeEndTime,
  isPending,
  minStartTime,
  maxEndTime,
}: ReturnType<typeof useTimeScrubber>) {
  const filteredEvents = useFilterEventsByEndTime(events, endTime);
  const tracks = useTracks(events);

  const messageHeight = 12;
  const trackSpacing = 4;
  const trackPadding = 8;

  return (
    <div className="flex w-full flex-col gap-1.5 rounded-md bg-slate-200 p-1.5 dark:bg-slate-800">
      <div className="relative flex flex-row items-center transition-opacity delay-75 duration-100">
        <input
          type="range"
          className={[
            "absolute h-full w-full rounded z-20",
            "appearance-none",
            "bg-transparent bg-gradient-to-r from-blue-100/25 to-blue-100/25 dark:from-blue-100/10 dark:to-blue-100/10 bg-no-repeat",
            "[&::-webkit-slider-runnable-track]:bg-transparent",
            "[&::-webkit-slider-runnable-track]:h-full",
            "[&::-webkit-slider-thumb]:h-[calc(100%-6px)]",
            "[&::-webkit-slider-thumb]:mt-[calc(6px/2)]",
            "[&::-webkit-slider-thumb]:w-1",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:rounded-md",
            "[&::-webkit-slider-thumb]:transition-colors",
            "[&::-webkit-slider-thumb]:delay-75",
            "[&::-webkit-slider-thumb]:duration-100",
            isPending
              ? "[&::-webkit-slider-thumb]:bg-blue-300"
              : "[&::-webkit-slider-thumb]:bg-blue-500",
            "[&::-webkit-slider-thumb]:z-20",
          ].join(" ")}
          min={minStartTime}
          max={maxEndTime}
          value={visibleEndTime}
          style={{
            backgroundSize:
              ((visibleEndTime - minStartTime) * 100) /
                (maxEndTime - minStartTime) +
              "% 100%",
          }}
          onChange={(event) => {
            const numberValue = Number.parseFloat(event.target.value);
            changeEndTime(numberValue);
          }}
        ></input>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height={`${
            tracks.length *
              (messageHeight + (tracks.length > 1 ? trackSpacing : 0)) +
            trackPadding * 2
          }px`}
          className="pointer-events-none z-10 rounded bg-white fill-slate-500 dark:bg-slate-700"
        >
          {tracks.map((track, idx) => {
            const sections: {
              requestId: string;
              startTime: number;
              endTime: number;
            }[] = [];

            if (track.length === 0) {
              return null;
            }

            let currentRequestId: string | undefined = undefined;
            for (const event of track) {
              if (currentRequestId === event.data.requestId) {
                continue;
              }

              currentRequestId = event.data.requestId;

              const eventsWithSameRequestId = track.filter(
                (event) => event.data.requestId === currentRequestId,
              );
              const lastEvent = eventsWithSameRequestId.at(-1);

              if (!lastEvent) {
                return null;
              }

              sections.push({
                requestId: currentRequestId,
                startTime: event.data.timestamp,
                endTime: lastEvent.data.timestamp,
              });
            }

            return sections.map((section) => {
              const x =
                ((section.startTime - minStartTime) /
                  (maxEndTime - minStartTime)) *
                100;

              const y = idx * (messageHeight + trackSpacing) + trackPadding;

              const width =
                ((section.endTime - section.startTime) /
                  (maxEndTime - minStartTime)) *
                100;

              return (
                <rect
                  key={section.requestId}
                  x={`${x * 0.98 + 1}%`}
                  y={`${y}px`}
                  width={width > 0.2 ? `${width}%` : "0.2%"}
                  height={messageHeight}
                  fill={getColorForFetch(section.requestId)}
                  rx="1"
                />
              );
            });
          })}
        </svg>
      </div>

      <div className="flex flex-row justify-between px-1">
        <div className="tabular-nums text-slate-700 dark:text-slate-300">
          {new Date(visibleEndTime).toLocaleTimeString()} /{" "}
          {new Date(maxEndTime).toLocaleTimeString()}
        </div>

        <div className="whitespace-nowrap tabular-nums text-slate-700 dark:text-slate-300">
          {String(filteredEvents.length).padStart(
            String(events.length).length,
            "0",
          )}{" "}
          / {events.length}
        </div>
      </div>
    </div>
  );
}

function useTimeRange(events: RscEvent[]) {
  return useMemo(() => {
    let minStartTime = Number.MAX_SAFE_INTEGER;
    let maxEndTime = 0;

    for (const message of events) {
      minStartTime = Math.min(minStartTime, message.data.timestamp);
      maxEndTime = Math.max(maxEndTime, message.data.timestamp);
    }

    const timeRange = maxEndTime - minStartTime;

    return {
      minStartTime,
      maxEndTime,
      timeRange,
    };
  }, [events]);
}

export function useFilterEventsByEndTime(events: RscEvent[], endTime: number) {
  return useMemo(() => {
    return events.filter((event) => event.data.timestamp <= endTime);
  }, [events, endTime]);
}
