const detectSuspenseHook = require('./rules/detect-suspense-hook');

const plugin = {
  meta: {
    name: 'eslint-plugin-react-suspense-check',
    version: '1.0.0',
  },
  rules: {
    'detect-suspense-hook': detectSuspenseHook,
  },
  configs: {},
};

const recommendedConfig = {
  name: 'react-suspense-check/recommended',
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  plugins: {
    'react-suspense-check': plugin,
  },
  rules: {
    'react-suspense-check/detect-suspense-hook': 'warn',
  },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

plugin.configs.recommended = recommendedConfig;

plugin.configs['flat/recommended'] = recommendedConfig;

export default plugin;
