import type { Meta, StoryObj } from "@storybook/react";

import { TimeScrubber } from "./TimeScrubber";
import { nextJsDocs } from "./exampleMessages";

const meta: Meta<typeof TimeScrubber> = {
  component: TimeScrubber,
  argTypes: { onEndTimeChange: { action: "end time changed" } },
};

export default meta;
type Story = StoryObj<typeof TimeScrubber>;

export const NextJsExample: Story = {
  args: {
    messages: nextJsDocs,
  },
};
