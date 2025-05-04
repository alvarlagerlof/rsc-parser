import type { Meta, StoryObj } from '@storybook/react';

import { FlightResponseChunkConsole } from './FlightResponseChunkConsole';

const meta: Meta<typeof FlightResponseChunkConsole> = {
  component: FlightResponseChunkConsole,
};

export default meta;
type Story = StoryObj<typeof FlightResponseChunkConsole>;

export const WarnExample: Story = {
  args: {
    data: {
      methodName: 'warn',
      stackTrace: [
        [
          'Pokemon',
          '/Users/alvar/Code/alvarlagerlof/rsc-parser/examples/embedded-example/.next/server/chunks/ssr/_a0bf3aeb._.js',
          34,
          25,
        ],
      ],
      owner: {
        $$type: 'reference',
        id: 'b',
        identifier: '',
        type: 'Reference',
      },
      env: 'Server',
      args: [
        {
          $$type: 'reference',
          id: 'c',
          identifier: '',
          type: 'Error',
        },
      ],
    },
  },
};
