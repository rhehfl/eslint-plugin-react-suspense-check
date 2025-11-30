import { Suspense } from 'react';
import { useSuspenseTimer } from './hooks/useSuspenseTimer';

// 데이터를 보여줄 컴포넌트
function SuspenseTimerComponent() {
  const message = useSuspenseTimer();

  return (
    <div style={{ padding: 20, background: '#d4edda', color: '#155724' }}>
      <h2>🎉 결과: {message}</h2>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Suspense 데모</h1>
      <hr />

      <Suspense
        fallback={
          <div style={{ padding: 20, background: '#f8d7da' }}>
            ⏳ 로딩중... (3초)
          </div>
        }
      >
        <SuspenseTimerComponent />
      </Suspense>
    </div>
  );
}
