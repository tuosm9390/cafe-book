# Tasks: 인증 함수 및 SDK 에러 수정

**Feature**: 인증 함수 및 SDK 에러 수정
**Plan**: [specs/003-fix-auth-and-sdk-errors/plan.md]

## Implementation Strategy

현재 발생 중인 치명적인 런타임 에러와 네트워크 인증 에러를 신속하게 해결합니다.
1. **사전 조사**: 실제 파일 구조와 환경 변수 상태를 정밀 진단합니다.
2. **임포트 오류 수정**: 잘못된 함수명을 참조하고 있는 호출부들을 실제 내보내고 있는 이름(`subscribeAuth`)과 일치시킵니다.
3. **SDK 인증 해결**: 환경 변수가 SDK 로딩 시점에 올바르게 주입되도록 보장합니다.
4. **통합 검증**: 성능 지표를 포함하여 모든 요구사항의 준수 여부를 확인합니다.

## Phase 0: Research & Setup (A5 해결)

- [x] T000 `src/api/auth.ts`의 실제 export 명칭과 `index.html`의 스크립트 태그 구조를 `read_file`로 최종 확인
- [x] T001 `.env` 파일에 `VITE_KAKAO_MAP_API_KEY`가 실제 키로 설정되어 있는지 확인하고, `.env.example`에도 동일한 키(플레이스홀더)를 추가하여 현행화 (헌법 IV 준수)

## Phase 1: [US2] 인증 상태 구독 정상화 (A1, A3 해결)

**Goal**: `Uncaught SyntaxError` 해결 및 인증 상태 동기화 성공.
**Independent Test**: `npm run test:unit` 실행 시 인증 관련 테스트 통과.

- [x] T002 `src/pages/MapPage.tsx`에서 `subscribeToAuthChanges` 임포트를 실제 이름인 `subscribeAuth`로 수정
- [x] T003 `grep -r "subscribeToAuthChanges" src` 명령으로 프로젝트 전체를 스캔하여 모든 잘못된 참조를 `subscribeAuth`로 일괄 수정
- [x] T008 (New) `auth.ts` 수정 사항에 대한 단위 테스트(`src/test/unit/interaction.test.ts` 등 활용) 실행 및 통과 확인 (헌법 III 준수)

## Phase 2: [US1] 카카오 SDK 인증 에러 해결

**Goal**: `401 Unauthorized` 해결 및 지도 정상 렌더링.
**Independent Test**: Network 탭에서 `sdk.js` 요청이 200 OK를 반환하는지 확인.

- [x] T004 `index.html`에서 `%VITE_KAKAO_MAP_API_KEY%` 주입이 Vite 빌드/개발 환경에서 정상 작동하는지 점검
- [x] T005 HTML 주입 실패 시, `src/utils/mapLoader.ts`를 통한 동적 SDK 로딩 방식(Script Injection) 구현 고려

## Phase 3: Polish & Validation (A2 해결)

- [x] T006 모든 페이지(`LoginPage`, `MapPage`, `AdminPage`) 진입 시 런타임 에러 여부 확인 및 **지도 로딩 시간(1초 이내) 측정** (SC-002 검증)
- [x] T007 `specs/003-fix-auth-and-sdk-errors/checklists/requirements.md` 기반 최종 결과 검증 및 분석 보고서 업데이트

## Dependencies

- Phase 1(US2)과 Phase 2(US1)은 상호 독립적이며 병렬 진행 가능합니다.

## Parallel Execution Examples

- **Task-level**:
  - T002, T004 (서로 다른 파일 수정)
