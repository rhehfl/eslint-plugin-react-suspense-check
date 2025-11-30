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
    ...suspensePlugin.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react-suspense-check/detect-suspense-hook': ['warn', { language: 'kr' }],
    },
    extends: [
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
