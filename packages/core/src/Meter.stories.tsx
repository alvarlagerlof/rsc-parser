import type { Meta, StoryObj } from "@storybook/react";

import { Meter } from "./Meter";

const meta: Meta<typeof Meter> = {
  component: Meter,
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  args: {
    fraction: 0.4,
  },
};
