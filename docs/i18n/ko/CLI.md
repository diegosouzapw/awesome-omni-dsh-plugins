# CLI 참조 — `@diegosouza.pw/dsh-plugins@0.1.0`

> 🌐 [English](../../docs/CLI.md) · **한국어**

> **비공식 커뮤니티 프로젝트입니다. DeepSeek와 제휴, 승인, 후원 관계가 없습니다.**
> DeepSeek의 이름과 상표는 각 소유자에게 귀속됩니다.

이 페이지는 배포된 CLI가 버전 `0.1.0`에서 정확히 어떻게 동작하는지를 문서화합니다. 아래의
모든 시놉시스와 플래그는 배포된 명령어 자체의 `--help` 출력에서 가져온 것입니다; 여기에는
아직 출시되지 않은 동작이 설명되어 있지 않습니다. CLI는 비공개 소스로부터 유지 관리되며,
스코프 패키지 [`@diegosouza.pw/dsh-plugins`](https://www.npmjs.com/package/@diegosouza.pw/dsh-plugins)로
npm에 배포됩니다.

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 --help
```

## v0.1.0의 설계 원칙

- **기본적으로 읽기 전용.** `catalog`, `search`, `info`, `list`, `doctor`는 절대 프로필을
  수정하거나, 파일을 쓰거나, 플러그인 코드를 실행하지 않습니다.
- **코드 실행을 위한 동의 게이트.** `add`, `update`, `remove`는 `--allow-code-execution`을
  전달하지 않는 한 DSH/pnpm 라이프사이클 코드 실행을 거부합니다. 이 플래그가 없으면
  `--dry-run`을 사용해 검증된 계획을 확인하세요.
- **네이티브 Windows 정책.** 코드 실행이 포함된 네이티브 Windows `add`/`update`/`remove`는
  v0.1.0에서 비활성화되어 있습니다; WSL을 사용하세요. 드라이런과 읽기 전용 명령어는 계속
  사용할 수 있으며, 네이티브 Windows 복구 마커는 문서화된 수동 복구를 필요로 합니다.
- **고정된 입력.** 카탈로그 입력은 로컬 디렉토리, 스냅샷 파일, 또는 선택적으로 정확한
  40자리 리비전에 고정된 정규 공개 스냅샷 URL일 수 있습니다.

## 공통 옵션

이 옵션들은 카탈로그를 소비하는 명령어들(`catalog validate`, `search`, `info`, `add`,
`update`, `remove`, `doctor`)에 나타납니다:

| 옵션                       | 의미                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `--catalog <path-or-url>`  | 로컬 카탈로그 디렉토리, 스냅샷 파일, 또는 고정된 정규 공개 스냅샷 URL |
| `--revision <sha>`         | 40자리 정확한 스냅샷 리비전                                           |
| `--json`                   | 안정적인 JSON 출력을 내보냅니다                                       |

전역 옵션: `-V, --version`은 CLI 버전을 출력합니다; `-h, --help`는 어떤 명령어에 대해서도
도움말을 출력합니다 (`dsh-plugins help [command]`도 작동합니다).

## 종료 코드

CLI는 관례적인 프로세스 종료 코드를 사용합니다:

|  종료 코드 | 의미                                                                              |
| ---------: | --------------------------------------------------------------------------------- |
| `0`        | 성공 (빈 카탈로그와 같은 "비어 있지만 유효한" 결과 포함)                          |
| `1`        | 실패: 검증 오류, 항목을 찾을 수 없음, 필수 옵션 누락, 또는 진단 검사가 오류를 보고함 |

v0.1.0에서 관측된 예시: 유효한 빈 카탈로그에서 `catalog validate`는 `0`으로 종료하며
`0 entries valid; catalog is empty`를 출력합니다; `info <unknown-id>`는 `1`로 종료하며
`Plugin not found`를 출력합니다; `doctor`는 어떤 검사(예: 누락된 `dsh` 실행 파일)든 오류를
보고하면 `1`로 종료합니다.

## 명령어

### `catalog` — 공개 카탈로그 표면을 검증합니다

```text
dsh-plugins catalog validate [--catalog <path-or-url>] [--revision <sha>] [--json]
dsh-plugins catalog docs-check [root]
dsh-plugins catalog github-forms-check [root]
```

- **`catalog validate`** — 카탈로그 YAML과 시맨틱스를 검증합니다: 안전한 YAML 파싱, 공개
  스키마, SPDX 표현식 파싱, 정확한 SemVer, SHA-512 SRI, 그리고 중복 ID / 저장소-노드-플러스-
  서브패스 거부. 이는 로컬이고 읽기 전용입니다: GitHub에 연결하거나, 저장소 신원을 확인하거나,
  고정된 커밋 시점의 증거를 검사하지 않습니다. 이는 `catalog-validation` CI 작업이 모든 카탈로그
  풀 리퀘스트에서 실행하는 것과 정확히 동일한 명령어입니다.
- **`catalog docs-check [root]`** — 필수 공개 카탈로그 문서가 존재하는지, Markdown 펜스가
  균형을 이루는지 확인합니다.
- **`catalog github-forms-check [root]`** — 구조화된 공개 GitHub 이슈 양식(클레임, 정정,
  제거)을 확인합니다.

```bash
# 저장소 루트에서:
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog validate --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog docs-check .
npx @diegosouza.pw/dsh-plugins@0.1.0 catalog github-forms-check .
```

### `search` — 공개 카탈로그 필드를 로컬에서 검색합니다

```text
dsh-plugins search [options] <query...>
```

선택된 카탈로그 입력에 대해 공개 카탈로그 필드를 로컬에서 검색합니다. 일치하는 항목을
출력하거나, 아무것도 일치하지 않으면 `No plugins found.`(종료 `0`)를 출력합니다.

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 search memory --catalog .
npx @diegosouza.pw/dsh-plugins@0.1.0 search notes markdown --catalog . --json
```

### `discover` — 카탈로그 너머의 플러그인을 찾습니다

```text
dsh-plugins discover [options] <query...>
```

> **배포된 `0.1.0`에는 포함되어 있지 않습니다.** `discover`는 `1.0.0`에서 배포됩니다; 이
> 페이지의 다른 모든 명령어는 현재 npm에 있는 버전에서 작동합니다. `@0.1.0`에 대해 실행하면
> 알 수 없는 명령어로 실패합니다.

먼저 큐레이션된 카탈로그를 검색한 다음 — `--offline`이 주어지지 않는 한 — 실시간 GitHub
`dsh-plugin` 토픽을 검색하므로, 아직 제출되지 않은 플러그인도 여전히 찾을 수 있습니다.
카탈로그 결과는 카탈로그가 보유한 증거(고정된 커밋, 크리에이터, 라이선스)를 담고 있으며,
커뮤니티 결과는 그중 어느 것도 담고 있지 않고 그렇게 표시됩니다. 그것들에 대해서는 아무것도
검토되지 않았기 때문입니다.

`--limit <n>`은 티어당 결과 수를 제한합니다 (기본값 `8`). `--json`은 절대 로컬라이즈되지
않는 안정적인 기계 형식을 내보냅니다.

```bash
npx @diegosouza.pw/dsh-plugins@1.0.0 discover memory --catalog .
npx @diegosouza.pw/dsh-plugins@1.0.0 discover vision --offline --catalog . --json
```

### `info` — 하나의 공개 카탈로그 항목을 표시합니다

```text
dsh-plugins info [options] <id>
```

정규 플러그인 ID로 하나의 공개 카탈로그 항목을 표시합니다. ID가 카탈로그에 없으면 `1`로
종료하며 `Plugin not found: <id>`를 출력합니다.

```bash
npx @diegosouza.pw/dsh-plugins@0.1.0 info example-notes-search --catalog .
```

### `add` — 공식 DSH 위임을 통해 카탈로그 플러그인 하나를 추가합니다

```text
dsh-plugins add [options] <id>
```

| 옵션                      | 의미                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| `--profile <name>`        | 변경할 DSH 프로필 (실질적으로 필수; 이것이 없으면 명령어가 오류를 냅니다) |
| `--dry-run`                | 파일이나 서브프로세스 없이 검증된 계획을 표시합니다               |
| `--allow-code-execution`   | DSH/pnpm 라이프사이클 코드에 동의합니다 (네이티브 Windows에서는 비활성화됨; WSL을 사용하세요) |
| `--catalog` / `--revision` / `--json` | 위의 공통 옵션                                       |

이 버전의 드라이런 시맨틱스: 명령어는 고정된 항목에 대한 계획을 해결하고 검증한 후 출력하며,
파일을 생성하거나 서브프로세스를 실행하지 않습니다. 실제 설치는 공식 DSH 도구로 위임되며
`--allow-code-execution`이 있을 때만 진행됩니다.

```bash
# 미리보기 전용 — 아무것도 기록되지 않고, 아무것도 실행되지 않습니다:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --dry-run

# 실제 설치 — 라이프사이클 코드에 대한 명시적 동의:
npx @diegosouza.pw/dsh-plugins@0.1.0 add example-notes-search --profile default --allow-code-execution
```

### `update` — 공식 DSH 위임을 통해 카탈로그 플러그인 하나를 업데이트합니다

```text
dsh-plugins update [options] <id>
```

`add`와 동일한 옵션과 동의 시맨틱스: `--profile <name>`, `--dry-run`,
`--allow-code-execution`, 그리고 공통 카탈로그 옵션.

### `remove` — 공식 DSH 위임을 통해 카탈로그가 관리하는 플러그인 하나를 제거합니다

```text
dsh-plugins remove [options] <id>
```

`add`와 동일한 옵션과 동의 시맨틱스. 카탈로그가 관리하는 설치만 제거됩니다.

### `recover` — 보류 중인 POSIX 변경을 복구합니다

```text
dsh-plugins recover
```

중단된 `add`/`update`/`remove` 이후 보류 중인 POSIX 변경을 복구합니다. 보류 중인 것이
없으면 `No mutation recovery is pending.`을 출력하고 `0`으로 종료합니다. 네이티브 Windows
복구는 문서화된 정책에 따라 계속 수동입니다.

### `list` — 카탈로그가 관리하는 설치를 나열합니다

```text
dsh-plugins list [--profile <name>] [--json]
```

프로필을 수정하지 않고 카탈로그가 관리하는 설치를 나열합니다. `--profile <name>`은 DSH
프로필로 필터링합니다. 설치된 것이 없으면 `No catalog-managed plugins installed.`를
출력하고 `0`으로 종료합니다.

### `doctor` — 읽기 전용 진단

```text
dsh-plugins doctor [--catalog <path-or-url>] [--revision <sha>] [--json]
```

Node, DSH, 네이티브 Windows 정책, 카탈로그에 대한 읽기 전용 진단을 실행합니다. 각 검사는
`ok` 또는 `error`를 보고합니다; 어떤 `error`든 전체 종료 코드를 `1`로 만듭니다. `dsh`
실행 파일이 없는 머신에서의 출력 예시:

```text
node [ok]: Node 24.16.0 is supported
dsh [error]: dsh executable was not found
catalog [ok]: catalog is valid and empty
```

## 로컬 검증이 증명하지 않는 것

초록불의 `catalog validate` 실행은 구조와 로컬 시맨틱스만 확인합니다. 원격 저장소 신원,
크리에이터의 소유권, 또는 고정된 커밋 시점의 증거를 증명하지는 않습니다 — 메인테이너는
[CONTRIBUTING.md](../../CONTRIBUTING.md)와 [docs/GOVERNANCE.md](../../docs/GOVERNANCE.md)에
설명된 대로, 병합 전에 이러한 별도의 프로버넌스 게이트를 적용합니다.

<!-- i18n-source-hash: 4f83ebb097bcbee07d61c5660c045f69c7b8d76a1d81184746f91f2b674cb298 -->
