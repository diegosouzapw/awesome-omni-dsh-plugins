# Alkotói jóváírás és pull request-elsőbbség

> 🌐 [English](../../docs/CREDIT.md) · **Magyar**

A katalógus azért létezik, hogy a független DSH-munkák felfedezhetők legyenek anélkül, hogy az
alkotóktól elvennék a tulajdonjogot. A nyilvános bejegyzések az eredeti repository-t és egy
immutábilis forráscommitot idéznek.

## Elsőbbség ugyanahhoz a bővítményhez

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. A bővítmény alkotója vagy a tulajdonos szervezet által nyitott pull request.
2. Az alkotó által kifejezetten jóváhagyott vagy társszerzőként jegyzett közösségi pull request.
3. Egy meglévő, érvényes közösségi pull request.
4. Egy katalógus-automatizálási pull request.
5. Egy privát jelölt, amelyhez nem tartozik nyilvános pull request.

Egy közvetlen alkotói pull request mindig preferált, és felülírja bármely nyitott közösségi
kurátori vagy automatizálási pull requestet ugyanahhoz a kanonikus bővítményhez, függetlenül
attól, hogy melyiket nyitották meg előbb, vagy melyik áll előrébb. Az alkotó pull requestje válik
az átvizsgálás eszközévé; a branch-ét soha nem írják felül, nem force-pusholják, és nem ültetik
át a kurált pull requestbe. Ha egy kurált bejegyzés már egyesítve lett, a történelem érintetlen
marad, és az alkotó egy új hozzájárulásban igényelheti vagy javíthatja azt.

## Nyilvános jóváírás

Minden katalógusbejegyzés hordozza az alkotó nyilvános GitHub handle-jét, az eredeti
repository-t, a repository node ID-ját, a bővítmény subpath-ját és a teljes rögzített commitot. A
nyilvános alkotói profil az egyetlen handle-ből származtatott, nem pedig második identitásként
tárolt. A külön karbantartói eredetiség-kapu feloldja a node ID-t, és elutasítja a
repository-URL-eltérést. A pull request leírásának tartalmaznia kell a `Created by @handle`
szöveget, valamint a forrás-repository és a forráscommit metaadatait.

Aki posztol vagy kommentel egy Discussionben, attól még nem tekintendő automatikusan alkotónak. A
tulajdonjogot a repository tulajdonosának vagy szervezetének, a csomag szerzőségének, a
manifeszt-metaadatoknak vagy a pontos rögzített forrástörténetnek kell alátámasztania.

## Git-identitás

<!-- creator-first:source-bound-git-identity -->

A commit-szerzőség és a pull request-szerzőség külön dolgok. Egy alkotó által indított pull
request az alkotót tartja meg pull request-szerzőként, és a commitjai természetes módon megőrzik
a szerzőséget. Egy karbantartói vagy automatizálási fiók megjelenhet committerként vagy
verifikált társszerzőként, de nem helyettesítheti az alkotó szerzőségét.

Egy kurált commitnál csak akkor használd az alkotót Git-szerzőként, vagy adj hozzá
`Co-authored-by` trailert, ha a pontos identitás forráshoz kötött és nyilvánosan verifikálható —
például egy olyan identitás, amely már hozzá van rendelve az alkotó eredeti repository-beli
commitjához. Soha ne tippelj meg e-mail-címet, ne gyárts noreply-címet, és ne használj privát
címet, amelyet egy engedélyezett nyilvános forráson kívül találtál.

Ha nem áll rendelkezésre verifikált Git-identitás, a kurátor vagy az automatizálási fiók szerzi a
commitot, és ehelyett explicit, látható jóváírást ad: `Created by @handle`, a megfelelő nyilvános
profil és az eredeti repository-ra mutató link a bejegyzésben és a pull requestben. A látható
YAML-jóváírás mindig kötelező, a Git-identitás-leképezéstől függetlenül. Egy későbbi közvetlen
alkotói pull request lecseréli a nyitott kurált pull requestet, ahelyett hogy örökölné annak
szintetikus történetét.

## Tiszteletteljes alkotói említés

Egy kurált pull request egyetlen tiszteletteljes, nyilvános `@alkotó` említést használ a leírásában,
az eredeti repository-ra mutató link mellett. Meghívhatja átvizsgálásra vagy egy helyettesítő
közvetlen pull requestre. Ne ismételd meg az említést, ne nyiss promóciós issue-kat, ne
kereszt-posztolj, és ne küldj nem kért közvetlen üzeneteket.

## Katalóguslicenc és upstream licenc

A katalógustények és a szerkesztői YAML-metaadatok CC0-1.0 alatt vannak felajánlva. Ez a
felajánlás nem változtatja meg az upstream bővítmény licencét. Az upstream kód, dokumentáció,
képernyőképek, logók és más kreatív anyag továbbra is az eredeti licencek és tulajdonosok hatálya
alá tartozik.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
