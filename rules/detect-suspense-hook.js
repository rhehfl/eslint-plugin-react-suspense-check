const PatternDetector = require('./utils/pattern-detector');
const ASTHelpers = require('./utils/ast-helpers');
const messages = require('./utils/messages');

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce Chain of Suspense naming convention' },
    messages: {
      hookError_en: messages.en.hookRenamingRequired,
      hookError_kr: messages.kr.hookRenamingRequired,
      compError_en: messages.en.componentRenamingRequired,
      compError_kr: messages.kr.componentRenamingRequired,
      hocError_en: messages.en.hocRenamingRequired,
      hocError_kr: messages.kr.hocRenamingRequired,
    },
    schema: [
      {
        type: 'object',
        properties: {
          additionalTriggers: { type: 'array' },
          language: { type: 'string' },
        },
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const additionalTriggers = new Set(options.additionalTriggers || []);
    const language = options.language || 'en';

    console.log('[SuspenseCheck] Rule Initialized');

    function check(node) {
      if (!PatternDetector.isSuspenseTrigger(node, additionalTriggers)) return;

      console.log('[SuspenseCheck] Trigger Detected:', node.type);

      const { functionNode, hocNode } = ASTHelpers.getOwnerInfo(node);

      if (hocNode) {
        const id = ASTHelpers.getIdentifier(hocNode);
        if (id && !/^withSuspense/.test(id.name)) {
          context.report({
            node: id,
            messageId: `hocError_${language}`,
            data: { suggestedName: id.name.replace(/^with/, 'withSuspense') },
          });
          return;
        }
      }

      const id = ASTHelpers.getIdentifier(functionNode);
      if (!id) return;

      const name = id.name;
      if (/^use/.test(name)) {
        if (!/^useSuspense/.test(name)) {
          context.report({
            node: id,
            messageId: `hookError_${language}`,
            data: { suggestedName: name.replace(/^use/, 'useSuspense') },
          });
        }
      } else if (/^[A-Z]/.test(name)) {
        if (!/^Suspense/.test(name)) {
          context.report({
            node: id,
            messageId: `compError_${language}`,
            data: { name },
          });
        }
      }
    }

    return {
      CallExpression: check,
      ThrowStatement: check,
    };
  },
};
