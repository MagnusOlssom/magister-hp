import type { CategoryId, Question } from '../types';
import { FIXED_OPTION_CATEGORIES } from './categories';
import { shuffle } from '../utils/helpers';

/**
 * Övningsfrågor (exempelmaterial, ej officiella provfrågor).
 *
 * Lägg till fler frågor genom att fylla på listan nedan – appen plockar
 * automatiskt upp dem. För LÄS/ELF/DTK används fältet `passage` för
 * lästext respektive diagrambeskrivning.
 */

/** Standardalternativ för KVA – ordningen är alltid densamma. */
export const KVA_OPTIONS = [
  'I är större än II',
  'II är större än I',
  'I är lika med II',
  'Informationen är otillräcklig',
];

/** Standardalternativ för NOG – ordningen är alltid densamma. */
export const NOG_OPTIONS = [
  'i (1) men ej i (2)',
  'i (2) men ej i (1)',
  'i (1) tillsammans med (2)',
  'i (1) och (2) var för sig',
  'Tillräcklig information saknas',
];

const NOG_STEM = 'Tillräcklig information för lösningen erhålls:';

export const QUESTIONS: Question[] = [
  // ---------------------------------------------------------------- XYZ
  {
    id: 'xyz-1',
    category: 'XYZ',
    question: 'Vad är x om 3x + 7 = 22?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5',
    explanation: 'Subtrahera 7 från båda led: 3x = 15. Dela med 3: x = 5.',
    difficulty: 'Bas',
  },
  {
    id: 'xyz-2',
    category: 'XYZ',
    question: 'En rektangel har omkretsen 36 cm och bredden 6 cm. Hur lång är rektangeln?',
    options: ['10 cm', '12 cm', '14 cm', '15 cm'],
    correctAnswer: '12 cm',
    explanation:
      'Omkretsen är 2 · (längd + bredd) = 36, alltså längd + bredd = 18. Längden är 18 − 6 = 12 cm.',
    difficulty: 'Bas',
  },
  {
    id: 'xyz-3',
    category: 'XYZ',
    question: 'Vad är 25 % av 320?',
    options: ['64', '75', '80', '96'],
    correctAnswer: '80',
    explanation: '25 % är en fjärdedel. 320 / 4 = 80.',
    difficulty: 'Bas',
  },
  {
    id: 'xyz-4',
    category: 'XYZ',
    question: 'Om f(x) = x² − 3x, vad är då f(5)?',
    options: ['10', '15', '25', '40'],
    correctAnswer: '10',
    explanation: 'f(5) = 5² − 3 · 5 = 25 − 15 = 10.',
    difficulty: 'Medel',
  },
  {
    id: 'xyz-5',
    category: 'XYZ',
    question:
      'Medelvärdet av fem tal är 12. Fyra av talen är 10, 11, 13 och 14. Vilket är det femte talet?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12',
    explanation:
      'Summan av alla fem tal är 5 · 12 = 60. De fyra kända talen har summan 48, så det femte talet är 60 − 48 = 12.',
    difficulty: 'Medel',
  },
  {
    id: 'xyz-6',
    category: 'XYZ',
    question: 'Vilken är lösningen till x² = 49 om x < 0?',
    options: ['−7', '7', '−14', '14'],
    correctAnswer: '−7',
    explanation: 'x² = 49 har lösningarna x = 7 och x = −7. Eftersom x < 0 är svaret −7.',
    difficulty: 'Bas',
  },
  {
    id: 'xyz-7',
    category: 'XYZ',
    question: 'En bil kör 240 km på 3 timmar. Vilken är bilens medelhastighet?',
    options: ['60 km/h', '70 km/h', '80 km/h', '90 km/h'],
    correctAnswer: '80 km/h',
    explanation: 'Medelhastighet = sträcka / tid = 240 / 3 = 80 km/h.',
    difficulty: 'Bas',
  },
  {
    id: 'xyz-8',
    category: 'XYZ',
    question: 'Hur många procent är 18 av 45?',
    options: ['25 %', '35 %', '40 %', '45 %'],
    correctAnswer: '40 %',
    explanation: '18 / 45 = 0,4 vilket motsvarar 40 %.',
    difficulty: 'Medel',
  },
  {
    id: 'xyz-9',
    category: 'XYZ',
    question: 'Om 2ˣ = 64, vad är då x?',
    options: ['4', '5', '6', '8'],
    correctAnswer: '6',
    explanation: '2⁶ = 64, alltså är x = 6.',
    difficulty: 'Medel',
  },
  {
    id: 'xyz-10',
    category: 'XYZ',
    question: 'Kvoten mellan två tal är 4 och deras summa är 35. Vilket är det större talet?',
    options: ['21', '24', '28', '30'],
    correctAnswer: '28',
    explanation:
      'Kalla talen 4y och y. Då är 4y + y = 35, så y = 7. Det större talet är 4 · 7 = 28.',
    difficulty: 'Svår',
  },

  // ---------------------------------------------------------------- KVA
  {
    id: 'kva-1',
    category: 'KVA',
    question: 'Kvantitet I: 3/4\nKvantitet II: 0,8',
    options: KVA_OPTIONS,
    correctAnswer: 'II är större än I',
    explanation: '3/4 = 0,75 och 0,75 < 0,8. Alltså är kvantitet II större.',
    difficulty: 'Bas',
  },
  {
    id: 'kva-2',
    category: 'KVA',
    passage: 'x > 0',
    question: 'Kvantitet I: x + 5\nKvantitet II: 5x',
    options: KVA_OPTIONS,
    correctAnswer: 'Informationen är otillräcklig',
    explanation:
      'Om x = 1 är I = 6 och II = 5 (I störst). Om x = 2 är I = 7 och II = 10 (II störst). Svaret beror på x, så informationen är otillräcklig.',
    difficulty: 'Medel',
  },
  {
    id: 'kva-3',
    category: 'KVA',
    question: 'Kvantitet I: 25 % av 200\nKvantitet II: 50 % av 100',
    options: KVA_OPTIONS,
    correctAnswer: 'I är lika med II',
    explanation: '25 % av 200 = 50 och 50 % av 100 = 50. Kvantiteterna är lika.',
    difficulty: 'Bas',
  },
  {
    id: 'kva-4',
    category: 'KVA',
    question: 'Kvantitet I: √81\nKvantitet II: 3²',
    options: KVA_OPTIONS,
    correctAnswer: 'I är lika med II',
    explanation: '√81 = 9 och 3² = 9. Kvantiteterna är lika.',
    difficulty: 'Bas',
  },
  {
    id: 'kva-5',
    category: 'KVA',
    passage: 'x är ett heltal större än 1.',
    question: 'Kvantitet I: x²\nKvantitet II: x + x',
    options: KVA_OPTIONS,
    correctAnswer: 'Informationen är otillräcklig',
    explanation:
      'Om x = 2 är båda kvantiteterna 4 (lika). Om x = 3 är I = 9 och II = 6 (I störst). Alltså går det inte att avgöra.',
    difficulty: 'Svår',
  },
  {
    id: 'kva-6',
    category: 'KVA',
    question: 'Kvantitet I: antalet minuter på 2,5 timmar\nKvantitet II: 140',
    options: KVA_OPTIONS,
    correctAnswer: 'I är större än II',
    explanation: '2,5 timmar = 2,5 · 60 = 150 minuter, vilket är mer än 140.',
    difficulty: 'Bas',
  },
  {
    id: 'kva-7',
    category: 'KVA',
    question: 'Kvantitet I: 2³ + 2³\nKvantitet II: 2⁴',
    options: KVA_OPTIONS,
    correctAnswer: 'I är lika med II',
    explanation: '2³ + 2³ = 8 + 8 = 16 och 2⁴ = 16. Kvantiteterna är lika.',
    difficulty: 'Medel',
  },
  {
    id: 'kva-8',
    category: 'KVA',
    passage:
      'En vara kostar 400 kr. Priset sänks först med 20 %, och därefter höjs det nya priset med 20 %.',
    question: 'Kvantitet I: varans slutpris\nKvantitet II: 400 kr',
    options: KVA_OPTIONS,
    correctAnswer: 'II är större än I',
    explanation:
      'Efter sänkningen: 400 · 0,8 = 320 kr. Efter höjningen: 320 · 1,2 = 384 kr. Slutpriset 384 kr är lägre än 400 kr.',
    difficulty: 'Medel',
  },
  {
    id: 'kva-9',
    category: 'KVA',
    passage: 'x och y är positiva tal med x + y = 10.',
    question: 'Kvantitet I: x · y\nKvantitet II: 25',
    options: KVA_OPTIONS,
    correctAnswer: 'Informationen är otillräcklig',
    explanation:
      'Om x = y = 5 är produkten exakt 25 (lika). Om x = 1 och y = 9 är produkten 9 (II störst). Det går alltså inte att avgöra.',
    difficulty: 'Svår',
  },
  {
    id: 'kva-10',
    category: 'KVA',
    question: 'Kvantitet I: medelvärdet av 4, 8 och 12\nKvantitet II: medianen av 4, 8 och 12',
    options: KVA_OPTIONS,
    correctAnswer: 'I är lika med II',
    explanation: 'Medelvärdet är (4 + 8 + 12) / 3 = 8 och medianen är 8. Kvantiteterna är lika.',
    difficulty: 'Medel',
  },

  // ---------------------------------------------------------------- NOG
  {
    id: 'nog-1',
    category: 'NOG',
    question: `Hur många elever går det i klassen?\n\n(1) Hälften av eleverna i klassen är pojkar.\n(2) Det går 14 pojkar i klassen.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) tillsammans med (2)',
    explanation:
      '(1) ensam säger inget om antalet. (2) ensam säger bara antalet pojkar. Tillsammans: pojkarna är hälften, alltså 2 · 14 = 28 elever.',
    difficulty: 'Bas',
  },
  {
    id: 'nog-2',
    category: 'NOG',
    question: `Fem tal är givna. Vad är talens medelvärde?\n\n(1) Summan av de fem talen är 75.\n(2) Det största av talen är 20.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) men ej i (2)',
    explanation:
      'Medelvärdet är summan delad med antalet: 75 / 5 = 15, så (1) räcker ensam. (2) säger inget om de övriga talen.',
    difficulty: 'Bas',
  },
  {
    id: 'nog-3',
    category: 'NOG',
    question: `Hur lång tid tar tågresan från stad A till stad B?\n\n(1) Tåget avgår från stad A klockan 9.15.\n(2) Avståndet mellan städerna är 180 km.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'Tillräcklig information saknas',
    explanation:
      'Avgångstid utan ankomsttid säger inget om restiden, och avstånd utan hastighet räcker inte heller. Inte ens tillsammans går det att beräkna restiden.',
    difficulty: 'Medel',
  },
  {
    id: 'nog-4',
    category: 'NOG',
    question: `Vilket är talet x?\n\n(1) x + 8 = 15\n(2) 3x = 21\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) och (2) var för sig',
    explanation:
      'Båda ekvationerna ger entydigt x = 7. Var och en av (1) och (2) är alltså tillräcklig på egen hand.',
    difficulty: 'Bas',
  },
  {
    id: 'nog-5',
    category: 'NOG',
    question: `Vad kostar fem äpplen?\n\n(1) Ett äpple väger 150 gram.\n(2) Tre äpplen kostar 12 kr.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (2) men ej i (1)',
    explanation:
      '(2) ger priset per äpple: 12 / 3 = 4 kr, alltså 20 kr för fem. Vikten i (1) säger inget om priset.',
    difficulty: 'Bas',
  },
  {
    id: 'nog-6',
    category: 'NOG',
    question: `Hur många sidor har boken?\n\n(1) Anna har läst 40 % av boken.\n(2) Anna har läst 96 sidor.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) tillsammans med (2)',
    explanation:
      'Tillsammans: 96 sidor motsvarar 40 %, så boken har 96 / 0,4 = 240 sidor. Var för sig räcker uppgifterna inte.',
    difficulty: 'Medel',
  },
  {
    id: 'nog-7',
    category: 'NOG',
    question: `x är ett positivt heltal. Är x ett jämnt tal?\n\n(1) x är delbart med 3.\n(2) x är större än 10.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'Tillräcklig information saknas',
    explanation:
      'Även med båda villkoren finns både jämna och udda möjligheter, t.ex. x = 12 (jämnt) och x = 15 (udda). Frågan kan inte avgöras.',
    difficulty: 'Svår',
  },
  {
    id: 'nog-8',
    category: 'NOG',
    question: `Hur stor är triangelns area?\n\n(1) Triangelns bas är 10 cm och dess höjd är 6 cm.\n(2) Triangelns omkrets är 24 cm.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) men ej i (2)',
    explanation:
      'Arean är (bas · höjd) / 2 = (10 · 6) / 2 = 30 cm², så (1) räcker ensam. Omkretsen bestämmer inte arean – trianglar med samma omkrets kan ha olika area.',
    difficulty: 'Medel',
  },
  {
    id: 'nog-9',
    category: 'NOG',
    question: `Hur många invånare har staden i dag?\n\n(1) För tio år sedan hade staden 50 000 invånare.\n(2) Staden har i dag tre gånger så många invånare som grannstaden, som har 30 000 invånare.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (2) men ej i (1)',
    explanation:
      '(2) ger direkt 3 · 30 000 = 90 000 invånare. (1) säger inget om hur befolkningen har förändrats sedan dess.',
    difficulty: 'Medel',
  },
  {
    id: 'nog-10',
    category: 'NOG',
    question: `Vad kostar en penna?\n\n(1) En penna och ett suddgummi kostar tillsammans 18 kr.\n(2) Suddgummit kostar 6 kr.\n\n${NOG_STEM}`,
    options: NOG_OPTIONS,
    correctAnswer: 'i (1) tillsammans med (2)',
    explanation:
      'Tillsammans: pennan kostar 18 − 6 = 12 kr. (1) ensam har två okända, och (2) ensam säger inget om pennan.',
    difficulty: 'Bas',
  },

  // ---------------------------------------------------------------- DTK
  {
    id: 'dtk-1',
    category: 'DTK',
    passage:
      'Tabellen visar antal sålda cyklar hos en cykelhandlare under fyra månader:\nMars: 120 · April: 150 · Maj: 180 · Juni: 150',
    question: 'Med hur många procent ökade försäljningen från mars till maj?',
    options: ['30 %', '40 %', '50 %', '60 %'],
    correctAnswer: '50 %',
    explanation: 'Ökningen är 180 − 120 = 60 cyklar. 60 / 120 = 0,5, det vill säga 50 %.',
    difficulty: 'Medel',
  },
  {
    id: 'dtk-2',
    category: 'DTK',
    passage:
      'Diagrammet visar dygnsmedeltemperaturen i Umeå under en vecka:\nMån: −2° · Tis: 0° · Ons: 3° · Tors: 5° · Fre: 1° · Lör: −1° · Sön: −4°',
    question: 'Hur stor är skillnaden mellan veckans högsta och lägsta dygnsmedeltemperatur?',
    options: ['7 grader', '8 grader', '9 grader', '10 grader'],
    correctAnswer: '9 grader',
    explanation: 'Högsta värdet är 5° (torsdag) och lägsta är −4° (söndag). 5 − (−4) = 9 grader.',
    difficulty: 'Bas',
  },
  {
    id: 'dtk-3',
    category: 'DTK',
    passage:
      'Tabellen visar invånarantalet i fyra kommuner år 2024:\nKommun A: 24 000 · Kommun B: 36 000 · Kommun C: 18 000 · Kommun D: 42 000',
    question: 'Hur många fler invånare har kommun D än kommun C?',
    options: ['18 000', '20 000', '24 000', '26 000'],
    correctAnswer: '24 000',
    explanation: '42 000 − 18 000 = 24 000 invånare.',
    difficulty: 'Bas',
  },
  {
    id: 'dtk-4',
    category: 'DTK',
    passage:
      'Ett cirkeldiagram visar hur en familj fördelar sina månadsutgifter på totalt 30 000 kr:\nBoende: 40 % · Mat: 25 % · Transport: 15 % · Övrigt: 20 %',
    question: 'Hur mycket lägger familjen på mat varje månad?',
    options: ['6 000 kr', '7 500 kr', '9 000 kr', '12 000 kr'],
    correctAnswer: '7 500 kr',
    explanation: '25 % av 30 000 kr = 0,25 · 30 000 = 7 500 kr.',
    difficulty: 'Bas',
  },
  {
    id: 'dtk-5',
    category: 'DTK',
    passage:
      'Tabellen visar nederbörden i Göteborg under fyra månader:\nJanuari: 60 mm · Februari: 40 mm · Mars: 50 mm · April: 30 mm',
    question: 'Hur stor var den genomsnittliga nederbörden per månad under perioden?',
    options: ['40 mm', '45 mm', '50 mm', '55 mm'],
    correctAnswer: '45 mm',
    explanation: 'Totalt föll 60 + 40 + 50 + 30 = 180 mm under fyra månader. 180 / 4 = 45 mm.',
    difficulty: 'Medel',
  },
  {
    id: 'dtk-6',
    category: 'DTK',
    passage:
      'Linjediagrammet visar antal besökare på ett museum:\n2019: 80 000 · 2020: 20 000 · 2021: 40 000 · 2022: 90 000',
    question: 'Mellan vilka år ökade antalet besökare mest?',
    options: ['2019–2020', '2020–2021', '2021–2022', 'Ökningen var lika stor båda perioderna'],
    correctAnswer: '2021–2022',
    explanation:
      'Mellan 2020 och 2021 ökade besökarna med 20 000, men mellan 2021 och 2022 med 50 000. Mellan 2019 och 2020 minskade antalet.',
    difficulty: 'Medel',
  },
  {
    id: 'dtk-7',
    category: 'DTK',
    passage: 'En karta har skalan 1:50 000. Avståndet mellan två orter är 6 cm på kartan.',
    question: 'Hur långt är avståndet mellan orterna i verkligheten?',
    options: ['300 m', '1,5 km', '3 km', '30 km'],
    correctAnswer: '3 km',
    explanation:
      '6 cm · 50 000 = 300 000 cm = 3 000 m = 3 km.',
    difficulty: 'Medel',
  },
  {
    id: 'dtk-8',
    category: 'DTK',
    passage:
      'Stapeldiagrammet visar antal anställda per avdelning på ett företag:\nEkonomi: 12 · IT: 18 · Försäljning: 24 · HR: 6',
    question: 'Hur stor andel av företagets anställda arbetar på försäljningsavdelningen?',
    options: ['30 %', '35 %', '40 %', '45 %'],
    correctAnswer: '40 %',
    explanation: 'Totalt finns 12 + 18 + 24 + 6 = 60 anställda. 24 / 60 = 0,4 = 40 %.',
    difficulty: 'Svår',
  },
  {
    id: 'dtk-9',
    category: 'DTK',
    passage:
      'Tabellen visar bensinpriset (kr per liter) under fyra veckor:\nVecka 1: 18,50 · Vecka 2: 19,00 · Vecka 3: 18,00 · Vecka 4: 19,50',
    question: 'Hur mycket högre var literpriset vecka 4 jämfört med vecka 3?',
    options: ['0,50 kr', '1,00 kr', '1,50 kr', '2,00 kr'],
    correctAnswer: '1,50 kr',
    explanation: '19,50 − 18,00 = 1,50 kr per liter.',
    difficulty: 'Bas',
  },
  {
    id: 'dtk-10',
    category: 'DTK',
    passage:
      'Tabellen visar antal resenärer per busslinje en vanlig vardag:\nLinje 1: 1 200 · Linje 2: 800 · Linje 3: 1 600 · Linje 4: 400',
    question: 'Hur många gånger fler resenärer har linje 3 än linje 4?',
    options: ['2 gånger', '3 gånger', '4 gånger', '5 gånger'],
    correctAnswer: '4 gånger',
    explanation: '1 600 / 400 = 4. Linje 3 har alltså fyra gånger så många resenärer som linje 4.',
    difficulty: 'Medel',
  },

  // ---------------------------------------------------------------- ORD
  {
    id: 'ord-1',
    category: 'ORD',
    question: 'frapperande',
    options: ['slående', 'irriterande', 'smickrande', 'tveksam', 'högtidlig'],
    correctAnswer: 'slående',
    explanation: 'Frapperande betyder slående eller anmärkningsvärd – något som väcker förvåning.',
    difficulty: 'Medel',
  },
  {
    id: 'ord-2',
    category: 'ORD',
    question: 'obsolet',
    options: ['föråldrad', 'nödvändig', 'okänd', 'felaktig', 'ovanlig'],
    correctAnswer: 'föråldrad',
    explanation: 'Obsolet betyder föråldrad – något som inte längre används eller är aktuellt.',
    difficulty: 'Medel',
  },
  {
    id: 'ord-3',
    category: 'ORD',
    question: 'gedigen',
    options: ['grundlig', 'ytlig', 'snabb', 'riskabel', 'tillfällig'],
    correctAnswer: 'grundlig',
    explanation: 'Gedigen betyder grundlig, solid och av hög kvalitet.',
    difficulty: 'Bas',
  },
  {
    id: 'ord-4',
    category: 'ORD',
    question: 'implicit',
    options: ['underförstådd', 'uttalad', 'omöjlig', 'komplicerad', 'ologisk'],
    correctAnswer: 'underförstådd',
    explanation: 'Implicit betyder underförstådd – något som antyds utan att sägas rakt ut.',
    difficulty: 'Medel',
  },
  {
    id: 'ord-5',
    category: 'ORD',
    question: 'konsensus',
    options: ['enighet', 'motsättning', 'diskussion', 'omröstning', 'tystnad'],
    correctAnswer: 'enighet',
    explanation: 'Konsensus betyder enighet eller samstämmighet inom en grupp.',
    difficulty: 'Bas',
  },
  {
    id: 'ord-6',
    category: 'ORD',
    question: 'depesch',
    options: ['meddelande', 'försening', 'vapen', 'tidskrift', 'resväska'],
    correctAnswer: 'meddelande',
    explanation: 'En depesch är ett (ofta snabbt eller officiellt) meddelande, t.ex. ett telegram.',
    difficulty: 'Svår',
  },
  {
    id: 'ord-7',
    category: 'ORD',
    question: 'altruistisk',
    options: ['osjälvisk', 'självupptagen', 'beräknande', 'lättsinnig', 'envis'],
    correctAnswer: 'osjälvisk',
    explanation: 'Altruistisk betyder osjälvisk – att sätta andras väl före sitt eget.',
    difficulty: 'Bas',
  },
  {
    id: 'ord-8',
    category: 'ORD',
    question: 'vedermöda',
    options: ['svårighet', 'belöning', 'åsikt', 'vana', 'högtid'],
    correctAnswer: 'svårighet',
    explanation: 'Vedermöda betyder svårighet, lidande eller stor ansträngning.',
    difficulty: 'Svår',
  },
  {
    id: 'ord-9',
    category: 'ORD',
    question: 'eklatant',
    options: ['uppenbar', 'tveksam', 'sällsynt', 'elegant', 'hemlig'],
    correctAnswer: 'uppenbar',
    explanation: 'Eklatant betyder uppenbar eller påfallande, t.ex. ”ett eklatant misslyckande”.',
    difficulty: 'Svår',
  },
  {
    id: 'ord-10',
    category: 'ORD',
    question: 'subtil',
    options: ['hårfin', 'grov', 'tydlig', 'snabb', 'ihålig'],
    correctAnswer: 'hårfin',
    explanation: 'Subtil betyder hårfin eller svårfångad – en skillnad som knappt märks.',
    difficulty: 'Medel',
  },
  {
    id: 'ord-11',
    category: 'ORD',
    question: 'prekär',
    options: ['vansklig', 'bekväm', 'lyckosam', 'långvarig', 'billig'],
    correctAnswer: 'vansklig',
    explanation: 'Prekär betyder vansklig, besvärlig eller osäker, t.ex. ”en prekär situation”.',
    difficulty: 'Medel',
  },
  {
    id: 'ord-12',
    category: 'ORD',
    question: 'redundant',
    options: ['överflödig', 'bristfällig', 'kraftfull', 'regelbunden', 'slumpmässig'],
    correctAnswer: 'överflödig',
    explanation: 'Redundant betyder överflödig – något som upprepas i onödan.',
    difficulty: 'Medel',
  },

  // ---------------------------------------------------------------- LÄS
  {
    id: 'las-1',
    category: 'LÄS',
    passage:
      'Forskning visar att sömn spelar en avgörande roll för inlärning och minne. Under djupsömnen bearbetar hjärnan dagens intryck och flyttar information från korttidsminnet till långtidsminnet. Studenter som sover ordentligt natten före ett prov presterar i genomsnitt bättre än de som pluggar hela natten. Trots detta väljer många studenter att offra sömnen när det blir ont om tid – något forskare menar är direkt kontraproduktivt.',
    question: 'Vad händer enligt texten under djupsömnen?',
    options: [
      'Information flyttas från korttidsminnet till långtidsminnet',
      'Hjärnan vilar helt från dagens intryck',
      'Korttidsminnet raderas för att ge plats åt nya intryck',
      'Inlärningsförmågan försämras tillfälligt',
    ],
    correctAnswer: 'Information flyttas från korttidsminnet till långtidsminnet',
    explanation:
      'Texten säger uttryckligen att hjärnan under djupsömnen ”flyttar information från korttidsminnet till långtidsminnet”.',
    difficulty: 'Bas',
  },
  {
    id: 'las-2',
    category: 'LÄS',
    passage:
      'Forskning visar att sömn spelar en avgörande roll för inlärning och minne. Under djupsömnen bearbetar hjärnan dagens intryck och flyttar information från korttidsminnet till långtidsminnet. Studenter som sover ordentligt natten före ett prov presterar i genomsnitt bättre än de som pluggar hela natten. Trots detta väljer många studenter att offra sömnen när det blir ont om tid – något forskare menar är direkt kontraproduktivt.',
    question: 'Varför menar forskarna att det är kontraproduktivt att plugga hela natten före ett prov?',
    options: [
      'Sömnen behövs för att kunskapen ska fästa i långtidsminnet',
      'Studenter blir mer stressade av att plugga sent',
      'Hjärnan kan bara ta in ny information på morgonen',
      'Prov tidigt på dagen gynnar morgonmänniskor',
    ],
    correctAnswer: 'Sömnen behövs för att kunskapen ska fästa i långtidsminnet',
    explanation:
      'Eftersom minnet konsolideras under sömnen motverkar nattplugg sitt eget syfte – det är det texten beskriver som kontraproduktivt.',
    difficulty: 'Medel',
  },
  {
    id: 'las-3',
    category: 'LÄS',
    passage:
      'Stadsodling har blivit allt vanligare i svenska städer. Förespråkarna lyfter fram fördelar som ökad biologisk mångfald, social gemenskap och kortare transporter. Kritiker menar dock att odlingarna sällan ger några betydande mängder mat och att ytorna ibland skulle göra större nytta som bostadsmark. Trots invändningarna fortsätter intresset att växa, och flera kommuner har infört särskilda program för att stödja stadsodling.',
    question: 'Vilken invändning mot stadsodling nämns i texten?',
    options: [
      'Odlingarna ger sällan betydande mängder mat',
      'Odlingarna minskar den biologiska mångfalden',
      'Odlingarna leder till längre transporter',
      'Kommunerna vägrar stödja projekten',
    ],
    correctAnswer: 'Odlingarna ger sällan betydande mängder mat',
    explanation:
      'Kritikerna i texten menar att odlingarna sällan ger betydande mängder mat och att marken ibland kunde användas till bostäder.',
    difficulty: 'Bas',
  },
  {
    id: 'las-4',
    category: 'LÄS',
    passage:
      'Stadsodling har blivit allt vanligare i svenska städer. Förespråkarna lyfter fram fördelar som ökad biologisk mångfald, social gemenskap och kortare transporter. Kritiker menar dock att odlingarna sällan ger några betydande mängder mat och att ytorna ibland skulle göra större nytta som bostadsmark. Trots invändningarna fortsätter intresset att växa, och flera kommuner har infört särskilda program för att stödja stadsodling.',
    question: 'Hur har kommunerna agerat enligt texten?',
    options: [
      'Flera har infört program som stödjer stadsodling',
      'De har förbjudit odling på bostadsmark',
      'De har höjt avgifterna för odlingslotter',
      'De har avvecklat sina odlingsprogram',
    ],
    correctAnswer: 'Flera har infört program som stödjer stadsodling',
    explanation:
      'Textens sista mening: ”flera kommuner har infört särskilda program för att stödja stadsodling”.',
    difficulty: 'Bas',
  },
  {
    id: 'las-5',
    category: 'LÄS',
    passage:
      'Andelen unga som läser böcker på fritiden har minskat stadigt under de senaste decennierna. Samtidigt visar undersökningar att läsning av längre texter tränar koncentration och ordförråd på ett sätt som kortare digitala texter sällan gör. Flera skolor har därför infört schemalagd lästid, med goda resultat. Eleverna läser inte bara mer – de uppger också att de mår bättre.',
    question: 'Varför har flera skolor infört schemalagd lästid?',
    options: [
      'Längre texter tränar koncentration och ordförråd',
      'Eleverna vägrar läsa hemma',
      'Digitala texter har blivit dyrare',
      'Lästid krävs enligt en ny lag',
    ],
    correctAnswer: 'Längre texter tränar koncentration och ordförråd',
    explanation:
      'Ordet ”därför” i texten kopplar lästiden till att längre texter tränar koncentration och ordförråd bättre än korta digitala texter.',
    difficulty: 'Medel',
  },
  {
    id: 'las-6',
    category: 'LÄS',
    passage:
      'Andelen unga som läser böcker på fritiden har minskat stadigt under de senaste decennierna. Samtidigt visar undersökningar att läsning av längre texter tränar koncentration och ordförråd på ett sätt som kortare digitala texter sällan gör. Flera skolor har därför infört schemalagd lästid, med goda resultat. Eleverna läser inte bara mer – de uppger också att de mår bättre.',
    question: 'Vilken effekt av den schemalagda lästiden nämns i texten, utöver att eleverna läser mer?',
    options: [
      'Eleverna uppger att de mår bättre',
      'Eleverna får högre betyg i alla ämnen',
      'Eleverna slutar använda mobiltelefoner',
      'Eleverna läser snabbare än tidigare',
    ],
    correctAnswer: 'Eleverna uppger att de mår bättre',
    explanation: 'Texten avslutas med att eleverna ”uppger också att de mår bättre”.',
    difficulty: 'Bas',
  },
  {
    id: 'las-7',
    category: 'LÄS',
    passage:
      'Fysisk aktivitet påverkar inte bara kroppen utan även hjärnan. Studier visar att regelbunden konditionsträning ökar blodflödet till hippocampus, ett område som är centralt för minnet. Hos äldre som börjar träna kan hippocampus till och med växa, vilket forskarna kopplar till förbättrad minnesförmåga. Effekten kräver dock kontinuitet – den som slutar träna förlorar gradvis de positiva förändringarna.',
    question: 'Vad kan enligt texten hända med hippocampus hos äldre som börjar träna?',
    options: [
      'Den kan växa',
      'Den krymper långsammare än normalt',
      'Den ersätts av ny vävnad',
      'Den påverkas inte alls',
    ],
    correctAnswer: 'Den kan växa',
    explanation:
      'Texten anger att hippocampus ”till och med kan växa” hos äldre som börjar träna, vilket kopplas till bättre minne.',
    difficulty: 'Medel',
  },
  {
    id: 'las-8',
    category: 'LÄS',
    passage:
      'Fysisk aktivitet påverkar inte bara kroppen utan även hjärnan. Studier visar att regelbunden konditionsträning ökar blodflödet till hippocampus, ett område som är centralt för minnet. Hos äldre som börjar träna kan hippocampus till och med växa, vilket forskarna kopplar till förbättrad minnesförmåga. Effekten kräver dock kontinuitet – den som slutar träna förlorar gradvis de positiva förändringarna.',
    question: 'Vad krävs enligt texten för att de positiva effekterna ska bestå?',
    options: [
      'Att man fortsätter träna regelbundet',
      'Att man tränar minst två timmar per dag',
      'Att man kombinerar träning med kosttillskott',
      'Att man börjar träna före 30 års ålder',
    ],
    correctAnswer: 'Att man fortsätter träna regelbundet',
    explanation:
      '”Effekten kräver dock kontinuitet” – slutar man träna försvinner förändringarna gradvis.',
    difficulty: 'Bas',
  },

  // ---------------------------------------------------------------- ELF
  {
    id: 'elf-1',
    category: 'ELF',
    passage:
      'Remote work has transformed the modern office. While many employees appreciate the flexibility, studies suggest that spontaneous collaboration — the kind that happens by the coffee machine — has declined sharply. Some companies now require office attendance a few days a week, hoping to restore creative exchanges without sacrificing the benefits of working from home.',
    question: 'Why have some companies started requiring office attendance a few days a week?',
    options: [
      'To restore spontaneous collaboration among employees',
      'To reduce the cost of office space',
      'To monitor employees more closely',
      'To phase out remote work completely',
    ],
    correctAnswer: 'To restore spontaneous collaboration among employees',
    explanation:
      'Företagen vill enligt texten återskapa de spontana, kreativa utbytena (”hoping to restore creative exchanges”) – utan att helt ge upp distansarbetets fördelar.',
    difficulty: 'Medel',
  },
  {
    id: 'elf-2',
    category: 'ELF',
    passage:
      'Remote work has transformed the modern office. While many employees appreciate the flexibility, studies suggest that spontaneous collaboration — the kind that happens by the coffee machine — has declined sharply. Some companies now require office attendance a few days a week, hoping to restore creative exchanges without sacrificing the benefits of working from home.',
    question: 'According to the passage, what has declined since the shift to remote work?',
    options: [
      'Informal, spontaneous collaboration',
      'Employee satisfaction with flexibility',
      'The number of office buildings',
      'The use of digital meeting tools',
    ],
    correctAnswer: 'Informal, spontaneous collaboration',
    explanation:
      'Texten säger att ”spontaneous collaboration … has declined sharply” – det spontana samarbetet vid t.ex. kaffemaskinen.',
    difficulty: 'Bas',
  },
  {
    id: 'elf-3',
    category: 'ELF',
    passage:
      'The honeybee is often praised as nature’s most diligent pollinator, yet wild bees are frequently more effective. Unlike honeybees, many wild species fly in colder weather and visit a wider range of flowers. Researchers therefore warn that focusing conservation efforts solely on honeybees may leave wild pollinators — and the crops that depend on them — at risk.',
    question: 'Why are wild bees often more effective pollinators than honeybees?',
    options: [
      'They tolerate colder weather and visit more kinds of flowers',
      'They live in larger colonies',
      'They produce more honey',
      'They are easier to breed commercially',
    ],
    correctAnswer: 'They tolerate colder weather and visit more kinds of flowers',
    explanation:
      'Enligt texten flyger många vilda arter i kallare väder och besöker fler sorters blommor än honungsbin.',
    difficulty: 'Medel',
  },
  {
    id: 'elf-4',
    category: 'ELF',
    passage:
      'The honeybee is often praised as nature’s most diligent pollinator, yet wild bees are frequently more effective. Unlike honeybees, many wild species fly in colder weather and visit a wider range of flowers. Researchers therefore warn that focusing conservation efforts solely on honeybees may leave wild pollinators — and the crops that depend on them — at risk.',
    question: 'What do the researchers warn about?',
    options: [
      'Directing conservation efforts only at honeybees',
      'Allowing wild bees to spread without control',
      'Reducing the number of beekeepers',
      'Planting too many wildflowers near farmland',
    ],
    correctAnswer: 'Directing conservation efforts only at honeybees',
    explanation:
      'Forskarna varnar för att naturvårdsinsatser som bara riktas mot honungsbin kan lämna vilda pollinatörer – och grödorna – i fara.',
    difficulty: 'Medel',
  },
  {
    id: 'elf-5',
    category: 'ELF',
    passage:
      'Birds in cities have changed their songs. Researchers comparing urban and forest populations of the same species found that city birds sing at a higher pitch and louder volume. The most likely explanation is traffic noise, which masks low-frequency sounds. Birds that fail to adapt struggle to attract mates, suggesting that the urban soundscape is actively shaping evolution.',
    question: 'Why do city birds most likely sing at a higher pitch than forest birds?',
    options: [
      'Traffic noise masks low-frequency sounds',
      'City birds are generally younger',
      'Tall buildings create strong echoes',
      'They imitate sounds from human devices',
    ],
    correctAnswer: 'Traffic noise masks low-frequency sounds',
    explanation:
      'Texten anger trafikbuller som den troligaste förklaringen, eftersom det dränker låga frekvenser.',
    difficulty: 'Medel',
  },
  {
    id: 'elf-6',
    category: 'ELF',
    passage:
      'Birds in cities have changed their songs. Researchers comparing urban and forest populations of the same species found that city birds sing at a higher pitch and louder volume. The most likely explanation is traffic noise, which masks low-frequency sounds. Birds that fail to adapt struggle to attract mates, suggesting that the urban soundscape is actively shaping evolution.',
    question: 'What happens to birds that fail to adapt their song?',
    options: [
      'They struggle to attract mates',
      'They migrate back to the forest',
      'They stop singing altogether',
      'They are driven away by other species',
    ],
    correctAnswer: 'They struggle to attract mates',
    explanation:
      '”Birds that fail to adapt struggle to attract mates” – fåglar som inte anpassar sin sång har svårt att hitta en partner.',
    difficulty: 'Bas',
  },
  {
    id: 'elf-7',
    category: 'ELF',
    passage:
      'Although e-books were once expected to replace printed books entirely, sales of physical books have remained remarkably stable. Surveys indicate that many readers, including younger ones, value the absence of notifications and the sense of progress a printed book provides. Publishers, once anxious about the digital transition, now treat e-books as a complement rather than a threat.',
    question: 'What was once expected to happen to printed books?',
    options: [
      'They would be entirely replaced by e-books',
      'They would become more expensive than e-books',
      'They would only be read by older people',
      'They would disappear from libraries',
    ],
    correctAnswer: 'They would be entirely replaced by e-books',
    explanation:
      'Inledningen: ”e-books were once expected to replace printed books entirely” – e-böcker väntades helt ersätta tryckta böcker.',
    difficulty: 'Bas',
  },
  {
    id: 'elf-8',
    category: 'ELF',
    passage:
      'Although e-books were once expected to replace printed books entirely, sales of physical books have remained remarkably stable. Surveys indicate that many readers, including younger ones, value the absence of notifications and the sense of progress a printed book provides. Publishers, once anxious about the digital transition, now treat e-books as a complement rather than a threat.',
    question: 'How do publishers regard e-books today?',
    options: [
      'As a complement to printed books',
      'As their main source of profit',
      'As a threat to their survival',
      'As a product mainly for younger readers',
    ],
    correctAnswer: 'As a complement to printed books',
    explanation:
      'Förlagen ser i dag e-böcker som ”a complement rather than a threat” – ett komplement, inte ett hot.',
    difficulty: 'Medel',
  },

  // ---------------------------------------------------------------- MEK
  {
    id: 'mek-1',
    category: 'MEK',
    question:
      'Trots att rapporten fick stor uppmärksamhet i medierna var slutsatserna långt ifrån ____; flera forskare ifrågasatte metoderna.',
    options: ['entydiga', 'omfattande', 'aktuella', 'tillgängliga'],
    correctAnswer: 'entydiga',
    explanation:
      'Att forskare ifrågasatte metoderna visar att slutsatserna inte var entydiga (självklara och samstämmiga).',
    difficulty: 'Medel',
  },
  {
    id: 'mek-2',
    category: 'MEK',
    question:
      'Efter flera år av sjunkande medlemstal beslutade föreningen att ____ sin verksamhet för att locka yngre deltagare.',
    options: ['förnya', 'avveckla', 'försvåra', 'fördröja'],
    correctAnswer: 'förnya',
    explanation:
      'Syftet att locka yngre deltagare kräver förnyelse – att avveckla, försvåra eller fördröja vore motsatsen.',
    difficulty: 'Bas',
  },
  {
    id: 'mek-3',
    category: 'MEK',
    question:
      'Hans argumentation var så ____ att till och med de mest kritiska åhörarna lät sig övertygas.',
    options: ['övertygande', 'motsägelsefull', 'långrandig', 'försiktig'],
    correctAnswer: 'övertygande',
    explanation:
      'Eftersom även kritikerna lät sig övertygas måste argumentationen ha varit övertygande.',
    difficulty: 'Bas',
  },
  {
    id: 'mek-4',
    category: 'MEK',
    question: 'Klimatförändringarna sker inte längre gradvis utan i allt mer ____ takt.',
    options: ['accelererande', 'avtagande', 'jämn', 'oförändrad'],
    correctAnswer: 'accelererande',
    explanation:
      '”Inte längre gradvis” signalerar att takten ökar – den är accelererande.',
    difficulty: 'Medel',
  },
  {
    id: 'mek-5',
    category: 'MEK',
    question:
      'Romanen fick ett ____ mottagande av kritikerna men blev trots det en stor ____ hos läsarna.',
    options: [
      'svalt – framgång',
      'entusiastiskt – besvikelse',
      'ljummet – förlust',
      'hånfullt – kostnad',
    ],
    correctAnswer: 'svalt – framgång',
    explanation:
      '”Trots det” kräver en kontrast: ett svalt mottagande av kritikerna ställs mot en stor framgång hos läsarna.',
    difficulty: 'Svår',
  },
  {
    id: 'mek-6',
    category: 'MEK',
    question:
      'Mötet blev kort eftersom parterna redan i förväg hade ____ de viktigaste frågorna.',
    options: ['avhandlat', 'undvikit', 'förvärrat', 'glömt'],
    correctAnswer: 'avhandlat',
    explanation:
      'Att frågorna redan var avhandlade (diskuterade och avklarade) förklarar varför mötet blev kort.',
    difficulty: 'Medel',
  },
  {
    id: 'mek-7',
    category: 'MEK',
    question: 'Trots sin ringa ålder uppvisade pianisten en ____ som imponerade på juryn.',
    options: ['mognad', 'nervositet', 'tveksamhet', 'blygsamhet'],
    correctAnswer: 'mognad',
    explanation:
      '”Trots sin ringa ålder” pekar på en egenskap man inte väntar sig hos unga – mognad.',
    difficulty: 'Medel',
  },
  {
    id: 'mek-8',
    category: 'MEK',
    question: 'Beslutet att stänga fabriken möttes av ____ protester från de anställda.',
    options: ['häftiga', 'ljudlösa', 'belåtna', 'likgiltiga'],
    correctAnswer: 'häftiga',
    explanation:
      'Protester mot en fabriksnedläggning beskrivs naturligast som häftiga – de övriga alternativen motsäger ordet ”protester”.',
    difficulty: 'Bas',
  },
  {
    id: 'mek-9',
    category: 'MEK',
    question: 'Forskarna kunde inte ____ resultaten, vilket gjorde studien svår att publicera.',
    options: ['replikera', 'ignorera', 'presentera', 'sammanfatta'],
    correctAnswer: 'replikera',
    explanation:
      'Inom forskning krävs att resultat kan replikeras (upprepas). Misslyckas det blir studien svår att publicera.',
    difficulty: 'Svår',
  },
  {
    id: 'mek-10',
    category: 'MEK',
    question: 'Hennes ____ för detaljer gjorde henne till en utmärkt korrekturläsare.',
    options: ['blick', 'förakt', 'rädsla', 'motvilja'],
    correctAnswer: 'blick',
    explanation:
      'Uttrycket ”blick för detaljer” betyder förmåga att lägga märke till detaljer – en tillgång för en korrekturläsare.',
    difficulty: 'Bas',
  },
];

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

/** Antal frågor i banken för en kategori. */
export function poolSize(category: CategoryId): number {
  return QUESTIONS.filter((q) => q.category === category).length;
}

/**
 * Plockar ut och blandar frågor inför en session. Svarsalternativen blandas
 * också – utom för KVA/NOG där alternativen alltid står i fast ordning.
 */
export function prepareQuestions(category: CategoryId, count: number): Question[] {
  const pool = QUESTIONS.filter((q) => q.category === category);
  const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
  return picked.map((q) =>
    FIXED_OPTION_CATEGORIES.has(category) ? { ...q } : { ...q, options: shuffle(q.options) },
  );
}
