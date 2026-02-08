import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import suspensePlugin from 'eslint-plugin-react-suspense-check';

export default defineConfig([
  globalIgnores(['dist']),
  suspensePlugin.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      'react-suspense-check': suspensePlugin,
    },
    rules: {
      'react-suspense-check/detect-suspense-hook': ['warn', { language: 'kr' }],
    },
  },
]);
