import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export function createConfig({ tsconfigPath, isNext = false } = {}) {
  return [
    js.configs.recommended,
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: {
        "@typescript-eslint": typescriptPlugin,
        "prettier": prettierPlugin,
        "import": importPlugin,
        ...(isNext && {
          "@next/next": nextPlugin,
          "react": reactPlugin,
          "react-hooks": reactHooksPlugin,
        }),
      },
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          project: tsconfigPath ?? "./tsconfig.json",
           ...(isNext && { jsxImportSource: "react" }),
        },
        globals: {
          ...(isNext ? globals.browser : globals.node),
          ...(isNext && { React: "readonly" }),
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
        ...(isNext && {
          "react/react-in-jsx-scope": "off", 
          "react/jsx-uses-react": "off",
          "@next/next/no-html-link-for-pages": "error",
          "@next/next/no-img-element": "error",
          "react/no-unescaped-entities": "off",
          "react-hooks/rules-of-hooks": "error",
          "react-hooks/exhaustive-deps": "warn",
        }),
      },
      settings: {
        "import/resolver": {
          typescript: { project: tsconfigPath ?? "./tsconfig.json" },
        },
        ...(isNext && { react: { version: "detect" } }),
      },
    },
    prettierConfig,
  ];
}