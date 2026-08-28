// ── COLOURS ──────────────────────────────────────────────────────────────────
export const C = {
  bg:           '#060810',
  surface:      '#0A0E1A',
  card:         '#0D1220',
  border:       '#1A2540',
  borderLight:  '#253560',
  gold:         '#B8902A',
  goldLight:    '#DDB84A',
  goldDim:      '#6A5015',
  silver:       '#8A9AAA',
  cream:        '#EDE0C0',
  creamDim:     '#A89870',
  engBlueLight: '#4A80C0',
  engBluePale:  '#8AAED8',
  ot:           '#1A5535', otLight: '#38A060', otBg: '#050F08',
  nt:           '#1A3A6A', ntLight: '#3A70C0', ntBg: '#040810',
  psalm:        '#4A2570', psalmLight: '#8050C0', psalmBg: '#080510',
  prov:         '#6A3A10', provLight: '#C07020', provBg: '#100808',
  success:      '#1A6030', successBg: '#040C06',
  error:        '#602020', errorBg: '#100606',
  white:        '#FFFFFF',
} as const;

// ── FONTS ────────────────────────────────────────────────────────────────────
export const F = {
  cinzel:        'Cinzel_400Regular',
  cinzelBold:    'Cinzel_700Bold',
  cinzelBlack:   'Cinzel_900Black',
  crimson:       'CrimsonPro_400Regular',
  crimsonItalic: 'CrimsonPro_400Regular_Italic',
  crimsonSemi:   'CrimsonPro_600SemiBold',
  crimsonBold:   'CrimsonPro_700Bold',
} as const;

// ── APP BRANDING ─────────────────────────────────────────────────────────────
export const APP = {
  name:     'Manna: Daily Word',
  tagline:  'Read. Understand. Remember.',
  slug:     'manna-daily-word',
  bundle:   'com.scripturepath.app',
} as const;

// ── SECTION METADATA ─────────────────────────────────────────────────────────
export interface SectionMeta {
  color: string; light: string; bg: string;
  label: string; icon: string; abbr: string;
}
export const SEC: Record<string, SectionMeta> = {
  ot:    { color:C.ot,    light:C.otLight,    bg:C.otBg,    label:'Old Testament', icon:'📜', abbr:'OT' },
  nt:    { color:C.nt,    light:C.ntLight,    bg:C.ntBg,    label:'New Testament', icon:'✝️',  abbr:'NT' },
  psalm: { color:C.psalm, light:C.psalmLight, bg:C.psalmBg, label:'Psalm',         icon:'🎵', abbr:'PS' },
  prov:  { color:C.prov,  light:C.provLight,  bg:C.provBg,  label:'Proverbs',      icon:'💡', abbr:'PR' },
};

