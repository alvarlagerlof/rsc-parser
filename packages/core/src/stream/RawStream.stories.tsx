import type { Meta, StoryObj } from "@storybook/react";

import { RawStream } from "./RawStream";
import { nextJsDocs } from "./exampleMessages";

const meta: Meta<typeof RawStream> = {
  component: RawStream,
};

export default meta;
type Story = StoryObj<typeof RawStream>;

export const NextJsExample: Story = {
  args: {
    messages: nextJsDocs,
  },
};
