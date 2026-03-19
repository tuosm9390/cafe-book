# Data Model: 사용자 인증 및 프로필

## 1. User Entity (Firestore)

사용자 정보는 Firebase Auth에서 기본 정보를 관리하고, 추가적인 프로필 정보는 `users` 컬렉션에 저장합니다.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `uid` | `string` | Firebase Auth UID (Primary Key) | Required, Unique |
| `email` | `string` | 사용자 이메일 | Required, Email format |
| `displayName` | `string` | 화면에 표시될 이름 | Max 20 chars |
| `photoURL` | `string` | 프로필 이미지 URL | Valid URL format |
| `provider` | `enum` | 인증 제공자 (`google`, `kakao`) | Required |
| `createdAt` | `timestamp` | 계정 생성 일시 | Required |
| `lastLoginAt` | `timestamp` | 최근 로그인 일시 | Required |

## 2. Authentication State (Client)

React 클라이언트에서 관리할 인증 상태 인터페이스입니다.

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
```

## 3. Relationships

- **User - Review**: 1:N (사용자는 여러 개의 카페 리뷰를 작성할 수 있음)
- **User - Bookmark**: 1:N (사용자는 여러 개의 카페를 북마크할 수 있음)
