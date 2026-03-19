# Data Model: 지도 초기화 및 위치 정보

**Date**: 2026-03-19
**Author**: Antigravity

## New Types & States

### GeolocationState (Custom Hook State)
`useGeolocation` 훅에서 관리할 사용자의 현재 위치 정보 상태입니다.

- **latitude** (`number`): 위도. (기본값: 37.4979)
- **longitude** (`number`): 경도. (기본값: 127.0276)
- **error** (`string | null`): 위치 획득 실패 시 에러 메시지. (기본값: null)
- **isLoading** (`boolean`): 위치 정보를 가져오는 중인지 여부. (기본값: true)

## Relationships & Data Flow

1. **`useGeolocation` (Hook)**:
   - `navigator.geolocation`을 호출하여 `GeolocationState`를 반환함.
2. **`MapPage` (Page)**:
   - `useGeolocation`을 호출하여 현재 위치를 확보함.
   - 확보된 위도/경도를 `MapContainer`의 `center` prop으로 전달함.
3. **`MapContainer` (Component)**:
   - 전달받은 `center` 값을 기반으로 카카오 지도의 중심을 설정함.
   - `selectedCafe`가 있을 경우 `selectedCafe.location`이 우선순위를 가짐.

## Validation Rules
- **위도/경도 범위**: 위도는 -90~90, 경도는 -180~180 범위를 준수해야 함.
- **폴백 처리**: Geolocation API 에러 발생 시 즉시 기본값(강남역)으로 상태를 업데이트하여 지도가 멈추지 않도록 함.
