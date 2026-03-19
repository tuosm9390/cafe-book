# Feature Specification: Firebase 설정 오류 수정 및 네트워크 안정성 확보

**Feature Branch**: `011-fix-firebase-network-errors`  
**Created**: 2026-03-19 16:30:00  
**Status**: Draft  
**Input**: User description: "@src/api/firebase.ts 파일에서 FirestoreSettings 타입에 존재하지 않는 useFetchStreams 속성 에러 수정 및 어드민 페이지 오프라인 오류(네트워크 차단 의심) 해결"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 안정적인 관리자 페이지 접근 (Priority: P1)

관리자는 어드민 페이지 접속 시 "client is offline" 에러 없이 실시간으로 데이터를 불러오고 권한을 확인할 수 있어야 합니다.

**Why this priority**: 관리자 기능은 서비스 운영의 핵심이며, 데이터 조작이 불가능한 상태는 치명적인 결함입니다.

**Independent Test**: 어드민 페이지 접속 시 네트워크 탭에서 Firestore Listen 채널이 성공적으로 확립되는지 확인하고, 콘솔에 "client is offline" 에러가 발생하지 않는지 검증합니다.

**Acceptance Scenarios**:

1. **Given** 인터넷이 연결된 환경에서, **When** 관리자 페이지(/admin)를 새로고침하면, **Then** Firestore로부터 사용자 권한 정보를 성공적으로 가져와 화면이 렌더링된다.
2. **Given** 관리자 페이지 로드 후, **When** 네트워크 요청이 발생하면, **Then** 무한 루프나 반복적인 terminate 요청 없이 단일 채널이 유지된다.

---

### User Story 2 - 정확한 Firebase SDK 초기화 (Priority: P1)

개발자는 컴파일 에러 없이 최신 Firebase SDK 가이드라인에 맞는 설정을 적용하여 시스템을 빌드할 수 있어야 합니다.

**Why this priority**: 타입 에러가 있는 코드는 안정적인 빌드와 배포를 방해하며, 잘못된 설정은 예기치 못한 런타임 동작을 유발합니다.

**Independent Test**: `src/api/firebase.ts` 파일에서 TypeScript 타입 에러가 발생하지 않는지 확인하고, 빌드 명령(`npm run build`)이 성공적으로 수행되는지 검증합니다.

**Acceptance Scenarios**:

1. **Given** `firebase.ts` 파일을 열었을 때, **When** Firestore 초기화 코드를 확인하면, **Then** `FirestoreSettings` 타입에 정의되지 않은 속성(`useFetchStreams` 등)이 제거되어 있고 타입 에러가 없다.

---

### Edge Cases

- 프록시나 방화벽이 있는 환경에서의 gRPC 스트림 차단 대응 (Long Polling 강제 설정의 유효성 검증).
- Firebase 프로젝트 ID가 `.env`와 일치하지 않을 경우의 명확한 에러 핸들링.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `src/api/firebase.ts`에서 `useFetchStreams` 속성을 제거하고, 현재 SDK 버전(v10.13.0+)에서 지원하는 표준 설정으로 대체해야 한다.
- **FR-002**: Firestore 클라이언트가 온라인 상태를 즉시 감지할 수 있도록 네트워크 프로토콜(HTTP/2 vs Long Polling) 설정을 재검토해야 한다.
- **FR-003**: `AdminPage.tsx`에서 발생하는 오프라인 에러를 방어하기 위해 데이터 호출 전 연결 상태 확인 로직을 보강해야 한다.

### Key Entities

- **Firestore Client**: Firebase 서버와 데이터를 주고받는 통신 주체.
- **Settings Object**: Firestore 행동을 정의하는 설정값 집합.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `src/api/firebase.ts` 내 TypeScript 타입 에러 0건.
- **SC-002**: 관리자 페이지 로드 시 "Failed to get document because the client is offline" 에러 재발 방지 (성공률 100%).
- **SC-003**: 네트워크 탭에서의 Firestore 연동 지연 시간 2초 이내.
