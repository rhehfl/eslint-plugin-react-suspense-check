const detectSuspenseHook = require('./rules/detect-suspense-hook');

const plugin = {
  meta: {
    name: 'eslint-plugin-react-suspense-check',
    version: '1.0.0',
  },
  rules: {
    'detect-suspense-hook': detectSuspenseHook,
  },
  configs: {}, // 아래에서 채움
};

plugin.configs.recommended = {
  plugins: {
    'react-suspense-check': plugin,
  },
  rules: {
    'react-suspense-check/detect-suspense-hook': 'warn',
  },
  // ③ (선택사항) 적용할 파일 확장자도 미리 지정해주면 사용자가 편함
  // 이걸 안 넣으면 모든 파일(.css, .json 등)을 다 찔러봐서 비효율적일 수 있음
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

module.exports = plugin;
