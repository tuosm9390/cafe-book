# Quickstart: Social Auth Integration

이 가이드는 Google 및 Kakao 소셜 로그인 설정을 완료하기 위한 최종 체크리스트입니다.

## Prerequisites
- Firebase 프로젝트 생성 완료 (Authentication 활성화)
- Kakao Developers 애플리케이션 등록 완료 (JavaScript 키 확보)

## Setup Steps

### 1. Firebase 설정 (Google)
1. **API 제한 해제**: [Google Cloud Console](https://console.cloud.google.com/) -> APIs & Services -> Credentials에서 API Key의 restrictions에 `Identity Toolkit API`가 포함되어 있는지 확인하십시오. (CONFIGURATION_NOT_FOUND 해결을 위한 핵심 단계)
2. **제공업체 활성화**: Firebase Console -> Authentication -> Sign-in method에서 Google을 활성화하십시오.

### 2. Kakao 설정 (Custom Token)
1. **도메인 등록**: Kakao Developers -> 내 애플리케이션 -> 플랫폼 -> Web 사이트 도메인에 개발 주소(예: `http://localhost:5173`)를 추가하십시오.
2. **백엔드 필요**: 현재 클라이언트 코드는 인터페이스만 준비되어 있습니다. 실제 로그인을 위해서는 Kakao Access Token을 받아 Firebase Custom Token으로 교환해 줄 **Firebase Cloud Functions** 구현이 필수적입니다.

### 3. 환경 변수 (`.env`)
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_KAKAO_JAVASCRIPT_KEY=... # Kakao JavaScript 키 필수
```

## Running Tests
```bash
# 단위 테스트 실행 (인증 로직 검증)
npm run test:unit -- tests/unit/auth.test.ts
```
