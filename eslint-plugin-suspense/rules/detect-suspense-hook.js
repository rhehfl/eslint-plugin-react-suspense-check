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
      hookRenamingRequired_en:
        "🛑 This hook triggers Suspense internally. Rename it to start with 'useSuspense' to signal its behavior.\n(Suggested: {{ suggestedName }})",
      componentRenamingRequired_en:
        "🛑 This component uses a Suspense-triggering hook. Rename it to 'Suspense{{name}}' so callers know to wrap it in a <Suspense> boundary.",

      hookRenamingRequired_kr:
        "🛑 내부에서 Suspense를 유발하는 훅입니다. 이름을 'useSuspense'로 시작하게 변경하여 동작을 명시하세요.\n(추천 이름: {{ suggestedName }})",
      componentRenamingRequired_kr:
        "🛑 내부에서 Suspense 훅을 사용하는 컴포넌트입니다. 상위에서 <Suspense> 처리가 필요함을 알릴 수 있도록 이름을 'Suspense{{name}}' 형식으로 변경하세요.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          additionalTriggers: {
            type: 'array',
            items: { type: 'string' },
          },
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
    const additionalTriggers = new Set(configuration.additionalTriggers || []);
    const lang = configuration.language || 'en';

    function getFunctionName(funcNode) {
      if (funcNode.type === 'FunctionDeclaration' && funcNode.id) {
        return { name: funcNode.id.name, node: funcNode.id };
      }
      if (funcNode.parent.type === 'VariableDeclarator' && funcNode.parent.id) {
        return { name: funcNode.parent.id.name, node: funcNode.parent.id };
      }
      if (
        funcNode.parent.type === 'CallExpression' &&
        funcNode.parent.parent.type === 'VariableDeclarator' &&
        funcNode.parent.parent.id
      ) {
        return {
          name: funcNode.parent.parent.id.name,
          node: funcNode.parent.parent.id,
        };
      }
      return null;
    }

    return {
      CallExpression(node) {
        let hookName = null;
        if (node.callee.type === 'Identifier') {
          hookName = node.callee.name;
        } else if (node.callee.type === 'MemberExpression') {
          hookName = node.callee.property.name;
        }

        if (!hookName) return;

        const isSuspenseTrigger =
          hookName === 'use' ||
          hookName === 'lazy' ||
          (typeof hookName === 'string' && /^useSuspense/.test(hookName)) ||
          additionalTriggers.has(hookName);

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

        const functionInfo = getFunctionName(parent);
        if (!functionInfo) return;

        const { name: parentFunctionName, node: parentIdNode } = functionInfo;

        const isParentHook = /^use/.test(parentFunctionName);
        const isParentComponent = /^[A-Z]/.test(parentFunctionName);

        if (isParentHook) {
          if (/^useSuspense/.test(parentFunctionName)) return;

          const suggestedName = parentFunctionName.replace(
            /^use/,
            'useSuspense',
          );
          context.report({
            node: parentIdNode,
            messageId: `hookRenamingRequired_${lang}`,
            data: { suggestedName },
          });
        } else if (isParentComponent) {
          if (/^Suspense/.test(parentFunctionName)) return;

          context.report({
            node: parentIdNode,
            messageId: `componentRenamingRequired_${lang}`,
            data: { name: parentFunctionName },
          });
        }
      },
    };
  },
};
