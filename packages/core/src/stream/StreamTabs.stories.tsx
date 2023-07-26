import type { Meta, StoryObj } from "@storybook/react";

import { StreamTabs } from "./StreamTabs";
import { nextJsDocs } from "./exampleMessages";

const meta: Meta<typeof StreamTabs> = {
  component: StreamTabs,
};

export default meta;
type Story = StoryObj<typeof StreamTabs>;

export const NextJsExample: Story = {
  args: {
    messages: nextJsDocs,
  },
};
