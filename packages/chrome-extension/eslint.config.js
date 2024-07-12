// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', '.turbo/**', 'vite.config.ts.timestamp*'],
  },
  ...[eslint.configs.recommended, ...tseslint.configs.recommended].map(
    (conf) => ({
      ...conf,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    }),
  ),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      curly: ['error', 'all'],
    },
  },
];
