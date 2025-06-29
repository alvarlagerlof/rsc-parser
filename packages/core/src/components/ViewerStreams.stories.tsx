import type { Meta, StoryObj } from '@storybook/react-vite';

import { ViewerStreams } from './ViewerStreams';
import { alvarDevExampleData } from '../example-data/alvar-dev';
import { ghFredkissDevExampleData } from '../example-data/gh-fredkiss-dev';
import { nextjsOrgExampleData } from '../example-data/nextjs-org';

const meta: Meta<typeof ViewerStreams> = {
  component: ViewerStreams,
};

export default meta;
type Story = StoryObj<typeof ViewerStreams>;

export const nextjsOrg: Story = {
  name: 'nextjs.org',
  args: {
    events: nextjsOrgExampleData,
  },
};

export const ghFredkissDEv: Story = {
  name: 'gh.fredkiss.dev',
  args: {
    events: ghFredkissDevExampleData,
  },
};

export const alvarDev: Story = {
  name: 'alvar.dev',
  args: {
    events: alvarDevExampleData,
  },
};