// ── BOOK VISUAL DATA ─────────────────────────────────────────────────────────
export interface BookVisual { symbol: string; label: string; accent: string; }
export const BOOK_VISUAL: Record<string, BookVisual> = {
  Genesis:          { symbol:'✦', label:'CREATION',   accent:C.otLight },
  Exodus:           { symbol:'⬡', label:'LIBERATION', accent:C.provLight },
  Leviticus:        { symbol:'✡', label:'HOLINESS',   accent:C.psalmLight },
  Numbers:          { symbol:'✦', label:'WILDERNESS', accent:C.ntLight },
  Deuteronomy:      { symbol:'⬡', label:'COVENANT',   accent:C.gold },
  Joshua:           { symbol:'⚔', label:'CONQUEST',   accent:C.error },
  Judges:           { symbol:'⬡', label:'CYCLES',     accent:C.provLight },
  Ruth:             { symbol:'✦', label:'LOYALTY',    accent:C.otLight },
  '1 Samuel':       { symbol:'⬡', label:'THE KING',   accent:C.psalmLight },
  '2 Samuel':       { symbol:'♛', label:'DAVID',      accent:C.gold },
  '1 Kings':        { symbol:'⬡', label:'WISDOM',     accent:C.gold },
  '2 Kings':        { symbol:'✦', label:'GLORY',      accent:C.ntLight },
  '1 Chronicles':   { symbol:'⬡', label:'WORSHIP',    accent:C.gold },
  '2 Chronicles':   { symbol:'✦', label:'TEMPLE',     accent:C.provLight },
  Ezra:             { symbol:'⬡', label:'RETURN',     accent:C.otLight },
  Nehemiah:         { symbol:'🧱', label:'REBUILD',   accent:C.provLight },
  Esther:           { symbol:'♛', label:'PROVIDENCE', accent:C.psalmLight },
  Job:              { symbol:'⬡', label:'SUFFERING',  accent:C.ntLight },
  Psalms:           { symbol:'♩', label:'WORSHIP',    accent:C.psalmLight },
  Proverbs:         { symbol:'◈', label:'WISDOM',     accent:C.provLight },
  Ecclesiastes:     { symbol:'∅', label:'VANITY',     accent:C.ntLight },
  'Song of Solomon':{ symbol:'✦', label:'LOVE',       accent:C.psalmLight },
  Isaiah:           { symbol:'✦', label:'MESSIAH',    accent:C.error },
  Jeremiah:         { symbol:'⬡', label:'JUDGMENT',   accent:C.provLight },
  Lamentations:     { symbol:'💧', label:'SORROW',    accent:C.ntLight },
  Ezekiel:          { symbol:'◈', label:'VISIONS',    accent:C.psalmLight },
  Daniel:           { symbol:'⬡', label:'KINGDOM',    accent:C.gold },
  Hosea:            { symbol:'♡', label:'MERCY',      accent:C.psalmLight },
  Joel:             { symbol:'⬡', label:'THE SPIRIT', accent:C.provLight },
  Amos:             { symbol:'⚖', label:'JUSTICE',    accent:C.otLight },
  Jonah:            { symbol:'≋', label:'GRACE',      accent:C.ntLight },
  Micah:            { symbol:'⬡', label:'JUSTICE',    accent:C.otLight },
  Nahum:            { symbol:'⬡', label:'JUDGMENT',   accent:C.error },
  Habakkuk:         { symbol:'⬡', label:'FAITH',      accent:C.provLight },
  Zephaniah:        { symbol:'⬡', label:'THE DAY',    accent:C.error },
  Haggai:           { symbol:'⬡', label:'REBUILD',    accent:C.gold },
  Zechariah:        { symbol:'◈', label:'MESSIAH',    accent:C.psalmLight },
  Malachi:          { symbol:'⬡', label:'PREPARE',    accent:C.gold },
  Matthew:          { symbol:'✦', label:'THE KING',   accent:C.otLight },
  Mark:             { symbol:'⚡', label:'SERVANT',   accent:C.error },
  Luke:             { symbol:'✦', label:'SAVIOR',     accent:C.otLight },
  John:             { symbol:'◈', label:'THE WORD',   accent:C.ntLight },
  Acts:             { symbol:'✦', label:'THE SPIRIT', accent:C.provLight },
  Romans:           { symbol:'⬡', label:'GRACE',      accent:C.psalmLight },
  '1 Corinthians':  { symbol:'❤', label:'LOVE',       accent:C.otLight },
  '2 Corinthians':  { symbol:'⬡', label:'COMFORT',    accent:C.ntLight },
  Galatians:        { symbol:'⬡', label:'FREEDOM',    accent:C.provLight },
  Ephesians:        { symbol:'⬡', label:'THE CHURCH', accent:C.ntLight },
  Philippians:      { symbol:'♡', label:'JOY',        accent:C.otLight },
  Colossians:       { symbol:'✦', label:'CHRIST',     accent:C.gold },
  '1 Thessalonians':{ symbol:'⬡', label:'HOPE',       accent:C.ntLight },
  '2 Thessalonians':{ symbol:'⬡', label:'THE DAY',    accent:C.provLight },
  '1 Timothy':      { symbol:'⬡', label:'MINISTRY',   accent:C.gold },
  '2 Timothy':      { symbol:'⬡', label:'COURAGE',    accent:C.provLight },
  Titus:            { symbol:'⬡', label:'ORDER',      accent:C.otLight },
  Philemon:         { symbol:'♡', label:'MERCY',      accent:C.psalmLight },
  Hebrews:          { symbol:'✡', label:'BETTER',     accent:C.gold },
  James:            { symbol:'⬡', label:'WORKS',      accent:C.otLight },
  '1 Peter':        { symbol:'🪨', label:'HOPE',      accent:C.ntLight },
  '2 Peter':        { symbol:'⬡', label:'TRUTH',      accent:C.provLight },
  '1 John':         { symbol:'❤', label:'LOVE',       accent:C.psalmLight },
  '2 John':         { symbol:'⬡', label:'TRUTH',      accent:C.ntLight },
  '3 John':         { symbol:'⬡', label:'WALKING',    accent:C.otLight },
  Jude:             { symbol:'🛡', label:'CONTEND',    accent:C.error },
  Revelation:       { symbol:'✦', label:'THE LAMB',   accent:C.error },
};

