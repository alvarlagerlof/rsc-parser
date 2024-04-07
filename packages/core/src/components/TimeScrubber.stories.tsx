import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";

const meta: Meta<typeof TimeScrubber> = {
  component: TimeScrubber,
};

export default meta;
type Story = StoryObj<typeof TimeScrubber>;

export const alvarDev: Story = {
  name: "alvar.dev",
  render: () => {
    const timeScrubber = useTimeScrubber(alvarDevExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};

export const ghFredKissDev: Story = {
  name: "gh.fredkiss.dev",
  render: () => {
    const timeScrubber = useTimeScrubber(ghFredkissDevExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};

export const nextjsOrg: Story = {
  name: "nextjs.org",
  render: () => {
    const timeScrubber = useTimeScrubber(nextjsOrgExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};
