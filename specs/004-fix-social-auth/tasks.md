# Tasks: Social Authentication Configuration Fix

**Input**: Design documents from `specs/004-fix-social-auth/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Grouped by user story for independent implementation and testing.

## Implementation Strategy

현재 발생 중인 `CONFIGURATION_NOT_FOUND` 오류를 즉시 해결하기 위해 Google 인증 설정을 가장 먼저 정상화(MVP)하고, 이후 Kakao 인증의 복잡한 토큰 교환 흐름을 Firebase Cloud Functions를 통해 순차적으로 구현합니다. 모든 작업은 실제 Firebase 콘솔 설정과 연동하여 검증합니다.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] `.env` 파일의 Firebase API Key 및 Project ID가 콘솔 설정과 정확히 일치하는지 재검증
- [x] T002 Google Cloud Console에서 `Identity Toolkit API` 및 `Token Service API` 제한 해제 상태 확인
- [x] T003 `.env.example`에 필요한 인증 관련 환경 변수 템플릿 업데이트

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 `src/types/index.ts`에 `User` 및 `AuthProvider` 인터페이스 정의 (data-model.md 기준)
- [x] T005 `src/api/firebase.ts`에서 환경 변수 유효성 검사 로직 추가 및 `CONFIGURATION_NOT_FOUND` 에러 발생 시 콘솔에 해결 가이드(Google Cloud Console 링크 등) 출력 구현 (U1 해결)
- [x] T006 [P] 인증 에러 발생 시 사용자에게 노출할 공통 에러 메시지 유틸리티 작성

## Phase 3: User Story 1 - Google 소셜 로그인 (Priority: P1) 🎯 MVP

**Goal**: Google 로그인 시 `CONFIGURATION_NOT_FOUND` 에러 해결 및 지도 페이지 진입 성공
**Independent Test**: 로그인 페이지에서 Google 버튼 클릭 시 팝업이 정상 작동하고 세션이 유지되는지 확인

### Tests for User Story 1
- [x] T007 [P] [US1] `src/api/auth.ts`의 `signInWithGoogle` 함수에 대한 단위 테스트 (Mock Firebase Auth)
- [x] T008 [US1] Playwright를 이용한 Google 로그인 팝업 호출 및 리다이렉트 E2E 테스트 작성

### Implementation for User Story 1
- [x] T009 [US1] `src/api/auth.ts` 내 `GoogleAuthProvider` 호출부의 구성 옵션 점검 및 수정
- [x] T010 [US1] `src/components/SocialLoginButtons.tsx`에서 Google 로그인 성공/실패 시의 상태 처리 로직 강화
- [x] T011 [US1] 인증 성공 후 메인 지도 페이지로의 라우팅 흐름 검증

---

## Phase 4: User Story 2 - Kakao 소셜 로그인 (Priority: P1)

**Goal**: Kakao 인증 성공 후 Firebase Custom Token으로 로그인이 완료됨
**Independent Test**: Kakao 인증 페이지 이동 및 로그인 완료 후 Firebase UID가 정상 발급되는지 확인

### Tests for User Story 2
- [x] T012 [P] [US2] Kakao 토큰 수신 및 Custom Token 교환 로직에 대한 단위 테스트
- [x] T019 [US2] Playwright를 이용한 Kakao 로그인 흐름(Redirect/Popup) E2E 테스트 작성 (C1 해결)

### Implementation for User Story 2
- [x] T013 [US2] Firebase Cloud Functions(또는 Mock Server)를 사용하여 Kakao Access Token을 Firebase Custom Token으로 교환하는 서버리스 함수 구현 (A1 해결)
- [x] T014 [US2] `src/api/auth.ts`에서 위 T013의 함수를 호출하여 로그인을 완료하는 인터페이스 구현
- [x] T015 [US2] `src/components/SocialLoginButtons.tsx`에 Kakao SDK 초기화 및 로그인 이벤트 핸들러 추가

---

## Phase 5: Polish & Validation

- [x] T020 [P] 인증 세션 만료 감지 시 사용자 알림(Toast) 및 로그인 페이지 리다이렉트 로직 구현 (G1 해결)
- [x] T016 [P] 인증 버튼 클릭부터 완료까지의 소요 시간 측정 (SC-002: 5초 이내 달성 여부 확인)
- [x] T017 전체적인 런타임 콘솔 에러 로그 0건 달성 여부 확인 (SC-001 검증)
- [x] T018 [P] `quickstart.md`의 연동 가이드가 실제 구현과 일치하는지 최종 업데이트
