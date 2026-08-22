# Creditarea creatorilor și prioritatea pull request-urilor

> 🌐 [English](../../docs/CREDIT.md) · **Română**

Catalogul există pentru a face munca independentă pe DSH descoperibilă, fără a lua creatorilor
proprietatea asupra ei. Intrările publice citează repository-ul original și un commit sursă
imuabil.

## Prioritatea pentru același plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Un pull request deschis de creatorul pluginului sau de organizația care îl deține.
2. Un pull request comunitar aprobat explicit sau co-autorat de creator.
3. Un pull request comunitar valid existent.
4. Un pull request de automatizare a catalogului.
5. Un candidat privat fără pull request public.

Un pull request direct al creatorului este întotdeauna preferat și înlocuiește orice pull request
deschis de curatore comunitară sau automatizare pentru același plugin canonic, indiferent care a
fost deschis primul sau care este mai avansat. Pull request-ul creatorului devine vehiculul de
review; ramura lui nu este niciodată suprascrisă, force-push-uită sau transplantată în pull
request-ul curat. Dacă o intrare curată a fost deja integrată, istoricul rămâne intact, iar
creatorul o poate revendica sau corecta într-o contribuție nouă.

## Atribuirea publică

Fiecare intrare de catalog poartă handle-ul public GitHub al creatorului, repository-ul original,
ID-ul de nod al repository-ului, subpath-ul pluginului și commit-ul complet fixat. Profilul public
al creatorului este derivat din unicul handle, în loc să fie stocat ca o a doua identitate. Poarta
separată de proveniență a întreținătorilor rezolvă ID-ul de nod și respinge o nepotrivire de URL de
repository. Descrierile pull request-urilor ar trebui să spună `Created by @handle` și să includă
metadatele repository-ului sursă și ale commit-ului sursă.

O persoană care postează sau comentează într-un Discussion nu este tratată automat drept creator.
Proprietatea trebuie susținută de proprietarul repository-ului sau organizație, de autoratul
pachetului, de metadatele manifestului sau de istoricul exact al sursei fixate.

## Identitatea Git

<!-- creator-first:source-bound-git-identity -->

Autoratul commit-ului și autoratul pull request-ului sunt separate. Un pull request inițiat de
creator îl păstrează pe creator ca autor al pull request-ului, iar commit-urile lui păstrează
autoratul în mod natural. Un cont de întreținător sau de automatizare poate apărea drept committer
sau co-autor verificat, dar nu trebuie să înlocuiască autoratul creatorului.

Pentru un commit curat, folosește creatorul ca autor Git sau adaugă un trailer `Co-authored-by`
doar când identitatea exactă este legată de sursă și verificabilă public, de exemplu o identitate
deja atașată commit-ului creatorului din repository-ul original. Nu ghici niciodată un e-mail, nu
fabrica o adresă noreply și nu folosi o adresă privată găsită în afara unei surse publice
autorizate.

Când nu este disponibilă o identitate Git verificată, curatorul sau contul de automatizare este
autorul commit-ului și oferă în schimb credit vizibil explicit: `Created by @handle`, profilul
public corespunzător și un link către repository-ul original în intrare și în pull request.
Atribuirea vizibilă în YAML este întotdeauna obligatorie, independent de maparea identității Git.
Un pull request direct ulterior al creatorului înlocuiește un pull request curat deschis, în loc să
îi moștenească istoricul sintetic.

## Mențiune respectuoasă a creatorului

Un pull request curat folosește o singură mențiune publică respectuoasă `@creator` în descrierea
lui, lângă linkul repository-ului original. Poate invita la review sau la un pull request direct de
înlocuire. Nu repeta mențiunea, nu deschide issue-uri promoționale, nu posta încrucișat și nu
trimite mesaje directe nesolicitate.

## Licența catalogului versus licența din amonte

Faptele catalogului și metadatele YAML editoriale sunt dedicate sub CC0-1.0. Acea dedicare nu
schimbă licența pluginului din amonte. Codul, documentația, capturile de ecran, siglele și alte
materiale creative din amonte rămân sub incidența licențelor și proprietarilor lor originali.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
