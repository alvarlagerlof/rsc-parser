import type { Meta, StoryObj } from "@storybook/react";

import { HintRow } from "./HintRow";

const meta: Meta<typeof HintRow> = {
  component: HintRow,
};

export default meta;
type Story = StoryObj<typeof HintRow>;

export const StyleExample: Story = {
  args: {
    data: JSON.stringify([
      "/_next/static/css/41e8bd728ca8294e.css?dpl=dpl_DbJSoidkMic3ZCp3P3DJMZxkvi32",
      { as: "style" },
    ]),
  },
};
