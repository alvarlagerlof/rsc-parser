import type { Meta, StoryObj } from '@storybook/react-vite';

import { RecordButton } from './RecordButton';

const meta: Meta<typeof RecordButton> = {
  component: RecordButton,
};

export default meta;
type Story = StoryObj<typeof RecordButton>;

export const notRecording: Story = {
  name: 'not recording',
  args: {
    isRecording: false,
  },
};

export const recording: Story = {
  name: 'recording',
  args: {
    isRecording: true,
  },
};
