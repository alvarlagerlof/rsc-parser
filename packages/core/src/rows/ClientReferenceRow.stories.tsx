import type { Meta, StoryObj } from "@storybook/react";

import { ClientReferenceRow } from "./ClientReferenceRow";

const meta: Meta<typeof ClientReferenceRow> = {
  component: ClientReferenceRow,
};

export default meta;
type Story = StoryObj<typeof ClientReferenceRow>;

export const UnknownName: Story = {
  args: {
    data: JSON.stringify({
      id: 77095,
      chunks: [
        "7095:static/chunks/7095-0d20f1be707836ac.js",
        "3517:static/chunks/app/(main)/blog/page-22a0214c471ccc51.js",
      ],
      name: "",
      async: false,
    }),
  },
};

export const WithName: Story = {
  args: {
    data: JSON.stringify({
      id: 82538,
      chunks: [
        "7095:static/chunks/7095-0d20f1be707836ac.js",
        "3034:static/chunks/3034-d8cf0f8567d59e6e.js",
        "3503:static/chunks/3503-24b01b8fcb22492f.js",
        "2480:static/chunks/app/(main)/projects/page-805143d67355c092.js",
      ],
      name: "NextSanityImage",
      async: false,
    }),
  },
};
