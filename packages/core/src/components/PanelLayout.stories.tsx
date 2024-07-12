import type { Meta, StoryObj } from '@storybook/react';

import { PanelLayout } from './PanelLayout';

const meta: Meta<typeof PanelLayout> = {
  component: PanelLayout,
};

export default meta;
type Story = StoryObj<typeof PanelLayout>;

export const small: Story = {
  name: 'small',
  args: {
    header: 'Header',
    buttons: 'Buttons go here',
    children: 'Content',
  },
};
