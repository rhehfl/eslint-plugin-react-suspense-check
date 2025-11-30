### 🧐 Why is this necessary?

React Suspense is powerful, but failing to wrap a component that is loading data in a parent `<Suspense>` boundary can cause the entire app to freeze or result in a white screen.

ESLint cannot verify if a `<Suspense>` boundary exists in the parent tree across different files. Therefore, this plugin **enforces naming conventions** to help developers recognize potential mistakes.

**Hook**: Hooks that trigger Suspense (throw a Promise) internally must start with useSuspense....

**Component**: Components using the above hooks must start with Suspense....

In short, it ensures that just by looking at the component name, you realize, "Ah, I need to wrap this in Suspense when using it!"

### 📦 Installation

```Bash
# npm
npm install --save-dev eslint-plugin-react-suspense-check
```

```Bash
# pnpm
pnpm add -D eslint-plugin-react-suspense-check
```

```Bash
# yarn
yarn add -D eslint-plugin-react-suspense-check
```

### ⚙️ Configuration

Add the following to your eslint.config.mjs (or .js) file.

```js
import suspensePlugin from 'eslint-plugin-react-suspense-check';

export default defineConfig([
  // ... other configs
  ...suspensePlugin.configs.recommended, // Apply recommended config

  //... other configs
]);
```

or

```js
import suspensePlugin from "eslint-plugin-react-suspense-check";

export default defineConfig([
  // ... other configs

   extends: [
      suspensePlugin.configs.recommended, // Apply recommended config
   ],
 //... other configs
]);
```

### 📏 Rules Description

Checks the names of hooks and components that trigger `Suspense`.

❌ Incorrect Examples

```ts
// 1. Hook naming violation
// Triggers Suspense but named like a normal hook
function useUserData() {
  throw promise;
}

// 2. Component naming violation
// Uses a Suspense hook but named like a normal component
function UserProfile() {
  const data = useSuspenseUser(); // <--- ⚠️ Warning: Change component name to 'SuspenseUserProfile'.
  return <div>{data.name}</div>;
}
```

✅ Correct Examples

```ts
// 1. Hook name starts with 'useSuspense'
function useSuspenseUserData() {
  throw promise;
}

// 2. Component name starts with 'Suspense'
// The caller can tell just by the name that <Suspense> is required.
function SuspenseUserProfile() {
  const data = useSuspenseUserData();
  return <div>{data.name}</div>;
}
```
