<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0
- List of modified principles:
  - Added: VII. Infrastructure & Security Compliance (보안 정책 및 리소스 무결성)
- Added sections: VII. Infrastructure & Security Compliance
- Templates requiring updates:
  - ✅ updated: .specify/memory/constitution.md
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs: 
  - TODO(SECURITY): 향후 CSP(Content Security Policy) 세부 규칙 추가 검토 필요.
-->

# Cafe Book Constitution

## Core Principles

### I. Library-First (UI 및 로직 분리)
모든 기능은 UI 컴포넌트와 비즈니스 로직(API 호출, 데이터 변환 등)이 엄격히 분리되어야 합니다. 로직은 독립적인 유틸리티 함수나 커스텀 훅으로 작성되어 독립적인 테스트가 가능해야 하며, 특정 UI 프레임워크에 대한 의존성을 최소화합니다.

### II. Mobile-First & Responsive (반응형 디자인)
카페 도감은 이동 중에 사용될 가능성이 높으므로 모바일 환경의 사용성을 최우선으로 고려합니다. 모든 페이지는 모바일에서 데스크톱까지 끊김 없는 반응형 레이아웃을 제공해야 하며, 터치 인터페이스에 최적화된 UX를 설계합니다.

### III. Hybrid Testing (TDD + E2E)
단위 테스트와 종단 간(E2E) 테스트를 병행하여 품질을 보장합니다. 핵심 비즈니스 로직은 TDD 방식으로 구현하며, 복잡한 사용자 시나리오(예: 카페 등록 후 지도 반영)는 Playwright를 이용한 E2E 테스트로 검증합니다. 모든 주요 기능은 자동화된 테스트 없이는 완료된 것으로 간주하지 않습니다.

### IV. Data Integrity & Security (데이터 무결성 및 보안)
사용자 데이터와 카페 정보의 무결성을 보호합니다. 모든 데이터 쓰기 작업은 Firebase 보안 규칙을 통해 인증된 사용자만 가능하도록 제한하며, 클라이언트 측 입력값 검증과 서버 측 보안 검증을 병행합니다. 민감한 API 키는 절대 코드에 노출하지 않고 환경 변수로 관리합니다.

### V. Performant & Smooth Map UX
지도 인터페이스는 사용자가 정보를 탐색하는 핵심 도구입니다. 10,000건 이상의 데이터에서도 0.5초 이내의 검색 성능을 유지해야 하며, 리스트 선택 시 지도는 부드럽게 이동(Smooth transition)해야 합니다. 성능 수치는 정기적인 벤치마크를 통해 검증합니다.

### VI. Reliable Delivery (E2E 보장)
모든 사용자 스토리는 독립적으로 테스트 가능하고 배포 가능해야 합니다. 기능 구현 후에는 반드시 `tasks.md`에 정의된 독립 테스트 기준을 통과해야 하며, 실제 환경과 유사한 조건에서 최종 검증을 수행합니다.

### VII. Infrastructure & Security Compliance (보안 정책 및 리소스 무결성)
외부 리소스(SDK, 라이브러리) 로드 시 반드시 SRI(Subresource Integrity)를 사용하여 무결성을 검증해야 합니다. 또한, 최신 브라우저의 보안 정책(예: COOP, COEP)을 준수하여 팝업 기반 인증 등이 차단되지 않도록 서버 및 개발 환경 설정을 유지해야 합니다.

## Security & Compliance

- **API Key Protection**: Kakao Map 및 Firebase API 키는 `.env` 파일을 통해서만 참조하며, `.gitignore`를 통해 저장소 유출을 방지합니다.
- **Privacy**: 사용자의 리뷰와 별점 정보는 공공의 이익을 위해 공유되나, 작성자의 식별 정보는 최소화하여 보호합니다.

## Development Workflow

- **Speckit Workflow**: 모든 기능 개발은 `/speckit.specify` -> `/speckit.plan` -> `/speckit.tasks` -> `/speckit.implement` 순서를 준수합니다.
- **Verification Gate**: 구현 전 `/speckit.analyze`를 통해 설계와 태스크의 일관성을 반드시 확인합니다.
- **Commit Convention**: `feat:`, `fix:`, `docs:`, `test:`, `chore:` 등의 접두사를 사용하여 의미 있는 커밋 메시지를 작성합니다.

## Governance
이 헌법은 카페 도감 프로젝트의 모든 의사결정과 코드 구현의 최상위 가이드라인입니다. 
1. **변경 절차**: 원칙의 추가/삭제/수정은 기술적 필요성에 대한 명확한 근거와 함께 제안되어야 합니다.
2. **버전 관리**: Semantic Versioning을 따르며, MAJOR 변경 시 기존 설계의 전수 재검토가 필요합니다.
3. **준수 확인**: 모든 PR 리뷰 시 헌법 원칙 위배 여부를 필수 항목으로 체크합니다.

**Version**: 1.2.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
