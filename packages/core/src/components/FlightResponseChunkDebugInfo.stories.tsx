import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlightResponseChunkDebugInfo } from './FlightResponseChunkDebugInfo';

const meta: Meta<typeof FlightResponseChunkDebugInfo> = {
  component: FlightResponseChunkDebugInfo,
};

export default meta;
type Story = StoryObj<typeof FlightResponseChunkDebugInfo>;

export const WarnExample: Story = {
  args: {
    data: {
      $$type: 'reference',
      id: 'd',
      identifier: '',
      type: 'Debug info',
    },
  },
};
