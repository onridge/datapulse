import js from "@eslint/js";

export default [
  {
    ...js.configs.recommended,
    files: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
  },
];