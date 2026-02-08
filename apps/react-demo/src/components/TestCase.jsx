import React, { use, memo, forwardRef } from 'react';
import { useSuspenseTimer } from '../hooks/useSuspenseTimer';

/**
 * [Mocks] 테스트를 위한 가상 라이브러리 함수들
 */
const externalPromise = new Promise(() => {});
const fakeFetcher = () => Promise.resolve('ok');
const useSWR = (k, f, o) => (o?.suspense ? useSuspenseTimer() : null);
const useQuery = (k, f, o) => (o?.suspense ? useSuspenseTimer() : null);
const useSuspenseQuery = () => useSuspenseTimer();

// =============================================================================
// 1. React 기본 API (use, React.use)
// =============================================================================

// ✅ Valid: React.use() 사용 및 올바른 네이밍
export function SuspenseReactUseExample() {
  const data = React.use(externalPromise);
  return <div>{data}</div>;
}

// ❌ Invalid: React.use()를 사용했으나 이름에 Suspense 누락
export function ReactUseExample() {
  const data = React.use(externalPromise); // 💥 에러 발생
  return <div>{data}</div>;
}

// =============================================================================
// 2. 라이브러리 옵션 패턴 (useSWR, TanStack Query)
// =============================================================================

// ✅ Valid: { suspense: true } 옵션 사용 및 네이밍 일치
export function SuspenseSwrComponent() {
  useSWR('todos', fakeFetcher, { suspense: true });
  return <div>SWR</div>;
}

// ❌ Invalid: suspense 옵션이 켜져 있으나 일반 컴포넌트 이름임
export function SwrComponent() {
  useSWR('todos', fakeFetcher, { suspense: true }); // 💥 에러 발생
  return <div>SWR</div>;
}

// ✅ Valid: TanStack Query v5의 전용 Suspense 훅 사용
export function SuspenseTanstackQuery() {
  useSuspenseQuery();
  return <div>TanStack</div>;
}

// ❌ Invalid: 전용 훅을 썼음에도 네이밍 규칙 위반
export function TanstackQuery() {
  useSuspenseQuery(); // 💥 에러 발생
  return <div>TanStack</div>;
}

// =============================================================================
// 3. HOC (Higher-Order Component) 패턴
// =============================================================================

// ✅ Valid: memo로 감싸진 컴포넌트 내부에서 Suspense 발생
export const SuspenseMemoComponent = memo(function () {
  useSuspenseTimer();
  return <div>Memo</div>;
});

// ❌ Invalid: memo 내부에서 Suspense가 발생하나 변수명이 일반적임
export const MemoComponent = memo(function a() {
  useSuspenseTimer(); // 💥 에러: 'SuspenseMemoComponent'로 변경 제안
  return <div>Memo</div>;
});

// ✅ Valid: forwardRef 패턴
export const SuspenseInput = forwardRef((props, ref) => {
  useSuspenseTimer();
  return <input ref={ref} />;
});

// =============================================================================
// 4. 커스텀 훅 체이닝 (Chain of Suspense)
// =============================================================================

// ✅ Valid: Suspense 훅을 호출하는 커스텀 훅은 useSuspense로 시작해야 함
export function useSuspenseWrapper() {
  return useSuspenseTimer();
}

// ❌ Invalid: 내부에서 Suspense가 전파되지만 이름은 일반 훅임
export function useWrapper() {
  return useSuspenseTimer(); // 💥 에러: 'useSuspenseWrapper'로 변경 제안
}

// =============================================================================
// 5. 엣지 케이스 (중첩 함수 및 인라인 렌더러)
// =============================================================================

// ❌ Invalid: 컴포넌트 내부의 중첩 함수에서 Suspense 발생 시
export function SuspenseNestedParent() {
  function Child() {
    useSuspenseTimer(); // 💥 에러: 'SuspenseChild'로 변경 제안
    return <p>child</p>;
  }
  return <Child />;
}

// ❌ Invalid: 익명 화살표 함수 컴포넌트
export const inlineRenderer = () => {
  useSuspenseTimer(); // 💥 에러 발생
  return <section>inline</section>;
};
