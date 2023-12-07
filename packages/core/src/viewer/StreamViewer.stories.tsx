import type { Meta, StoryObj } from "@storybook/react";

import { StreamViewer } from "./StreamViewer";
// import { nextJsExampleData } from "../example-data/nextjs";
import { ghNextExampleData } from "../example-data/gh-fredkiss-dev";
// import { neurodiversityWikiExampleData } from "../example-data/neurodiversity-wiki";

const meta: Meta<typeof StreamViewer> = {
  component: StreamViewer,
};

export default meta;
type Story = StoryObj<typeof StreamViewer>;

// export const NextJs: Story = {
//   name: "nextjs.org",
//   args: {
//     messages: nextJsExampleData,
//   },
// };

export const GhNext: Story = {
  name: "gh-issues.vercel.app",
  args: {
    messages: ghNextExampleData,
  },
};

// export const NeurodiversityWiki: Story = {
//   name: "neurodiversity.wiki",
//   args: {
//     messages: neurodiversityWikiExampleData,
//   },
// };
