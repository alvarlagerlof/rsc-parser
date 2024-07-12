import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RequestDetailTabParsedPayload } from './RequestDetailTabParsedPayload';
import { alvarDevExampleData } from '../example-data/alvar-dev';
import { ghFredkissDevExampleData } from '../example-data/gh-fredkiss-dev';
import { nextjsOrgExampleData } from '../example-data/nextjs-org';

const meta: Meta<typeof RequestDetailTabParsedPayload> = {
  component: RequestDetailTabParsedPayload,
};

export default meta;
type Story = StoryObj<typeof RequestDetailTabParsedPayload>;

export const alvarDev: Story = {
  name: 'alvar.dev',
  render: () => {
    return <RequestDetailTabParsedPayload events={alvarDevExampleData} />;
  },
};

export const ghFredKissDev: Story = {
  name: 'gh.fredkiss.dev',
  render: () => {
    return <RequestDetailTabParsedPayload events={ghFredkissDevExampleData} />;
  },
};

export const nextjsOrg: Story = {
  name: 'nextjs.org',
  render: () => {
    return <RequestDetailTabParsedPayload events={nextjsOrgExampleData} />;
  },
};
