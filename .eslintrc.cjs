const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
  ]
    .map(require.resolve)
    .concat([
      // "plugin:@tanstack/eslint-plugin-query/recommended"
    ]),
  parserOptions: {
    project: true,
    tsconfigRootDir: process.cwd(),
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", "src-tauri/", "src/bindings/", "src/components/ui"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "unicorn/filename-case": "off",
    "eslint-comments/require-description": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "react/hook-use-state": "off",
    // "@tanstack/query/exhaustive-deps": "warn",
    "@typescript-eslint/no-misused-promises": "off",
    camelcase: "off",
  },
};
