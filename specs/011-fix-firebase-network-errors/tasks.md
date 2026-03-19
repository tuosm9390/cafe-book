# Tasks: Firebase 설정 오류 수정 및 네트워크 안정성 확보

**Input**: Design documents from `specs/011-fix-firebase-network-errors/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Organization**: Grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable
- **[Story]**: US1, US2, etc.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 `.env` 파일에 `VITE_FIRESTORE_DATABASE_ID` 등 필수 환경 변수 확인 및 보완
- [x] T002 [P] `src/api/firebase.ts` 내의 주석 처리된 레거시 코드 및 미사용 import 정리

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T003 `firebase/firestore` 모듈에서 `initializeFirestore`, `terminate`, `clearIndexedDbPersistence` import 확인

---

## Phase 3: User Story 2 - 정확한 Firebase SDK 초기화 (Priority: P1) 🎯 MVP

**Goal**: `useFetchStreams` 타입 에러를 해결하고 최신 SDK 규격에 맞는 초기화 로직을 구현함.
**Independent Test**: `npm run build` 또는 IDE 상에서 `firebase.ts` 파일의 TypeScript 에러가 발생하지 않음.

### Implementation for User Story 2
- [x] T004 [US2] `src/api/firebase.ts`에서 `useFetchStreams` 속성 제거
- [x] T005 [US2] `getFirestore` 대신 `initializeFirestore`를 사용하여 명시적 설정 구조로 변경
- [x] T006 [US2] `FirestoreSettings` 타입에 맞춰 `experimentalForceLongPolling: true` 적용
- [x] T007 [US2] `resetFirestore` 유틸리티 함수 구현 및 export 하여 복구 경로 확보

---

## Phase 4: User Story 1 - 안정적인 관리자 페이지 접근 (Priority: P1)

**Goal**: Firestore 클라이언트의 오프라인 고착 현상을 해결하고 실시간 데이터 채널을 안정화함.
**Independent Test**: 관리자 페이지 로드 시 "client is offline" 에러가 발생하지 않고 데이터가 즉시 표시됨.

### Implementation for User Story 1
- [x] T008 [US1] `src/api/firebase.ts`에 진단용 로그 및 설정 가이드(`logFirebaseSetupGuide`) 복원
- [x] T009 [US1] `AdminPage.tsx` 진입 시 초기화 로직에서 네트워크 상태 확인 및 자동 재시도 로직 보강 검토
- [x] T010 [US1] 브라우저 개발자 도구 Network 탭을 통해 Firestore Listen 채널의 안정성 검증

---

## Phase 6: 데이터베이스 기초 설정 및 시딩 (Database Seeding)

- [x] T014 [US1] `src/api/seedApi.ts` 생성 및 테스트용 카페 데이터(최소 3건) 정의
- [x] T015 [US1] 관리자 권한 강제 부여 로직(로그인 유저를 users 컬렉션에 admin으로 등록) 구현
- [x] T016 [US1] 시딩 실행 후 Firestore 콘솔에서 컬렉션 및 문서 생성 여부 최종 확인

---

---

## Phase 7: 분석 결과 반영 및 품질 보완 (Remediation)

- [x] T017 `research.md`의 `VITE_FIRESTORE_DATABASE_ID` 사용 배경을 `spec.md` 및 `plan.md`에 동기화
- [x] T018 `AdminPage.tsx`에서 데이터 로딩 시간 측정 로직 구현 및 SC-002(2.0초 이내) 검증
- [x] T019 [Constitution IX] `getSafeFirestore` 래퍼를 통한 자동 자가 치유(Self-healing) 로직 최종 검증

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T011 [P] `quickstart.md` 가이드 내용과 실제 구현 코드의 설정값 일치 여부 최종 확인
- [x] T012 [P] 다른 페이지(MapPage 등)에서도 Firestore 연동 지연이 발생하는지 전수 점검
- [x] T013 최종 성능 벤치마크 (데이터 로딩 시간 2초 이내 확인) 및 분석 보고서 최신화
