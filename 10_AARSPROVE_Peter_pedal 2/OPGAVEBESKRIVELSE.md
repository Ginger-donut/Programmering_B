# Årsprøveprojekt: Point & Click Escape Room

**Programmering B — HTX 1.år**
**Forår 2026**

---

## Oversigt

| | |
|---|---|
| **Emne** | Point & click spil / escape room |
| **Gruppestr.** | 1–2 elever |
| **Aflevering** | Fredag d. 22. maj 2026 |
| **Årsprøve** | 26.–27. maj 2026 (ca. 20 min. pr. elev) |

---

## Opgavebeskrivelse

I skal udvikle et **point & click escape room-spil**, hvor spilleren skal løse en række gåder og træffe interaktive valg for at komme igennem spillet og nå frem til en afslutning.

Spillet skal bygges med de teknikker og værktøjer, I har arbejdet med i løbet af året.

### Krav til produktet

**Gameplay:**
- Spillet skal indeholde **mindst fem gåder eller interaktive valg** (f.eks. find en kode, vælg den rigtige genstand, løs et puslespil, kombiner elementer osv.)
- Spilleren navigerer sig igennem spillet ved at **klikke** på elementer på skærmen
- Spillet skal have en tydelig **start**, en klar **progression** og mindst én **afslutning**

**Timer & High Score:**
- Spillet skal køre **på tid** med en **synlig timer** (countdown eller optælling)
- Når spillet er gennemført, gemmes spillerens tid (og evt. navn) som **high score i en Firestore-database**
- Der skal vises en **high score-liste** (f.eks. top 10), så spillere kan sammenligne tider

