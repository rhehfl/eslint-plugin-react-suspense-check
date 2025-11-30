### 🇰🇷 한국어

한국 개발자들을 위한 설명서입니다.

# eslint-plugin-react-suspense-check 🇰🇷

> **React Suspense** 런타임 에러를 네이밍 규칙(Naming Convention)으로 예방하세요.

[🇺🇸 English Docs](./README.md)

## 🧐 왜 필요한가요?

React Suspense는 강력하지만, 데이터 로딩 중인 컴포넌트를 상위 `<Suspense>`로 감싸지 않으면 **앱 전체가 멈추거나 하얀 화면**이 될 수 있습니다.

ESLint는 파일 건너편의 상위 트리에 `<Suspense>`가 있는지 확인할 수 없습니다. 그래서 이 플러그인은 **이름 짓기 규칙**을 강제하여 개발자가 실수를 인지하도록 돕습니다.

1.  **훅(Hook)**: 내부에서 Suspense를 유발(Promise throw)하는 훅은 반드시 **`useSuspense...`** 로 시작해야 합니다.
2.  **컴포넌트**: 위 훅을 사용하는 컴포넌트는 반드시 **`Suspense...`** 로 시작해야 합니다.

즉, 컴포넌트 이름만 봐도 _"아, 이건 쓸 때 Suspense로 감싸줘야 하는구나!"_ 라고 알 수 있게 만드는 것입니다.

## 📦 설치

```bash
# npm
npm install --save-dev eslint-plugin-react-suspense-check
```

```bash
# pnpm
pnpm add -D eslint-plugin-react-suspense-check
```

```bash
# yarn
yarn add -D eslint-plugin-react-suspense-check
```

### ⚙️ 설정 방법

eslint.config.mjs (또는 .js) 파일에 아래 내용을 추가하세요.

```JavaScript

import suspensePlugin from "eslint-plugin-react-suspense-check";

export default defineConfig([
  // ... 다른 설정들
  ...suspensePlugin.configs.recommended,// 추천 설정 적용

 //... 다른 설정들
]);
```

or

```JavaScript

import suspensePlugin from "eslint-plugin-react-suspense-check";

export default defineConfig([
  // ... 다른 설정들

   extends: [
      suspensePlugin.configs.recommended, // 추천 설정 적용
   ],
 //... 다른 설정들
]);
```

### 📏 규칙 설명

`Suspense` 를 유발하는 훅과 컴포넌트의 이름을 검사합니다.

❌ 잘못된 예시

```ts
// 1. 훅 이름 위반
// Suspense를 유발하는데 일반 훅처럼 이름을 지음
function useUserData() {
  throw promise;
}

// 2. 컴포넌트 이름 위반
// Suspense 훅을 사용하는데 일반 컴포넌트처럼 이름을 지음
function UserProfile() {
  const data = useSuspenseUser(); // <--- ⚠️ 경고: 컴포넌트 이름을 'SuspenseUserProfile'로 변경하세요.
  return <div>{data.name}</div>;
}
```

✅ 올바른 예시

```ts
// 1. 훅 이름이 'useSuspense'로 시작함
function useSuspenseUserData() {
  throw promise;
}

// 2. 컴포넌트 이름이 'Suspense'로 시작함
// 호출하는 사람이 <Suspense>가 필요하다는 것을 이름만 보고 알 수 있음.
function SuspenseUserProfile() {
  const data = useSuspenseUserData();
  return <div>{data.name}</div>;
}
```

### 🌍 언어 설정 (한글 지원)

에러 메시지를 한국어로 보고 싶다면 옵션을 설정할 수 있습니다. (기본값은 영어)

한국어 설정 예시:

```ts
// eslint.config.mjs
export default [
  {
    //...
    rules: {
      'react-suspense-check/detect-suspense-hook': ['warn', { language: 'kr' }],
    },
  },
];
```
