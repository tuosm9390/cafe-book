# Data Model: 카페 도감 핵심 엔티티

**Feature**: 카페 도감 초기 기능 (지도 및 관리 페이지)
**Storage**: Firebase Firestore (NoSQL)

## 핵심 엔티티 (Entities)

### 1. Cafe (카페)
- **컬렉션**: `cafes`
- **필드**:
  - `id` (string, document-id): 카페 고유 식별자.
  - `name` (string): 카페 이름.
  - `address` (string): 카페 도로명/지번 주소.
  - `location` (geopoint): 위도(latitude), 경도(longitude) 좌표 정보.
  - `createdAt` (timestamp): 등록 일시.
  - `updatedAt` (timestamp): 최종 수정 일시.
  - `createdBy` (string, user-id): 등록한 관리자 ID.
- **관계**: `interactions` 서브 컬렉션 또는 별도 컬렉션과 연결.

### 2. Interaction (사용자 상호작용)
- **컬렉션**: `interactions` (또는 `cafes/{cafeId}/interactions`)
- **필드**:
  - `id` (string, document-id): 상호작용 고유 식별자.
  - `cafeId` (string): 대상 카페 ID.
  - `userId` (string): 작성자 고유 ID.
  - `comment` (string, optional): 사용자가 남긴 한 줄 평/코멘트.
  - `rating` (number): 별점 (1~5 점).
  - `isFavorite` (boolean): 즐겨찾기 등록 여부.
  - `updatedAt` (timestamp): 최종 상호작용 일시.
- **유효성 검사**:
  - `rating`은 반드시 1에서 5 사이의 정수여야 함.
  - `comment`는 최대 500자 이내로 제한.

## 상태 전이 (State Transitions)

### 카페 등록/수정/삭제 흐름
1. **관리자 인증**: `auth.uid`가 관리자 그룹에 속해 있는지 확인.
2. **데이터 등록**: `cafes` 컬렉션에 새 문서 생성.
3. **목표 전파**: 지도 및 목록 렌더링 시 실시간 스냅샷 또는 정적 패치로 반영.

### 상호작용 관리 흐름
1. **사용자 액션**: 코멘트 입력, 별점 선택, 즐겨찾기 토글.
2. **문서 갱신**: `interactions` 컬렉션에 해당 사용자-카페 쌍의 문서가 있으면 업데이트, 없으면 생성.
3. **UI 동기화**: 리스트의 코멘트/별점 영역 즉시 업데이트.
