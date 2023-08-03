import { useEffect, useMemo, useState, useTransition } from "react";
import { RscChunkMessage } from "./stream/message";
import { useFilterMessagesByEndTime, useTimeRange } from "./stream/hooks";

export function useTimeScrubber(
  messages: RscChunkMessage[],
  { follow }: { follow: boolean },
) {
  const { minStartTime, maxEndTime } = useTimeRange(messages);
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
  }, [messages]);

  return {
    messages,
    endTime,
    visibleEndTime,
    changeEndTime,
    isPending,
    startTransition,
    minStartTime,
    maxEndTime,
  };
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function useTracks(messages: RscChunkMessage[]) {
  return useMemo(() => {
    const messageTracks: Array<Array<RscChunkMessage>> = [[]];

    for (const message of messages) {
      // Find a track that doesn't overlap with the current message
      const track = messageTracks.find((track) => {
        const lastMessage = track[track.length - 1];

        if (!lastMessage) {
          return true;
        }

        if (lastMessage.data.fetchStartTime === message.data.fetchStartTime) {
          return true;
        }

        const lastMessageWithSameFetchUrl = messages
          .filter(
            (m) => m.data.fetchStartTime === lastMessage.data.fetchStartTime,
          )
          .at(-1);

        if (
          lastMessage.data.fetchStartTime !== message.data.fetchStartTime &&
          typeof lastMessageWithSameFetchUrl !== "undefined" &&
          lastMessageWithSameFetchUrl.data.chunkEndTime <
            message.data.fetchStartTime
        ) {
          return true;
        }

        return false;
      });

      if (track) {
        track.push(message);
      } else {
        messageTracks.push([message]);
      }
    }

    return messageTracks;
  }, [messages]);
}

export function TimeScrubber({
  messages,
  endTime,
  visibleEndTime,
  changeEndTime,
  isPending,
  minStartTime,
  maxEndTime,
}: ReturnType<typeof useTimeScrubber>) {
  const filteredMessages = useFilterMessagesByEndTime(messages, endTime);
  const tracks = useTracks(messages);

  const messageHeight = 12;
  const trackSpacing = 4;
  const trackPadding = 8;

  return (
    <div className="flex w-full flex-col gap-1.5 rounded-md bg-slate-200 p-1.5 dark:bg-slate-700 dark:text-white">
      <div className="relative flex flex-row items-center transition-opacity delay-75 duration-100">
        <input
          type="range"
          className={[
            "absolute h-full w-full rounded z-20",
            "appearance-none",
            "bg-transparent bg-gradient-to-r from-blue-100/25 to-blue-100/25 bg-no-repeat",
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
          className="pointer-events-none z-10 rounded bg-white fill-slate-500"
        >
          {tracks.map((track, idx) => {
            return track.map((message) => {
              const x =
                ((message.data.chunkStartTime - minStartTime) /
                  (maxEndTime - minStartTime)) *
                100;

              const y = idx * (messageHeight + trackSpacing) + trackPadding;

              const width =
                ((message.data.chunkEndTime - message.data.chunkStartTime) /
                  (maxEndTime - minStartTime)) *
                100;

              return (
                <rect
                  x={`${x * 0.98 + 1}%`}
                  y={`${y}px`}
                  width={width > 0.2 ? `${width}%` : "0.2%"}
                  height={messageHeight}
                  fill={`oklch(80% 0.15 ${
                    random(message.data.fetchStartTime) * 360
                  })`}
                  rx="1"
                />
              );
            });
          })}
        </svg>
      </div>

      <div className="flex flex-row justify-between px-1 text-sm">
        <div className="tabular-nums text-slate-700 dark:text-slate-300">
          {new Date(visibleEndTime).toLocaleTimeString()} /{" "}
          {new Date(maxEndTime).toLocaleTimeString()}
        </div>

        <div className="whitespace-nowrap tabular-nums text-slate-700 dark:text-slate-300">
          {String(filteredMessages.length).padStart(
            String(messages.length).length,
            "0",
          )}{" "}
          / {messages.length}
        </div>
      </div>
    </div>
  );
}
