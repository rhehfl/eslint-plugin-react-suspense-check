// packages/eslint-plugin-suspense/rules/suspense-naming.js

const messages = require('./utils/messages');
const {
  isSuspensePattern,
  extractHookName,
  isHookName,
  isComponentName,
  isHOCName,
  hasCorrectSuspenseHookNaming,
  hasCorrectSuspenseComponentNaming,
  hasCorrectSuspenseHOCNaming,
  suggestHookName,
  suggestHOCName,
} = require('./utils/pattern-detector');
const {
  getFunctionIdentifier,
  findParentFunction,
  findHOCFunction,
} = require('./utils/ast-helpers');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce naming conventions (Chain of Suspense) for hooks triggering Suspense',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/rhehfl/eslint-plugin-react-suspense-check#readme',
    },
    messages: {
      hookRenamingRequired_en: messages.en.hookRenamingRequired,
      componentRenamingRequired_en: messages.en.componentRenamingRequired,
      hocRenamingRequired_en: messages.en.hocRenamingRequired,
      hookRenamingRequired_kr: messages.kr.hookRenamingRequired,
      componentRenamingRequired_kr: messages.kr.componentRenamingRequired,
      hocRenamingRequired_kr: messages.kr.hocRenamingRequired,
    },
    schema: [
      {
        type: 'object',
        properties: {
          additionalTriggers: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional hook names that trigger Suspense',
          },
          language: {
            type: 'string',
            enum: ['en', 'kr'],
            description: 'Language for error messages',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalTriggers = new Set(options.additionalTriggers || []);
    const language = options.language || 'en';

    return {
      CallExpression(node) {
        const hookName = extractHookName(node);
        if (!hookName) return;

        if (!isSuspensePattern({ hookName, node, additionalTriggers })) {
          return;
        }

        const hocFunction = findHOCFunction(node);
        if (hocFunction) {
          const hocIdentifier = getFunctionIdentifier(hocFunction);
          if (hocIdentifier) {
            const { name: hocName, node: hocIdNode } = hocIdentifier;

            if (hasCorrectSuspenseHOCNaming(hocName)) return;

            context.report({
              node: hocIdNode,
              messageId: `hocRenamingRequired_${language}`,
              data: {
                suggestedName: suggestHOCName(hocName),
              },
            });
            return;
          }
        }

        const parentFunction = findParentFunction(node);
        if (!parentFunction) return;

        const functionIdentifier = getFunctionIdentifier(parentFunction);
        if (!functionIdentifier) return;

        const { name: parentName, node: parentIdNode } = functionIdentifier;

        if (isHookName(parentName)) {
          if (hasCorrectSuspenseHookNaming(parentName)) return;

          context.report({
            node: parentIdNode,
            messageId: `hookRenamingRequired_${language}`,
            data: {
              suggestedName: suggestHookName(parentName),
            },
          });
        } else if (isComponentName(parentName)) {
          if (hasCorrectSuspenseComponentNaming(parentName)) return;

          context.report({
            node: parentIdNode,
            messageId: `componentRenamingRequired_${language}`,
            data: {
              name: parentName,
            },
          });
        }
      },
    };
  },
};