**Teknik:**
- Projektet skal bygges med **HTML, CSS, JavaScript og p5.js**
- Brug `shiftPage()`-mønsteret til at skifte mellem rum/scener
- Brug [`mousePressed()`](https://p5js.org/reference/p5.Element/mousePressed/) på p5-elementer til interaktivitet (klik på genstande, knapper, hotspots)
- Brug [`addClass`](https://p5js.org/reference/p5.Element/addClass/) / [`removeClass`](https://p5js.org/reference/p5.Element/removeClass/) og [`show`](https://p5js.org/reference/p5.Element/show/) / [`hide`](https://p5js.org/reference/p5.Element/hide/) til at vise og skjule elementer i spillet
- Brug **Firebase/Firestore** til at gemme og hente high scores
- I må gerne bruge [`createElement`](https://p5js.org/reference/p5/createElement/), [`createImg`](https://p5js.org/reference/p5/createImg/), [`createDiv`](https://p5js.org/reference/p5/createDiv/) osv. til at bygge interface dynamisk

**Grafik og medier (valgfrit):**
- I vælger selv den visuelle stil. Det kan være:
  - Statiske billeder og grafik (fotos, tegninger, ikoner)
  - Små filmsekvenser eller animerede GIFs
  - En blanding
- I må gerne bruge lyd og lydeffekter ([`loadSound`](https://p5js.org/reference/p5/loadSound/) / [`createAudio`](https://p5js.org/reference/p5/createAudio/))
- I må gerne bruge webcam, speech synthesis eller andre browser-API'er, hvis det giver mening for jeres spil

### Krav til aflevering

Afleveringen består af to dele: en **fælles projektbeskrivelse** og en **individuel synopsis**.

#### Fælles projektbeskrivelse (gruppen)
Gruppen afleverer en kort **projektbeskrivelse** (ca. 1 side) der indeholder:
- Hvad spillet handler om og hvad målet er
- En oversigt over arbejdsfordelingen — hvem har ansvaret for hvad
- En beskrivelse af den enkelte elevs fokusområde i projektet

Projektbeskrivelsen skal godkendes af læreren inden I går i gang med at kode.

#### Individuel synopsis
Hver elev skriver sin egen **synopsis** (3–5 normalsider, ekskl. kode og bilag). Synopsen er jeres forberedelse til den mundtlige prøve og skal give et overblik over projektet og jeres arbejde. Den skal indeholde:

1. **Forblad** — titel, navn, dato, hold
2. **Kort abstract** — et kort resumé af hvad projektet går ud på (3–5 linjer)
3. **Problemformulering** — hvad er det I har sat jer for at løse/lave?
4. **Funktionsbeskrivelse** — beskriv spillet fra brugerens perspektiv: skærmlayout, hvad man kan klikke på, spillets flow
5. **Dokumentation af programmet:**
   - Overordnet beskrivelse af programmets opbygning
   - Flowchart eller diagram over spillets struktur (rum/sider og sammenhængen mellem dem)
   - Gennemgang af udvalgte kodestumper med forklaring — beskriv mindst to af jeres gåder/interaktioner teknisk
   - Brug gerne pseudokode til at forklare centrale algoritmer (fx timer-logik, scoring, gåde-logik)
6. **Test** — beskriv hvordan I har testet spillet (funktionel test og evt. brugertest)
7. **Konklusion** — hvad er I nået i mål med? Hvad ville I gøre anderledes/videreudvikle?
8. **Bilag** — den samlede kode (HTML, CSS, JS)

---

## Tidsplan

I har **5 uger** fra projektstart til årsprøven. Der er 2 moduler om ugen (á 1,5 klokketime = 3 klokketimer ugentligt).

### Skoletid (10 moduler ≈ 15 klokketimer)

| Uge | Modul | Indhold |
|-----|-------|---------|
| **1** (21.–25. apr) | 1 | Opgavegennemgang. Gruppedannelse. Brainstorm og konceptudvikling |
| | 2 | Skriv fælles projektbeskrivelse (godkendes af læreren). Opsæt projekt fra template. Planlæg spillets rum/struktur og lav flowchart |
| **2** (28. apr – 2. maj) | 3 | Byg grundstruktur: sider/rum, navigation med `shiftPage`, timer |
| | 4 | Implementér de første 2–3 gåder/interaktioner |
| **3** (5.–9. maj) | 5 | Fortsæt med gåder og spilmekanik |
| | 6 | Opsæt Firestore: gem og vis high scores |
| **4** (12.–16. maj) | 7 | Grafik, lyd, polish. Test spillets flow fra start til slut |
| | 8 | Fejlretning og finpudsning. Peer-test (test hinandens spil) |
| **5** (19.–22. maj) | 9 | Færdiggør synopsis. Sørg for at flowchart, kodestumper og test er beskrevet |
| | 10 | **Aflevering fredag d. 22. maj** (produkt + individuel synopsis). Forbered mundtlig præsentation |

### Fordybelsestid (hjemme)

Der forventes **ca. 2 timers fordybelsestid pr. uge**, dvs. ca. 10 timer i alt. Brug dem på:

- At finde og redigere grafik, billeder, lyd
- At programmere videre på gåder og features
- At skrive den individuelle synopsis (flowchart, kodedokumentation, test)
- At forberede den mundtlige årsprøvepræsentation

---

## Årsprøven (26.–27. maj)

Årsprøven er en **individuel mundtlig prøve på ca. 20 minutter** og foregår sådan:

1. **Præsentation af eksamensprojektet** (ca. 10 min) — du præsenterer spillet og gennemgår din synopsis. Vis spillet i aktion, forklar den overordnede arkitektur, og gå i dybden med de dele du har haft ansvar for. Du skal kunne forklare centrale teknikker: `shiftPage`, [`mousePressed`](https://p5js.org/reference/p5.Element/mousePressed/), timer-logik, Firestore-integration, og hvordan du har løst mindst to gåder teknisk
2. **Uddybende spørgsmål** (ca. 10 min) — læreren stiller spørgsmål til jeres løsninger, beder dig redegøre for udvalgte kontrolstrukturer og kodestumper, og spørger ind til de teknikker og begreber I har arbejdet med i løbet af året

Denne årsprøve er en **generalprøve** for den rigtige eksamen i 2.år, hvor der til eksamen også indgår en lodtrukken opgave og 60 minutters forberedelse. Brug årsprøven til at øve jer på at forklare jeres kode mundtligt.

**Tips til forberedelsen:**
- Øv jer på at forklare jeres kode med egne ord — det handler om at vise at I forstår hvad der sker og hvorfor
- Brug synopsen som talepapir: gennemgå flowchart, pseudokode og kodestumper
- Vær klar til at vise og forklare programmets opbygning live (fx via udviklerværktøjer i browseren)

---

## Bedømmelseskriterier

Bedømmelsen tager udgangspunkt i de faglige mål for Programmering B:

| Kriterium | Beskrivelse |
|-----------|-------------|
| **Funktionalitet** | Virker spillet? Er der mindst fem gåder? Fungerer timer og high score? Er det testet? |
| **Kodekvalitet og struktur** | Er koden velstruktureret og læsbar? Er der brugt fornuftige variabelnavne, undgået duplikeret kode, og anvendt de teknikker vi har lært (funktioner, arrays, events osv.)? |
| **Arkitektur og dokumentation** | Kan du redegøre for programmets opbygning på forskellige niveauer? Er synopsen klar, med relevant brug af flowchart, pseudokode og kodeeksempler? |
| **Kreativitet og design** | Er gåderne interessante og varierede? Fungerer det som en sammenhængende spiloplevelse? |
| **Mundtlig præstation** | Kan du forklare jeres kode og de tekniske valg I har truffet med egne ord? Kan du svare på uddybende spørgsmål om teknikker og begreber fra undervisningen? |

---

## Ressourcer

Alt materiale fra undervisningen ligger i kursus-repoet:

- `0X_template_with_menu/` — projektskabelon med menu og `shiftPage`
- `06_memory_game/` — eksempel på spilmekanik med [`addClass`](https://p5js.org/reference/p5.Element/addClass/)/[`removeClass`](https://p5js.org/reference/p5.Element/removeClass/)
- `07_quiz_game/` — eksempel på progression gennem sider og score
- `08_blackjack_fetch_api/` — eksempel på spilstate og [`hide`](https://p5js.org/reference/p5.Element/hide/)/[`show`](https://p5js.org/reference/p5.Element/show/)
- `09_firebase/` — eksempel på Firestore (gem og hent data, `onSnapshot`)
- `04_webcam_mic_speech/` — eksempel på lyd, webcam og speech

**God fornøjelse — og husk: det vigtigste er at I laver noget der virker og som I kan forklare!**
