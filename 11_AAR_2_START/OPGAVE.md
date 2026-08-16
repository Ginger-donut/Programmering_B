# Mit favoritspil — interaktiv præsentation

**Programmering B — 2. år**  
**Udgangspunkt:** denne mappe (`11_AAR_2_START`)

---

## Opgaven

Lav en lille web-præsentation af dit **favoritspil**.

Du bygger videre på skabelonen med flere sider/skærme og navigation med `shiftPage()`.

Vælg selv spillet. Det skal bare være noget, du faktisk gider præsentere.

---

## Krav til produktet

### Sider
- Mindst **4 sider** (`.page`)
- Hver side har sit eget `id` og `title`
- Hver side har egen baggrund (billede, farve eller gradient)
- Kort tekst på hver side — fx:
  - intro / hvad spillet er
  - gameplay
  - karakterer / verden
  - hvorfor lige det her spil er dit favorit

### Navigation
- En menu (fx i en `footer`), der bygges fra DOM’en med `selectAll('.page')`
- Menuen skal bruge sidernes `title`
- Klik på et menupunkt skal skifte side med `shiftPage()`
- `shiftPage()` skal bruge `addClass('show')` / `removeClass('show')`

### Audiovisuelle effekter
- Mindst én **visuel effekt** på hver side  
  (fx hover, transition, GIF, hide/show, animation, parallax-agtigt greb)
- Mindst én **lyd- eller AV-effekt** et sted i præsentationen  
  (fx klik-lyd, baggrundsmusik, speech, kort video)

### Assets
- Læg billeder, lyd osv. i `assets/`
- Du må gerne hente materialer fra nettet — husk at kunne sige, hvor de kommer fra

---

## Tips

- Start med HTML-siderne og CSS, så navigationen virker
- Byg menuen dynamisk, så den følger med, når du tilføjer nye sider
- Genbrug gerne teknikker fra 1. år (`04_webcam_mic_speech`, parallax, spil-projekter osv.)
- Hold det simpelt og personligt — hellere 4 fede sider end 10 tomme

---

## Du skal kunne forklare

- Hvordan siderne er gemt i DOM’en
- Hvordan menuen bygges fra et array med `selectAll('.page')`
- Hvad `addClass` og `removeClass` gør i `shiftPage()`
- Hvordan du har koblet klik / lyd / visuelle effekter til dine sider

---

## Aflevering

- Færdigt projekt i mappen
- Klar til kort fremvisning: vis præsentationen og forklar én teknisk ting, du er stolt af
