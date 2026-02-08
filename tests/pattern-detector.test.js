import { describe, it, expect } from 'vitest';
import PatternDetector from '../rules/utils/pattern-detector.js';

describe('PatternDetector 단위 테스트', () => {
  it('React 19의 use() 호출을 감지해야 함', () => {
    const node = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'use' },
    };
    expect(PatternDetector.isSuspenseTrigger(node)).toBe(true);
  });

  it('useSuspense로 시작하는 커스텀 훅을 감지해야 함', () => {
    const node = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'useSuspenseQuery' },
    };
    expect(PatternDetector.isSuspenseTrigger(node)).toBe(true);
  });

  it('{ suspense: true } 옵션을 감지해야 함', () => {
    const node = {
      type: 'CallExpression',
      callee: { name: 'useQuery' },
      arguments: [
        {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: { type: 'Identifier', name: 'suspense' },
              value: { type: 'Literal', value: true },
            },
          ],
        },
      ],
    };
    expect(PatternDetector.hasSuspenseOption(node)).toBe(true);
  });
});
