import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponseTabSplit } from "./FlightResponseTabSplit";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import { createFlightResponse } from "../createFlightResponse";
import { isRscChunkEvent } from "../events";

const meta: Meta<typeof FlightResponseTabSplit> = {
  component: FlightResponseTabSplit,
};

export default meta;
type Story = StoryObj<typeof FlightResponseTabSplit>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      alvarDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const flightResponse = createFlightResponse(
      ghFredkissDevExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const flightResponse = createFlightResponse(
      nextjsOrgExampleData.filter(isRscChunkEvent),
    );
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};
