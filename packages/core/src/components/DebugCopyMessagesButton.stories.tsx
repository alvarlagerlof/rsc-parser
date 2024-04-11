import type { Meta, StoryObj } from "@storybook/react";

import { DebugCopyMessagesButton } from "./DebugCopyMessagesButton";
import { alvarDevExampleData } from "../example-data/alvar-dev";

const meta: Meta<typeof DebugCopyMessagesButton> = {
  component: DebugCopyMessagesButton,
};

export default meta;
type Story = StoryObj<typeof DebugCopyMessagesButton>;

export const example: Story = {
  name: "example",
  args: {
    messages: alvarDevExampleData,
  },
};
