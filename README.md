# Magister HP – träna inför högskoleprovet

En modern, responsiv webbapp för att öva inför högskoleprovet. Träna alla åtta
delprov (XYZ, KVA, NOG, DTK, ORD, LÄS, ELF, MEK), följ din utveckling med
statistik, få en löpande prognos av ditt resultat på skalan 0,0–2,0 och en
personlig analys av Coach Jens.

Byggd med **React 18 + TypeScript + Vite**. All data sparas lokalt i
webbläsaren (localStorage) – ingen backend behövs.

## Kom igång

Kräver [Node.js](https://nodejs.org) 18 eller senare.

```bash
npm install
npm run dev
```

Öppna sedan adressen som visas (vanligtvis http://localhost:5173).

Produktionsbygge:

```bash
npm run build    # typkontroll + bygge till dist/
npm run preview  # servera produktionsbygget lokalt
```

## Funktioner

- **Översikt (dashboard)** – välkomstmeddelande, prognos, mål, nyckeltal
  (besvarade frågor, träffsäkerhet, sessioner, träningstid), bästa/svagaste
  kategori och senaste pass.
- **Träna** – välj kategori (med svensk förklaring av varje delprov), antal
  frågor, med/utan tid samt tempo (standard HP-tempo eller lugnt tempo med
  50 % extra tid). Rekommenderad tid per fråga följer respektive delprov,
  t.ex. ORD 18 s och NOG 100 s per fråga.
- **Övningsflöde** – en fråga i taget med "Fråga 3 av 10", direkt rättning,
  rätt svar och svensk förklaring efter varje val, nedräkningstimer i tajmat
  läge (pausas medan du läser förklaringen) och möjlighet att avsluta när som
  helst.
- **Sammanfattning** – resultat, träffsäkerhet, total tid, snittid per fråga
  jämfört med rekommenderad, genomgång av felsvar och förslag på nästa steg.
- **Historik** – alla sessioner med datum, kategori, resultat, träffsäkerhet,
  tid och tidsläge. Filtrering per kategori och möjlighet att rensa.
- **Statistik** – träffsäkerhet per kategori, verbal vs kvantitativ del,
  snittid per fråga jämfört med rekommenderad samt trend över de senaste
  sessionerna.
- **Prognos** – uppskattat HP-resultat 0,0–2,0 baserat på din historik.
  Nyare sessioner väger tyngre, tajmade sessioner väger tyngre än otajmade,
  och verbal/kvantitativ del vägs samman som på riktiga provet.
- **Profil** – namn, profilbild (skalas ner och sparas lokalt), målpoäng med
  jämförelse mot prognosen ("Kvar till mål: 0,25") och möjlighet att
  återställa all data.
- **Mörkt läge** – växla mellan ljust och mörkt tema; valet sparas och
  systeminställningen respekteras vid första besöket.

## Projektstruktur

```
src/
  data/
    categories.ts    # Metadata för de åtta delproven (namn, beskrivning, tid, färg)
    questions.ts     # Frågebanken (mockfrågor) + urvalslogik
  utils/
    prognosis.ts     # Prognosberäkning 0,0–2,0
    stats.ts         # Aggregerad statistik (totalt, per kategori)
    storage.ts       # localStorage-hjälpare
    format.ts        # Svensk formatering (1,35 · 78 % · 12 min 30 s)
    helpers.ts       # shuffle, uid, clamp
    image.ts         # Nedskalning av profilbild
  context/
    AppContext.tsx   # Profil, sessioner och tema + persistens
  components/
    Layout.tsx, CategorySelector.tsx, SessionSettings.tsx,
    ExerciseSession.tsx, QuestionCard.tsx, SessionSummary.tsx,
    DarkModeToggle.tsx, Modal.tsx, StatCard.tsx, ProgressRing.tsx, ...
  pages/
    Dashboard.tsx, TrainPage.tsx, HistoryPage.tsx,
    StatisticsPage.tsx, ProfilePage.tsx
```

## Lägga till egna frågor

Frågorna ligger i [`src/data/questions.ts`](src/data/questions.ts) och följer
det här formatet:

```ts
{
  id: 'xyz-11',
  category: 'XYZ',          // XYZ | KVA | NOG | DTK | ORD | LÄS | ELF | MEK
  passage: '...',           // valfritt: lästext (LÄS/ELF) eller diagrambeskrivning (DTK)
  question: 'Vad är ...?',
  options: ['1', '2', '3', '4'],
  correctAnswer: '3',       // måste matcha ett av alternativen exakt
  explanation: 'Kort förklaring på svenska.',
  difficulty: 'Medel',      // Bas | Medel | Svår
}
```

Lägg till objektet i `QUESTIONS`-listan så dyker frågan upp automatiskt.
För KVA och NOG används de fasta standardalternativen (`KVA_OPTIONS` /
`NOG_OPTIONS`) och alternativens ordning blandas aldrig.

## Lagring

All användardata sparas i localStorage under nycklarna `hpfokus:sessions`,
`hpfokus:profile` och `hpfokus:theme` (prefixet behålls oförändrat sedan
tidigare så att redan sparad data följer med efter namnbytet). Rensa via
profilsidan ("Återställ all data") eller webbläsarens utvecklarverktyg.

> **Obs!** Frågorna i appen är egenskrivna övningsexempel i högskoleprovets
> stil – inte officiella provfrågor.
