import type { Meta, StoryObj } from "@storybook/react";

import { PathTabs, usePathTabs } from "./PathTabs";
import { nextJsExampleData } from "../../example-data/nextjs";
import { neurodiversityWikiExampleData } from "../../example-data/neurodiversity-wiki";
import { ghNextExampleData } from "../../example-data/gh-next";

const meta: Meta<typeof PathTabs> = {
  component: PathTabs,
};

export default meta;
type Story = StoryObj<typeof PathTabs>;

export const Nextjs: Story = {
  name: "nextjs.org",
  render: () => {
    const pathTabs = usePathTabs(nextJsExampleData, {
      follow: false,
    });

    return (
      <PathTabs {...pathTabs}>
        <p>Tab content goes</p>
      </PathTabs>
    );
  },
};

export const GhNext: Story = {
  name: "gh-issues.vercel.app",
  render: () => {
    const pathTabs = usePathTabs(ghNextExampleData, {
      follow: false,
    });

    return (
      <PathTabs {...pathTabs}>
        <p>Tab content goes</p>
      </PathTabs>
    );
  },
};

export const NeurodiversityWiki: Story = {
  name: "neurodiversity.wiki",
  render: () => {
    const pathTabs = usePathTabs(neurodiversityWikiExampleData, {
      follow: false,
    });

    return (
      <PathTabs {...pathTabs}>
        <p>Tab content goes</p>
      </PathTabs>
    );
  },
};
