# Research: Social Authentication Configuration Fix

이 연구는 Firebase `CONFIGURATION_NOT_FOUND` 오류의 원인을 분석하고, Google 및 Kakao 소셜 로그인의 안정적인 구현 패턴을 정의합니다.

## Findings

### 1. CONFIGURATION_NOT_FOUND (400) 오류 분석
- **원인**: 제공된 API Key(`AIzaSy...`)는 유효하나, 해당 키가 Google Cloud Console에서 'Identity Toolkit API'를 사용할 수 있도록 제한 해제(API Restrictions)되어 있지 않거나, Firebase 프로젝트의 Authentication 기능이 올바르게 초기화되지 않았을 때 발생함.
- **해결 방안**: 
  - Google Cloud Console -> APIs & Services -> Credentials에서 해당 API Key의 'API restrictions' 섹션에 `Identity Toolkit API` 및 `Token Service API`가 포함되어 있는지 확인.
  - Firebase 콘솔 설정의 `projectId`와 `authDomain`이 `.env` 파일의 값과 토씨 하나 틀리지 않고 일치하는지 재검증.

### 2. 소셜 로그인 구현 패턴
- **Google Login**: 
  - `signInWithPopup` 방식을 사용하며, `GoogleAuthProvider`를 통해 인증.
  - 현재 `src/api/auth.ts`에 구현된 방식은 표준적이며 적절함.
- **Kakao Login**: 
  - Firebase는 Kakao를 기본 제공업체로 지원하지 않으므로 'Custom Token' 방식 필요.
  - 흐름: (Client) Kakao Login -> (Client) Kakao Access Token 획득 -> (Backend/Function) Kakao Token 검증 및 Firebase Custom Token 생성 -> (Client) `signInWithCustomToken` 호출.
  - **Decision**: 현재 프로젝트에 백엔드가 없으므로, Firebase Identity Platform의 'OIDC' 기능을 사용하여 Kakao를 연동하거나, 클라이언트 측에서 처리 가능한 패턴(만약 가능하다면)을 재검토해야 함. (현실적으로는 백엔드 또는 Cloud Functions 필요)

## Decisions & Rationales

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| `.env` 매핑 강화 | `import.meta.env` 사용은 Vite 표준이나, 런타임 시 undefined 여부를 체크하는 유틸리티 추가 | hardcoding (보안 위반) |
| Kakao Auth Flow 보완 | 현재 `signInWithCustomToken`만 있고 토큰 교환 로직이 누락됨. 이를 위한 Mock 또는 가이드 추가 | SDK 직접 연동 (Firebase와 세션 동기화 불가) |

## References
- Firebase Auth Error Codes: [https://firebase.google.com/docs/auth/admin/errors]
- Kakao Login with Firebase: [https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api]
