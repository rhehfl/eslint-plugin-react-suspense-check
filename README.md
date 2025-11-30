# eslint-plugin-react-suspense-check

![npm](https://img.shields.io/npm/v/eslint-plugin-react-suspense-check)
![license](https://img.shields.io/npm/l/eslint-plugin-react-suspense-check)
![downloads](https://img.shields.io/npm/dt/eslint-plugin-react-suspense-check)

> **Prevent React Suspense runtime errors by enforcing safe naming conventions.**

[🇰🇷 한국어 설명 (Korean Docs)](./README.ko.md)

## 🧐 Why?

React Suspense is powerful, but if a component suspends without a parent `<Suspense>` boundary, your entire app can crash (White Screen).

Since ESLint cannot check the component tree across files, this plugin uses **"Naming Conventions"** to prevent mistakes:

1.  **Hooks**: Hooks that trigger Suspense must start with `useSuspense...`.
2.  **Components**: Components that call these hooks must start with `Suspense...`.

This signals to the developer: *"This component requires a Suspense boundary!"*

## 📦 Installation

```bash
# npm
npm install --save-dev eslint-plugin-react-suspense-check

# pnpm
pnpm add -D eslint-plugin-react-suspense-check

# yarn
yarn add -D eslint-plugin-react-suspense-check
⚙️ Configuration
Flat Config (ESLint v9+, Recommended)
Add this to your eslint.config.mjs (or .js):

JavaScript

import suspensePlugin from "eslint-plugin-react-suspense-check";

export default [
  // ... other configs
  suspensePlugin.configs.recommended,
];
Legacy Config (.eslintrc)
JSON

{
  "extends": [
    "plugin:react-suspense-check/recommended"
  ]
}
📏 Rules
detect-suspense-hook
Enforces naming conventions for hooks and components involving Suspense.

❌ Incorrect
TypeScript

// 1. Hook Naming Violation
// Triggers Suspense but named like a normal hook.
function useUserData() {
  throw promise;
}

// 2. Component Naming Violation
// Uses a Suspense hook but named like a normal component.
function UserProfile() {
  const data = useSuspenseUser(); // <--- ⚠️ Warning: Rename component to 'SuspenseUserProfile'
  return <div>{data.name}</div>;
}
✅ Correct
TypeScript

// 1. Hook starts with 'useSuspense'
function useSuspenseUserData() {
  throw promise;
}

// 2. Component starts with 'Suspense'
// Now the caller knows it needs a <Suspense> boundary.
function SuspenseUserProfile() {
  const data = useSuspenseUserData();
  return <div>{data.name}</div>;
}

// Usage
<Suspense fallback={<Skeleton />}>
  <SuspenseUserProfile />
</Suspense>
🌍 Language Options
You can switch the error message language to Korean. (Default is English)

Korean Setting:

JavaScript

// eslint.config.mjs
export default [
  {
    plugins: { "react-suspense-check": suspensePlugin },
    rules: {
      "react-suspense-check/detect-suspense-hook": ["warn", { "language": "kr" }]
    }
  }
];
📝 License
MIT


---

### 2. 🇰🇷 한국어 - `README.ko.md`

한국 개발자들을 위한 친절한 설명서입니다.

```markdown
# eslint-plugin-react-suspense-check 🇰🇷

> **React Suspense 런타임 에러를 네이밍 규칙(Naming Convention)으로 예방하세요.**

[🇺🇸 English Docs](./README.md)

## 🧐 왜 필요한가요?

React Suspense는 강력하지만, 데이터 로딩 중인 컴포넌트를 상위 `<Suspense>`로 감싸지 않으면 **앱 전체가 멈추거나 하얀 화면(White Screen)**이 될 수 있습니다.

ESLint는 파일 건너편의 상위 트리에 `<Suspense>`가 있는지 확인할 수 없습니다. 그래서 이 플러그인은 **"이름 짓기 규칙"**을 강제하여 개발자가 실수를 인지하도록 돕습니다.

1.  **훅(Hook)**: 내부에서 Suspense를 유발(Promise throw)하는 훅은 반드시 **`useSuspense...`** 로 시작해야 합니다.
2.  **컴포넌트**: 위 훅을 사용하는 컴포넌트는 반드시 **`Suspense...`** 로 시작해야 합니다.

즉, 컴포넌트 이름만 봐도 *"아, 이건 쓸 때 Suspense로 감싸줘야 하는구나!"* 라고 알 수 있게 만드는 것입니다.

## 📦 설치

```bash
# npm
npm install --save-dev eslint-plugin-react-suspense-check

# pnpm
pnpm add -D eslint-plugin-react-suspense-check

# yarn
yarn add -D eslint-plugin-react-suspense-check
⚙️ 설정 방법
Flat Config (ESLint v9+, 권장)
eslint.config.mjs (또는 .js) 파일에 아래 내용을 추가하세요.

JavaScript

import suspensePlugin from "eslint-plugin-react-suspense-check";

export default [
  // ... 다른 설정들
  suspensePlugin.configs.recommended, // 추천 설정 적용 (기본값: warn)
];
Legacy Config (.eslintrc)
JSON

{
  "extends": [
    "plugin:react-suspense-check/recommended"
  ]
}
📏 규칙 설명
detect-suspense-hook
Suspense를 유발하는 훅과 컴포넌트의 이름을 검사합니다.

❌ 잘못된 예시
TypeScript

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
✅ 올바른 예시
TypeScript

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

// 사용처
<Suspense fallback={<Skeleton />}>
  <SuspenseUserProfile />
</Suspense>
🌍 언어 설정 (한글 지원)
에러 메시지를 한국어로 보고 싶다면 옵션을 설정할 수 있습니다. (기본값은 영어)

한국어 설정 예시:

JavaScript

// eslint.config.mjs
export default [
  {
    plugins: { "react-suspense-check": suspensePlugin },
    rules: {
      "react-suspense-check/detect-suspense-hook": ["warn", { "language": "kr" }]
    }
  }
];
📝 라이선스
MIT


---

### ✅ 적용 방법

1.  `packages/eslint-plugin-suspense/` 폴더 안에 `README.md` 파일을 생성하고 **1번 내용**을 붙여넣으세요.
2.  같은 폴더에 `README.ko.md` 파일을 생성하고 **2번 내용**을 붙여넣으세요.
3.  저장 후 `git add .`, `git commit`, `git push` 하시면 깃허브에 아주 예쁘게 올라갈 겁니다
