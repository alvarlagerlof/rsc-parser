import { createContext } from "react";
import { ParsedPayload } from "./parse-payload";

export const PayloadContext = createContext<ParsedPayload>(null!);
