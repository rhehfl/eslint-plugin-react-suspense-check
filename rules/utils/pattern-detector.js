const SUSPENSE_APIS = new Set(['use', 'lazy']);
const KNOWN_SUSPENSE_HOOKS = new Set(['''useSuspenseQuery', 'useSuspenseInfiniteQuery']);

const PatternDetector = {
  isSuspenseTrigger(node, additionalTriggers = new Set()) {
    if (!node) return false;

    if (node.type === 'CallExpression') {
      const name = this.extractName(node);
      if (!name) return false;
      if (/suspense/i.test(name)) return true;
      if (SUSPENSE_APIS.has(name) || KNOWN_SUSPENSE_HOOKS.has(name) || additionalTriggers.has(name)) return true;

      return this.hasSuspenseOption(node);
    }

    if (node.type === 'ThrowStatement') {
      const arg = node.argument;
      if (!arg) return false;
      return (
        (arg.type === 'NewExpression' && arg.callee.name === 'Promise') || // throw new Promise()
        (arg.type === 'Identifier' && /promise/i.test(arg.name)) ||        // throw promiseVar
        (arg.type === 'CallExpression' && /fetch|request/i.test(this.extractName(arg) || '')) // throw fetch()
      );
    }

    return false;
  },

  // 훅/함수 이름 추출 (MemberExpression 대응)
  extractName(node) {
    if (node.callee?.type === 'Identifier') return node.callee.name;
    if (node.callee?.type === 'MemberExpression') return node.callee.property.name;
    return null;
  },

  // 모든 인자에서 { suspense: true } 탐색
  hasSuspenseOption(node) {
    return node.arguments?.some(arg => {
      if (arg.type !== 'ObjectExpression') return false;
      return arg.properties.some(p => 
        (p.key?.name === 'suspense' || p.key?.value === 'suspense') && p.value?.value === true
      );
    }) ?? false;
  }
};

module.exports = PatternDetector;