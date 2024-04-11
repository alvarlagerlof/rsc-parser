import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  component: Logo,
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const small: Story = {
  name: "small",
  args: {
    variant: "small",
  },
};

export const wide: Story = {
  name: "wide",
  args: {
    variant: "wide",
  },
};
