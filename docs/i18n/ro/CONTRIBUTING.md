# Cum contribui

> 🌐 [English](../../CONTRIBUTING.md) · **Română**

> **Proiect comunitar neoficial. Nu este afiliat, susținut sau sponsorizat de DeepSeek.**
> Numele și mărcile DeepSeek aparțin proprietarului lor de drept.

Îți mulțumim că îmbunătățești catalogul. Contribuțiile sunt centrate pe creatori: folosește dovezi
din repository-ul original, păstrează atribuirea și menține fiecare plugin revizuibil independent.
Catalogul pornește gol prin design; nicio intrare nu este acceptată fără propriul pull request
revizuit.

## Începe cu creatorul

Un pull request deschis direct de creatorul pluginului sau de organizația care îl deține este
întotdeauna preferat. Dacă creatorul este gata să contribuie, folosește ramura și pull request-ul
lui în loc să recreezi munca lui într-o ramură de curator sau de automatizare.

Curatoria comunitară este binevenită când ajută un creator care nu a deschis un pull request. Ea nu
stabilește proprietate sau prioritate față de o contribuție directă ulterioară a creatorului.

<!-- catalog-policy:one-plugin-per-branch-and-pr -->

## Un plugin per ramură și per pull request

Creează o ramură dedicată pentru un singur plugin și deschide un singur pull request din acea
ramură. Ramura și pull request-ul trebuie să creeze sau să modifice exact un fișier YAML sub
`catalog/plugins/`. Nu amesteca pluginuri, curățenie de documentație, indexuri generate sau
întreținere fără legătură în acea ramură sau în acel pull request.

ID-ul intrării și numele fișierului trebuie să fie aceeași valoare kebab-case cu litere mici.
Întreținătorii revizuiesc și integrează fiecare pull request de plugin individual; un lot care
conține mai multe pluginuri nu este împărțit și nici integrat parțial.

## Rezolvă sursa originală

Fiecare câmp public trebuie reconstruit din repository-ul original al creatorului, pachetul,
manifestul, README-ul, licența sau release-ul de la commit-ul fixat. Nu copia proza, atribuirea de
categorie, capturile de ecran, clasamentul, badge-urile sau metadatele generate ale unui alt
catalog sau agregator. Un link găsit într-un proiect-umbrelă, marketplace, listă sau agregator este
doar un indiciu, nu o dovadă și nici sursa pluginului.

Nu trimite niciodată un proiect-umbrelă, agregator, marketplace, catalog de instalare sau listă ca
intrare de catalog, chiar dacă este instalabil independent. Folosește-l doar ca indiciu și rezolvă
fiecare plugin-copil instalabil independent până la creatorul lui real și repository-ul original.
Un plugin din monorepo-ul real al creatorului său poate fi trimis din subpath-ul lui exact, dar
trebuie să respecte politica de stele pentru monorepo de mai jos.

## Dovezi obligatorii

Furnizează toate acestea în pull request:

- URL-ul public canonic al repository-ului original și ID-ul imuabil de nod al repository-ului.
  Întreținătorii rezolvă ID-ul de nod și resping nepotrivirile de URL în poarta separată de
  proveniență.
- Handle-ul public GitHub al creatorului și URL-ul public de profil corespunzător. YAML-ul
  stochează handle-ul o singură dată; URL-ul de profil este derivat ca
  `https://github.com/<handle>`.
- Un OID complet de commit sursă de 40 de caractere și subpath-ul exact al pluginului, sau `null`
  pentru un plugin din rădăcina repository-ului.
- O descriere în engleză delimitată și calea dovezii ei la acel commit fixat.
- `kind`-ul artefactului, categoria primară și tag-urile alese din
  [docs/CATEGORIES.md](../../docs/CATEGORIES.md).
- Expresia completă de licență SPDX din amonte, dovedită la commit-ul fixat.
- Un descriptor de instalare canonic fixat la o versiune npm exactă, sau la repository-ul sursă,
  commit-ul complet și subpath. Descriptorul este dată, niciodată o comandă shell.
- Dovezi ale integrării DSH native și calea lor la commit-ul fixat.
- Dovezi smoke existente, nesensibile, pentru exact acel pin de artefact, sau valoarea explicită
  `not run`. Nu instala pluginul și nu executa cod de ciclu de viață `preinstall`, `install`,
  `postinstall`, `prepare` sau alt cod de pachet/plugin doar pentru a pregăti o contribuție la
  catalog.
- Pentru un repository dedicat, numărul de stele verificabil pentru exact acel repository, împreună
  cu sursa publică și momentul verificării. Pentru un plugin de monorepo, folosește politica null
  obligatorie de mai jos.
- Proveniență din Discussion sau comentariu public, când există; altfel folosește `null`.
- Valoarea lizibilă de mașină `unofficial: true`.

Dacă nu există deja un smoke-test calificat, folosește `verification.status: eligible` și
`verification.smokeTest: null`. Folosește `verified` doar când există dovezi smoke revizuibile
pentru pinul exact. Niciuna dintre stări nu este o susținere sau o certificare de securitate.

