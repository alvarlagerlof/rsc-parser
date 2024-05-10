import type { Meta, StoryObj } from "@storybook/react";

import { ReadNextScriptTagsButton } from "./ReadNextScriptTagsButton";

const meta: Meta<typeof ReadNextScriptTagsButton> = {
  component: ReadNextScriptTagsButton,
};

export default meta;
type Story = StoryObj<typeof ReadNextScriptTagsButton>;

export const example: Story = {
  name: "example",
};
