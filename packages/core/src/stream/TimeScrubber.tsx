import { useEffect, useState, useTransition } from "react";
import { RscChunkMessage } from "./message";
import { useFilterMessagesByEndTime, useTimeRange } from "./hooks";

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

export function TimeScrubber({
  messages,
  endTime,
  visibleEndTime,
  changeEndTime,
  isPending,
  minStartTime,
  maxEndTime,
}: ReturnType<typeof useTimeScrubber>) {
  const messageTimePercentages = messages.map((message) => {
    const percentage =
      ((message.data.chunkStartTime - minStartTime) /
        (maxEndTime - minStartTime)) *
      100;

    return percentage;
  });

  const filteredMessages = useFilterMessagesByEndTime(messages, endTime);

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg bg-slate-200  px-2 py-1 dark:bg-slate-700 dark:text-white">
      <div className="flex flex-row gap-2">
        <div className="tabular-nums text-slate-700 dark:text-slate-300">
          {new Date(visibleEndTime).toLocaleTimeString()} /{" "}
          {new Date(maxEndTime).toLocaleTimeString()}
        </div>
        <input
          type="range"
          className="grow"
          min={minStartTime}
          max={maxEndTime}
          value={visibleEndTime}
          onChange={(event) => {
            const numberValue = Number.parseFloat(event.target.value);
            changeEndTime(numberValue);
          }}
        ></input>
      </div>

      <div
        className={`flex flex-row gap-2 transition-opacity delay-[50] duration-100 ${
          isPending ? "opacity-60" : ""
        }`}
      >
        <div className="whitespace-nowrap tabular-nums text-slate-700 dark:text-slate-300">
          {String(filteredMessages.length).padStart(
            String(messages.length).length,
            "0",
          )}{" "}
          / {messages.length}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height="20px"
          className="stroke-slate-400 dark:stroke-slate-300"
        >
          <circle cx="100px" cy="100px" r="1px" stroke="black" />
          {messageTimePercentages.map((percentage, idx) => (
            <line
              key={`circle-${idx}`}
              x1={`${percentage}%`}
              y1="0px"
              x2={`${percentage}%`}
              y2="100%"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