Nu trimite niciodată credențiale, cookie-uri, adrese de e-mail private, cod sursă nepublicat sau
alte secrete.

## Reguli YAML și de schemă

Creează `catalog/plugins/<plugin-id>.yaml` și validează-l față de
[`schemas/plugin.schema.yaml`](../../schemas/plugin.schema.yaml). `id`-ul trebuie să fie egal cu
numele de bază al fișierului și trebuie să înceapă cu namespace-ul tău: handle-ul tău
`creator.github` cu litere mici (orice secvență de caractere din afara `[a-z0-9]` devine un singur
`-`) urmat de `-`, de exemplu `some-creator-my-plugin` pentru handle-ul `Some-Creator`. Validarea
catalogului impune ambele. Schema este sursa de adevăr pentru numele câmpurilor și valorile permise;
[docs/CATEGORIES.md](../../docs/CATEGORIES.md) definește cum se alege unicul `kind` de artefact,
categoria primară, tag-urile și scopul repository-ului.

Un descriptor npm trebuie să conțină un nume de pachet valid și o versiune exactă. Schema publică
respinge valori de tip opțiune și nelimitate, dar nu reimplementează SemVer sau SRI: validarea
catalogului trebuie să parseze versiunea, să ceară SemVer exact și să parseze orice valoare de
integritate ca SHA-512 SRI valid. Un descriptor sursă este legat de `source.repository`,
`source.commit` și `source.subpath`, fără a duplica valori sursă mutabile.

Instalatoarele trebuie să folosească tablouri de argumente, să dezactiveze execuția shell și să
plaseze un terminator de opțiuni înaintea valorilor poziționale furnizate de catalog, acolo unde
comanda invocată îl suportă. Validarea la trimitere nu trebuie să invoce un instalator sau ciclul
de viață al pluginului.

<!-- catalog-validation:local-structure-and-semantics-only -->

`catalog validate` este o verificare locală, read-only, structurală și semantică. Parsează YAML
sigur, validează schema publică, parsează expresii SPDX, cere SemVer exact și SHA-512 SRI valid și
respinge ID-urile duplicate și cheile canonice repository-node-plus-subpath. Nu contactează GitHub,
nu rezolvă identitatea repository-ului și nu inspectează căile de dovezi la commit-ul fixat.

<!-- maintainer-gate:repository-origin-and-pinned-evidence -->

Înainte ca o intrare să ajungă `eligible`, întreținătorii rezolvă separat repository-ul canonic și
ID-ul de nod, leagă creatorul de sursa originală și inspectează descrierea declarată, licența,
integrarea DSH și dovezile smoke la `source.commit`. Un rezultat local verde de validare nu este
dovadă de proveniență sau de origine.

## Stelele repository-ului

Doar stelele care aparțin verificabil exact repository-ului dedicat al pluginului pot fi
înregistrate. Stelele unui proiect-părinte nu trebuie niciodată atribuite unui plugin stocat
într-un monorepo mai larg. O intrare de monorepo rămâne eligibilă pentru secțiunile funcționale ale
catalogului, dar trebuie să declare:

```yaml
repositoryScope: monorepo
popularity:
  starsPolicy: undefined-parent-repository
  stars: null
```

O intrare dedicată folosește `repositoryScope: dedicated`, `starsPolicy: exact-repository` și
numărul nenegativ de stele observat pe același repository. Citește
[docs/RANKING.md](../../docs/RANKING.md) înainte de a trimite date de popularitate.

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

## Prioritatea creatorului și contact respectuos

Pentru același plugin canonic, prioritatea este:

1. Un pull request deschis de creator sau de organizația care îl deține.
2. Un pull request comunitar aprobat explicit de creator.
3. Un pull request valid existent de curatore comunitară.
4. Un pull request de automatizare a catalogului.

Un pull request direct al creatorului înlocuiește orice pull request deschis de curatore sau de
automatizare, indiferent care a fost deschis primul sau care este mai avansat. Pull request-ul
creatorului devine vehiculul de review; întreținătorii nu fac force-push pe ramura creatorului și
nu îi transplantă munca în pull request-ul curat. Dacă o intrare curată a fost deja integrată,
istoricul public nu este rescris. Creatorul poate folosi o cerere de revendicare sau de corectare
și apoi poate contribui direct cu un pull request de continuare.

Un pull request curat ar trebui să folosească o singură mențiune publică respectuoasă `@creator` în
descrierea lui, lângă un link către repository-ul original, invitând creatorul să îl revizuiască
sau să îl înlocuiască cu un pull request direct. Nu repeta mențiunea, nu deschide issue-uri
promoționale, nu posta încrucișat, nu trimite mesaje directe nesolicitate și nu spam-a creatorul în
niciun alt mod.

<!-- creator-first:source-bound-git-identity -->

