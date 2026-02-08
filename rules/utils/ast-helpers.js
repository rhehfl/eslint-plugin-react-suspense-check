function getFunctionIdentifier(funcNode) {
  if (funcNode.type === 'FunctionDeclaration' && funcNode.id) {
    return {
      name: funcNode.id.name,
      node: funcNode.id,
    };
  }
  if (funcNode.parent?.type === 'VariableDeclarator' && funcNode.parent.id) {
    return {
      name: funcNode.parent.id.name,
      node: funcNode.parent.id,
    };
  }
  if (
    funcNode.parent?.type === 'CallExpression' &&
    funcNode.parent.parent?.type === 'VariableDeclarator' &&
    funcNode.parent.parent.id
  ) {
    return {
      name: funcNode.parent.parent.id.name,
      node: funcNode.parent.parent.id,
    };
  }

  return null;
}

function findParentFunction(node) {
  let parent = node.parent;

  while (parent) {
    if (
      parent.type === 'FunctionDeclaration' ||
      parent.type === 'ArrowFunctionExpression' ||
      parent.type === 'FunctionExpression'
    ) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
}

/**
 * ✨ HOC 패턴 감지 - 반환되는 내부 함수 찾기
 * HOC 구조: function withX(Component) { return function Inner() { ... } }
 *
 * @param {Node} node - CallExpression 노드
 * @returns {Node|null} - HOC의 최상위 함수 노드
 */
function findHOCFunction(node) {
  let parent = node.parent;
  let innerFunction = null;

  while (parent) {
    if (
      parent.type === 'FunctionDeclaration' ||
      parent.type === 'ArrowFunctionExpression' ||
      parent.type === 'FunctionExpression'
    ) {
      innerFunction = parent;
      break;
    }
    parent = parent.parent;
  }

  if (!innerFunction) return null;

  let hocCandidate = innerFunction.parent;

  while (hocCandidate) {
    if (hocCandidate.type === 'ReturnStatement') {
      hocCandidate = hocCandidate.parent;
      continue;
    }

    if (hocCandidate.type === 'BlockStatement') {
      hocCandidate = hocCandidate.parent;
      continue;
    }
    if (
      hocCandidate.type === 'FunctionDeclaration' ||
      hocCandidate.type === 'ArrowFunctionExpression' ||
      hocCandidate.type === 'FunctionExpression'
    ) {
      const identifier = getFunctionIdentifier(hocCandidate);
      if (identifier && /^with[A-Z]/.test(identifier.name)) {
        return hocCandidate;
      }
    }

    hocCandidate = hocCandidate.parent;
  }

  return null;
}

function containsJSX(node) {
  let found = false;

  function traverse(n) {
    if (!n || found) return;

    if (n.type === 'JSXElement' || n.type === 'JSXFragment') {
      found = true;
      return;
    }

    for (const key in n) {
      if (n[key] && typeof n[key] === 'object') {
        if (Array.isArray(n[key])) {
          n[key].forEach(traverse);
        } else {
          traverse(n[key]);
        }
      }
    }
  }

  traverse(node);
  return found;
}

module.exports = {
  getFunctionIdentifier,
  findParentFunction,
  findHOCFunction,
  containsJSX,
};
