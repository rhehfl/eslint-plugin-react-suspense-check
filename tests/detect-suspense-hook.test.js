import { RuleTester } from 'eslint';
import rule from '../rules/detect-suspense-hook.js';
import { describe } from 'vitest';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('detect-suspense-hook 규칙 테스트', () => {
  ruleTester.run('detect-suspense-hook', rule, {
    valid: [
      {
        code: 'function SuspenseUser() { const data = use(promise); return <div>{data}</div>; }',
      },
      {
        code: 'const useSuspenseData = () => { return useSuspenseQuery(); }',
      },
      {
        code: 'function NormalComponent() { const [s] = useState(); return null; }',
      },
    ],
    invalid: [
      {
        code: 'function UserList() { const data = use(promise); return null; }',
        errors: [
          { messageId: 'suspenseNamingError_en', data: { name: 'UserList' } },
        ],
      },
      {
        code: 'const MyDataComp = memo(() => { useSuspenseQuery(); return null; });',
        errors: [
          { messageId: 'suspenseNamingError_en', data: { name: 'MyDataComp' } },
        ],
      },
      {
        code: 'const fetchData = () => { use(p); }',
        errors: [
          { messageId: 'suspenseNamingError_en', data: { name: 'fetchData' } },
        ],
      },
    ],
  });
});
