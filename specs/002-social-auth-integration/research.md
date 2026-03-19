# Research: 소셜 로그인 및 UI 연동 전략

## 1. 카카오 로그인 연동 (Firebase Custom Auth)

- **Decision**: Firebase Custom Auth와 Firebase Functions를 조합한 방식을 사용합니다.
- **Rationale**: Firebase Auth는 카카오를 기본 제공자로 지원하지 않습니다. 카카오 인증 서버로부터 받은 `access_token`을 Firebase Function으로 전달하고, 해당 Function에서 `admin.auth().createCustomToken()`을 사용하여 커스텀 토큰을 생성한 뒤 클라이언트로 반환하여 로그인 처리를 수행합니다.
- **Alternatives considered**: 별도의 인증 서버 구축 (관리 포인트 증가로 제외), 프론트엔드에서만 처리 (보안 취약으로 제외).

## 2. 리다이렉션 로직 (Auth Guard)

- **Decision**: `App.tsx`에서 `useAuth` 훅을 사용하여 인증 상태를 감시하고, 비인증 상태일 때 `Navigate` 컴포넌트를 사용하여 `/login`으로 리다이렉트하는 `ProtectedRoute` 컴포넌트를 구현합니다.
- **Rationale**: 선언적인 라우팅 관리가 가능하며, 비즈니스 로직과 UI 분리 원칙을 준수합니다.
- **Alternatives considered**: `useEffect` 내에서 `window.location.replace` 사용 (React의 단일 페이지 애플리케이션 특성에 반함).

## 3. 1/3 사이드바 반응형 디자인

- **Decision**: Tailwind CSS의 `grid` 또는 `flex` 레이아웃을 사용하며, 모바일(`sm` 미만)에서는 `w-full`, 데스크톱(`md` 이상)에서는 `w-1/3` (약 33%) 비율을 적용합니다.
- **Rationale**: 모바일 환경에서의 가독성을 보장하며 데스크톱에서는 명세서의 디자인 요구사항을 충족합니다.
- **Alternatives considered**: 고정 픽셀(px) 사이드바 (다양한 해상도 대응이 어려움).

## 4. 회원가입 버튼 전환 UX

- **Decision**: React의 상태(useState)를 사용하여 `isSignupMode` 플래그를 관리하고, 이 값에 따라 버튼의 레이블과 아이콘을 동적으로 렌더링합니다.
- **Rationale**: 단순한 상태 변경만으로 UI의 즉각적인 반응을 보장하며, 코드 복잡도를 낮출 수 있습니다.
- **Alternatives considered**: 별도의 회원가입 전용 페이지 생성 (화면 전환 비용 발생 및 사용자 경험 저하).
