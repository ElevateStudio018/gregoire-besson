# Grégoire Besson — moderniserat förslag

Konceptförslag på en ny webbplats för Grégoire Besson. Det bygger på varumärkets egna grunder:
signalrött `#e2001a`, vita ytor, produktrenderingar på ljusa plattor och Noto-familjen
(Noto Sans Display i fet stil för rubriker, Noto Sans för brödtext).

Statisk sajt utan byggsteg: öppna `index.html` eller kör `python3 -m http.server 8000`.
En gul banner överst visar tydligt att det är ett konceptförslag.

## Sidor (hash-routing)
| Sida | Adress | Innehåll |
|---|---|---|
| Start | `#/` | Hero, effektväljare, kategorier, serier, återförsäljarsök |
| Maskiner | `#/maskiner` | Effektväljare över alla 50 modeller, grupperade per serie, och sök på gamla namn |
| Serie | `#/serie/rover` | Egen produktsida per serie med fördelar, utrustning, kundröster och sammanfattning |
| Modell | `#/modell/rover-70` | Specifikationer (hk/kW, m/ft, utförande) och offertknappar |
| Återförsäljare | `#/aterforsaljare` | Alla 1 246 återförsäljare med karta, sök, landsfilter och ”nära mig” |
| Kontakt | `#/kontakt` | Formulär för broschyr, återuppringning eller offert (skickar inget) |

Språk: svenska, engelska, franska och tyska, valt i headern eller med `?lang=`.

## Data
- `assets/js/models.js`: modellspecifikationer hämtade från produktsidorna.
- `assets/data/content.js`: produktsidornas innehåll. Engelska och franska kommer från deras sajt, svenska är översatt för förslaget. Tyska visar den engelska texten.
- `assets/data/dealers.js`: återförsäljarnätet från `maps.gb-group.co/data/dealers.geojson`. Telefon och e-post är GB Groups regionkontakt.
- Bilder i `assets/img` kommer från kundens nuvarande sajt. Inget AI-genererat material används.

Kartan använder Leaflet och OpenStreetMap.
