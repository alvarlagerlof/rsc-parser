import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../../core/src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  previewHead: (head) => `
  ${head}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet">`,
};
export default config;

function getAbsolutePath(value: string): any {
  const result = dirname(require.resolve(join(value, 'package.json')));
  console.log(result);
  return result;
}
