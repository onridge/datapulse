import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";

export function createConfig({ tsconfigPath, isNext = false } = {}) {
  return [
    ...(isNext ? coreWebVitals : [js.configs.recommended]),
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: {
        "@typescript-eslint": typescriptPlugin,
        "prettier": prettierPlugin,
        ...(isNext ? {} : { "import": importPlugin }),
      },
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          project: tsconfigPath ?? "./tsconfig.json",
        },
        globals: {
          ...(isNext ? globals.browser : globals.node),
        },
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
        "@typescript-eslint/no-non-null-assertion": "warn",
        "import/order": ["error", {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          "alphabetize": { order: "asc", caseInsensitive: true },
        }],
        "import/no-duplicates": "error",
        "prettier/prettier": "error",
         ...(isNext && { "react/no-unescaped-entities": "off" }),
      },
      settings: {
        "import/resolver": {
          typescript: { project: tsconfigPath ?? "./tsconfig.json" },
        },
      },
    },
    prettierConfig,
  ];
}