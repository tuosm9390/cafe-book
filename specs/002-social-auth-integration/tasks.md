# Tasks: 소셜 로그인 연동 및 로그인 UI 구현

**Feature**: 소셜 로그인 연동 및 로그인 UI 구현
**Plan**: [specs/002-social-auth-integration/plan.md]

## Implementation Strategy

이 기능은 사용자 인증의 핵심인 소셜 로그인과 그 진입점인 로그인 UI를 구현합니다. 
1. **인프라 설정**: Firebase 및 소셜 앱 키 설정을 먼저 수행합니다.
2. **인증 기반 구축**: 전역에서 사용할 수 있는 인증 훅과 API를 구현합니다.
3. **UI 구현**: 명세된 1/3 사이드바 레이아웃과 리다이렉션 로직을 구현합니다.
4. **기능 통합**: 실제 소셜 로그인 API를 연동하고 상태를 동기화합니다.
5. **검증**: 독립적인 테스트 케이스를 통해 각 사용자 스토리를 검증합니다.

## Phase 1: Setup

- [x] T001 [P] 환경 변수(.env)에 소셜 로그인 관련 키 설정 (Firebase, Kakao, Google)
- [x] T002 [P] 필요한 의존성 설치 (react-router-dom, lucide-react 등)

## Phase 2: Foundational (Authentication Layer)

- [x] T003 [P] `src/types/index.ts`에 User 및 AuthState 인터페이스 정의
- [x] T004 `src/api/auth.ts`에 Firebase Auth 초기화 및 기본 소셜 로그인 유틸리티 구현
- [x] T005 `src/hooks/useAuth.ts`에 전역 인증 상태 관리 훅 구현

## Phase 3: [US2] 로그인 페이지 리다이렉트 및 UI

**Goal**: 비인증 사용자를 로그인 페이지로 유도하고 기본 레이아웃을 제공함.
**Independent Test**: `/` 접속 시 `/login`으로 이동하고 우측 33% 영역에 사이드바가 표시되는지 확인.

- [x] T006 `src/components/ProtectedRoute.tsx` 인증 가드 컴포넌트 구현
- [x] T007 `src/App.tsx`에 리다이렉션 라우팅 로직 적용
- [x] T008 `src/pages/LoginPage.tsx`에 1/3 사이드바 레이아웃 골격 구현 (Tailwind 활용)

## Phase 4: [US3] 회원가입 버튼 전환

**Goal**: 로그인/회원가입 모드에 따라 버튼 텍스트를 동적으로 변경함.
**Independent Test**: '회원가입' 클릭 시 버튼이 '카카오 회원가입' 등으로 즉시 바뀌는지 확인.

- [x] T009 [P] `src/components/SocialLoginButtons.tsx` 컴포넌트 추출 및 상태 연동
- [x] T010 `src/pages/LoginPage.tsx`에 회원가입 모드 토글 로직 구현

## Phase 5: [US1] 소셜 계정으로 로그인

**Goal**: 구글 및 카카오 계정을 통한 실제 로그인 연동을 완료함.
**Independent Test**: 각 버튼 클릭 시 인증 팝업/페이지가 뜨고 완료 후 메인으로 이동하는지 확인.

- [x] T011 `src/api/auth.ts`에 구글 로그인(Popup/Redirect) 로직 완성
- [ ] T012 `src/api/auth.ts`에 카카오 로그인(Custom Token 활용) 로직 구현
- [x] T013 `src/components/SocialLoginButtons.tsx`에 각 로그인 함수 바인딩

## Phase 6: Polish & Cross-cutting

- [x] T014 로그인 페이지 모바일 대응 최적화 (w-full 전환)
- [ ] T015 인증 실패 및 취소 시 에러 메시지 처리 (Toast 등)
- [x] T016 `specs/002-social-auth-integration/checklists/requirements.md` 기반 최종 검증

## Dependencies

- Phase 2(인증 레이어)는 Phase 3, 5의 필수 선행 조건입니다.
- US2(리다이렉트)가 완료되어야 US1, US3를 실제 화면에서 테스트할 수 있습니다.

## Parallel Execution Examples

- **Story-level**: [US2]와 [US3]의 UI 작업은 일부 병렬 진행 가능.
- **Task-level**:
  - T001, T002 (Setup)
  - T003, T009 (Type & UI Component definition)
