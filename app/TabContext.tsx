import { createContext } from "react";

export const TabContext = createContext<
  | {
      setTab: (tab: string) => void;
    }
  | undefined
>(undefined);
