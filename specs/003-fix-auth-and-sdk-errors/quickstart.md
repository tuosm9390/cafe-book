# Quickstart: 인증 및 SDK 에러 해결 가이드

## 1. 카카오 API 키 설정

현재 발생하고 있는 401 Unauthorized 에러를 해결하려면 반드시 실제 카카오 JavaScript 키가 필요합니다.

1.  [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속합니다.
2.  내 애플리케이션에서 사용 중인 앱을 선택하거나 새로 생성합니다.
3.  **요약 정보** 탭에서 **JavaScript 키**를 복사합니다.
4.  프로젝트 루트의 `.env` 파일을 열고 아래 변수에 값을 붙여넣습니다.
    ```env
    VITE_KAKAO_MAP_API_KEY=복사한_실제_키_값
    ```
5.  **플랫폼 > Web** 설정에서 현재 실행 중인 도메인(예: `http://localhost:5173`)이 등록되어 있는지 확인합니다.

## 2. 코드 수정 사항 자동 적용

구현 단계(`/speckit.implement`)를 실행하면 다음 사항이 자동으로 수정됩니다.
- `MapPage.tsx`의 `subscribeToAuthChanges` 임포트가 `subscribeAuth`로 변경됩니다.
- 인증 상태 감시 로직이 정상화됩니다.
