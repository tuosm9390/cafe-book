# Quickstart: 지도 초기화 및 레이아웃 수정

**Date**: 2026-03-19
**Author**: Antigravity

## Overview
이 기능은 메인 페이지 진입 시 발생하는 레이아웃 틀어짐(중앙 배치)을 해결하고, 지도의 초기 중심을 사용자의 현재 위치(또는 강남역)로 자동 설정합니다.

## Prerequisites
- **환경 변수**: `VITE_KAKAO_MAP_API_KEY`가 `.env`에 올바르게 설정되어 있어야 함.
- **브라우저 설정**: 위치 정보 접근 권한(Geolocation)이 활성화되어 있어야 함.

## Verification Steps

### 1. 레이아웃 확인 (데스크톱)
- **절차**: 브라우저를 1024px 이상의 해상도로 설정하고 메인 페이지 진입.
- **기대 결과**: 사이드바가 화면 좌측에 고정되고 지도가 나머지 영역(우측)을 채워야 함. 사이드바가 화면 중앙에 떠 있지 않아야 함.

### 2. 현재 위치 기반 지도 초기화
- **절차**: 브라우저 위치 정보 제공을 '허용'하고 페이지 로드.
- **기대 결과**: 지도가 현재 사용자가 있는 위치를 중심으로 표시되어야 함. (Level 5)

### 3. 위치 권한 거부 시 폴백 확인
- **절차**: 브라우저 위치 정보 제공을 '거부'하고 페이지 로드.
- **기대 결과**: 지도가 강남역(위도 37.4979, 경도 127.0276)을 중심으로 표시되어야 함.

## Testing Locally
```bash
# 유닛 테스트 실행 (useGeolocation 훅 검증)
npm run test src/hooks/useGeolocation.test.ts

# E2E 테스트 실행 (레이아웃 및 지도 초기화 검증)
npx playwright test tests/e2e/map-initialization.spec.ts
```
