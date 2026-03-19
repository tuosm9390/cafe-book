# Quickstart: 소셜 로그인 개발 가이드

## 1. 환경 변수 설정 (.env)

이 기능을 실행하기 위해 다음 환경 변수가 필요합니다.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_KAKAO_JAVASCRIPT_KEY=your_kakao_js_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 2. Firebase 콘솔 설정

- **Authentication**: `Google` 로그인 제공업체 활성화.
- **Project Settings**: 앱 등록 후 구성 객체 생성.

## 3. 카카오 개발자 콘솔 설정

- **내 애플리케이션**: 새로운 앱 생성 및 JavaScript 키 발급.
- **플랫폼**: `Web` 플랫폼 등록 (http://localhost:5173).
- **카카오 로그인**: 활성화 및 Redirect URI 설정.

## 4. 로컬 실행

1. 의존성 설치: `npm install`
2. 환경 변수 파일 생성: `.env` 파일에 위 변수 추가.
3. 서비스 실행: `npm run dev`
4. 로그인 페이지 확인: `http://localhost:5173/login`
