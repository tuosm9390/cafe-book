# Quickstart: 카페 도감 개발 시작하기

**Feature**: 카페 도감 초기 기능 (지도 및 관리 페이지)

## 필수 준비물
- **Node.js**: v20 이상
- **Firebase 프로젝트**: Firestore 및 Authentication 활성화
- **Kakao Map API**: 애플리케이션 등록 및 JavaScript 키 발급

## 로컬 설정 (Local Setup)

1. **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 다음 정보를 입력합니다.
   ```env
   REACT_APP_KAKAOMAP_API_KEY=your_kakao_api_key
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   # ... 기타 Firebase 설정 정보
   ```

2. **의존성 설치**:
   ```bash
   npm install
   # 핵심 라이브러리: firebase, react-kakao-maps-sdk, tailwindcss
   ```

3. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

## 주요 기능 확인 방법

### 1. 지도 페이지 (Main)
- 브라우저에서 `/` 경로로 접속.
- 왼쪽 사이드바에서 카페 목록과 검색창이 나타나는지 확인.
- 지도가 카카오맵 API를 통해 정상적으로 렌더링되는지 확인.

### 2. 관리 페이지 (Admin)
- `/admin` 경로로 접속 (로그인 필요 시 관리자 계정으로 접속).
- 카페 정보(이름, 주소 등)를 입력하고 '등록' 버튼 클릭.
- 등록 후 다시 지도 페이지(`/`)로 이동하여 데이터가 나타나는지 확인.

## 테스트 실행
```bash
# 단위 테스트
npm run test:unit

# E2E 테스트 (Playwright)
npx playwright test
```
