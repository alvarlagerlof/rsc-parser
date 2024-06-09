import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponse } from "./FlightResponse";
import { createFlightResponse } from "../createFlightResponse";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import { isRscChunkEvent } from "../events";

const meta: Meta<typeof FlightResponse> = {
  component: FlightResponse,
};

export default meta;
type Story = StoryObj<typeof FlightResponse>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      alvarDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponse flightResponse={flightResponse} />;
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      ghFredkissDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponse flightResponse={flightResponse} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const flightResponse = createFlightResponse(
      nextjsOrgExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponse flightResponse={flightResponse} />;
  },
};
