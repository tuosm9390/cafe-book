# Research: 카페 도감 기술 조사 및 결정

**Feature**: 카페 도감 초기 기능 (지도 및 관리 페이지)
**Date**: 2026-03-19

## 기술적 미결정 사항 해결

### 1. UI 라이브러리 및 스타일링 방식
- **결정**: **Tailwind CSS**
- **이유**: 생산성이 높고 반응형 디자인 대응이 용이하며, 별도의 CSS 파일을 최소화하여 유지보수성을 높일 수 있음.
- **대안**: Vanilla CSS (유연성은 높으나 작업 속도가 느림), MUI (컴포넌트 완성도는 높으나 커스텀 디자인 적용 시 복잡도가 증가함).

### 2. 카카오맵 API 연동 방식
- **결정**: **`react-kakao-maps-sdk`** 라이브러리 사용
- **이유**: React 선언적 프로그래밍 스타일에 최적화되어 있으며, 마커 및 지도 이동 처리가 간편함. API 키 노출 방지를 위해 환경 변수(.env) 관리가 필수적임.

### 3. Firebase 보안 및 인증 구조
- **결정**: **Firebase Authentication (Email/Password)** + **Firestore Security Rules**
- **내용**: 
  - 관리자 계정 여부를 Firestore `users` 컬렉션의 `role` 필드 또는 커스텀 클레임으로 확인.
  - 보안 규칙을 통해 관리자만 `cafes` 컬렉션을 생성/수정/삭제 가능하도록 제한.
  - 코멘트 및 별점은 모든 사용자가 `read` 가능하도록 설정.

## 기술별 모범 사례 (Best Practices)

### Kakao Map API
- 지도 중심 좌표 변경 시 `setCenter` 또는 `panTo` 메서드를 사용하여 부드러운 전환 구현 (SC-002 달성).
- 불필요한 재렌더링 방지를 위해 지도 객체와 이벤트 핸들러를 메모이제이션 처리.

### Firebase Firestore
- 데이터 일관성을 위해 카페 정보 수정 시 관련 상호작용(리뷰) 데이터와의 관계 설계 주의.
- 읽기 비용 최적화를 위해 필요한 필드만 인덱싱 처리.

## 연구 결과 요약
모든 [NEEDS CLARIFICATION] 사항이 해결되었습니다.
- 스타일링: Tailwind CSS
- 지도 연동: react-kakao-maps-sdk
- 데이터 및 인증: Firebase (Firestore, Auth)
