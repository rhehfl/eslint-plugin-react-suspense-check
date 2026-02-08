const detectSuspenseHook = require('./rules/detect-suspense-hook');

// 1. 플러그인 객체 기본 정의
const plugin = {
  meta: {
    name: 'eslint-plugin-react-suspense-check',
    version: '1.0.0',
  },
  rules: {
    'detect-suspense-hook': detectSuspenseHook,
  },
  configs: {}, // 일단 비워둠
};

// 2. Recommended 설정 정의 (Flat Config 호환)
// 핵심: 여기서 plugins에 'plugin' 변수(자기 자신)를 직접 넣어줍니다.
const recommendedConfig = {
  name: 'react-suspense-check/recommended', // (선택) 디버깅용 이름
  files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  plugins: {
    'react-suspense-check': plugin, // ⭐ 여기가 핵심! 자기 자신을 참조
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

module.exports = plugin;
