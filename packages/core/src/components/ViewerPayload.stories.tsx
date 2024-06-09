import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ViewerPayload } from "./ViewerPayload";
import { RscEvent, isRscChunkEvent, isRscRequestEvent } from "../events";
import { alvarDevExampleData } from "../example-data/alvar-dev";
import { ghFredkissDevExampleData } from "../example-data/gh-fredkiss-dev";
import { nextjsOrgExampleData } from "../example-data/nextjs-org";

const meta: Meta<typeof ViewerPayload> = {
  component: ViewerPayload,
};

export default meta;
type Story = StoryObj<typeof ViewerPayload>;

function getUrlsAndRequestIds(events: RscEvent[]) {
  return Array.from(
    new Set(
      events.filter(isRscRequestEvent).map((message) => ({
        url: message.data.url,
        requestId: message.data.requestId,
      })),
    ),
  );
}

function getPayloadByRequestId(events: RscEvent[], requestId: string) {
  return events
    .filter(isRscChunkEvent)
    .filter((message) => message.data.requestId === requestId)
    .map((message) =>
      new TextDecoder().decode(Uint8Array.from(message.data.chunkValue)),
    )
    .join("");
}

export const alvarDev: Story = {
  name: "alvar.dev",
  argTypes: {
    defaultPayload: {
      options: getUrlsAndRequestIds(alvarDevExampleData).map(({ url }) => url),
      mapping: getUrlsAndRequestIds(alvarDevExampleData).reduce(
        (acc, { url, requestId }) => {
          acc[url] = getPayloadByRequestId(alvarDevExampleData, requestId);
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
    defaultPayload: getPayloadByRequestId(
      alvarDevExampleData,
      getUrlsAndRequestIds(alvarDevExampleData)[0].requestId,
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
      options: getUrlsAndRequestIds(ghFredkissDevExampleData).map(
        ({ url }) => url,
      ),
      mapping: getUrlsAndRequestIds(ghFredkissDevExampleData).reduce(
        (acc, { url, requestId }) => {
          acc[url] = getPayloadByRequestId(ghFredkissDevExampleData, requestId);
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
    defaultPayload: getPayloadByRequestId(
      ghFredkissDevExampleData,
      getUrlsAndRequestIds(ghFredkissDevExampleData)[0].requestId,
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
      options: getUrlsAndRequestIds(nextjsOrgExampleData).map(({ url }) => url),
      mapping: getUrlsAndRequestIds(nextjsOrgExampleData).reduce(
        (acc, { url, requestId }) => {
          acc[url] = getPayloadByRequestId(nextjsOrgExampleData, requestId);
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
    defaultPayload: getPayloadByRequestId(
      nextjsOrgExampleData,
      getUrlsAndRequestIds(nextjsOrgExampleData)[0].requestId,
    ),
  },
  render: ({ defaultPayload }) => (
    <ViewerPayload defaultPayload={defaultPayload} key={defaultPayload} />
  ),
};
