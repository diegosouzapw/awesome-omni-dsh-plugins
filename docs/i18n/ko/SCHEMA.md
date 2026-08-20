# 카탈로그 항목 스키마 참조

> 🌐 [English](../../docs/SCHEMA.md) · **한국어**

> **비공식 커뮤니티 프로젝트입니다. DeepSeek와 제휴, 승인, 후원 관계가 없습니다.**
> DeepSeek의 이름과 상표는 각 소유자에게 귀속됩니다.

이것은 [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml)의 필드별 참조입니다.
이는 `catalog/plugins/` 아래의 모든 파일이 만족해야 하는 공개 JSON Schema (draft 2020-12)입니다.
스키마 파일 자체가 신뢰할 수 있는 원천 데이터입니다; 이 페이지와 스키마가 일치하지 않을 경우,
스키마가 우선합니다.

두 계층의 검증이 적용됩니다. 공개 스키마는 제한된 *안전한 형태*(옵션처럼 보이거나 제한되지
않은 값을 거부하는 패턴과 길이)를 강제합니다. 그 위에, `catalog validate`는 필수 시맨틱
파서를 적용합니다: 버전을 위한 정확한 SemVer, 무결성 값을 위한 SHA-512 SRI, 라이선스를 위한
SPDX 표현식 파싱, 그리고 중복 키 거부. 값이 스키마 패턴과 일치하더라도 시맨틱적으로 거부될 수
있습니다.

최상위 규칙: 항목은 단일 YAML 객체이며, `additionalProperties: false`(알려지지 않은 필드는
거부됨)이고, 다음 필드 **모두**가 필수입니다.

## 최상위 필드

| 필드                | 유형    | 필수 | 요약                                                          |
| ------------------- | ------- | :--: | ------------------------------------------------------------- |
| `schemaVersion`     | const   | 예   | 정확히 `1`이어야 함                                            |
| `id`                 | string  | 예   | 소문자 kebab-case 항목 ID; 파일명과 일치해야 함                |
| `name`               | string  | 예   | 표시 이름, 1–120자                                             |
| `description`        | object  | 예   | 큐레이션된 영어 요약과 그 증거 경로                            |
| `unofficial`         | const   | 예   | 정확히 `true`이어야 함                                         |
| `kind`               | enum    | 예   | 정규 아티팩트 판별자                                           |
| `primaryCategory`    | enum    | 예   | 단일 주요 기능 카테고리                                        |
| `tags`               | array   | 예   | 고유한 소문자 kebab-case 태그 (비어 있을 수 있음)              |
| `source`              | object  | 예   | 원본 저장소, 노드 ID, 서브패스 및 고정된 커밋                  |
| `creator`             | object  | 예   | 크리에이터의 공개 GitHub 핸들                                  |
| `package`             | object  | 예   | 정규 설치 디스크립터 (npm **또는** source)                     |
| `dsh`                  | object  | 예   | DSH 프로필과 네이티브 통합 증거 경로                          |
| `repositoryScope`     | enum    | 예   | `dedicated` 또는 `monorepo`                                   |
| `popularity`          | object  | 예   | 스타 정책과 스타 수 (범위에 조건부)                            |
| `license`              | object  | 예   | 업스트림 SPDX 라이선스 표현식                                  |
| `verification`         | object  | 예   | 검증 상태, 확인 시각, 신원 및 스모크 테스트                     |
| `provenance`           | object  | 예   | 공개 Discussion/댓글 URL 또는 `null`                           |

### `schemaVersion`

상수 `1`. 공개 스키마 버전 1을 식별합니다; 다른 어떤 값도 유효하지 않습니다.

### `id`

`^[a-z0-9]+(?:-[a-z0-9]+)*$`와 일치하는 문자열 — 소문자 kebab-case, 선행/후행 또는 이중
하이픈 없음. [CONTRIBUTING.md](../../CONTRIBUTING.md)에 따라, 항목 파일은 동일한 값으로
`catalog/plugins/<id>.yaml`이라는 이름이어야 합니다.

### `name`

자유 형식 표시 이름, `minLength: 1`, `maxLength: 120`.

### `description`

정확히 두 개의 필수 속성을 가진 객체(다른 어떤 것도 허용되지 않음):

| 속성           | 유형   | 규칙                                                                       |
| -------------- | ------ | ---------------------------------------------------------------------------- |
| `en`            | string | 영어 요약, 20–320자                                                          |
| `evidencePath`  | string | 저장소에 대한 상대 경로 패턴; 선행 `/` 없음, 백슬래시 없음, `.`/`..` 세그먼트 없음 |

