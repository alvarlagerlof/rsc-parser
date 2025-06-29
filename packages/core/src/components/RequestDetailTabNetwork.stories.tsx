import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RequestDetailTabNetwork } from './RequestDetailTabNetwork';
import { alvarDevExampleData } from '../example-data/alvar-dev';
import { ghFredkissDevExampleData } from '../example-data/gh-fredkiss-dev';
import { nextjsOrgExampleData } from '../example-data/nextjs-org';

const meta: Meta<typeof RequestDetailTabNetwork> = {
  component: RequestDetailTabNetwork,
};

export default meta;
type Story = StoryObj<typeof RequestDetailTabNetwork>;

export const alvarDev: Story = {
  name: 'alvar.dev',
  render: () => {
    return <RequestDetailTabNetwork events={alvarDevExampleData} />;
  },
};

export const ghFredKissDev: Story = {
  name: 'gh.fredkiss.dev',
  render: () => {
    return <RequestDetailTabNetwork events={ghFredkissDevExampleData} />;
  },
};

export const nextjsOrg: Story = {
  name: 'nextjs.org',
  render: () => {
    return <RequestDetailTabNetwork events={nextjsOrgExampleData} />;
  },
};
