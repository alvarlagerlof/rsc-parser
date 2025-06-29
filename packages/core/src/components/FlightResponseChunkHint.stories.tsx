import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlightResponseChunkHint } from './FlightResponseChunkHint';

const meta: Meta<typeof FlightResponseChunkHint> = {
  component: FlightResponseChunkHint,
};

export default meta;
type Story = StoryObj<typeof FlightResponseChunkHint>;

export const StyleExample: Story = {
  args: {
    data: JSON.stringify([
      '/_next/static/css/41e8bd728ca8294e.css?dpl=dpl_DbJSoidkMic3ZCp3P3DJMZxkvi32',
      'style',
    ]),
  },
};

export const FontExample: Story = {
  args: {
    data: JSON.stringify([
      '/_next/static/41e8bd728ca8294e.css',
      'font',
      { crossOrigin: 'anonymous', type: 'font/woff2' },
    ]),
  },
};