영어 요약은 다른 카탈로그에서 복사되지 않고 `source.commit` 시점에 존재하는 `evidencePath`의
파일로부터 큐레이션되어야 합니다.

### `unofficial`

상수 `true`. 목록이 비공식임을 나타내는 기계 판독 가능한 마커.

### `kind`

**유일한** 아티팩트 유형 판별자(두 번째 통합 유형 필드는 존재하지 않음). 다음 중 하나입니다:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

의미와 순위에 미치는 영향은 [docs/CATEGORIES.md](../../docs/CATEGORIES.md)에 정의되어
있습니다.

### `primaryCategory`

13개의 기능 카테고리 중 하나:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

표시 라벨과 선택 가이드는 [docs/CATEGORIES.md](../../docs/CATEGORIES.md)에 있습니다.

### `tags`

각각 `^[a-z0-9]+(?:-[a-z0-9]+)*$`(소문자 kebab-case)와 일치하는 고유한 문자열의 배열.
스키마는 최소 개수를 강제하지 않습니다.

### `source`

정확히 네 개의 필수 속성을 가진 객체:

| 속성                | 유형             | 규칙                                                                    |
| -------------------- | ---------------- | --------------------------------------------------------------------------- |
| `repository`          | string           | `https://github.com/<owner>/<repo>` URL; owner는 GitHub 사용자명 규칙을 따르고, repo 이름은 1–100자이며, `.`/`..`일 수 없고 `.git`으로 끝날 수 없음 |
| `repositoryNodeId`     | string           | 불변의 GitHub 저장소 노드 ID, 비어 있지 않음                              |
| `subpath`              | string 또는 null | 저장소 내 플러그인 서브패스(`evidencePath`와 동일한 안전한 상대 경로 패턴), 또는 저장소 루트 플러그인의 경우 `null` |
| `commit`               | string           | 40자리 전체 16진수 커밋 OID                                              |

카탈로그 검증은 `repositoryNodeId`를 확인하고 저장소 URL 불일치를 거부해야 합니다 — 이 확인은
로컬 구조 검사의 일부가 아니라 메인테이너 측 게이트입니다.

### `creator`

하나의 필수 속성을 가진 객체:

| 속성      | 유형   | 규칙                                                |
| --------- | ------ | ------------------------------------------------------ |
| `github`   | string | GitHub 사용자명 (1–39자, GitHub 핸들 규칙)               |

공개 프로필 URL은 항상 `https://github.com/<handle>`로 도출됩니다; 두 번째 프로필 필드는
저장되지 않으므로, 둘이 서로 어긋날 수 없습니다.

### `package`

정규 설치 디스크립터. 이는 데이터이며 결코 셸 명령어가 아니고, 정확히 두 형태 중 하나를
취합니다 (`oneOf`):

**npm 패키지** — `ecosystem`, `name`, `version` 필수; `integrity` 선택:

| 속성        | 유형   | 규칙                                                                       |
| ----------- | ------ | ------------------------------------------------------------------------------ |
| `ecosystem`  | const  | `npm`                                                                           |
| `name`       | string | npm 패키지 이름 형태(선택적으로 스코프됨), 최대 214자                          |
| `version`    | string | 정확한 `x.y.z` 버전 형태(선택적 prerelease/build); 범위는 거부됨. 시맨틱 계층은 추가로 파싱 가능한 정확한 SemVer를 요구함 |
| `integrity`  | string | 선택적 `sha512-…` SRI 형태, 8–256자. 시맨틱 계층은 이를 유효한 SHA-512 SRI로 파싱해야 함 |

**소스 설치** — `ecosystem`만 필수:

| 속성        | 유형   | 규칙     |
| ----------- | ------ | -------- |
| `ecosystem`  | const  | `source` |

소스 디스크립터는 의도적으로 그 밖의 아무것도 저장하지 않습니다: 저장소, 커밋, 서브패스는
`source`로부터 도출되므로, 가변적인 값이 절대 중복되지 않습니다.

### `dsh`

네이티브 DSH 통합 증거:

| 속성            | 유형   | 규칙                                                                     |
| --------------- | ------ | ------------------------------------------------------------------------------ |
| `profiles`       | array  | `^[A-Za-z0-9][A-Za-z0-9._-]*$`와 일치하는 최소 하나의 고유한 프로필 이름         |
| `evidencePath`    | string | `source.commit` 시점의 DSH 통합 증거에 대한 안전한 상대 경로                   |

