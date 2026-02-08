const SUSPENSE_APIS = new Set(['use', 'lazy']);
const KNOWN_SUSPENSE_HOOKS = new Set([
  'useSuspenseQuery',
  'useSuspenseInfiniteQuery',
]);

const PatternDetector = {
  isSuspenseTrigger(node, additionalTriggers = new Set()) {
    if (!node) return false;

    if (node.type === 'CallExpression') {
      const name = this.extractName(node);

      if (!name) return false;
      if (/suspense/i.test(name)) return true;
      if (
        SUSPENSE_APIS.has(name) ||
        KNOWN_SUSPENSE_HOOKS.has(name) ||
        additionalTriggers.has(name)
      )
        return true;

      return this.hasSuspenseOption(node);
    }

    return false;
  },

  // 훅/함수 이름 추출 (MemberExpression 대응)
  extractName(node) {
    if (node.callee?.type === 'Identifier') return node.callee.name;
    if (node.callee?.type === 'MemberExpression')
      return node.callee.property.name;
    return null;
  },

  hasSuspenseOption(node) {
    if (!node.arguments || node.arguments.length === 0) return false;

    return node.arguments.some((arg) => {
      if (arg.type !== 'ObjectExpression') return false;

      return arg.properties.some((prop) => {
        if (prop.type !== 'Property') return false;

        const keyName =
          prop.key.type === 'Identifier' ? prop.key.name : prop.key.value;
        if (keyName !== 'suspense') return false;

        if (prop.value.type === 'Literal' && prop.value.value === true) {
          return true;
        }

        if (
          prop.shorthand &&
          prop.value.type === 'Identifier' &&
          prop.value.name === 'suspense'
        ) {
          return true;
        }

        if (
          prop.value.type === 'Identifier' &&
          /suspense/i.test(prop.value.name)
        ) {
          return true;
        }

        return false;
      });
    });
  },
};

module.exports = PatternDetector;
