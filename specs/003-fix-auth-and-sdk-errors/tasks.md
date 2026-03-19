# Tasks: 인증 함수 및 SDK 에러 수정

**Feature**: 인증 함수 및 SDK 에러 수정
**Plan**: [specs/003-fix-auth-and-sdk-errors/plan.md]

## Implementation Strategy

현재 발생 중인 치명적인 런타임 에러와 네트워크 인증 에러를 신속하게 해결합니다.
1. **임포트 오류 수정**: 잘못된 함수명을 참조하고 있는 호출부들을 실제 내보내고 있는 이름과 일치시킵니다.
2. **SDK 인증 해결**: 환경 변수가 SDK 로딩 시점에 올바르게 주입되도록 보장합니다.
3. **통합 검증**: 모든 페이지에서 런타임 에러가 발생하지 않고 지도가 정상적으로 표시되는지 확인합니다.

## Phase 1: Setup

- [x] T001 `.env` 파일에 `VITE_KAKAO_MAP_API_KEY`가 플레이스홀더가 아닌 실제 키로 설정되어 있는지 수동 확인

## Phase 2: [US2] 인증 상태 구독 정상화

**Goal**: `Uncaught SyntaxError` 해결 및 인증 상태 동기화 성공.
**Independent Test**: 브라우저 콘솔에서 `does not provide an export named 'subscribeToAuthChanges'` 에러가 사라지는지 확인.

- [x] T002 `src/pages/MapPage.tsx`에서 `subscribeToAuthChanges` 임포트를 `subscribeAuth`로 수정
- [x] T003 `src/App.tsx` 또는 기타 파일에서 잘못된 인증 구독 함수 참조 여부 전수 조사 및 수정

## Phase 3: [US1] 카카오 SDK 인증 에러 해결

**Goal**: `401 Unauthorized` 해결 및 지도 정상 렌더링.
**Independent Test**: Network 탭에서 `sdk.js` 요청의 `appkey`가 실제 값으로 전달되고 200 OK를 반환하는지 확인.

- [x] T004 `index.html`에서 `%VITE_KAKAO_MAP_API_KEY%` 주입 방식이 Vite 개발 서버에서 정상 작동하는지 점검
- [x] T005 만약 HTML 주입 방식이 계속 실패할 경우, `src/utils/mapLoader.ts` (또는 신규)를 통한 동적 SDK 로딩 방식 도입 고려

## Phase 4: Polish & Validation

- [x] T006 수정 후 모든 페이지(`LoginPage`, `MapPage`, `AdminPage`) 진입 시 런타임 에러 발생 여부 최종 확인
- [x] T007 `specs/003-fix-auth-and-sdk-errors/checklists/requirements.md` 기반 최종 결과 검증

## Dependencies

- Phase 2(US2)와 Phase 3(US1)은 상호 독립적이며 병렬 진행 가능합니다.

## Parallel Execution Examples

- **Task-level**:
  - T002, T004 (서로 다른 파일 수정)