### `repositoryScope`

`dedicated`(저장소 스타가 이 정확한 플러그인에 속함) 또는 `monorepo`(플러그인이 더 넓은
프로젝트 내부의 서브패스나 패키지임) 중 하나. 이 값은 아래의 조건부 인기도 규칙을 결정합니다.

### `popularity`

| 속성          | 유형               | 규칙                                                     |
| ------------- | ------------------- | ------------------------------------------------------------ |
| `starsPolicy`  | enum                | `exact-repository` 또는 `undefined-parent-repository`         |
| `stars`        | integer 또는 null   | 음수가 아닌 정수, 또는 `null`                                 |

조건부 규칙 (스키마의 `allOf` 블록에 의해 강제됨):

- `repositoryScope: monorepo`는 `starsPolicy: undefined-parent-repository`와 `stars: null`을
  **강제합니다**. 부모 프로젝트의 스타는 절대 모노레포 플러그인에 귀속되지 않습니다.
- `repositoryScope: dedicated`는 `starsPolicy: exact-repository`와 정수 `stars >= 0`을
  **강제합니다**.

이 값들이 순위 판별식에 어떻게 반영되는지는 [docs/RANKING.md](../../docs/RANKING.md)를
참고하세요.

### `license`

| 속성      | 유형   | 규칙                                                            |
| --------- | ------ | -------------------------------------------------------------------- |
| `spdx`     | string | SPDX 표현식 형태, 2–256자, 선행 하이픈 없음                            |

스키마는 안전한 문자 형태만 강제합니다; 카탈로그 검증은 실제 SPDX 표현식 파서로 값을 파싱하고
정규화해야 합니다. 고정된 커밋 시점에 증거로 확인된 완전한 업스트림 표현식을 기록하세요
(예: `Apache-2.0` 또는 `MIT OR GPL-3.0-only`).

### `verification`

검증은 `source.commit`에 적용됩니다. 네 개의 필수 속성을 가진 객체:

| 속성                    | 유형             | 규칙                                                    |
| ------------------------ | ----------------- | ------------------------------------------------------------ |
| `status`                  | enum              | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`               | string            | 확인 시각의 `date-time` 형식 타임스탬프                        |
| `repositoryIdentity`      | const             | `resolved`이어야 함                                            |
| `smokeTest`               | object 또는 null  | 스모크 테스트 기록, 또는 자격을 갖춘 테스트가 없을 경우 `null`  |

존재할 경우, `smokeTest`는 다음을 요구합니다:

| 속성              | 유형   | 규칙                                                                |
| ------------------ | ------ | -------------------------------------------------------------------------- |
| `installTarget`     | const  | `canonical-install-descriptor` — 가변적인 값을 중복하지 않고 `package`나 고정된 소스를 참조함 |
| `check`              | object | 필수 `name`(패키지 이름 형태)과 `version`(정확한 버전 형태)                 |
| `result`             | const  | `passed` — 실패한 스모크 테스트는 스모크 테스트로 기록되지 않음             |

조건부 규칙: `status: verified`는 null이 아닌 `smokeTest` 객체를 **요구합니다**. 검토 가능한
스모크 테스트 증거가 없는 항목은 `status: eligible`과 `smokeTest: null`을 사용합니다. 어떤
상태도 보증이나 보안 인증이 아닙니다 — [docs/RANKING.md](../../docs/RANKING.md)를 참고하세요.

### `provenance`

공개 프로버넌스 링크, 각각 URI 또는 `null`:

| 속성         | 유형              | 규칙                                              |
| ------------ | ----------------- | -------------------------------------------------- |
| `discussion`  | string 또는 null  | 존재할 경우 공개 Discussion URL                     |
| `comment`     | string 또는 null  | 존재할 경우 공개 댓글 URL                           |

## 스키마가 검사하지 않는 것

스키마는 의도적으로 로컬적이고 구조적입니다. 저장소가 존재하는지, 노드 ID가 URL과 일치하는지,
증거 경로가 고정된 커밋 시점에 존재하는지, 스타 수가 정확한지, 또는 크리에이터가 소스를
소유하는지를 **검증하지 않습니다**. 이러한 검사는
[CONTRIBUTING.md](../../CONTRIBUTING.md)와 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)에
설명된 메인테이너 검토 게이트에 속합니다.

<!-- i18n-source-hash: 8803e392a6a1668bc8cfe3451ec41e804fb2943046a0a7e6b0301caf42aae034 -->
