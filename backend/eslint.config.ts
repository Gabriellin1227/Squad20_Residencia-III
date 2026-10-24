import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import jestPlugin from "eslint-plugin-jest";
import eslintConfigPrettier from "eslint-config-prettier"; // 1. Importado aqui

export default tseslint.config(
  // Regras recomendadas padrão (JS e TS)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Configuração de ambiente Node.js para os arquivos-fonte
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: "./tsconfig.json", // Corrigido: 'project' e '.json'
        tsconfigRootDir: __dirname,
      },
    },
  },
  
  // Configuração do Jest (aplicada exclusivamente a arquivos de teste)
  {
    files: ["**/*.test.{js,ts}", "**/*.spec.{js,ts}", "**/__tests__/**/*.{js,ts}"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
  
  // Validação de arquivos JSON
  {
    files: ["**/*.json"],
    language: "json/json",
    plugins: {
      json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
  },

  // Prettier deve ser sempre a última configuração do array
  eslintConfigPrettier
);