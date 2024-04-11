import type { Meta, StoryObj } from "@storybook/react";

import { BottomPanel } from "./BottomPanel";

const meta: Meta<typeof BottomPanel> = {
  component: BottomPanel,
};

export default meta;
type Story = StoryObj<typeof BottomPanel>;

export const example: Story = {
  args: {
    openButton: "RSC",
    isOpen: true,
    children: "Panel content",
  },
};
