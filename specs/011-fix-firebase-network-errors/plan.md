# Implementation Plan: Firebase 네트워크 안정성 확보
**Date**: 2026-03-19 | **Spec**: [spec.md](./spec.md)

## Summary
Firebase Firestore SDK v10의 호환성 이슈를 해결하고, 특정 네트워크 차단 환경에서 발생하는 오프라인 고착 현상을 자가 치유(Self-healing) 메커니즘을 통해 해결하는 기술적 접근 방식입니다.

## Technical Context
- **Primary Dependencies**: Firebase SDK v10.13.0+
- **Key Mechanism**: `experimentalForceLongPolling`, `clearIndexedDbPersistence`
- **Infrastructure**: Firebase Firestore (NoSQL)
- **Environment**: `VITE_FIRESTORE_DATABASE_ID` (Required for explicit DB instance targeting)

## Constitution Check
- [ ] **IX. Network Resilience**: 오프라인 시나리오 대응 및 자가 치유 로직 설계 포함? (Planned)

## Self-Healing Strategy (A3 대응)
네트워크 탄력성 원칙(Constitution IX)을 구현하기 위한 구체적 수치 및 로직:
1. **에러 감지 및 트리거 조건 (CHK001, CHK005)**:
   - `FirestoreError.code === 'unavailable'` 또는 `code === 'failed-precondition'` 상태 감지.
   - **연속 실패**: 3회 연속 실패 시 즉시 복구 트리거.
   - **타임아웃**: 요청 후 15초(15,000ms) 내 응답 없을 시 트리거.
   - **백오프(Backoff)**: 재시도 간격을 1s -> 2s -> 4s로 지수적으로 증가시켜 무한 루프 부하 방지.
2. **적용 범위 (CHK002)**:
   - `src/api/firebase.ts`에서 초기화되는 모든 Firestore 인스턴스에 전역 적용.
3. **복구 절차**:
   - `diagnosticLog`: 현재 상태 및 에러 카운트 기록.
   - `step1`: `terminate(db)`를 호출하여 진행 중인 모든 스트림 강제 종료.
   - `step2`: `clearIndexedDbPersistence(db)`를 호출하여 오염 가능성이 있는 로컬 IndexedDB 캐시 삭제.
   - `step3`: `initializeFirestore`를 재호출하여 깨끗한 상태로 연결 재시작.

## Architecture Change
- **Location**: `src/api/firebase.ts`
- **Pattern**: `getSafeFirestore()` 래퍼 함수 도입.
  - 내부적으로 초기화 상태를 관리하고, 에러 인터셉터를 통해 자가 치유 로직을 호출함.

## Project Structure (Feature Specific)
```text
specs/011-fix-firebase-network-errors/
├── spec.md              # Feature requirements
├── plan.md              # This file
├── research.md          # Analysis output
└── tasks.md             # Implementation tasks
```
