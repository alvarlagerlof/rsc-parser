import type { Meta, StoryObj } from "@storybook/react";

import { PathTabs, usePathTabs } from "./PathTabs";
import { RscChunkMessage } from "../../main";
import { nextJsExampleData } from "../../example-data/nextjs";
import { neurodiversityWikiExampleData } from "../../example-data/neurodiversity-wiki";
import { ghNextExampleData } from "../../example-data/gh-next";

const meta: Meta<typeof PathTabs> = {
  component: PathTabs,
};

export default meta;
type Story = StoryObj<typeof PathTabs>;

function getUrlsFromMessages(messages: RscChunkMessage[]) {
  return Array.from(new Set(messages.map((message) => message.data.fetchUrl)));
}

export const Nextjs: Story = {
  name: "nextjs.org",
  render: () => {
    const pathTabs = usePathTabs(getUrlsFromMessages(nextJsExampleData), {
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
    const pathTabs = usePathTabs(getUrlsFromMessages(ghNextExampleData), {
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
    const pathTabs = usePathTabs(
      getUrlsFromMessages(neurodiversityWikiExampleData),
      {
        follow: false,
      }
    );

    return (
      <PathTabs {...pathTabs}>
        <p>Tab content goes</p>
      </PathTabs>
    );
  },
};
