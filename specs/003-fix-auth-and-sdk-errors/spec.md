# Feature Specification: 인증 함수 내보내기 오류 및 Kakao SDK 401 에러 수정

**Feature Branch**: `003-fix-auth-and-sdk-errors`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "아직 에러발생하고 있어. network에서 확인되는 코드야 Request URL http://dapi.kakao.com/v2/maps/sdk.js?appkey=your_kakao_javascript_api_key&libraries=services,clusterer,drawing Request Method GET Status Code 401 Unauthorized Referrer Policy strict-origin-when-cross-origin 콘솔에러 Uncaught SyntaxError: The requested module '/src/api/auth.ts' does not provide an export named 'subscribeToAuthChanges' (at MapPage.tsx:6:10)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 정상적인 지도 로드 (Priority: P1)

사용자가 서비스 접속 시 카카오 지도가 401 인증 에러 없이 정상적으로 화면에 렌더링되어야 한다.

**Why this priority**: 지도는 서비스의 핵심 기능이며, 인증 에러로 인해 지도가 표시되지 않으면 서비스 이용이 불가능하다.

**Independent Test**: 브라우저 개발자 도구의 Network 탭에서 `sdk.js` 요청의 `appkey`가 실제 키 값으로 전달되는지 확인하고, HTTP 상태 코드가 200 OK인지 확인한다.

**Acceptance Scenarios**:

1. **Given** 올바른 카카오 API 키가 `.env`에 설정된 상태에서, **When** 지도 페이지에 접속하면, **Then** 지도가 에러 없이 로드된다.

---

### User Story 2 - 인증 상태 구독 정상화 (Priority: P1)

시스템 내부적으로 사용자의 인증 상태 변화를 오류 없이 감지하고 대응할 수 있어야 한다.

**Why this priority**: 인증 상태 구독 함수가 잘못 참조되면 전체 애플리케이션의 런타임 에러를 유발하여 화면이 렌더링되지 않는다.

**Independent Test**: `MapPage.tsx` 및 기타 파일에서 `subscribeToAuthChanges` 임포트 시 `Uncaught SyntaxError`가 발생하지 않는지 콘솔에서 확인한다.

**Acceptance Scenarios**:

1. **Given** 애플리케이션이 실행될 때, **When** `MapPage`가 로드되면, **Then** `auth.ts`로부터 `subscribeToAuthChanges` (또는 수정된 함수명)를 정상적으로 가져와 실행한다.

---

### Edge Cases

- **환경 변수 누락**: `.env` 파일에 `VITE_KAKAO_JAVASCRIPT_KEY`가 없을 경우 사용자에게 명확한 가이드를 제공해야 한다.
- **캐시 문제**: 브라우저 캐시로 인해 이전의 `your_kakao_javascript_api_key` 값이 계속 유지될 경우 하드 새로고침이 필요함을 인지해야 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `src/api/auth.ts` 파일은 `subscribeToAuthChanges`라는 이름의 함수를 내보내거나, 이를 참조하는 모든 파일의 임포트 이름을 현재 내보내고 있는 이름(`subscribeAuth`)과 일치시켜야 한다.
- **FR-002**: 카카오 맵 SDK를 로드할 때 `your_kakao_javascript_api_key`와 같은 플레이스홀더 대신 `.env`에서 로드한 실제 API 키를 동적으로 주입해야 한다.
- **FR-003**: 환경 변수가 클라이언트 측에 노출될 수 있도록 `VITE_` 접두사를 올바르게 사용하고 있는지 확인한다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 런타임 콘솔에서 `Uncaught SyntaxError` 및 `401 Unauthorized` 에러 발생 0건.
- **SC-002**: 페이지 로드 후 지도가 화면에 표시되기까지의 시간이 1초 이내(네트워크 속도 제외 로직 시간 기준).
