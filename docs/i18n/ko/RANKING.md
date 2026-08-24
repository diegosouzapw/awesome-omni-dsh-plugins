# 순위 산정 방법론

> 🌐 [English](../../RANKING.md) · [Português (Brasil)](../pt-BR/RANKING.md) · [中文（简体）](../zh-CN/RANKING.md) · **한국어**

순위는 병합된 공개 카탈로그 항목에 대한 투명한 뷰입니다. 순위는 절대 숨겨진 결합 점수를
사용하지 않으며, 절대 넓은 부모 프로젝트의 스타를 플러그인의 인기도로 취급하지 않습니다.

## 스타 기준 상위 플러그인 판정식

항목은 아래의 모든 조건이 참일 때만 자격을 갖춥니다:

```text
kind == plugin (정규 네이티브 DSH 번들 판별자)
repositoryScope == dedicated
verification.status in [eligible, verified]
repository is active and not archived
stars belong to the exact plugin repository
entry is merged into the public catalog
```

자격을 갖춘 항목은 `popularity.starsPolicy: exact-repository`와 `popularity.stars`의 음수가
아닌 정수를 사용합니다. 동점인 경우 대소문자를 구분하지 않는 플러그인 ID를 결정론적인 표시
순서로 사용합니다; 이 동점 처리는 품질 차이를 의미하지 않습니다.

`kind`는 유일한 아티팩트 유형 판별자입니다. 스키마는 그것과 모순될 수 있는 두 번째 DSH 통합
종류를 의도적으로 저장하지 않습니다.

## 명시적 제외 대상

더 넓은 모노레포 안의 플러그인은 계속 카탈로그 자격을 갖추지만, 그 부모의 스타는 플러그인
순위에 대해 정의되지 않습니다. 그것은 `repositoryScope: monorepo`,
`popularity.starsPolicy: undefined-parent-repository`, `popularity.stars: null`을 사용해야
합니다. 이는 기능적 섹션에는 나타나지만 모든 스타 기반 순위에서는 제외됩니다.

플러그인 패밀리, 테마, 스킨, skill, 프리셋, 클라이언트, 인터페이스, 브릿지, 그리고 더 넓은
에코시스템 프로젝트는 스타 기준 상위 플러그인에 나타나지 않습니다. 이들은 비교 가능한 데이터가
존재하는 경우 별도의 섹션을 받습니다. 애그리게이터, 마켓플레이스, 인스톨러 카탈로그, 목록은
카탈로그 항목이 아니며 어떤 카탈로그 섹션도 받지 않습니다.

## 순위 뷰

프로젝트는 스타, 24시간 성장, 7일 성장, 최근 업데이트, 검증된 설치, 플러그인 패밀리, 테마와
스킨, 클라이언트와 인터페이스, 그리고 에코시스템 통합에 대한 별개의 뷰를 게시할 수 있습니다.
각 뷰는 자신만의 포함 규칙과 스냅샷 시각을 공개해야 합니다.

자격을 갖춘 항목이 0개일 때, 상위 플러그인은 렌더링되지 않습니다. 첫 번째 자격을 갖춘 병합이
상위 플러그인 뷰를 만듭니다; 자격을 갖춘 항목이 10개 존재한 이후에만 라벨이 "Top 10"으로
바뀝니다. 플레이스홀더나 조작된 순위는 허용되지 않습니다.

## 검증은 보증이 아닙니다

`eligible`은 공개 구조와 DSH 통합이 검증되었음을 의미합니다. `verified`는 추가로 고정된
소스나 패키지에 대해 설치 스모크 테스트가 통과했음을 의미합니다. 어느 상태도 보증, 보장 또는
절대적인 보안 인증이 아닙니다.

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
