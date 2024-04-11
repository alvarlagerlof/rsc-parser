import type { Meta, StoryObj } from "@storybook/react";

import { ClearMessagesButton } from "./ClearMessagesButton";

const meta: Meta<typeof ClearMessagesButton> = {
  component: ClearMessagesButton,
};

export default meta;
type Story = StoryObj<typeof ClearMessagesButton>;

export const example: Story = {
  name: "example",
};
