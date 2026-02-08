const ASTHelpers = {
  getOwnerInfo(node) {
    let parent = node.parent;
    let info = {
      functionNode: null,
      hocNode: null,
    };

    while (parent) {
      if (this.isHOC(parent)) {
        info.hocNode = parent;
      }

      if (
        !info.functionNode &&
        (parent.type === 'FunctionDeclaration' ||
          parent.type === 'FunctionExpression' ||
          parent.type === 'ArrowFunctionExpression')
      ) {
        info.functionNode = parent;
      }

      parent = parent.parent;
    }
    return info;
  },

  isHOC(node) {
    const id = node.id || (node.type === 'VariableDeclarator' ? node.id : null);
    return id && /^with[A-Z]/.test(id.name);
  },

  getIdentifier(node) {
    if (!node) return null;
    if (node.parent.type === 'VariableDeclarator') return node.parent.id;
    return null;
  },
};

module.exports = ASTHelpers;
