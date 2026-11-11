# Trener

Trenerapp for håndball og fotball. Én HTML-fil, installeres på iPhone som app.

**Viktig:** Dette repoet inneholder kun appens kode/oppsett – **aldri data**.
Alle data (spillere, vurderinger, kamper …) lagres lokalt på hver enhet (localStorage)
og flyttes mellom enheter med sikkerhetskopi (JSON-fil) under Statistikk → ⚙︎.

## Filer
- `index.html` – hele appen
- `version.js` – versjonsnummer og endringslogg (øk ved hver endring)
- `sw.js` – offline/oppdatering (rører aldri data)
- `manifest.webmanifest`, `icon.png` – installering som app

## Oppdatere appen
1. Endre koden, øk `APP_VERSION` i `version.js` og legg til en linje i `APP_CHANGES`.
2. Commit og push. Hosting bygger automatisk.
3. Mobilen viser «Ny versjon er klar» neste gang appen åpnes. Data påvirkes ikke.

## Oppsett etter clone
`cp scripts/pre-commit .git/hooks/pre-commit` – blokkerer commit av data eller uønskede filer.
