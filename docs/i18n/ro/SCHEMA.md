# Referința schemei de intrare în catalog

> 🌐 [English](../../SCHEMA.md) · [Português (Brasil)](../pt-BR/SCHEMA.md) · [中文（简体）](../zh-CN/SCHEMA.md) · **Română**

> **Proiect comunitar neoficial. Nu este afiliat, susținut sau sponsorizat de DeepSeek.**
> Numele și mărcile DeepSeek aparțin proprietarului lor de drept.

Aceasta este referința câmp cu câmp pentru [`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml),
schema JSON publică (draft 2020-12) pe care trebuie să o satisfacă fiecare fișier sub
`catalog/plugins/`. Fișierul schemei în sine este sursa de adevăr; când această pagină și schema
nu sunt de acord, schema câștigă.

Se aplică două straturi de validare. Schema publică impune *forme sigure* delimitate (tipare și
lungimi care resping valori de tip opțiune sau nelimitate). Deasupra ei, `catalog validate` aplică
parsere semantice obligatorii: SemVer exact pentru versiuni, SHA-512 SRI pentru valorile de
integritate, parsarea expresiilor SPDX pentru licențe și respingerea cheilor duplicate. O valoare
poate să corespundă tiparului schemei și totuși să fie respinsă semantic.

Reguli de nivel superior: intrarea este un singur obiect YAML, `additionalProperties: false`
(câmpurile necunoscute sunt respinse) și **toate** câmpurile următoare sunt obligatorii.

## Câmpuri de nivel superior

| Câmp            | Tip     | Obligatoriu | Rezumat                                                       |
| ----------------- | ------- | :------: | ------------------------------------------------------------- |
| `schemaVersion`   | const   |   da    | Trebuie să fie exact `1`                                           |
| `id`              | string  |   da    | ID de intrare kebab-case cu litere mici; trebuie să corespundă numelui fișierului        |
| `name`            | string  |   da    | Nume de afișare, 1–120 de caractere                                |
| `description`     | object  |   da    | Rezumat curat în engleză plus calea dovezii lui                |
| `unofficial`      | const   |   da    | Trebuie să fie exact `true`                                        |
| `kind`            | enum    |   da    | Discriminator canonic al artefactului                              |
| `primaryCategory` | enum    |   da    | O singură categorie primară de capabilitate                            |
| `tags`            | array   |   da    | Tag-uri unice kebab-case cu litere mici (pot fi goale)               |
| `source`          | object  |   da    | Repository-ul original, ID-ul de nod, subpath-ul și commit-ul fixat       |
| `creator`         | object  |   da    | Handle-ul public GitHub al creatorului                                |
| `package`         | object  |   da    | Descriptor canonic de instalare (npm **sau** source)              |
| `dsh`             | object  |   da    | Profiluri DSH și calea dovezii de integrare nativă             |
| `repositoryScope` | enum    |   da    | `dedicated` sau `monorepo`                                     |
| `popularity`      | object  |   da    | Politica de stele și numărul de stele (condiționat de scop)            |
| `license`         | object  |   da    | Expresia de licență SPDX din amonte                              |
| `verification`    | object  |   da    | Starea verificării, momentul verificării, identitatea și smoke-testul      |
| `provenance`      | object  |   da    | URL-uri publice de Discussion/comentariu sau `null`                      |

### `schemaVersion`

Constantă `1`. Identifică versiunea 1 a schemei publice; orice altă valoare este invalidă.

### `id`

String care corespunde tiparului `^[a-z0-9]+(?:-[a-z0-9]+)*$` — kebab-case cu litere mici, fără
cratime la început/sfârșit sau duble. Conform [CONTRIBUTING.md](../../CONTRIBUTING.md), fișierul
intrării trebuie să fie numit `catalog/plugins/<id>.yaml` cu valoarea identică; validatorul
respinge o nepotrivire (`id-filename-mismatch`). ID-ul trebuie de asemenea să înceapă cu
namespace-ul creatorului: handle-ul `creator.github` cu litere mici, cu fiecare secvență de
caractere din afara `[a-z0-9]` redusă la un singur `-`, urmat de `-` (`id-creator-prefix`).

### `name`

Nume de afișare în format liber, `minLength: 1`, `maxLength: 120`.

### `description`

Obiect cu exact două proprietăți obligatorii (altele nu sunt permise):

| Proprietate    | Tip   | Reguli                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `en`           | string | Rezumat în engleză, 20–320 de caractere                                    |
| `evidencePath` | string | Tipar de cale relativă de repository; fără `/` la început, fără backslash-uri, fără segmente `.`/`..` |

Rezumatul în engleză trebuie curat din fișierul de la `evidencePath`, așa cum există el la
`source.commit` — nu copiat dintr-un alt catalog.

### `unofficial`

Constantă `true`. Marker lizibil de mașină că listarea este neoficială.

### `kind`

**Singurul** discriminator de tip de artefact (nu există un al doilea câmp de tip de integrare).
Unul dintre:

`plugin` · `plugin-family` · `skin-theme` · `skill` · `preset-profile` · `client-interface` ·
`bridge-adapter` · `ecosystem-project`

Semnificațiile și consecințele pentru clasament sunt definite în
[docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `primaryCategory`

Una dintre cele treisprezece categorii de capabilitate:

`user-interface-dashboards` · `memory-rag` · `search-research` · `coding-developer-tools` ·
`browser-automation` · `vision-audio-multimodal` · `sessions-productivity` ·
`security-permissions-approvals` · `diagnostics-observability` · `models-providers-routing` ·
`messaging-notifications` · `data-external-services` · `entertainment-customization`

Etichetele de afișare și ghidajul de alegere sunt în [docs/CATEGORIES.md](../../docs/CATEGORIES.md).

### `tags`

Tablou de stringuri unice, fiecare corespunzând tiparului `^[a-z0-9]+(?:-[a-z0-9]+)*$` (kebab-case
cu litere mici). Schema nu impune un număr minim.

### `source`

Obiect cu exact patru proprietăți obligatorii:

| Proprietate        | Tip           | Reguli                                                                  |
| ------------------ | -------------- | ---------------------------------------------------------------------- |
| `repository`       | string         | URL `https://github.com/<owner>/<repo>`; ownerul respectă regulile de nume de utilizator GitHub, numele repository-ului are 1–100 de caractere, nu poate fi `.`/`..` și nu se poate termina în `.git` |
| `repositoryNodeId` | string         | ID imuabil de nod GitHub al repository-ului, nevid                         |
| `subpath`          | string sau null | Subpath-ul pluginului în repository (același tipar sigur de cale relativă ca `evidencePath`), sau `null` pentru un plugin din rădăcina repository-ului |
| `commit`           | string         | OID complet de commit, 40 de caractere hexazecimale                               |

Validarea catalogului trebuie să rezolve `repositoryNodeId` și să respingă o nepotrivire de URL de
repository — acea rezolvare este o poartă a întreținătorilor, nu parte a verificării structurale
locale.

### `creator`

Obiect cu o singură proprietate obligatorie:

| Proprietate | Tip   | Reguli                                             |
| -------- | ------ | ------------------------------------------------- |
| `github` | string | Nume de utilizator GitHub (1–39 de caractere, regulile de handle GitHub) |

URL-ul public de profil este derivat întotdeauna ca `https://github.com/<handle>`; nu este stocat
un al doilea câmp de profil, astfel încât cele două nu pot diverge niciodată.

### `package`

Descriptorul canonic de instalare. Este dată, niciodată o comandă shell, și ia exact una dintre
două forme (`oneOf`):

**pachet npm** — obligatorii `ecosystem`, `name`, `version`; opțional `integrity`:

| Proprietate | Tip  | Reguli                                                                      |
| ----------- | ----- | -------------------------------------------------------------------------- |
| `ecosystem` | const | `npm`                                                                      |
| `name`      | string | Formă de nume de pachet npm (opțional cu scope), max 214 caractere                 |
| `version`   | string | Formă exactă de versiune `x.y.z` (prerelease/build opționale); intervalele sunt respinse. Stratul semantic cere în plus un SemVer exact, parsabil |
| `integrity` | string | Formă opțională `sha512-…` SRI, 8–256 de caractere. Stratul semantic trebuie să îl parseze ca SHA-512 SRI valid |

**instalare din sursă** — obligatoriu doar `ecosystem`:

| Proprietate | Tip  | Reguli    |
| ----------- | ----- | -------- |
| `ecosystem` | const | `source` |

Un descriptor sursă nu stochează intenționat nimic altceva: repository-ul, commit-ul și subpath-ul
sunt derivate din `source`, astfel încât valorile mutabile nu sunt niciodată duplicate.

### `dsh`

Dovezi ale integrării DSH native:

| Proprietate    | Tip   | Reguli                                                          |
| -------------- | ------ | -------------------------------------------------------------- |
| `profiles`     | array  | Cel puțin un nume unic de profil care corespunde tiparului `^[A-Za-z0-9][A-Za-z0-9._-]*$` |
| `evidencePath` | string | Cale relativă sigură către dovezile integrării DSH la `source.commit` |

### `repositoryScope`

Fie `dedicated` (stelele repository-ului aparțin exact acestui plugin), fie `monorepo` (pluginul
este un subpath sau un pachet într-un proiect mai larg). Această valoare conduce regulile
condiționale de popularitate de mai jos.

### `popularity`

| Proprietate  | Tip            | Reguli                                                |
| ------------ | --------------- | ---------------------------------------------------- |
| `starsPolicy`| enum            | `exact-repository` sau `undefined-parent-repository`  |
| `stars`      | integer sau null | Întreg nenegativ, sau `null`                      |

Reguli condiționale (impuse de blocurile `allOf` ale schemei):

- `repositoryScope: monorepo` **forțează** `starsPolicy: undefined-parent-repository` și
  `stars: null`. Stelele proiectului-părinte nu sunt niciodată atribuite unui plugin de monorepo.
- `repositoryScope: dedicated` **forțează** `starsPolicy: exact-repository` și un întreg
  `stars >= 0`.

Vezi [docs/RANKING.md](../../docs/RANKING.md) pentru cum alimentează aceste valori predicatul de
clasament.

### `license`

| Proprietate | Tip   | Reguli                                                          |
| -------- | ------ | -------------------------------------------------------------- |
| `spdx`   | string | Formă de expresie SPDX, 2–256 de caractere, fără cratimă la început          |

Schema impune doar o formă sigură de caractere; validarea catalogului trebuie să parseze și să
normalizeze valoarea cu un parser real de expresii SPDX. Înregistrează expresia completă din
amonte, dovedită la commit-ul fixat (de exemplu `Apache-2.0` sau `MIT OR GPL-3.0-only`).

### `verification`

Verificarea se aplică la `source.commit`. Obiect cu patru proprietăți obligatorii:

| Proprietate          | Tip           | Reguli                                                  |
| -------------------- | -------------- | ------------------------------------------------------ |
| `status`             | enum           | `eligible` · `verified` · `stale` · `unavailable` · `archived` · `quarantined` |
| `checkedAt`          | string         | Timestamp în format `date-time` al verificării           |
| `repositoryIdentity` | const          | Trebuie să fie `resolved`                                     |
| `smokeTest`          | object sau null | Înregistrarea smoke-testului, sau `null` când nu există un test calificat |

Când este prezent, `smokeTest` cere:

| Proprietate     | Tip   | Reguli                                                             |
| --------------- | ------ | ----------------------------------------------------------------- |
| `installTarget` | const  | `canonical-install-descriptor` — referă `package` sau sursa fixată, fără a duplica valori mutabile |
| `check`         | object | `name` obligatoriu (formă de nume de pachet) și `version` (formă exactă de versiune) |
| `result`        | const  | `passed` — un smoke-test eșuat nu este înregistrat ca smoke test    |

Regulă condițională: `status: verified` **cere** un obiect `smokeTest` nenul. Intrările fără dovezi
smoke revizuibile folosesc `status: eligible` și `smokeTest: null`. Niciun status nu este o
susținere sau o certificare de securitate — vezi [docs/RANKING.md](../../docs/RANKING.md).

### `provenance`

Linkuri publice de proveniență, fiecare URI sau `null`:

| Proprietate  | Tip          | Reguli                                            |
| ------------ | ------------- | ------------------------------------------------ |
| `discussion` | string sau null | URL public de Discussion, când există unul            |
| `comment`    | string sau null | URL public de comentariu, când există unul               |

## Ce nu verifică schema

Schema este intenționat locală și structurală. **Nu** verifică faptul că repository-ul există, că
ID-ul de nod corespunde URL-ului, că există căile de dovezi la commit-ul fixat, că numărul de
stele este exact sau că creatorul deține sursa. Acele verificări aparțin porților de review ale
întreținătorilor, descrise în [CONTRIBUTING.md](../../CONTRIBUTING.md) și
[docs/GOVERNANCE.md](../../docs/GOVERNANCE.md).

<!-- i18n-source-hash: d1232382b38d13680fc8bbadf837b3f7c51c0aae9f5b5ec10118d8dfa84b62a0 -->
