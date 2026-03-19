# Research Report: Firebase Firestore 설정 오류 및 네트워크 차단 분석

**Decision**: `useFetchStreams`를 제거하고, 최신 Firebase SDK 가이드에 따라 `forceLongPolling` 설정을 `initializeFirestore`를 통해 명확히 적용함. 또한 `terminate`와 `clearIndexedDbPersistence`를 포함한 복구 로직을 복원하여 오프라인 고착 현상을 해결함.  
**Rationale**: 
1. `useFetchStreams`는 Firebase JS SDK v10.x 대에서 `Settings` 타입에서 제거되었음.
2. 특정 네트워크 환경에서 gRPC 스트림이 차단될 경우 Firestore는 오프라인으로 인식됨. 이를 해결하기 위해 `experimentalForceLongPolling`을 true로 설정하는 것이 표준 대응임.
3. "client is offline" 에러가 지속되는 경우 브라우저의 IndexedDB에 저장된 영속성 데이터가 오염되었을 수 있으므로 캐시 삭제 로직이 필요함.

**Alternatives Considered**: 
- `getFirestore`만 사용: 기본 설정(Auto-detect)에 의존하므로 특정 네트워크 차단 환경에서 대응 불가.
- SDK 버전 다운그레이드: 최신 보안 및 기능 업데이트를 포기해야 하므로 기각.

## Research Tasks

### 1. 최신 Firebase SDK (v10.13.0+) Firestore 설정값 조사
- **결과**: `useFetchStreams`는 더 이상 사용되지 않음. 네트워크 제어는 `forceLongPolling`으로 충분함.

### 2. "client is offline" 에러와 네트워크 무한 요청 관계 분석
- **원인**: gRPC 연결 시도 -> 실패 -> 재시도 루프 발생. 이 과정에서 클라이언트는 서버와 완전히 연결되지 않은 것으로 간주함.
- **해결**: HTTP Long Polling을 강제하여 방화벽/프록시 이슈 회피.

### 3. 오프라인 데이터 복구 전략
- **방법**: `terminate(db)` 후 `clearIndexedDbPersistence(db)`를 호출하여 로컬 캐시를 초기화하고 연결을 재확립함.
