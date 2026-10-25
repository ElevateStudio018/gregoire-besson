# Grégoire Besson — förslag på ny webbplats

Statisk redesign av gregoire-besson.com. Inga byggsteg: öppna `index.html` eller kör

    python3 -m http.server 8000

## Innehåll
- **Språk:** svenska, engelska, franska, tyska (`?lang=sv|en|fr|de`, sparas i webbläsaren). Texter i `assets/js/i18n.js`.
- **Effektväljare:** reglage för traktoreffekt (50–600 hk) som filtrerar 50 modeller. Specifikationerna är hämtade från nuvarande sajt och ligger i `assets/js/models.js`.
- **Sortiment:** 11 serier i tre familjer. Klick på en serie filtrerar väljaren.
- **Gamla namn → nya namn:** sökbar korstabell.
- **Kontaktformulär:** broschyr, återuppringning eller offert. *Ingen backend är kopplad än* – submit visar bara en bekräftelse.

## Material
Logotyp, produktbilder och fältfoton kommer från kundens nuvarande sajt (`assets/img`). Inget AI-genererat bildmaterial används.
