import PatternDetector from './utils/pattern-detector.js';
import ASTUtils from './utils/ast-utils.js';

const rule = {
  meta: {
    type: 'problem',
    docs: { description: 'Enforce Chain of Suspense naming convention' },
    messages: {
      suspenseNamingError_en:
        "The function '{{name}}' triggers Suspense. Ensure its name includes 'Suspense' or 'Boundary' to warn parent components.",
      suspenseNamingError_kr:
        "'{{name}}'에서 Suspense 트리거가 감지되었습니다. 상위에서 이를 인지할 수 있도록 이름에 'Suspense' 또는 'Boundary'를 포함하세요.",
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

    function check(node) {
      if (!PatternDetector.isSuspenseTrigger(node, additionalTriggers)) return;

      const parent = ASTUtils.findClosestContext(node);
      if (!parent) return;
      let funcName = ASTUtils.getFunctionName(parent);
      if (!funcName || funcName === 'DefaultExport') {
        const filename = context.getFilename();
        funcName = filename.split(/[\\/]/).pop().replace(/\..+$/, '');
      }

      const isSuspenseAware = /Suspense|Boundary/i.test(funcName);

      if (!isSuspenseAware) {
        const messageId =
          language === 'kr'
            ? 'suspenseNamingError_kr'
            : 'suspenseNamingError_en';

        context.report({
          node: parent.id || parent,
          messageId,
          data: { name: funcName },
        });
      }
    }

    return {
      CallExpression: check,
    };
  },
};
export default rule;
