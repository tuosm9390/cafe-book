# Feature Specification: Social Authentication Configuration Fix

**Feature Branch**: `004-fix-social-auth`  
**Created**: 2026-03-19  
**Status**: Draft  
**Input**: User description: "회원가입 및 로그인 기능이 동작하지 않는 것 같아. auth.ts:17 GET https://identitytoolkit.googleapis.com/v1/projects?key=AIzaSyC9A4ZPnK-IHQCH57nYMqgMsBl_nAE9x9g 400 (Bad Request) iframe.js:311 {\"error\":{\"code\":400,\"message\":\"CONFIGURATION_NOT_FOUND\",\"errors\":[{\"message\":\"CONFIGURATION_NOT_FOUND\",\"domain\":\"global\",\"reason\":\"invalid\"}]}} 구글, 카카오톡 모두 동작하게 해줘."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Google 소셜 로그인 (Priority: P1)

사용자는 Google 계정을 사용하여 서비스에 로그인하거나 회원가입을 할 수 있어야 한다.

**Why this priority**: 가장 널리 사용되는 인증 수단 중 하나로, 초기 진입 장벽을 낮추는 핵심 기능이다.

**Independent Test**: 로그인 페이지에서 'Google로 로그인' 버튼을 클릭했을 때, 팝업이 정상적으로 표시되고 인증 완료 후 지도 페이지로 리다이렉트되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** Google 인증이 Firebase 콘솔에서 이미 활성화된 상태에서, **When** 사용자가 Google 로그인 버튼을 클릭하면, **Then** Google 계정 선택 창이 나타난다.
2. **Given** 올바른 Google 계정을 선택하면, **When** 인증이 완료되면, **Then** 사용자는 로그인이 완료되어 메인 화면으로 이동한다.

---

### User Story 2 - Kakao 소셜 로그인 (Priority: P1)

사용자는 Kakao 계정을 사용하여 서비스에 로그인하거나 회원가입을 할 수 있어야 한다.

**Why this priority**: 국내 사용자층에게 가장 친숙하고 접근성이 높은 인증 수단이다.

**Independent Test**: 로그인 페이지에서 '카카오톡으로 로그인' 버튼을 클릭했을 때, Kakao 인증 서버로 정상적으로 연결되고 Firebase Custom Token을 통해 로그인이 완료되는지 확인한다.

**Acceptance Scenarios**:

1. **Given** Kakao API 키와 리다이렉트 URI가 이미 Kakao 콘솔에 설정된 상태에서, **When** 사용자가 Kakao 로그인 버튼을 클릭하면, **Then** Kakao 인증 페이지로 이동한다.
2. **Given** Kakao 인증 완료 후 서버로부터 토큰을 받으면, **When** Firebase 인증 절차를 거치면, **Then** 사용자는 로그인이 완료되어 메인 화면으로 이동한다.

---

### Edge Cases

- **Firebase 구성 불일치**: `.env`의 API 키와 Firebase 프로젝트 설정이 실제와 일치하지 않을 경우 `CONFIGURATION_NOT_FOUND` 에러가 발생하므로, 이를 자동 감지하거나 로깅해야 한다.
- **세션 만료**: 인증 도중 브라우저 탭이 닫히거나 세션이 만료되는 경우의 적절한 폴백 처리가 필요하다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 Firebase Identity Platform에서 Google 제공업체를 올바르게 초기화하고 호출해야 한다.
- **FR-002**: 시스템은 Kakao 인증 후 발급받은 토큰을 Firebase Custom Token으로 변환하여 인증을 완료해야 한다.
- **FR-003**: 모든 인증 관련 환경 변수는 `.env` 파일로부터 안전하게 로드되어야 하며, `VITE_` 접두사 규칙을 준수해야 한다.
- **FR-004**: 인증 과정에서 발생하는 네트워크 에러(400, 401 등)를 감지하고 사용자에게 알림을 제공해야 한다.

### Key Entities

- **User**: 인증에 성공한 사용자의 정보 (UID, 이메일, 프로필 이미지 등).
- **AuthProvider**: Google 또는 Kakao와 같은 외부 인증 서비스 제공자.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 로그인 시도 시 런타임 콘솔에서 `CONFIGURATION_NOT_FOUND` 에러 발생 0건.
- **SC-002**: 인증 버튼 클릭부터 로그인 완료 후 페이지 이동까지의 소요 시간이 5초 이내.
