# Grégoire Besson — förslag på uppdaterad webbplats

En uppfräschning av gregoire-besson.com som behåller varumärkets egna designsystem:
**Noto Sans**, brödtext `#4f4f4f` med 0,5 px teckenavstånd, röd navbar `#e2001a`, mörk topplist `#333`,
grå paneler `#eee`/`#f0f0f0`, centrerade rubriker i formatet ”**Serie** – funktion” och vita produktrutnät.

Statisk sajt utan byggsteg: öppna `index.html` eller kör `python3 -m http.server 8000`.

## Vad som är nytt jämfört med nuvarande sajt
- **Riktig svensk version.** Nuvarande `/sv` visar översättningsnycklar (`home_big_title`, `navbar_machines` …). Språkval SV/EN/FR/DE i topplisten, sparas och kan sättas med `?lang=`.
- **Effektväljare med två handtag** (50–600 hk) plus kategorifilter, som filtrerar produktrutnätet direkt.
- **Modellkort** – klick på en maskin visar hk/kW, arbetsbredd m/ft och utförande, med knappar för offert eller broschyr som fyller i formuläret.
- **Mega-meny** för Maskiner, sticky navbar och mobilmeny.
- **Sökbar namnkorstabell** (gamla → nya serienamn).
- Formuläret behåller deras tre bildval (broschyr / återuppringning / offert) med validering. *Ingen backend är kopplad än.*

## Material
Logotyp, hero-bild, produktbilder, traktorikoner, sociala ikoner och kontaktbilder är hämtade från kundens nuvarande sajt. Specifikationerna i `assets/js/models.js` är skrapade från deras produktsidor. Inget AI-genererat material används.
