/** @type {import("eslint").Linter.Config} */
const config = {
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "prettier",
    ],
    parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  plugins: ['prettier'],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            // Allow promises to be used as attributes such as `onSubmit`
            attributes: false,
          },
        },
      ],
    },
    ignorePatterns: ["**/*.config.js", "**/*.config.cjs", "packages/config/**"],
    reportUnusedDisableDirectives: true,
  };
  
  module.exports = config;