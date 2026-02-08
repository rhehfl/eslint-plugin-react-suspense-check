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

    // 1. 이름이 명시된 함수 선언 (function MyComp() {})
    if (node.id && node.id.name) {
      return node.id.name;
    }

    // ⭐ 여기서 변수를 선언해야 에러가 안 납니다!
    let current = node.parent;

    // 2. HOC(memo, forwardRef) 대응: 부모가 호출문이면 한 단계 더 위로
    if (current && current.type === 'CallExpression') {
      current = current.parent;
    }

    // 3. 변수 할당형 (const MyComp = ...)
    if (
      current &&
      current.type === 'VariableDeclarator' &&
      current.id.type === 'Identifier'
    ) {
      return current.id.name;
    }

    // 4. 객체 속성형 ({ MyComp: () => {} })
    if (
      current &&
      current.type === 'Property' &&
      current.key.type === 'Identifier'
    ) {
      return current.key.name;
    }

    // 5. 익명 Export Default
    if (current && current.type === 'ExportDefaultDeclaration') {
      return 'DefaultExport';
    }

    return null;
  },
};

export default ASTUtils;
