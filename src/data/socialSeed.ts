import type { SocialState, SocialUser } from '../types';

/**
 * Seed för den lokala forum-prototypen. Fiktiv community som gör att Social-ytan
 * känns levande direkt. Allt nedan är exempeldata – inga riktiga användare.
 *
 * Tidsstämplar byggs relativt `now` (minuter sedan) så att "3 tim sedan" stämmer
 * när datan först seedas.
 */

export const SEED_VERSION = 1;

const USERS: SocialUser[] = [
  { id: 'u-elin', name: 'Elin Westerlund', faculty: 'medicin' },
  { id: 'u-omar', name: 'Omar Haddad', faculty: 'teknik' },
  { id: 'u-sara', name: 'Sara Lind', faculty: 'juridik' },
  { id: 'u-johan', name: 'Johan Berg', faculty: 'ekonomi' },
  { id: 'u-amir', name: 'Amir Khan', faculty: 'naturvetenskap' },
  { id: 'u-maja', name: 'Maja Nyström', faculty: 'humaniora' },
  { id: 'u-tilda', name: 'Tilda Ek', faculty: 'psykologi' },
  { id: 'u-kalle', name: 'Kalle Sundin', faculty: 'samhallsvetenskap' },
];

const min = (now: number, m: number) => new Date(now - m * 60_000).toISOString();

