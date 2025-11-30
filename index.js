// rules/detect-suspense-hook.js

module.exports = {
  meta: {
    type: 'problem', // 문제 유형 (problem, suggestion, layout)
    docs: {
      description: 'Detect usage of Suspense-triggering hooks',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      suspenseDetected:
        "⚠️ '{{ hookName }}'은 Suspense를 유발합니다. 상위 컴포넌트에 <Suspense>가 있는지 확인하세요.",
    },
    schema: [], // 옵션이 필요하면 여기에 정의
  },

  create(context) {
    return {
      // 함수 호출(CallExpression)을 만날 때마다 실행
      CallExpression(node) {
        // 1. 호출된 함수의 이름 가져오기
        const hookName = node.callee.name;

        // 2. 우리가 감시할 훅 목록 정의 (나중에 옵션으로 뺄 수도 있음)
        // 'useSuspense'로 시작하거나, React 'use', 'lazy' 등을 포함
        const isSuspenseHook =
          hookName === 'use' ||
          (typeof hookName === 'string' && hookName.startsWith('useSuspense'));

        if (isSuspenseHook) {
          // 3. 경고 메시지 리포트
          context.report({
            node: node,
            messageId: 'suspenseDetected',
            data: {
              hookName: hookName,
            },
          });
        }
      },
    };
  },
};
