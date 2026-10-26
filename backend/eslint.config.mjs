import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import jestPlugin from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**", "package-lock.json"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    files: [
      "**/*.test.{js,ts}",
      "**/*.spec.{js,ts}",
      "**/__tests__/**/*.{js,ts}",
    ],
    plugins: { jest: jestPlugin },
    languageOptions: { globals: globals.jest },
    rules: { ...jestPlugin.configs.recommended.rules },
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    plugins: { json },
    rules: { ...json.configs.recommended.rules },
  },
  eslintConfigPrettier,
);
