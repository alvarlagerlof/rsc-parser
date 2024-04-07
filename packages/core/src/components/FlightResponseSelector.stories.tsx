import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  FlightResponseSelector,
  useFlightResponseSelector,
} from "./FlightResponseSelector";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";

const meta: Meta<typeof FlightResponseSelector> = {
  component: FlightResponseSelector,
};

export default meta;
type Story = StoryObj<typeof FlightResponseSelector>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const pathTabs = useFlightResponseSelector(alvarDevExampleData, {
      follow: false,
    });

    return (
      <FlightResponseSelector {...pathTabs}>
        <p>Tab content goes</p>
      </FlightResponseSelector>
    );
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const pathTabs = useFlightResponseSelector(ghFredkissDevExampleData, {
      follow: false,
    });

    return (
      <FlightResponseSelector {...pathTabs}>
        <p>Tab content goes</p>
      </FlightResponseSelector>
    );
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const pathTabs = useFlightResponseSelector(nextjsOrgExampleData, {
      follow: false,
    });

    return (
      <FlightResponseSelector {...pathTabs}>
        <p>Tab content goes</p>
      </FlightResponseSelector>
    );
  },
};
