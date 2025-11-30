// test-rule.js
const { RuleTester } = require('eslint');

// ---------------------------------------------------------
// 1. 우리가 만든 룰 로직 (여기에 그대로 붙여넣기)
// ---------------------------------------------------------
const rule = {
  meta: {
    type: 'problem',
    messages: {
      suspenseTriggerDetected: '⚡️ Suspense 유발!',
      hookRenamingRequired: '🛑 이름 바꿔! (제안: {{ suggestedName }})',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const hookName = node.callee.name;
        const isSuspenseTrigger =
          hookName === 'use' ||
          hookName === 'lazy' ||
          (typeof hookName === 'string' && /^useSuspense/.test(hookName));

        if (!isSuspenseTrigger) return;

        let parent = node.parent;
        while (parent) {
          if (
            [
              'FunctionDeclaration',
              'ArrowFunctionExpression',
              'FunctionExpression',
            ].includes(parent.type)
          )
            break;
          parent = parent.parent;
        }
        if (!parent) return;

        let parentName = null;
        if (parent.type === 'FunctionDeclaration' && parent.id)
          parentName = parent.id.name;
        else if (
          parent.parent.type === 'VariableDeclarator' &&
          parent.parent.id
        )
          parentName = parent.parent.id.name;

        if (!parentName) return;

        const isParentHook = /^use/.test(parentName);

        if (isParentHook) {
          if (/^useSuspense/.test(parentName)) return; // 통과
          const suggestedName = parentName.replace(/^use/, 'useSuspense');
          context.report({
            node: parent.id || parent.parent.id,
            messageId: 'hookRenamingRequired',
            data: { suggestedName },
          });
        } else {
          context.report({
            node: node,
            messageId: 'suspenseTriggerDetected',
          });
        }
      },
    };
  },
};

// ---------------------------------------------------------
// 2. 테스트 실행기 설정
// ---------------------------------------------------------
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // 👈 핵심: JSX 문법(<div /> 등)을 허용한다고 설정!
      },
    },
  },
});

console.log('🚀 테스트 시작...');

ruleTester.run('detect-suspense-hook', rule, {
  // ✅ 통과해야 하는 코드들 (Valid)
  valid: [
    {
      code: `
        function useSuspenseUser() {
          return useSuspenseQuery(options);
        }
      `,
    },
    {
      code: `
        const useSuspenseData = () => {
          const data = use(Promise.resolve());
          return data;
        }
      `,
    },
  ],

  // ❌ 에러가 나야 하는 코드들 (Invalid)
  invalid: [
    {
      // Case A: 커스텀 훅 이름이 잘못됨
      code: `
        function useUser() {
          return useSuspenseQuery(options);
        }
      `,
      errors: [{ messageId: 'hookRenamingRequired' }],
    },
    {
      // Case B: 컴포넌트에서 직접 사용
      code: `
        function UserProfile() {
          const data = useSuspenseQuery(options);
          return <div>{data}</div>;
        }
      `,
      errors: [{ messageId: 'suspenseTriggerDetected' }],
    },
  ],
});

console.log('✅ 모든 테스트 통과! 로직이 정상입니다.');
