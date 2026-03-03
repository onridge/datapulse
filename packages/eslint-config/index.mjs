import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export function createConfig({ tsconfigPath, isNext = false } = {}) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });

  return [
    ...(isNext ? compat.extends("next/core-web-vitals") : []),
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: {
        "@typescript-eslint": typescriptPlugin,
        "import": importPlugin,
        "prettier": prettierPlugin,
      },
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          project: tsconfigPath ?? "./tsconfig.json",
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
      },
      settings: {
        "import/resolver": {
          typescript: { project: tsconfigPath ?? "./tsconfig.json" },
        },
      },
    },
  ];
}