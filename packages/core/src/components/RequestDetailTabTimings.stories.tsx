import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { RequestDetailTabTimings } from './RequestDetailTabTimings';
import { alvarDevExampleData } from '../example-data/alvar-dev';
import { ghFredkissDevExampleData } from '../example-data/gh-fredkiss-dev';
import { nextjsOrgExampleData } from '../example-data/nextjs-org';

const meta: Meta<typeof RequestDetailTabTimings> = {
  component: RequestDetailTabTimings,
};

export default meta;
type Story = StoryObj<typeof RequestDetailTabTimings>;

export const alvarDev: Story = {
  name: 'alvar.dev',
  render: () => {
    return <RequestDetailTabTimings events={alvarDevExampleData} />;
  },
};

export const ghFredKissDev: Story = {
  name: 'gh.fredkiss.dev',
  render: () => {
    return <RequestDetailTabTimings events={ghFredkissDevExampleData} />;
  },
};

export const nextjsOrg: Story = {
  name: 'nextjs.org',
  render: () => {
    return <RequestDetailTabTimings events={nextjsOrgExampleData} />;
  },
};
