const SUSPENSE_APIS = new Set(['use', 'lazy']);

const PatternDetector = {
  isSuspenseTrigger(node, additionalTriggers = new Set()) {
    if (!node) return false;

    if (node.type === 'CallExpression') {
      const name = this.getCalleeName(node);

      if (!name) return false;
      if (/suspense/i.test(name)) return true;
      if (SUSPENSE_APIS.has(name) || additionalTriggers.has(name)) return true;

      return this.hasSuspenseOption(node);
    }

    return false;
  },

  getCalleeName(node) {
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
        if (
          (prop.key.name === 'suspense' || prop.key.value === 'suspense') &&
          prop.value.value === true
        )
          return true;
      });
    });
  },
};

export default PatternDetector;