// ── FREE PLAY LIBRARY ────────────────────────────────────────────────────────
export interface BookEntry { n: string; c: number; i: string; }
export interface LibrarySection { section: string; color: string; books: BookEntry[]; }
export const LIBRARY: LibrarySection[] = [
  { section:'Pentateuch', color:C.ot, books:[
    {n:'Genesis',c:50,i:'🌍'},{n:'Exodus',c:40,i:'🏺'},{n:'Leviticus',c:27,i:'🕊️'},
    {n:'Numbers',c:36,i:'🏕️'},{n:'Deuteronomy',c:34,i:'📋'},
  ]},
  { section:'History', color:C.ot, books:[
    {n:'Joshua',c:24,i:'⚔️'},{n:'Judges',c:21,i:'🔄'},{n:'Ruth',c:4,i:'🌾'},
    {n:'1 Samuel',c:31,i:'👑'},{n:'2 Samuel',c:24,i:'🏛️'},{n:'1 Kings',c:22,i:'🏯'},
    {n:'2 Kings',c:25,i:'🌑'},{n:'Ezra',c:10,i:'📖'},{n:'Nehemiah',c:13,i:'🧱'},{n:'Esther',c:10,i:'👸'},
  ]},
  { section:'Poetry & Wisdom', color:C.psalm, books:[
    {n:'Job',c:42,i:'⚡'},{n:'Psalms',c:150,i:'🎵'},{n:'Proverbs',c:31,i:'💡'},
    {n:'Ecclesiastes',c:12,i:'🌀'},{n:'Song of Solomon',c:8,i:'🌹'},
  ]},
  { section:'Major Prophets', color:C.nt, books:[
    {n:'Isaiah',c:66,i:'📣'},{n:'Jeremiah',c:52,i:'😢'},{n:'Lamentations',c:5,i:'💧'},
    {n:'Ezekiel',c:48,i:'👁️'},{n:'Daniel',c:12,i:'🦁'},
  ]},
  { section:'Minor Prophets', color:C.nt, books:[
    {n:'Hosea',c:14,i:'💔'},{n:'Joel',c:3,i:'🌾'},{n:'Amos',c:9,i:'⚖️'},
    {n:'Jonah',c:4,i:'🐋'},{n:'Micah',c:7,i:'⚔️'},{n:'Nahum',c:3,i:'🌩️'},
    {n:'Habakkuk',c:3,i:'🔭'},{n:'Zephaniah',c:3,i:'🔥'},{n:'Malachi',c:4,i:'📜'},
  ]},
  { section:'Gospels & Acts', color:C.nt, books:[
    {n:'Matthew',c:28,i:'👑'},{n:'Mark',c:16,i:'⚡'},{n:'Luke',c:24,i:'🏥'},
    {n:'John',c:21,i:'💡'},{n:'Acts',c:28,i:'🔥'},
  ]},
  { section:"Paul's Letters", color:C.prov, books:[
    {n:'Romans',c:16,i:'✉️'},{n:'1 Corinthians',c:16,i:'⛪'},{n:'2 Corinthians',c:13,i:'💌'},
    {n:'Galatians',c:6,i:'🔓'},{n:'Ephesians',c:6,i:'🏛️'},{n:'Philippians',c:4,i:'😊'},
    {n:'Colossians',c:4,i:'🌟'},{n:'1 Thessalonians',c:5,i:'⏰'},{n:'2 Thessalonians',c:3,i:'⚡'},
    {n:'1 Timothy',c:6,i:'📝'},{n:'2 Timothy',c:4,i:'🕯️'},{n:'Titus',c:3,i:'🌿'},{n:'Philemon',c:1,i:'🤝'},
  ]},
  { section:'General Letters', color:C.prov, books:[
    {n:'Hebrews',c:13,i:'✡️'},{n:'James',c:5,i:'🤝'},{n:'1 Peter',c:5,i:'🪨'},
    {n:'2 Peter',c:3,i:'📝'},{n:'1 John',c:5,i:'❤️'},{n:'Jude',c:1,i:'🛡️'},{n:'Revelation',c:22,i:'👁️'},
  ]},
];
