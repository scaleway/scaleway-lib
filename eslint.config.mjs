import babelParser from "@babel/eslint-parser";
import scw from "@scaleway/eslint-config-react/javascript";
import scwTypescript from "@scaleway/eslint-config-react/typescript";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/build/",
      "**/__typetests__/",
      "**/packages_deprecated/",
      "**/coverage/",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  ...scw.map((config) => ({ ...config, files: ["**/*.js"] })),
  {
    files: ["**/*.js"],

    languageOptions: {
      parser: babelParser,
      parserOptions: {
        configFile: "./babel.config.json",
      },
    },
  },
  ...scwTypescript.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.json"],
      },
    },
  },
  ...scwTypescript.map((config) => ({
    ...config,
    files: [
      "packages/changesets-renovate/**/*.ts{x,}",
      "packages/validate-icu-locales/**/*.ts{x,}",
      "**/__tests__/**/*.ts{x,}",
    ],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.json"],
      },
    },
  })),
  ...scwTypescript.map((config) => ({
    ...config,
    files: [
      "packages/changesets-renovate/**/*.ts{x,}",
      "packages/validate-icu-locales/**/*.ts{x,}",
      "**/__tests__/**/*.ts{x,}",
    ],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.json"],
      },
    },

    rules: {
      ...config.rules,
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
    },
  })),

  {
    files: [
      "packages/jest-helpers/**/*.ts{x,}",
      "**/__tests__/**/*.ts{x,}",
      "**/vitest.setup.ts",
      "**/*.config.ts",
      "**/__mocks__/**/*.ts{x,}",
    ],

    rules: {
      "import/no-extraneous-dependencies": "off",
      "react/jsx-key": "off",
      "import/no-relative-packages": "off",
    },
  },
];
