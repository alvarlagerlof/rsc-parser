import type { Meta, StoryObj } from "@storybook/react";

import { PanelLayout } from "./PanelLayout";

const meta: Meta<typeof PanelLayout> = {
  component: PanelLayout,
};

export default meta;
type Story = StoryObj<typeof PanelLayout>;

export const small: Story = {
  name: "small",
  args: {
    header: "Header",
    positionSwitchButton: "Position switch button",
    closeButton: "Close button",
    children: "Content",
  },
};
