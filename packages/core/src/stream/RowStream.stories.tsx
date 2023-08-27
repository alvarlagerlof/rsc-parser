import type { Meta, StoryObj } from "@storybook/react";

import { RowStream } from "./RowStream";
import { nextJsExampleData } from "../example-data/nextjs";
import { ghNextExampleData } from "../example-data/gh-next";
import { neurodiversityWikiExampleData } from "../example-data/neurodiversity-wiki";

const meta: Meta<typeof RowStream> = {
  component: RowStream,
};

export default meta;
type Story = StoryObj<typeof RowStream>;

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
