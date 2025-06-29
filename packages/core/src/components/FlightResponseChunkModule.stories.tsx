import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlightResponseChunkModule } from './FlightResponseChunkModule';

const meta: Meta<typeof FlightResponseChunkModule> = {
  component: FlightResponseChunkModule,
};

export default meta;
type Story = StoryObj<typeof FlightResponseChunkModule>;

export const UnknownName: Story = {
  args: {
    data: [
      '77095',
      [
        '7095',
        'static/chunks/7095-0d20f1be707836ac.js',
        '3517',
        'static/chunks/app/(main)/blog/page-22a0214c471ccc51.js',
      ],
      '',
    ],
  },
};

export const WithName: Story = {
  args: {
    data: [
      '82538',
      [
        '7095',
        'static/chunks/7095-0d20f1be707836ac.js',
        '3034',
        'static/chunks/3034-d8cf0f8567d59e6e.js',
        '3503',
        'static/chunks/3503-24b01b8fcb22492f.js',
        '2480',
        'static/chunks/app/(main)/projects/page-805143d67355c092.js',
      ],
      'NextSanityImage',
    ],
  },
};
