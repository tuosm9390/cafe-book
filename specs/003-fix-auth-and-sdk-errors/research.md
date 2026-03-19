# Research: 인증 및 SDK 에러 분석 결과

## 1. 인증 구독 함수 참조 오류

- **Decision**: `src/api/auth.ts`의 `subscribeAuth` 함수명을 유지하고, 이를 참조하는 `MapPage.tsx` 및 기타 파일의 임포트 구문을 수정합니다.
- **Rationale**: `auth.ts` 내의 네이밍이 일관성(`signInWith...`, `subscribeAuth`)을 가지고 있으므로, 호출 측을 수정하는 것이 더 깔끔합니다.
- **Findings**: `src/api/auth.ts`에는 `subscribeAuth`만 존재하며 `subscribeToAuthChanges`는 정의되어 있지 않음.

## 2. 카카오 맵 SDK 401 Unauthorized 에러

- **Decision**: `.env` 파일의 `VITE_KAKAO_MAP_API_KEY` 값을 실제 발급받은 키로 교체해야 함을 가이드하고, `index.html`에서 환경 변수 주입 형식이 Vite 표준에 맞는지 재확인합니다.
- **Rationale**: 현재 `.env` 값이 플레이스홀더 문자열로 되어 있어 카카오 서버에서 인증에 실패하고 있음.
- **Findings**: `index.html`에서 `%VITE_KAKAO_MAP_API_KEY%` 형식을 사용 중이며, 이는 Vite에서 올바른 HTML 변수 주입 방식임.

## 3. 환경 변수 주입 확인

- **Decision**: `index.html`에서 SDK를 로드하는 방식 대신, 필요한 컴포넌트(예: `MapContainer.tsx`)에서 `react-kakao-maps-sdk`의 `useKakaoLoader`를 사용하는 방식으로 전환하는 것을 검토합니다.
- **Rationale**: 런타임에 동적으로 키를 관리하기 더 쉬우며, HTML에 직접 스크립트 태그를 넣는 것보다 React 친화적인 방식임.
- **Alternatives considered**: 현재의 `index.html` 방식 유지 (단순하지만 유연성이 떨어짐).
