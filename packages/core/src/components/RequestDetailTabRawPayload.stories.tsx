import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RequestDetailTabRawPayload } from './RequestDetailTabRawPayload';
import { alvarDevExampleData } from '../example-data/alvar-dev';
import { ghFredkissDevExampleData } from '../example-data/gh-fredkiss-dev';
import { nextjsOrgExampleData } from '../example-data/nextjs-org';

const meta: Meta<typeof RequestDetailTabRawPayload> = {
  component: RequestDetailTabRawPayload,
};

export default meta;
type Story = StoryObj<typeof RequestDetailTabRawPayload>;

export const alvarDev: Story = {
  name: 'alvar.dev',
  render: () => {
    return <RequestDetailTabRawPayload events={alvarDevExampleData} />;
  },
};

export const ghFredkissDev: Story = {
  name: 'gh.fredkiss.dev',
  render: () => {
    return <RequestDetailTabRawPayload events={ghFredkissDevExampleData} />;
  },
};

export const nextjsOrg: Story = {
  name: 'nextjs.org',
  render: () => {
    return <RequestDetailTabRawPayload events={nextjsOrgExampleData} />;
  },
};
