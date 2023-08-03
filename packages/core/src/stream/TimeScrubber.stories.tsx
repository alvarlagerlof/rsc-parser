import type { Meta, StoryObj } from "@storybook/react";

import { TimeScrubber, useTimeScrubber } from "./TimeScrubber";
import { nextJsExampleData } from "../example-data/nextjs";
import { ghNextExampleData } from "../example-data/gh-next";
import { neurodiversityWikiExampleData } from "../example-data/neurodiversity-wiki";

const meta: Meta<typeof TimeScrubber> = {
  component: TimeScrubber,
};

export default meta;
type Story = StoryObj<typeof TimeScrubber>;

export const NextJs: Story = {
  name: "nextjs.org",
  render: () => {
    const timeScrubber = useTimeScrubber(nextJsExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};

export const GhNext: Story = {
  name: "gh-issues.vercel.app",
  render: () => {
    const timeScrubber = useTimeScrubber(ghNextExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};

export const NeurodiversityWiki: Story = {
  name: "neurodiversity.wiki",
  render: () => {
    const timeScrubber = useTimeScrubber(neurodiversityWikiExampleData, {
      follow: false,
    });

    return <TimeScrubber {...timeScrubber} />;
  },
};
