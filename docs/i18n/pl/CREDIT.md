# Uznanie twórcy i pierwszeństwo pull requestów

> 🌐 [English](../../CREDIT.md) · [Português (Brasil)](../pt-BR/CREDIT.md) · [中文（简体）](../zh-CN/CREDIT.md) · **Polski**

Katalog istnieje po to, by niezależna praca DSH była odkrywalna, bez odbierania własności jej
twórcom. Publiczne wpisy cytują oryginalne repozytorium i niezmienny commit źródłowy.

## Pierwszeństwo dla tej samej wtyczki

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request otwarty przez twórcę wtyczki lub organizację będącą właścicielem.
2. Pull request społeczności wyraźnie zatwierdzony lub współautorstwa twórcy.
3. Istniejący, ważny pull request społeczności.
4. Pull request automatyzacji katalogu.
5. Prywatny kandydat bez publicznego pull requesta.

Bezpośredni pull request twórcy jest zawsze preferowany i ma pierwszeństwo przed każdym otwartym
pull requestem kuratorstwa społecznościowego lub automatyzacji dla tej samej kanonicznej
wtyczki, niezależnie od tego, który został otwarty jako pierwszy lub który jest bardziej
zaawansowany. Pull request twórcy staje się pojazdem recenzji; jego gałąź nigdy nie jest
nadpisywana, poddawana force-push ani przenoszona do skuratorowanego pull requesta. Jeśli
skuratorowany wpis już się scalił, historia pozostaje nienaruszona, a twórca może zgłosić
roszczenie lub poprawić go w nowym wkładzie.

## Publiczna atrybucja

Każdy wpis katalogu niesie publiczny uchwyt (handle) GitHub twórcy, oryginalne repozytorium, ID
węzła repozytorium, podścieżkę wtyczki i pełny przypięty commit. Publiczny profil twórcy jest
wyprowadzany z pojedynczego uchwytu zamiast być przechowywany jako druga tożsamość. Osobna bramka
pochodzenia opiekunów rozstrzyga ID węzła i odrzuca niezgodność URL repozytorium. Opisy pull
requestów powinny zawierać `Created by @handle` oraz metadane repozytorium źródłowego i commita
źródłowego.

Osoba, która publikuje wpis lub komentuje w Discussion, nie jest automatycznie traktowana jako
twórca. Własność musi być poparta przez właściciela repozytorium lub organizację, autorstwo
pakietu, metadane manifestu lub dokładną historię przypiętego źródła.

## Tożsamość Git

<!-- creator-first:source-bound-git-identity -->

Autorstwo commita i autorstwo pull requesta to sprawy odrębne. Pull request pochodzący od
twórcy zachowuje twórcę jako autora pull requesta, a jego commity naturalnie zachowują
autorstwo. Konto opiekuna lub automatyzacji może pojawić się jako committer lub jako
zweryfikowany współautor, ale nie może zastąpić autorstwa twórcy.

Dla skuratorowanego commita używaj twórcy jako autora Git lub dodaj trailer `Co-authored-by`
tylko wtedy, gdy dokładna tożsamość jest związana ze źródłem i publicznie weryfikowalna, np.
tożsamość już dołączona do commita twórcy w oryginalnym repozytorium. Nigdy nie zgaduj adresu
e-mail, nie twórz sztucznie adresu noreply ani nie używaj prywatnego adresu znalezionego poza
autoryzowanym publicznym źródłem.

Gdy zweryfikowana tożsamość Git jest niedostępna, kurator lub konto automatyzacji jest autorem
commita i zamiast tego przyznaje wyraźne, widoczne uznanie: `Created by @handle`, odpowiadający
publiczny profil oraz link do oryginalnego repozytorium we wpisie i pull request. Widoczna
atrybucja w YAML jest zawsze wymagana niezależnie od mapowania tożsamości Git. Późniejszy
bezpośredni pull request twórcy zastępuje otwarty skuratorowany pull request, zamiast dziedziczyć
jego syntetyczną historię.

## Pełna szacunku wzmianka o twórcy

Skuratorowany pull request używa jednej, pełnej szacunku publicznej wzmianki `@twórca` w swoim
opisie, obok linku do oryginalnego repozytorium. Może zapraszać do recenzji lub zastępczego
bezpośredniego pull requesta. Nie powtarzaj wzmianki, nie otwieraj promocyjnych zgłoszeń, nie
publikuj krzyżowo (cross-post) ani nie wysyłaj niechcianych wiadomości bezpośrednich.

## Licencja katalogu a licencja upstream

Fakty katalogu i redakcyjne metadane YAML są dedykowane w ramach CC0-1.0. Ta dedykacja nie
zmienia licencji wtyczki upstream. Kod, dokumentacja, zrzuty ekranu, logotypy i inne materiały
kreatywne upstream pozostają objęte ich oryginalnymi licencjami i właścicielami.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
