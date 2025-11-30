module.exports = {
  meta: {
    type: 'problem', // 코드의 로직 문제로 간주
    docs: {
      description:
        'Enforce naming conventions (Chain of Suspense) for hooks triggering Suspense',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      // [Case 1] 컴포넌트에서 사용할 때 경고
      suspenseTriggerDetected:
        "⚡️ '{{ hookName }}'은(는) Suspense를 유발합니다. 상위 트리에 <Suspense> 처리가 되어 있는지 확인하세요.",

      // [Case 2] 커스텀 훅 이름이 규칙을 어겼을 때 에러
      hookRenamingRequired:
        "🛑 내부에서 Suspense를 유발하는 훅을 사용 중입니다. 이 훅의 이름은 'useSuspense...'로 시작해야 합니다.\n(추천 이름: {{ suggestedName }})",
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        // 1. 호출된 함수 이름 확인
        const hookName = node.callee.name;
        // 감시 대상: 'use' (React 19), 'lazy', 또는 'useSuspense'로 시작하는 모든 훅
        const isSuspenseTrigger =
          hookName === 'use' ||
          hookName === 'lazy' || // React.lazy
          (typeof hookName === 'string' && /^useSuspense/.test(hookName));

        if (!isSuspenseTrigger) return;

        // 2. 현재 이 코드가 실행되는 '부모 함수' 찾기 (AST 트리 타고 올라가기)
        let parent = node.parent;
        while (parent) {
          if (
            parent.type === 'FunctionDeclaration' ||
            parent.type === 'ArrowFunctionExpression' ||
            parent.type === 'FunctionExpression'
          ) {
            break;
          }
          parent = parent.parent;
        }

        // 부모 함수가 없으면(전역 실행 등) 패스
        if (!parent) return;

        // 3. 부모 함수의 이름 추출하기
        let parentFunctionName = null;
        let parentIdNode = null;

        if (parent.type === 'FunctionDeclaration' && parent.id) {
          // function useMyHook() {}
          parentFunctionName = parent.id.name;
          parentIdNode = parent.id;
        } else if (
          parent.type === 'ArrowFunctionExpression' ||
          parent.type === 'FunctionExpression'
        ) {
          // const useMyHook = () => {}
          // 화살표 함수는 부모의 변수 선언부(VariableDeclarator)를 봐야 이름이 보임
          if (parent.parent.type === 'VariableDeclarator' && parent.parent.id) {
            parentFunctionName = parent.parent.id.name;
            parentIdNode = parent.parent.id;
          }
        }

        if (!parentFunctionName) return;

        // 4. 로직 분기: 부모가 '커스텀 훅'인가, '컴포넌트'인가?
        const isParentHook = /^use/.test(parentFunctionName);

        if (isParentHook) {
          // [Case A] 커스텀 훅 내부인 경우 -> 이름 검사 (Naming Convention)
          // 이미 이름이 useSuspense... 라면 통과
          if (/^useSuspense/.test(parentFunctionName)) return;

          // 아니면 에러 리포트 (이름 바꾸라고 강제)
          const suggestedName = parentFunctionName.replace(
            /^use/,
            'useSuspense'
          );
          context.report({
            node: parentIdNode, // 함수 이름에 빨간 줄
            messageId: 'hookRenamingRequired',
            data: {
              suggestedName,
            },
          });
        } else {
          // [Case B] 일반 컴포넌트(또는 일반 함수)인 경우 -> 사용 주의 경고
          // 훅이 아닌데(대문자로 시작하는 컴포넌트 등) Suspense 훅을 불렀다면 경고 대상
          const isSuspenseComponent = /^Suspense/.test(parentFunctionName); // 예: SuspenseUserProfile

          if (!isSuspenseComponent) {
            // 1. 이름이 규칙을 안 지켰으면 -> 컴포넌트 이름에 경고를 띄움 ("이름 바꾸세요!")
            context.report({
              node: parentIdNode, // 함수 이름 위치 (function UserProfile의 'UserProfile')
              message:
                "이 컴포넌트는 내부에서 Suspense를 유발합니다! 컴포넌트 이름을 'Suspense{{name}}' 형식으로 변경하여 호출자가 <Suspense >를 사용할 수 있도록 해주세요.",
              data: { name: parentFunctionName },
            });
          }
        }
      },
    };
  },
};
