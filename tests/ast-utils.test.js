import { describe, it, expect } from 'vitest';
import ASTUtils from '../rules/utils/ast-utils.js';

describe('ASTUtils 단위 테스트', () => {
  describe('getFunctionName', () => {
    it('일반 함수 선언식의 이름을 반환해야 함', () => {
      const node = { id: { name: 'MyComponent' }, type: 'FunctionDeclaration' };
      expect(ASTUtils.getFunctionName(node)).toBe('MyComponent');
    });

    it('변수에 할당된 화살표 함수의 이름을 반환해야 함', () => {
      const node = {
        type: 'ArrowFunctionExpression',
        parent: {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'ArrowComp' },
        },
      };
      expect(ASTUtils.getFunctionName(node)).toBe('ArrowComp');
    });

    it('memo로 감싸진 HOC의 이름을 반환해야 함', () => {
      const node = { type: 'ArrowFunctionExpression' };
      const callExpr = {
        type: 'CallExpression',
        callee: { name: 'memo' },
        parent: {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'MyMemo' },
        },
      };
      node.parent = callExpr;
      expect(ASTUtils.getFunctionName(node)).toBe('MyMemo');
    });

    it('익명 export default인 경우 DefaultExport를 반환해야 함', () => {
      const node = {
        type: 'FunctionExpression',
        parent: {
          type: 'ExportDefaultDeclaration',
        },
      };
      expect(ASTUtils.getFunctionName(node)).toBe('DefaultExport');
    });
  });
});
