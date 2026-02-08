const PatternDetector = require('./utils/pattern-detector');
const ASTHelpers = require('./utils/ast-helpers');
const messages = require('./utils/messages');

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce Chain of Suspense naming convention' },
    messages: {
      hookError: messages.kr.hookRenamingRequired,
      compError: messages.kr.componentRenamingRequired,
      hocError: messages.kr.hocRenamingRequired,
    },
    schema: [
      { type: 'object', properties: { additionalTriggers: { type: 'array' } } },
    ],
  },

  create(context) {
    const additionalTriggers = new Set(
      context.options[0]?.additionalTriggers || [],
    );

    function check(node) {
      if (!PatternDetector.isSuspenseTrigger(node, additionalTriggers)) return;
      const { functionNode, hocNode } = ASTHelpers.getOwnerInfo(node);

      if (hocNode) {
        const id = ASTHelpers.getIdentifier(hocNode);
        if (id && !/^withSuspense/.test(id.name)) {
          context.report({
            node: id,
            messageId: 'hocError',
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
            messageId: 'hookError',
            data: { suggestedName: name.replace(/^use/, 'useSuspense') },
          });
        }
      } else if (/^[A-Z]/.test(name)) {
        if (!/^Suspense/.test(name)) {
          context.report({ node: id, messageId: 'compError', data: { name } });
        }
      }
    }

    return {
      CallExpression: check,
      ThrowStatement: check,
    };
  },
};
