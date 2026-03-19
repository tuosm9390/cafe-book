# Feature Specification: Firebase Firestore 네트워크 에러 수정 및 자가 치유
**Feature Branch**: `011-fix-firebase-network-errors`
**Status**: Draft (Remediated)
**Created**: 2026-03-19

## User Scenarios & Testing
### User Story 1 - 네트워크 차단 환경에서의 관리자 접속 (Priority: P1)
**Scenario**: 기업 방화벽 등으로 인해 gRPC 스트림이 차단된 환경에서 관리자가 접속함.
**Acceptance Scenarios**:
1. **Given** gRPC 포트가 차단된 네트워크 환경에서, **When** 관리자 페이지에 진입하면, **Then** Firestore는 자동으로 HTTP Long Polling 모드로 동작하여 데이터를 로드해야 함.

### User Story 2 - 오프라인 고착 현상 자가 치유 (Priority: P1)
**Scenario**: 로컬 캐시 오염으로 인해 네트워크 연결 후에도 "client is offline" 상태가 지속됨.
**Acceptance Scenarios**:
1. **Given** "client is offline" 에러가 3회 연속 발생하거나 15초 이상 지속될 때, **When** 시스템이 이를 감지하면, **Then** 사용자 개입 없이 자동으로 로컬 캐시를 초기화(`clearIndexedDbPersistence`)하고 재연결을 시도해야 함. [Constitution IX 준수]
2. **Given** 자가 치유 로직이 실행될 때, **When** 프로세스가 진행 중이면, **Then** 사용자에게 "네트워크 연결을 최적화하고 있습니다. 잠시만 기다려 주세요..."라는 안내 메시지와 함께 로딩 스피너를 표시해야 함. [CHK003 해결]

### Edge Cases
- **네트워크 복구 직후**: 자가 치유 로직 실행 중 네트워크가 실제 복구되었음을 감지하면, 불필요한 캐시 초기화 대신 즉시 실시간 리스너를 재확립함. [CHK008 관련]
- **쓰기 작업 중단**: 캐시 초기화 시 전송 대기 중인 데이터(Pending writes)가 있다면, 삭제 전 경고창을 띄워 사용자에게 데이터 유실 가능성을 알리고 확인을 받음.

## Requirements
### Functional Requirements
- **FR-001**: 최신 Firebase SDK v10 규격에 따라 `useFetchStreams`를 제거하고 `initializeFirestore`를 사용해야 함.
- **FR-002**: 특정 네트워크 차단 환경을 우회하기 위해 `experimentalForceLongPolling: true` 설정을 강제함.
- **FR-003**: Firestore 연결 상태를 모니터링하고, 지속적인 오프라인 에러 발생 시 자동으로 복구 로직(Terminate -> Clear -> Re-init)을 트리거하는 자가 치유(Self-healing) 레이어를 구현함.

### Technical Constraints
- **TC-001**: 멀티 DB 환경 지원을 위해 `VITE_FIRESTORE_DATABASE_ID` 환경 변수가 반드시 정의되어야 함.

## Success Criteria
### Measurable Outcomes
- **SC-001**: 빌드 및 런타임 시 `FirestoreSettings` 타입 에러가 발생하지 않음.
- **SC-002**: 관리자 페이지 데이터 로딩 시간이 네트워크 장애 상황을 제외하고 2.0초 이내여야 함.
- **SC-003**: 네트워크 복구 후 자가 치유 로직이 1회 이내의 재시도로 연결을 정상화함.
