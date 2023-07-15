import * as Ariakit from "@ariakit/react";
import { createContext } from "react";

export const TabContext = createContext<Ariakit.TabStore | undefined>(
  undefined,
);
