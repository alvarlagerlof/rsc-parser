import React from 'react';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';

const EndTimeContext = createContext<{
  endTime: number;
  visibleEndTime: number;
  changeEndTime: (value: number) => void;
  isPending: boolean;
}>({
  endTime: Infinity,
  visibleEndTime: Infinity,
  changeEndTime: () => {},
  isPending: false,
});

export function EndTimeProvider({
  maxEndTime,
  children,
}: {
  maxEndTime: number;
  children: ReactNode;
}) {
  const [endTime, setEndTime] = useState(Infinity);
  const [visibleEndTime, setVisibleEndTime] = useState(endTime);
  const [isPending, startTransition] = useTransition();

  const changeEndTime = (value: number) => {
    setVisibleEndTime(value);
    startTransition(() => {
      setEndTime(value);
    });
  };

  useEffect(() => {
    if (endTime !== maxEndTime) {
      changeEndTime(maxEndTime);
    }
  }, [maxEndTime]);

  return (
    <EndTimeContext.Provider
      value={{
        endTime,
        visibleEndTime,
        changeEndTime,
        isPending,
      }}
    >
      <div>{children}</div>
    </EndTimeContext.Provider>
  );
}

export function useEndTime() {
  const context = useContext(EndTimeContext);

  if (context === undefined) {
    throw new Error('useEndTime must be used within a EndTimeContext.Provider');
  }

  return context;
}
