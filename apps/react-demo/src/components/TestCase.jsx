import { use, memo, forwardRef } from 'react';
import { useSuspenseTimer } from '../hooks/useSuspenseTimer';

// =============================================================================
// 1. React 'use' Hook 케이스
// =============================================================================

// ✅ [Valid] use()를 사용했고, 이름이 Suspense로 시작함
export function SuspenseUseExample({ dataPromise }) {
  if (dataPromise) {
    const data = use(dataPromise);
    return <div>{data}</div>;
  }
  return null;
}

// ❌ [Invalid] use()를 사용했지만, 이름이 일반 컴포넌트임
// 👉 에러 예상: "SuspenseWrongNameExample"로 변경 제안
export function WrongNameUseExample({ dataPromise }) {
  if (dataPromise) {
    const data = use(dataPromise); // 💥 여기서 에러 발생
    return <div>{data}</div>;
  }
  return null;
}

// =============================================================================
// 2. HOC (Higher-Order Component) - memo 케이스
// =============================================================================

// ✅ [Valid] memo로 감쌌고, 변수명이 Suspense로 시작함
export const SuspenseMemoComponent = memo(function () {
  useSuspenseTimer();
  return <div>Memoized Content</div>;
});

// ❌ [Invalid] memo로 감쌌지만, 변수명이 일반적임
// 👉 에러 예상: "MemoComponent" -> "SuspenseMemoComponent" 변경 제안
export const MemoComponent = memo(function () {
  useSuspenseTimer(); // 💥 여기서 에러 발생
  return <div>Memoized Content</div>;
});

// =============================================================================
// 3. HOC (Higher-Order Component) - forwardRef 케이스
// =============================================================================

// ✅ [Valid] forwardRef를 사용했고, 변수명이 Suspense로 시작함
export const SuspenseInput = forwardRef((props, ref) => {
  useSuspenseTimer();
  return <input ref={ref} />;
});

// ❌ [Invalid] forwardRef를 사용했지만, 변수명이 일반적임
// 👉 에러 예상: "InputComponent" -> "SuspenseInputComponent" 변경 제안
export const InputComponent = forwardRef((props, ref) => {
  useSuspenseTimer(); // 💥 여기서 에러 발생
  return <input ref={ref} />;
});

// =============================================================================
// 4. Custom Hook 체이닝 케이스
// =============================================================================

// ✅ [Valid] 내부에서 Suspense 훅을 쓰고, 자신도 useSuspense로 시작함
export function useSuspenseWrapper() {
  return useSuspenseTimer();
}

// ❌ [Invalid] 내부에서 Suspense 훅을 썼는데, 자신은 일반 훅 이름임
// 👉 에러 예상: "useWrapper" -> "useSuspenseWrapper" 변경 제안
export function useWrapper() {
  return useSuspenseTimer(); // 💥 여기서 에러 발생
}