export function buildSeedState(now: number): SocialState {
  const users: Record<string, SocialUser> = {};
  for (const u of USERS) users[u.id] = u;

  return {
    version: SEED_VERSION,
    users,
    posts: [
      {
        id: 'p1',
        authorId: 'u-elin',
        body: 'Pluggade KVA i två timmar idag och äntligen börjar polletten trilla ner 🎉 Någon mer som kämpat med jämförelserna?',
        createdAt: min(now, 35),
        likeCount: 14,
        likedByMe: false,
        comments: [
          { id: 'p1c1', authorId: 'u-omar', body: 'Grymt! Vad var det som fick det att lossna?', createdAt: min(now, 28) },
          { id: 'p1c2', authorId: 'u-elin', body: 'Att alltid testa med både små och stora tal innan jag väljer “otillräcklig info”.', createdAt: min(now, 22) },
        ],
      },
      {
        id: 'p2',
        authorId: 'u-omar',
        body: 'Tips: gör gamla prov under tidspress, inte bara i lugn takt. Gjorde enorm skillnad för mitt tempo på DTK.',
        createdAt: min(now, 95),
        likeCount: 31,
        likedByMe: false,
        comments: [
          { id: 'p2c1', authorId: 'u-johan', body: 'Det här. Tempot är halva grejen på DTK.', createdAt: min(now, 80) },
        ],
      },
      {
        id: 'p3',
        authorId: 'u-maja',
        body: 'Någon annan som tyckte ELF-texterna var sjukt långa senast? Hann knappt klart 😅',
        createdAt: min(now, 220),
        likeCount: 22,
        likedByMe: false,
        comments: [
          { id: 'p3c1', authorId: 'u-sara', body: 'Ja! Jag läser frågorna först nu, sparar massa tid.', createdAt: min(now, 200) },
          { id: 'p3c2', authorId: 'u-tilda', body: 'Samma strategi här, rekommenderas.', createdAt: min(now, 150) },
        ],
      },
      {
        id: 'p4',
        authorId: 'u-amir',
        body: 'Delmål klart: 0,9 → 1,3 på tre veckor. Mest tack vare att jag äntligen rättar mina fel ordentligt 💪',
        createdAt: min(now, 1500),
        likeCount: 48,
        likedByMe: false,
        comments: [],
      },
    ],
    areas: [
      { id: 'plugghjalp', name: 'Plugghjälp', description: 'Fråga och hjälp varandra med klurigheter.', emoji: '📚' },
      { id: 'kvant', name: 'Kvantitativa delen', description: 'XYZ, KVA, NOG och DTK.', emoji: '🔢' },
      { id: 'verbal', name: 'Verbala delen', description: 'ORD, LÄS, MEK och ELF.', emoji: '✍️' },
      { id: 'dagbocker', name: 'Dagböcker', description: 'Dokumentera din pluggresa.', emoji: '📔' },
      { id: 'lakarhornan', name: 'Läkarhörnan', description: 'För er som siktar på vården.', emoji: '🩺' },
      { id: 'utbildning', name: 'Diskussion om utbildning', description: 'Program, antagning och framtid.', emoji: '🎓' },
    ],
    threads: [
      {
        id: 't1',
        areaId: 'kvant',
        authorId: 'u-johan',
        title: 'Hur tänker ni på NOG-frågor med två villkor?',
        body: 'Jag fastnar ofta på att avgöra om (1) och (2) räcker var för sig eller tillsammans. Har ni någon tankegång ni följer steg för steg?',
        createdAt: min(now, 600),
        views: 142,
        comments: [
          { id: 't1c1', authorId: 'u-amir', body: 'Testa alltid villkoren separat först, sedan tillsammans. Skriv ner vad varje villkor låser fast.', createdAt: min(now, 540) },
          { id: 't1c2', authorId: 'u-elin', body: 'Och var paranoid med “otillräcklig information” – det är rätt oftare än man tror.', createdAt: min(now, 360) },
        ],
        lastActivityAt: min(now, 360),
      },
      {
        id: 't2',
        areaId: 'plugghjalp',
        authorId: 'u-tilda',
        title: 'Hur lägger ni upp en pluggvecka som funkar?',
        body: 'Jobbar heltid och får ihop kanske 6 timmar i veckan. Hur prioriterar ni när tiden är knapp?',
        createdAt: min(now, 1200),
        views: 308,
        comments: [
          { id: 't2c1', authorId: 'u-kalle', body: 'Korta tajmade pass på svagaste delen + rätta felen samma kväll. Kvalitet > kvantitet.', createdAt: min(now, 1100) },
        ],
        lastActivityAt: min(now, 1100),
      },
      {
        id: 't3',
        areaId: 'verbal',
        authorId: 'u-maja',
        title: 'Bästa sättet att bygga ordförråd inför ORD?',
        body: 'Känner att ORD drar ner mig. Flashcards, läsa mycket, eller något annat som funkat för er?',
        createdAt: min(now, 2600),
        views: 215,
        comments: [
          { id: 't3c1', authorId: 'u-sara', body: 'Anki varje morgon, 15 min. Tråkigt men det funkar verkligen.', createdAt: min(now, 2400) },
          { id: 't3c2', authorId: 'u-omar', body: 'Läs DN/SvD ledarsidor, full av provord.', createdAt: min(now, 1800) },
        ],
        lastActivityAt: min(now, 1800),
      },
      {
        id: 't4',
        areaId: 'lakarhornan',
        authorId: 'u-elin',
        title: 'Vilket HP-resultat siktar ni läkar-sökande på?',
        body: 'Snittet till läkarprogrammet är stenhårt. Vad har ni för målpoäng och hur ligger ni till?',
        createdAt: min(now, 4000),
        views: 521,
        comments: [
          { id: 't4c1', authorId: 'u-tilda', body: 'Siktar på 1,6. Långt kvar men det går framåt.', createdAt: min(now, 3600) },
        ],
        lastActivityAt: min(now, 3600),
      },
    ],
    chatRooms: [
      {
        id: 'c-allman',
        name: 'Allmän chatt',
        topic: 'Häng, frågor och motivation',
        onlineCount: 23,
        messages: [
          { id: 'm1', authorId: 'u-kalle', body: 'God morgon! Vem pluggar idag? ☀️', createdAt: min(now, 18) },
          { id: 'm2', authorId: 'u-maja', body: 'Här! Kör ett ORD-pass nu.', createdAt: min(now, 15) },
          { id: 'm3', authorId: 'u-omar', body: 'Lycka till 💪 jag tar DTK på tid.', createdAt: min(now, 11) },
        ],
      },
      {
        id: 'c-kvant',
        name: 'Kvant-hjälp live',
        topic: 'Snabb hjälp med XYZ/KVA/NOG/DTK',
        onlineCount: 9,
        messages: [
          { id: 'm4', authorId: 'u-amir', body: 'Någon som kan förklara fråga med procentökning bakvägen?', createdAt: min(now, 40) },
          { id: 'm5', authorId: 'u-johan', body: 'Dela frågan så löser vi den ihop!', createdAt: min(now, 36) },
        ],
      },
      {
        id: 'c-motivation',
        name: 'Pluggmotivation',
        topic: 'Peppa varandra till provet',
        onlineCount: 14,
        messages: [
          { id: 'm6', authorId: 'u-sara', body: 'Tre veckor kvar. Vi fixar det här! 🔥', createdAt: min(now, 70) },
        ],
      },
    ],
  };
}
