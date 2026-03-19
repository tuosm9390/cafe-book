# Data Model: User & Auth

이 데이터 모델은 인증에 성공한 사용자의 정보와 소셜 제공업체와의 관계를 정의합니다.

## Entities

### User
인증된 사용자의 핵심 프로필 정보입니다. Firestore의 `users` 컬렉션에 저장됩니다.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `uid` | string | Firebase 고유 식별자 | 필수, 고유 |
| `email` | string | 사용자 이메일 | 필수, 이메일 형식 |
| `displayName` | string | 화면 표시 이름 | 필수 |
| `photoURL` | string | 프로필 이미지 URL | 선택 |
| `provider` | string | 인증 제공자 (`google`, `kakao`) | 필수 |
| `createdAt` | timestamp | 계정 생성 일시 | 필수 |
| `lastLoginAt` | timestamp | 마지막 로그인 일시 | 필수 |

## Relationships
- **User (1) : (N) Reviews**: 한 사용자는 여러 개의 리뷰를 작성할 수 있습니다.
- **User (1) : (N) Interactions**: 사용자는 여러 카페에 대해 별점이나 좋아요를 남길 수 있습니다.

## State Transitions
1. **Unauthenticated**: 초기 상태.
2. **Authenticating**: 소셜 로그인 팝업 또는 리다이렉트 진행 중.
3. **Authenticated**: 인증 성공 후 사용자 정보를 세션/상태에 저장한 상태.
4. **Registration (New User)**: 최초 로그인 시 Firestore에 기본 프로필 생성.
