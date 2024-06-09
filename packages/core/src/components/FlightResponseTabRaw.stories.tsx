import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponseTabRaw } from "./FlightResponseTabRaw";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import { createFlightResponse } from "../createFlightResponse";
import { isRscChunkEvent } from "../types";

const meta: Meta<typeof FlightResponseTabRaw> = {
  component: FlightResponseTabRaw,
};

export default meta;
type Story = StoryObj<typeof FlightResponseTabRaw>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      alvarDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabRaw flightResponse={flightResponse} />;
  },
};

export const ghFredkissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      ghFredkissDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabRaw flightResponse={flightResponse} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const flightResponse = createFlightResponse(
      nextjsOrgExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabRaw flightResponse={flightResponse} />;
  },
};
