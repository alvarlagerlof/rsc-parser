import type { Meta, StoryObj } from "@storybook/react";

import { FlightResponseTabSplit } from "./FlightResponseTabSplit";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import { createFlightResponse } from "../createFlightResponse";

const meta: Meta<typeof FlightResponseTabSplit> = {
  component: FlightResponseTabSplit,
};

export default meta;
type Story = StoryObj<typeof FlightResponseTabSplit>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const flightResponse = createFlightResponse(alvarDevExampleData);
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const flightResponse = createFlightResponse(ghFredkissDevExampleData);
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const flightResponse = createFlightResponse(nextjsOrgExampleData);
    return <FlightResponseTabSplit flightResponse={flightResponse} />;
  },
};
