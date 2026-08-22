# 카탈로그 카테고리

각 카탈로그 항목은 하나의 아티팩트 종류, 하나의 주요 기능 카테고리, 그리고 0개 이상의 태그를
가집니다. 주요 카테고리는 항목이 어디에 나타날지를 결정합니다; 태그는 항목을 중복하지 않고
카테고리 간 검색을 제공합니다.

## 아티팩트 종류

<!-- catalog-policy:aggregators-never-entries -->

| 값 | 의미 | 플러그인으로 스타 순위가 매겨짐 |
|---|---|---:|
| `plugin` | 설치 가능한 네이티브 DSH 번들 | 모든 순위 조건이 충족될 때만 |
| `plugin-family` | 여러 DSH 플러그인을 포함하는 저장소 | 아니요; 별도 섹션 |
| `skin-theme` | DSH UI 스킨 또는 비주얼 테마 | 아니요; 별도 섹션 |
| `skill` | DSH 지원을 갖춘 에이전트 skill | 아니요 |
| `preset-profile` | DSH 프로필 또는 프리셋 | 아니요 |
| `client-interface` | 데스크톱, TUI, 에디터 또는 원격 클라이언트 | 아니요 |
| `bridge-adapter` | 다른 제품에서 DSH로의 통합 | 아니요 |
| `ecosystem-project` | DSH 통합을 포함하는 더 넓은 프로젝트 | 아니요 |

엄브렐라 저장소, 애그리게이터, 마켓플레이스, 인스톨러 카탈로그 또는 목록은 그 애그리게이터
자체가 설치 가능하더라도 절대 카탈로그 항목이 될 수 없습니다. 그것은 오직 단서로만 사용될 수
있습니다. 각 단서를 독립적으로 설치 가능한 자식 아티팩트까지 따라가서, 그것을 제출하기 전에
그 아티팩트의 실제 크리에이터, 원본 저장소, 패키지, 소스 서브패스를 확인하세요. 진짜 크리에이터의
모노레포가 자식 플러그인의 원본 저장소일 수 있지만, 그 자식은 정확한 서브패스와 모노레포 스타
정책을 사용해야 합니다.

`kind` 필드는 정규 DSH 아티팩트 판별자입니다. 별도의 통합 종류는 존재하지 않습니다: `plugin`은
이미 네이티브 DSH 번들을 의미하며, `ecosystem-project`는 이미 DSH 통합을 갖춘 더 넓은 프로젝트를
의미합니다. 이는 모순되는 분류 쌍을 방지합니다.

## 주요 기능 카테고리

| 값 | 표시 라벨 |
|---|---|
| `user-interface-dashboards` | 사용자 인터페이스와 대시보드 |
| `memory-rag` | 메모리와 RAG |
| `search-research` | 검색과 리서치 |
| `coding-developer-tools` | 코딩과 개발자 도구 |
| `browser-automation` | 브라우저와 자동화 |
| `vision-audio-multimodal` | 비전, 오디오, 멀티모달 |
| `sessions-productivity` | 세션과 생산성 |
| `security-permissions-approvals` | 보안, 권한, 승인 |
| `diagnostics-observability` | 진단과 관측 가능성 |
| `models-providers-routing` | 모델, 프로바이더, 라우팅 |
| `messaging-notifications` | 메시징과 알림 |
| `data-external-services` | 데이터와 외부 서비스 |
| `entertainment-customization` | 엔터테인먼트와 커스터마이징 |

가시성을 가장 많이 높일 것 같은 카테고리가 아니라, 플러그인의 주요 역할을 가장 잘 나타내는
카테고리를 선택하세요.

## 인터페이스 태그

표준 인터페이스 태그는 `web-ui`, `sidebar`, `settings`, `tui`, `cli`, `desktop`, `mobile`,
`remote`, `editor`, `headless`, `theme`를 포함합니다. 고정된 원본 소스에서 확인 가능한 증거를
설명하는 경우, 추가적인 소문자 kebab-case 기능 태그가 허용됩니다.

## 저장소 범위

저장소 스타가 정확히 카탈로그화된 그 플러그인에 속할 때만 `dedicated`를 사용하세요. 플러그인이
더 넓은 프로젝트 내부의 서브패스나 패키지일 때는 `monorepo`를 사용하세요. 모노레포 항목은
`popularity.starsPolicy: undefined-parent-repository`와 `popularity.stars: null`을 사용해야
합니다.

<!-- i18n-source-hash: 7b8e3dc5e30c5a9227179fe0caa70415b18a29014362c6b2a6fa4f7db37f82b4 -->
