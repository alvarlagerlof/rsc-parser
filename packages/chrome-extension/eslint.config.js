// @ts-check

import { FlatCompat } from "@eslint/eslintrc";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const compat = new FlatCompat();

export default [
  {
    ignores: ["dist/**", ".turbo/**", "vite.config.ts.timestamp*"],
  },
  ...[eslint.configs.recommended, ...tseslint.configs.recommended].map(
    (conf) => ({
      ...conf,
      files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    }),
  ),
  ...compat.config({
    extends: ["plugin:tailwindcss/recommended"],
    rules: {
      "tailwindcss/classnames-order": "error",
    },
  }),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      curly: ["error", "all"],
    },
  },
];
