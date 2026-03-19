# Tasks: 지도 초기화 및 레이아웃 수정

**Input**: Design documents from `specs/005-fix-map-initialization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (다른 파일 작업, 의존성 없음)
- **[Story]**: [US1], [US2] (spec.md의 사용자 스토리와 매핑)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] `src/hooks/` 디렉토리에 `useGeolocation.ts` 파일 생성 및 스캐폴딩
- [x] T002 `src/index.css`에서 `body` 태그의 레이아웃 스타일(`display: flex`, `place-content: center`) 식별

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 `src/types/index.ts`에 `GeolocationState` 타입 정의 추가
- [x] T004 [P] `src/hooks/useGeolocation.test.ts` 파일 생성 및 `useGeolocation` 훅에 대한 단위 테스트 작성 (TDD)
- [x] T005 [P] `src/hooks/useGeolocation.ts`에 `navigator.geolocation` 기반 현재 위치 획득 로직 구현
- [x] T006 `src/hooks/useGeolocation.ts`에 위치 권한 거부 시 강남역(37.4979, 127.0276) 폴백 로직 구현

## Phase 3: User Story 1 - 지도 초기 위치 자동 설정 (Priority: P1) 🎯 MVP

**Goal**: 지도가 로드될 때 사용자의 현재 위치를 중심으로 표시함.
**Independent Test**: 위치 권한 허용 시 현재 위치, 거부 시 강남역이 중심에 오는지 확인.

### Implementation for User Story 1
- [x] T007 [P] [US1] `src/pages/MapPage.tsx`에서 `useGeolocation` 훅을 호출하여 현재 좌표 확보
- [x] T008 [US1] `src/pages/MapPage.tsx`에서 확보된 좌표를 `MapContainer`의 `center` prop으로 전달하도록 수정
- [x] T009 [US1] `src/components/MapContainer.tsx`에서 초기 지도 레벨을 5로 변경 (FR-005)
- [x] T010 [US1] `src/components/MapContainer.tsx`에서 `selectedCafe`가 없을 때 전달받은 `center`를 우선 사용하도록 수정
- [x] T011 [US1] `src/utils/mapLoader.ts`의 SDK 로딩 URL에 `https:` 프로토콜 명시적 추가 (Decision 4)

## Phase 4: User Story 2 - 사이드바 레이아웃 정상화 (Priority: P1)

**Goal**: 사이드바가 좌측에 고정되고 지도가 나머지 영역을 가득 채움.
**Independent Test**: 데스크톱 해상도에서 사이드바 위치 및 지도 너비 확인.

### Implementation for User Story 2
- [x] T012 [P] [US2] `src/index.css`의 `body` 태그에서 `place-content: center` 및 `display: flex` 스타일 제거
- [x] T013 [US2] `src/components/Layout.tsx`에서 사이드바 너비(`w-80`)와 지도 영역(`flex-1`)이 전체 화면을 차지하며 좌측에 고정되는지 CSS 클래스(flex-row 등) 검증
- [x] T014 [US2] `src/components/Layout.tsx`의 `aside` 영역에 `z-index` 및 배경색 설정을 통해 지도와의 시각적 분리 보장

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T015 [P] 모바일 해상도(768px 미만)에서 상하 레이아웃 정상 작동 확인 (Responsive Design Audit)
- [x] T016 위치 획득 중 로딩 상태(`isLoading`)가 `MapPage.tsx`에서 로딩 스피너나 중앙 메시지로 적절히 표현되는지 확인
- [x] T017 최종 성능 벤치마크: 지도 이동 및 초기 렌더링 체감 속도 확인 (SC-001)
