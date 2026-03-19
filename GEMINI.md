# Cafe Book Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-19

## Active Technologies

- **Language**: TypeScript 5.x, Node.js 20.x
- **Frameworks**: React 18+, react-kakao-maps-sdk
- **UI/Styling**: Tailwind CSS
- **Backend/Storage**: Firebase SDK 10+, Firebase Firestore (NoSQL), Firebase Auth

## Project Structure

```text
src/
├── api/                 # Firebase 연동 및 Kakao Map 관련 유틸리티
├── components/          # 공통 UI 컴포넌트 (Sidebar, Map, StarRating 등)
├── hooks/               # 상태 관리 및 API 호출용 커스텀 훅
├── pages/               # 페이지 컴포넌트 (MapPage, AdminPage)
├── types/               # TypeScript 타입 정의
└── utils/               # 공통 유틸리티 함수

tests/
├── e2e/                 # Playwright 테스트
├── integration/         # Firebase 연동 테스트
└── unit/                # 컴포넌트 및 로직 단위 테스트
```

## Commands

- `npm run dev`: 개발 서버 실행
- `npm run test:unit`: Vitest를 이용한 단위 테스트 실행
- `npx playwright test`: Playwright를 이용한 E2E 테스트 실행
- `npm run build`: 프로덕션 빌드 생성

## Code Style

- **TypeScript**: 엄격한 타입 체크(`strict: true`) 적용.
- **Components**: Functional Components + Hooks (React 18+ 패턴).
- **Styling**: Tailwind CSS 클래스 중심의 유틸리티 우선 방식.
- **Firebase**: SDK v10+ 모듈형 스타일(Functional/Modular) 사용.

## Recent Changes

- **001-cafe-map-admin**: 카카오맵 기반 지도 페이지 및 Firebase 연동 관리 페이지 초기 기능 설계 완료.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
