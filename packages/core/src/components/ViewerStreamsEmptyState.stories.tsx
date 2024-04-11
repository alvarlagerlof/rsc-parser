import type { Meta, StoryObj } from "@storybook/react";

import { ViewerStreamsEmptyState } from "./ViewerStreamsEmptyState";

const meta: Meta<typeof ViewerStreamsEmptyState> = {
  component: ViewerStreamsEmptyState,
};

export default meta;
type Story = StoryObj<typeof ViewerStreamsEmptyState>;

export const example: Story = {
  name: "example",
};
