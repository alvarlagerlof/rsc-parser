import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponseTabNetwork } from "./FlightResponseTabNetwork";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import {
  createFlightResponse,
  processBinaryChunk,
} from "@rsc-parser/react-client";
import { isRscChunkEvent } from "../events";

const meta: Meta<typeof FlightResponseTabNetwork> = {
  component: FlightResponseTabNetwork,
};

export default meta;
type Story = StoryObj<typeof FlightResponseTabNetwork>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const flightResponse = createFlightResponse();
    for (const event of alvarDevExampleData.filter(isRscChunkEvent)) {
      flightResponse._currentTimestamp = event.data.timestamp;
      processBinaryChunk(
        flightResponse,
        Uint8Array.from(event.data.chunkValue),
      );
    }
    return <FlightResponseTabNetwork flightResponse={flightResponse} />;
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const flightResponse = createFlightResponse();
    for (const event of ghFredkissDevExampleData.filter(isRscChunkEvent)) {
      flightResponse._currentTimestamp = event.data.timestamp;
      processBinaryChunk(
        flightResponse,
        Uint8Array.from(event.data.chunkValue),
      );
    }
    return <FlightResponseTabNetwork flightResponse={flightResponse} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const flightResponse = createFlightResponse();
    for (const event of nextjsOrgExampleData.filter(isRscChunkEvent)) {
      flightResponse._currentTimestamp = event.data.timestamp;
      processBinaryChunk(
        flightResponse,
        Uint8Array.from(event.data.chunkValue),
      );
    }
    return <FlightResponseTabNetwork flightResponse={flightResponse} />;
  },
};
