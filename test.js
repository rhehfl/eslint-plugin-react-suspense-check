import { RuleTester } from 'eslint';
import rule from '../rules/detect-suspense-hook.js'; // 경로와 확장자(.js) 확인!

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
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
      // 1. 이름에 Suspense가 포함된 훅
      code: `
        function useSuspenseUser() {
          return use(Promise.resolve());
        }
      `,
    },
    {
      // 2. 이름에 Suspense가 포함된 컴포넌트
      code: `
        function SuspenseProfile() {
          const data = useSuspenseQuery();
          return <div>{data}</div>;
        }
      `,
    },
    {
      // 3. HOC (memo) - 변수명에 Suspense 포함
      code: `
        const SuspenseMemoComp = React.memo(() => {
          useSuspenseData();
          return <div />;
        });
      `,
    },
    {
      // 4. 일반 훅 (Suspense 트리거가 없음) -> 당연히 통과
      code: `
        function useNormalHook() {
          const [state, setState] = useState();
          return state;
        }
      `,
    },
  ],

  // ❌ 에러가 발생해야 하는 코드들 (Invalid)
  invalid: [
    {
      // 1. 트리거는 있는데 이름에 Suspense가 없음
      code: `
        function useUser() {
          return use(Promise.resolve());
        }
      `,
      errors: [
        {
          messageId: 'suspenseNamingError_kr', // 또는 suspenseNamingError_en (설정에 따라)
          data: { name: 'useUser' },
        },
      ],
    },
    {
      // 2. 일반 컴포넌트인데 Suspense 트리거 사용
      code: `
        function Profile() {
          const data = useSuspenseQuery();
          return <div>{data}</div>;
        }
      `,
      errors: [
        {
          messageId: 'suspenseNamingError_kr',
          data: { name: 'Profile' },
        },
      ],
    },
    {
      // 3. forwardRef 익명 함수 - 변수명 MyInput에 Suspense가 없음
      code: `
        const MyInput = forwardRef((props, ref) => {
          const val = useSuspenseValue();
          return <input ref={ref} />;
        });
      `,
      errors: [
        {
          messageId: 'suspenseNamingError_kr',
          data: { name: 'MyInput' },
        },
      ],
    },
    {
      // 4. 추가 트리거 옵션 작동 확인
      options: [{ additionalTriggers: ['useQuery'], language: 'kr' }],
      code: `
        function useData() {
          return useQuery('key', fetcher);
        }
      `,
      errors: [
        {
          messageId: 'suspenseNamingError_kr',
          data: { name: 'useData' },
        },
      ],
    },
  ],
});

console.log('✅ 모든 테스트 통과!');
