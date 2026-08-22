# Zásluhy tvorcov a prednosť pull requestov

Katalóg existuje, aby bola nezávislá práca na DSH objaviteľná bez toho, aby sa tvorcom odoberalo
vlastníctvo. Verejné záznamy citujú pôvodný repozitár a nemenný zdrojový commit.

## Prednosť pre ten istý plugin

<!-- creator-first:direct-pr-supersedes-curation-and-automation -->

1. Pull request otvorený tvorcom pluginu alebo vlastniacou organizáciou.
2. Komunitný pull request explicitne schválený alebo spoluatorizovaný tvorcom.
3. Existujúci platný komunitný pull request.
4. Automatizovaný pull request katalógu.
5. Súkromný kandidát bez verejného pull requestu.

Priamy pull request tvorcu je vždy preferovaný a nahrádza ktorýkoľvek otvorený komunitný kurátorský
alebo automatizovaný pull request pre ten istý kanonický plugin bez ohľadu na to, ktorý bol otvorený
skôr alebo je ďalej. Pull request tvorcu sa stáva vozidlom posúdenia; jeho vetva sa nikdy
neprepisuje, nespojuje force-pushom ani neprenáša do kurátorského pull requestu. Ak už bol
kurátorský záznam zlúčený, história zostáva nedotknutá a tvorca si ho môže nárokovať alebo opraviť
v novom príspevku.

## Verejné pripísanie

Každý záznam katalógu nesie verejný GitHub handle tvorcu, pôvodný repozitár, ID uzla repozitára,
podcestu pluginu a úplný pripnutý commit. Verejný profil tvorcu sa odvodzuje z jediného handle
namiesto toho, aby sa ukladal ako druhá identita. Samostatná brána pôvodu správcov dohľadáva ID uzla
a odmieta nezhodu URL repozitára. Popisy pull requestov by mali uvádzať `Created by @handle` a
zahŕňať metadáta zdrojového repozitára a zdrojového commitu.

Osoba, ktorá publikuje alebo komentuje v Discussion, sa automaticky nepovažuje za tvorcu.
Vlastníctvo musí byť podložené vlastníkom repozitára alebo organizáciou, autorstvom balíka,
metadátami manifestu alebo presnou históriou pripnutého zdroja.

## Git identita

<!-- creator-first:source-bound-git-identity -->

Autorstvo commitu a autorstvo pull requestu sú oddelené. Pull request pochádzajúci od tvorcu
ponecháva tvorcu ako autora pull requestu a jeho commity prirodzene zachovávajú autorstvo. Správca
alebo automatizačný účet sa môže objaviť ako committer alebo ako overený spoluautor, ale nesmie
nahradiť autorstvo tvorcu.

Pre kurátorský commit použite tvorcu ako autora Git alebo pridajte trailer `Co-authored-by` iba
vtedy, keď je presná identita viazaná na zdroj a verejne overiteľná, napríklad identita už pripojená
ku commitu tvorcu v pôvodnom repozitári. Nikdy e-mail nehádajte, nevymýšľajte noreply adresu ani
nepoužívajte súkromnú adresu nájdenú mimo autorizovaného verejného zdroja.

Keď nie je dostupná overená Git identita, autorom commitu je kurátor alebo automatizačný účet a
namiesto toho uvedie explicitné viditeľné pripísanie: `Created by @handle`, zodpovedajúci verejný
profil a odkaz na pôvodný repozitár v zázname a pull requeste. Viditeľné pripísanie v YAML sa vždy
vyžaduje nezávisle od mapovania Git identity. Neskorší priamy pull request tvorcu nahrádza otvorený
kurátorský pull request namiesto toho, aby zdedil jeho syntetickú históriu.

## Ohľaduplná zmienka o tvorcovi

Kurátorský pull request použije vo svojom popise jednu ohľaduplnú verejnú zmienku `@creator` vedľa
odkazu na pôvodný repozitár. Môže pozvať na posúdenie alebo na náhradný priamy pull request.
Zmienku neopakujte, neotvárajte propagačné issues, nekrížovo neprispievajte ani neposielajte
nevyžiadané súkromné správy.

## Licencia katalógu verzus upstream licencia

Fakty katalógu a redakčné YAML metadáta sú venované pod CC0-1.0. Toto venovanie nemení licenciu
upstream pluginu. Upstream kód, dokumentácia, snímky obrazovky, logá a ďalší tvorivý materiál
zostávajú podliehať svojim pôvodným licenciám a vlastníkom.

<!-- i18n-source-hash: 8644c6efac62727cebe2f5e87d48788b4b73f2d4b1088e89877e715e4b49c618 -->
