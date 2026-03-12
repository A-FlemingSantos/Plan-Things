import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const jsxLanguageOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  globals: globals.browser,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

const reactPlugins = {
  react,
  "react-hooks": reactHooks,
  "react-refresh": reactRefresh,
};

const reactRules = {
  "react/jsx-uses-vars": "error",
  "react/react-in-jsx-scope": "off",
  ...reactHooks.configs.recommended.rules,
  "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
};

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended],
    files: ["src/**/*.{js,jsx}"],
    languageOptions: jsxLanguageOptions,
    plugins: reactPlugins,
    rules: reactRules,
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: jsxLanguageOptions,
    plugins: reactPlugins,
    rules: {
      ...reactRules,
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
