import type { Meta, StoryObj } from "@storybook/react";

import { PayloadViewer } from "./PayloadViewer";
import { nextJsExampleData } from "../example-data/nextjs";
import { ghNextExampleData } from "../example-data/gh-next";
import { neurodiversityWikiExampleData } from "../example-data/neurodiversity-wiki";
import { RscChunkMessage } from "../main";

const meta: Meta<typeof PayloadViewer> = {
  component: PayloadViewer,
};

export default meta;
type Story = StoryObj<typeof PayloadViewer>;

function getUrls(messages: RscChunkMessage[]) {
  return Array.from(new Set(messages.map((message) => message.data.fetchUrl)));
}

function getPayloadByUrl(messages: RscChunkMessage[], url: string) {
  return messages
    .filter((message) => message.data.fetchUrl === url)
    .map((message) => message.data.chunkValue)
    .join("");
}

export const NextJs: Story = {
  name: "nextjs.org",
  argTypes: {
    defaultPayload: {
      options: getUrls(nextJsExampleData),
      mapping: getUrls(nextJsExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(nextJsExampleData, url);
          return acc;
        },
        {} as Record<string, string>,
      ),
      control: {
        type: "select",
      },
    },
  },
  args: {
    defaultPayload: getPayloadByUrl(
      nextJsExampleData,
      getUrls(nextJsExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <PayloadViewer defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};

export const GhNext: Story = {
  name: "gh-issues.vercel.app",
  argTypes: {
    defaultPayload: {
      options: getUrls(ghNextExampleData),
      mapping: getUrls(ghNextExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(ghNextExampleData, url);
          return acc;
        },
        {} as Record<string, string>,
      ),
      control: {
        type: "select",
      },
    },
  },
  args: {
    defaultPayload: getPayloadByUrl(
      ghNextExampleData,
      getUrls(ghNextExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <PayloadViewer defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};

export const NeurodiversityWiki: Story = {
  name: "neurodiversity.wiki",
  argTypes: {
    defaultPayload: {
      options: getUrls(neurodiversityWikiExampleData),
      mapping: getUrls(neurodiversityWikiExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(neurodiversityWikiExampleData, url);
          return acc;
        },
        {} as Record<string, string>,
      ),
      control: {
        type: "select",
      },
    },
  },
  args: {
    defaultPayload: getPayloadByUrl(
      neurodiversityWikiExampleData,
      getUrls(neurodiversityWikiExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <PayloadViewer defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};
