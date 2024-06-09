import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TimeScrubber } from "./TimeScrubber";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";
import { EndTimeProvider } from "./EndTimeContext";

const meta: Meta<typeof TimeScrubber> = {
  component: TimeScrubber,
};

export default meta;
type Story = StoryObj<typeof TimeScrubber>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    return (
      <EndTimeProvider maxEndTime={Infinity}>
        <TimeScrubber
          minStartTime={0}
          maxEndTime={Infinity}
          events={alvarDevExampleData}
        />
        ;
      </EndTimeProvider>
    );
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    return (
      <EndTimeProvider maxEndTime={Infinity}>
        <TimeScrubber
          minStartTime={0}
          maxEndTime={Infinity}
          events={ghFredkissDevExampleData}
        />
        ;
      </EndTimeProvider>
    );
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    return (
      <EndTimeProvider maxEndTime={Infinity}>
        <TimeScrubber
          minStartTime={0}
          maxEndTime={Infinity}
          events={nextjsOrgExampleData}
        />
        ;
      </EndTimeProvider>
    );
  },
};
