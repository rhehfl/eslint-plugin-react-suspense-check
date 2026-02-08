let cachedPromise = null;
let isDone = false;

function startTimer() {
  if (!cachedPromise) {
    cachedPromise = new Promise((resolve) => {
      setTimeout(() => {
        isDone = true;
        resolve();
      }, 3000);
    });
  }
  return cachedPromise;
}

/**
 * 3초 동안 Suspense(로딩)를 유발하다가 완료되면 true를 반환하는 훅
 * (ESLint 테스트용 이름: useSuspense로 시작)
 */
export function useSuspenseTimer() {
  if (isDone) {
    return '3초 기다리기 성공!';
  }

  const promise = startTimer();
  throw promise;
}
