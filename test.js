const { RuleTester } = require('eslint');
const rule = require('./rules/detect-suspense-hook'); // 👈 작성한 룰 파일 import

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

console.log('🚀 강화된 Suspense 룰 테스트 시작...');

ruleTester.run('detect-suspense-hook', rule, {
  // ✅ 통과해야 하는 코드들 (Valid)
  valid: [
    {
      // 1. 올바른 훅 네이밍 (useSuspense...)
      code: `
        function useSuspenseUser() {
          return use(Promise.resolve());
        }
      `,
    },
    {
      // 2. 올바른 컴포넌트 네이밍 (Suspense...)
      code: `
        function SuspenseProfile() {
          const data = useSuspenseQuery();
          return <div>{data}</div>;
        }
      `,
    },
    {
      // 3. HOC (memo) 지원 - 올바른 네이밍
      code: `
        const SuspenseMemoComp = React.memo(() => {
          useSuspenseData();
          return <div />;
        });
      `,
    },
    {
      // 4. 일반 훅 (Suspense 미사용) - 무시되어야 함
      code: `
        function useNormalHook() {
          const [state, setState] = useState();
          return state;
        }
      `,
    },
    {
      code: `
        function fetchData() {
          // React Hook 규칙 위반이지만, 우리 룰은 '컴포넌트/훅'만 타겟팅하므로 패스
          useSuspenseQuery(); 
        }
      `,
    },
  ],

  invalid: [
    {
      code: `
        function useUser() {
          return use(Promise.resolve());
        }
      `,
      errors: [
        {
          messageId: 'hookRenamingRequired',
          data: { suggestedName: 'useSuspenseUser' },
        },
      ],
    },
    {
      code: `
        function Profile() {
          const data = useSuspenseQuery();
          return <div>{data}</div>;
        }
      `,
      errors: [
        { messageId: 'componentRenamingRequired', data: { name: 'Profile' } },
      ],
    },
    {
      code: `
        const MyInput = forwardRef((props, ref) => {
          const val = useSuspenseValue();
          return <input ref={ref} />;
        });
      `,
      errors: [
        { messageId: 'componentRenamingRequired', data: { name: 'MyInput' } },
      ],
    },
    {
      options: [{ additionalTriggers: ['useQuery'] }],
      code: `
        function useData() {
          return useQuery('key', fetcher);
        }
      `,
      errors: [
        {
          messageId: 'hookRenamingRequired',
          data: { suggestedName: 'useSuspenseData' },
        },
      ],
    },
  ],
});

console.log('✅ 모든 테스트 통과! HOC 및 옵션 기능이 정상 작동합니다.');
