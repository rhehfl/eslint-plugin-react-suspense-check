import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import suspensePlugin from 'eslint-plugin-react-suspense-check';

export default defineConfig([
  // 1. 전역 무시 파일 설정
  globalIgnores(['dist']),

  // 2. 기본 추천 설정들 (extends 대신 배열에 직접 나열)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,

  // 3. 우리가 만든 플러그인 추천 설정
  // (여기서 plugins 등록과 기본 규칙이 로드됩니다)
  suspensePlugin.configs.recommended,

  // 4. 사용자 커스텀 설정 (여기서 덮어쓰기)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // 추가로 필요한 플러그인 등록
    plugins: {
      'react-refresh': reactRefresh,
    },

    // 규칙 커스터마이징
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ✨ 한국어 옵션 적용 (맨 아래에 적어야 덮어씌워짐)
      'react-suspense-check/detect-suspense-hook': ['warn', { language: 'kr' }],
    },
  },
]);
