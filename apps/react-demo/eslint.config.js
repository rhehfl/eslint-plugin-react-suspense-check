import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import suspensePlugin from 'eslint-plugin-react-suspense-check';
export default defineConfig([
  globalIgnores(['dist']),
  {
    plugins: { 'react-suspense-check': suspensePlugin },
    files: ['**/*.{js,jsx,ts,tsx}'],

    extends: [
      suspensePlugin.configs.recommended,
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
