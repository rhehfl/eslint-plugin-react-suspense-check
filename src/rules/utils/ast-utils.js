const ASTUtils = {
  findClosestContext(node) {
    let parent = node.parent;
    while (parent) {
      if (/Function|Method|ClassDeclaration/.test(parent.type)) {
        return parent;
      }
      if (parent.type === 'Program') return null;

      parent = parent.parent;
    }
    return null;
  },

  getFunctionName(node) {
    if (!node) return null;

    if (node.id && node.id.name) {
      return node.id.name;
    }

    let current = node.parent;

    if (current && current.type === 'CallExpression') {
      current = current.parent;
    }

    if (
      current &&
      current.type === 'VariableDeclarator' &&
      current.id.type === 'Identifier'
    ) {
      return current.id.name;
    }

    if (
      current &&
      current.type === 'Property' &&
      current.key.type === 'Identifier'
    ) {
      return current.key.name;
    }

    if (current && current.type === 'ExportDefaultDeclaration') {
      return 'DefaultExport';
    }

    return null;
  },
};

export default ASTUtils;
