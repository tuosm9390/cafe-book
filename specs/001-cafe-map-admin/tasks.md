# Tasks: 카페 도감 초기 기능 (지도 및 관리 페이지)

**Input**: Design documents from `specs/001-cafe-map-admin/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Vitest (Unit) 및 Playwright (E2E) 테스트를 포함합니다. TDD 방식으로 진행합니다.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 프로젝트 초기화 및 기본 기술 스택 설정

- [x] T001 Create React + TypeScript project structure per implementation plan
- [x] T002 Initialize Tailwind CSS and configure `tailwind.config.js`
- [x] T003 [P] Setup environment variables in `.env` (Kakao Map, Firebase Keys)
- [x] T004 [P] Configure Vitest and Playwright test environments

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 사용자 스토리에 공통적으로 필요한 핵심 인프라 구축

- [x] T005 [P] Setup Firebase initialization in `src/api/firebase.ts`
- [x] T006 [P] Implement Firebase Auth utilities in `src/api/auth.ts`
- [x] T007 Define core TypeScript interfaces in `src/types/index.ts` (Cafe, Interaction)
- [x] T008 [P] Implement Kakao Map loader utility in `src/utils/mapLoader.ts`
- [x] T009 Create base Layout component with Sidebar container in `src/components/Layout.tsx`

---

## Phase 3: User Story 1 - 지도 기반 카페 탐색 및 검색 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 지도를 통해 카페 목록을 보고 검색할 수 있음

**Independent Test**: `/` 경로에서 사이드바의 검색 기능이 작동하고, 리스트 클릭 시 지도가 해당 위치로 이동하는지 확인

### Tests for User Story 1
- [x] T010 [P] [US1] Unit test for search filtering logic in `tests/unit/search.test.ts`
- [x] T011 [US1] E2E test for map center movement on list click in `tests/e2e/map-navigation.spec.ts`

### Implementation for User Story 1
- [x] T012 [P] [US1] Implement Cafe item component in `src/components/CafeListItem.tsx`
- [x] T013 [P] [US1] Implement Sidebar with Search input in `src/components/Sidebar.tsx`
- [x] T014 [US1] Implement Map container using `react-kakao-maps-sdk` in `src/components/MapContainer.tsx`
- [x] T015 [US1] Create Map Page and integrate Sidebar & Map in `src/pages/MapPage.tsx`
- [x] T016 [US1] Implement search filtering state logic in `src/hooks/useCafes.ts`

---

## Phase 4: User Story 2 - 카페 데이터 관리 (Priority: P1)

**Goal**: 관리자가 카페 정보를 등록, 수정, 삭제할 수 있음

**Independent Test**: `/admin` 경로에서 새로운 카페를 등록한 후 메인 지도 페이지에 나타나는지 확인

### Tests for User Story 2
- [x] T017 [US2] E2E test for Cafe CRUD operations in `tests/e2e/admin-crud.spec.ts`

### Implementation for User Story 2
- [x] T018 [P] [US2] Implement Admin Login page in `src/pages/LoginPage.tsx`
- [x] T019 [US2] Implement Cafe registration/edit form in `src/components/CafeForm.tsx`
- [x] T020 [US2] Implement Cafe CRUD logic with Firestore in `src/api/cafeApi.ts`
- [x] T021 [US2] Create Admin Page with list and form in `src/pages/AdminPage.tsx`
- [x] T022 [US2] Add Route guards for admin access in `src/App.tsx`

---

## Phase 5: User Story 3 - 카페 상호작용 (코멘트, 별점, 즐겨찾기) (Priority: P2)

**Goal**: 사용자가 카페에 리뷰를 남기고 즐겨찾기 할 수 있음

**Independent Test**: 특정 카페 리스트 항목에서 별점을 매기고 코멘트를 적었을 때 새로고침 후에도 유지되는지 확인

### Tests for User Story 3
- [x] T023 [P] [US3] Unit test for rating calculation in `tests/unit/interaction.test.ts`
- [x] T032 [US3] E2E test for cafe interactions in `tests/e2e/interactions.spec.ts`

### Implementation for User Story 3
- [x] T024 [P] [US3] Implement StarRating component in `src/components/StarRating.tsx`
- [x] T025 [P] [US3] Implement CommentInput and Favorite toggle in `src/components/InteractionSection.tsx`
- [x] T026 [US3] Implement interaction state persistence with Firestore in `src/api/interactionApi.ts`
- [x] T027 [US3] Integrate InteractionSection into Sidebar Cafe item

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 사용자 경험 개선 및 보안 강화

- [x] T028 [P] Apply responsive design for mobile views using Tailwind media queries
- [x] T029 Implement smooth transitions for map movement (panTo)
- [x] T030 Setup Firestore Security Rules for cafe and interaction collections
- [x] T031 Final validation of `quickstart.md` setup process
- [x] T033 [P] Benchmark search filtering performance (<0.5s) in `tests/unit/performance.test.ts`

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Setup (Phase 1)** -> **Foundational (Phase 2)** (반드시 순차 실행)
2. **Foundational (Phase 2)** -> **User Stories (Phase 3, 4, 5)** (병렬 가능하지만 P1 우선 권장)
3. **User Stories** -> **Polish (Phase 6)**

### Implementation Strategy
- **MVP First**: US1(지도 탐색)을 가장 먼저 완료하여 핵심 가치를 증명합니다.
- **Data Dependency**: US2(관리)가 구현되어야 실제 데이터를 자유롭게 넣을 수 있으므로 US1 이후 즉시 진행합니다.
