module.exports = {
  en: {
    hookRenamingRequired:
      "🛑 This hook triggers Suspense internally. Rename it to start with 'useSuspense' to signal its behavior.\n(Suggested: {{ suggestedName }})",

    componentRenamingRequired:
      "🛑 This component uses a Suspense-triggering hook. Rename it to 'Suspense{{name}}' so callers know to wrap it in a <Suspense> boundary.",

    hocRenamingRequired:
      "🛑 This HOC uses a Suspense-triggering hook internally. Rename it to start with 'withSuspense' to signal its behavior.\n(Suggested: {{ suggestedName }})",
  },

  kr: {
    hookRenamingRequired:
      "🛑 내부에서 Suspense를 유발하는 훅입니다. 이름을 'useSuspense'로 시작하게 변경하여 동작을 명시하세요.\n(추천 이름: {{ suggestedName }})",

    componentRenamingRequired:
      "🛑 내부에서 Suspense 훅을 사용하는 컴포넌트입니다. 상위에서 <Suspense> 처리가 필요함을 알릴 수 있도록 이름을 'Suspense{{name}}' 형식으로 변경하세요.",

    hocRenamingRequired:
      "🛑 내부에서 Suspense 훅을 사용하는 HOC입니다. 이름을 'withSuspense'로 시작하게 변경하여 동작을 명시하세요.\n(추천 이름: {{ suggestedName }})",
  },
};
