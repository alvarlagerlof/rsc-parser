import type { Meta, StoryObj } from "@storybook/react";

import { StreamTabs } from "./StreamTabs";
import { nextJsExampleData } from "../example-data/nextjs";
import { ghNextExampleData } from "../example-data/gh-next";
import { neurodiversityWikiExampleData } from "../example-data/neurodiversity-wiki";

const meta: Meta<typeof StreamTabs> = {
  component: StreamTabs,
};

export default meta;
type Story = StoryObj<typeof StreamTabs>;

export const NextJs: Story = {
  name: "nextjs.org",
  args: {
    messages: nextJsExampleData,
  },
};

export const GhNext: Story = {
  name: "gh-issues.vercel.app",
  args: {
    messages: ghNextExampleData,
  },
};

export const NeurodiversityWiki: Story = {
  name: "neurodiversity.wiki",
  args: {
    messages: neurodiversityWikiExampleData,
  },
};
