# Firebase Network & Setting Guide

이 문서는 Firestore 연동 시 발생하는 네트워크 차단 문제와 설정 오류를 해결하기 위한 가이드입니다.

## 1. Firestore 초기화 설정 (v10.13.0+)

TypeScript 환경에서 `initializeFirestore` 호출 시 아래와 같은 설정을 권장합니다.

```typescript
import { initializeFirestore } from 'firebase/firestore';

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // gRPC 차단 환경 대응 (Long Polling 강제)
  // useFetchStreams: false,         // [주의] v10.x 이상에서 더 이상 사용하지 않음
});
```

## 2. "Client is Offline" 문제 해결

브라우저가 온라인임에도 불구하고 Firestore가 오프라인 상태로 인식될 경우 아래 단계를 수행하십시오.

### Step 1: 네트워크 환경 확인
- 회사 방화벽이나 프록시가 `firestore.googleapis.com`의 gRPC 스트림을 차단하고 있는지 확인합니다.
- `experimentalForceLongPolling: true` 설정이 적용되었는지 확인합니다.

### Step 2: 로컬 캐시 및 연결 초기화
연결 상태가 꼬였을 경우 `resetFirestore` 함수를 호출하여 상태를 강제 초기화할 수 있습니다.

```typescript
import { db, resetFirestore } from './api/firebase';

// 필요한 지점에서 호출 (예: 개발자 도구 콘솔 또는 초기 로딩 실패 시)
await resetFirestore();
```

## 4. 데이터베이스 초기화 및 시딩 (Development)

프로젝트 초기화 후 데이터가 없는 경우 브라우저 개발자 도구(F12) 콘솔에서 아래 명령어를 실행하여 컬렉션 생성 및 기초 데이터를 삽입할 수 있습니다.

### 기초 카페 데이터 삽입
```javascript
await dbUtils.seedCafes();
```

### 본인 계정을 어드민으로 설정
로그인한 상태에서 실행해야 합니다.
```javascript
await dbUtils.makeMeAdmin();
```

### 전체 초기화 가이드
1. 앱 로그인 (구글 로그인 등)
2. `await dbUtils.makeMeAdmin()` 실행 (관리자 권한 획득)
3. `await dbUtils.seedCafes()` 실행 (카페 데이터 생성)
4. 페이지 새로고침

### 네트워크 탭 확인
- 관리자 페이지 접속 후 브라우저 개발자 도구 -> Network 탭을 엽니다.
- `channel?VER=...` 형태의 요청들이 지속적으로 실패(terminate)하거나 무한 반복되는지 확인합니다.
- 설정 적용 후에는 HTTP POST 요청 기반의 안정적인 통신이 이루어져야 합니다.
