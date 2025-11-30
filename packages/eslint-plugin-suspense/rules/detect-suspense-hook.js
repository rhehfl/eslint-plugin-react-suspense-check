module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce naming conventions (Chain of Suspense) for hooks triggering Suspense',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      // [Case 1] 훅 이름 변경 필요
      hookRenamingRequired_en:
        "🛑 This hook triggers Suspense internally. Rename it to start with 'useSuspense' to signal its behavior.\n(Suggested: {{ suggestedName }})",
      hookRenamingRequired_kr:
        "🛑 내부에서 Suspense를 유발하는 훅입니다. 이름을 'useSuspense'로 시작하게 변경하여 동작을 명시하세요.\n(추천 이름: {{ suggestedName }})",

      // [Case 2] 컴포넌트 이름 변경 필요
      componentRenamingRequired_en:
        "🛑 This component uses a Suspense-triggering hook. Rename it to 'Suspense{{name}}' so callers know to wrap it in a <Suspense> boundary.",
      componentRenamingRequired_kr:
        "🛑 내부에서 Suspense 훅을 사용하는 컴포넌트입니다. 상위에서 <Suspense> 처리가 필요함을 알릴 수 있도록 이름을 'Suspense{{name}}' 형식으로 변경하세요.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            enum: ['en', 'kr'],
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const lang = configuration.language || 'en';
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
            parent.type === 'FunctionDeclaration' ||
            parent.type === 'ArrowFunctionExpression' ||
            parent.type === 'FunctionExpression'
          ) {
            break;
          }
          parent = parent.parent;
        }

        if (!parent) return;

        let parentFunctionName = null;
        let parentIdNode = null;

        if (parent.type === 'FunctionDeclaration' && parent.id) {
          parentFunctionName = parent.id.name;
          parentIdNode = parent.id;
        } else if (
          parent.type === 'ArrowFunctionExpression' ||
          parent.type === 'FunctionExpression'
        ) {
          if (parent.parent.type === 'VariableDeclarator' && parent.parent.id) {
            parentFunctionName = parent.parent.id.name;
            parentIdNode = parent.parent.id;
          }
        }

        if (!parentFunctionName) return;

        const isParentHook = /^use/.test(parentFunctionName);

        if (isParentHook) {
          if (/^useSuspense/.test(parentFunctionName)) return;

          const suggestedName = parentFunctionName.replace(
            /^use/,
            'useSuspense'
          );
          context.report({
            node: parentIdNode,
            messageId: `hookRenamingRequired_${lang}`,
            data: {
              suggestedName,
            },
          });
        } else {
          const isSuspenseComponent = /^Suspense/.test(parentFunctionName);

          if (!isSuspenseComponent) {
            context.report({
              node: parentIdNode,
              messageId: `componentRenamingRequired_${lang}`,
            });
          }
        }
      },
    };
  },
};
