import type { Meta, StoryObj } from "@storybook/react";

import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { nextJsDocs } from "./exampleMessages";

const meta: Meta<typeof TimeScrubber> = {
  component: TimeScrubber,
};

export default meta;
type Story = StoryObj<typeof TimeScrubber>;

export const NextJsExample: Story = {
  render: () => {
    const timeScrubber = useTimeScrubber(nextJsDocs, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};