Pull request-urile și commit-urile create de autorul pluginului păstrează creditul creatorului în
mod natural. Commit-urile curate pot folosi autoratul Git al creatorului sau un trailer
`Co-authored-by` doar cu o identitate legată de sursă și verificabilă public. Nu inventa și nu
ghici niciodată un e-mail. Când nu există o identitate Git verificată, curatorul este autorul
commit-ului și oferă credit explicit `Created by @handle`, cu linkul repository-ului original în
YAML și în pull request. Un cont de întreținător sau de automatizare poate fi committer sau
co-autor verificat, dar nu trebuie să înlocuiască autoratul creatorului. Vezi
[docs/CREDIT.md](../../docs/CREDIT.md) pentru politica completă.

## Comenzi de validare și disponibilitate

CLI-ul npm este publicat ca `omni-dsh-plugins@1.0.1`, deci comenzile de mai jos sunt
disponibile prin `npx` astăzi. Folosește-le exact așa cum sunt scrise; contributorii nu ar trebui
să inventeze comenzi substitut.

Rulează aceste comenzi din rădăcina repository-ului:

```bash
npx omni-dsh-plugins catalog validate --catalog .
npx omni-dsh-plugins catalog docs-check .
npx omni-dsh-plugins catalog github-forms-check .
```

`catalog validate` efectuează doar verificările locale YAML, de schemă, SPDX, SemVer exact, SHA-512
SRI și de duplicate descrise mai sus și acceptă catalogul intenționat cu zero intrări. Nu dovedește
identitatea remote a repository-ului sau dovezile sursei fixate. Celelalte comenzi verifică
documentația publică obligatorie și formularele structurate de issue GitHub. Trecerea locală a
acestor comenzi nu relaxează cerințele de dovezi; întreținătorii aplică în continuare fiecare poartă
de release corespunzătoare înainte de integrare.

## Porți de review, coliziuni și integrare

Întreținătorii aplică fiecare poartă pe commit-ul curent al pull request-ului înainte de integrare:

1. **Scop:** o ramură dedicată, un fișier YAML de plugin și nicio schimbare fără legătură.
2. **Identitate originală:** creatorul, repository-ul canonic, ID-ul de nod, commit-ul complet și
   subpath-ul concordă.
3. **Schemă și dovezi:** YAML-ul, categoriile, SPDX, pin-ul de instalare, dovezile DSH și statusul
   smoke sunt consistente intern, fără executarea codului de ciclu de viață al pluginului.
4. **Popularitate:** stelele dedicate sunt verificabile pe repository-ul exact, sau stelele de
   monorepo sunt `null` cu `undefined-parent-repository`.
5. **Documentație și formulare:** documentația publică, gardurile Markdown și formularele
   structurate rămân valide.
6. **Coliziune și deduplicare:** nicio intrare integrată sau pull request deschis nu reprezintă
   același plugin canonic.

Numele sau ID-urile diferite nu fac pluginurile duplicate distincte. Tratează același ID de nod de
repository și subpath, același pachet canonic sau un alt țintă de instalare demonstrabil identică
drept coliziune. Rezolvă aliasurile și pull request-urile concurente înainte de integrare. Un pull
request direct al creatorului câștigă o coliziune cu curatoria sau automatizarea; altfel
întreținătorii aleg un singur vehicul de review și închid sau redirecționează duplicatele în loc să
le integreze pe ambele.

Doar un întreținător integrează un plugin după ce toate porțile trec. Fiecare plugin acceptat este
integrat individual; validarea, curatoria sau automatizarea nu implică integrare automată sau în
lot.

## Checklist pentru pull request

- [ ] Am folosit o ramură dedicată și acest PR schimbă exact o intrare de plugin.
- [ ] Sursa este repository-ul original al creatorului, nu un proiect-umbrelă sau agregator.
- [ ] Handle-ul/profilul creatorului, repository-ul, ID-ul de nod, subpath-ul și commit-ul complet
      sunt dovedite.
- [ ] `kind`-ul, categoria și tag-urile urmează `docs/CATEGORIES.md`.
- [ ] Licența SPDX și descriptorul de instalare fixat sunt dovedite.
- [ ] Integrarea DSH nativă și rezultatul smoke sau statusul `not run` sunt dovedite.
- [ ] Nu am executat cod de ciclu de viață al pluginului sau pachetului pentru a pregăti această
      contribuție.
- [ ] Stelele dedicate sunt verificabile, sau stelele de monorepo folosesc politica null
      obligatorie.
- [ ] Am verificat dacă există o intrare existentă și un pull request deschis pentru același plugin
      canonic.
- [ ] Intrarea este explicit neoficială și nu conține secrete sau date personale private.

## Politica de limbă

Documentația de lansare și descrierile din catalog sunt doar în engleză. Lansarea în 43 de locale
rămâne un element de backlog post-MVP; nu adăuga documente de locale goale sau traduceri automate
în masă.

<!-- i18n-source-hash: 45f53cd9ab5bca68a26c7ebd3948b4e8d2e4ab8221fb8cfae8fa31f76a14db91 -->
