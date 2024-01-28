import type { Meta, StoryObj } from "@storybook/react";

import { ViewerPayload } from "./ViewerPayload";
import { RscChunkMessage } from "../types";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";

const meta: Meta<typeof ViewerPayload> = {
  component: ViewerPayload,
};

export default meta;
type Story = StoryObj<typeof ViewerPayload>;

function getUrls(messages: RscChunkMessage[]) {
  return Array.from(new Set(messages.map((message) => message.data.fetchUrl)));
}

function getPayloadByUrl(messages: RscChunkMessage[], url: string) {
  return messages
    .filter((message) => message.data.fetchUrl === url)
    .map((message) =>
      new TextDecoder().decode(Uint8Array.from(message.data.chunkValue)),
    )
    .join("");
}

export const alvarDev: Story = {
  name: "alvar.dev",
  argTypes: {
    defaultPayload: {
      options: getUrls(alvarDevExampleData),
      mapping: getUrls(alvarDevExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(alvarDevExampleData, url);
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
      alvarDevExampleData,
      getUrls(alvarDevExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <ViewerPayload defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};

export const ghFredkissDev: Story = {
  name: "gh.fredkiss.dev",
  argTypes: {
    defaultPayload: {
      options: getUrls(ghFredkissDevExampleData),
      mapping: getUrls(ghFredkissDevExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(ghFredkissDevExampleData, url);
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
      ghFredkissDevExampleData,
      getUrls(ghFredkissDevExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <ViewerPayload defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};

export const nextJsOrg: Story = {
  name: "nextjs.org",
  argTypes: {
    defaultPayload: {
      options: getUrls(nextjsOrgExampleData),
      mapping: getUrls(nextjsOrgExampleData).reduce(
        (acc, url) => {
          acc[url] = getPayloadByUrl(nextjsOrgExampleData, url);
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
      nextjsOrgExampleData,
      getUrls(nextjsOrgExampleData)[0],
    ),
  },
  render: ({ defaultPayload }) => (
    <ViewerPayload defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};
