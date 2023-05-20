import { createContext } from "react";

export const TabContext = createContext<
  | {
      setTab: (tab: number) => void;
    }
  | undefined
>(undefined);
