# Research: 지도 초기화 및 레이아웃 수정

**Date**: 2026-03-19
**Author**: Antigravity

## Decision 1: 레이아웃 중앙 배치 해결
- **문제**: `src/index.css`의 `body` 스타일에 `display: flex; place-content: center;`가 설정되어 있어, 고정 너비가 아닌 `Layout` 컴포넌트 전체가 화면 중앙에 위치함. 이로 인해 사이드바가 좌측이 아닌 중앙에 보임.
- **해결**: `body`의 `place-content: center`와 `display: flex`를 제거하고, `Layout` 컴포넌트 내부에서 Flexbox를 사용하여 영역을 분리함. (이미 `Layout.tsx`는 `flex h-screen`으로 구현되어 있음)
- **Rationale**: `body` 레벨의 중앙 배치는 랜딩 페이지나 로그인 페이지에는 적합할 수 있으나, 전체 화면을 사용하는 지도 서비스 레이아웃에는 부적합함.
- **Alternatives considered**: `Layout` 컴포넌트에 `w-full`을 강제하거나 `margin: 0 auto`를 사용하는 방안이 있으나, 근본적인 `body` 스타일 수정이 더 깔끔함.

## Decision 2: Geolocation 구현 방식
- **문제**: 지도가 처음 로드될 때 사용자의 현재 위치를 파악하여 중심을 잡아야 함.
- **해결**: `useGeolocation` 커스텀 훅을 생성하여 `navigator.geolocation.getCurrentPosition`을 호출하고, 위도/경도 상태를 관리함. `MapPage.tsx`에서 이 훅을 사용하여 `center` 좌표를 `MapContainer`에 전달함.
- **Rationale**: 헌법 I(Library-First) 원칙에 따라 UI와 위치 획득 로직을 분리하여 테스트 가능성을 높임.
- **Alternatives considered**: `MapContainer` 내부에서 직접 호출할 수도 있으나, `MapPage` 레벨에서 상태를 관리하여 사이드바 등 다른 컴포넌트와 위치 정보를 공유하기 쉽게 함.

## Decision 3: 기본 위치 및 폴백 전략
- **선택**: 강남역 (37.4979, 127.0276), Level 5
- **Rationale**: 사용자의 요청에 따라 유동 인구가 많고 카페가 밀집된 강남역을 기본값으로 설정함.
- **Fallback**: 위치 권한 거부(`PERMISSION_DENIED`), 시간 초과(`TIMEOUT`), 위치 획득 실패 시 에러 없이 기본 좌표로 즉시 전환함.

## Decision 4: Kakao Map SDK 무결성 (SRI)
- **검토**: `dapi.kakao.com`에서 로드되는 SDK는 쿼리 파라미터(appkey)를 포함한 동적 URL이므로 정적 SRI 해시 적용이 어려움.
- **결정**: 현재의 동적 로딩 방식을 유지하되, `https` 프로토콜을 명시적으로 사용하여 중간자 공격 위험을 최소화함. (현재 `//dapi.kakao.com`으로 사용 중)
- **Rationale**: 카카오 API 명세에서 권장하는 로딩 방식을 따름.
