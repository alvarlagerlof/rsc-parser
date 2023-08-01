import type { Meta, StoryObj } from "@storybook/react";

import { PathTabs, usePathTabs } from "./PathTabs";

const meta: Meta<typeof PathTabs> = {
  component: PathTabs,
};

export default meta;
type Story = StoryObj<typeof PathTabs>;

export const Example: Story = {
  render: () => {
    const pathTabs = usePathTabs(
      [
        "https://nextjs.org/?_rsc=1ag7k",
        "https://nextjs.org/docs/app/building-your-application/optimizing/images?_rsc=1ag7k",
        "https://nextjs.org/docs?_rsc=1ag7k",
        "https://nextjs.org/blog/next-13-4?_rsc=1ag7k",
        "https://nextjs.org/docs/app/building-your-application/styling?_rsc=1ag7k",
        "https://nextjs.org/docs/app/building-your-application/data-fetching?_rsc=1ag7k",
        "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming?_rsc=1ag7k",
        "https://nextjs.org/docs/app/building-your-application/routing/middleware?_rsc=1ag7k",
      ],
      { follow: false },
    );

    return (
      <PathTabs {...pathTabs}>
        <p>Tab content goes</p>
      </PathTabs>
    );
  },
};
