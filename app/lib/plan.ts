export interface PassageRef { book: string; chapter: number; }
export interface DayPlan { day: number; ot: PassageRef; nt: PassageRef; psalm: PassageRef; prov: PassageRef; }

function seq(book: string, chapters: number): PassageRef[] {
  return Array.from({ length: chapters }, (_, i) => ({ book, chapter: i + 1 }));
}

function buildPlan(): DayPlan[] {
  const OT: PassageRef[] = [
    ...seq('Genesis',50),...seq('Exodus',40),...seq('Leviticus',27),...seq('Numbers',36),
    ...seq('Deuteronomy',34),...seq('Joshua',24),...seq('Judges',21),...seq('Ruth',4),
    ...seq('1 Samuel',31),...seq('2 Samuel',24),...seq('1 Kings',22),...seq('2 Kings',25),
    ...seq('1 Chronicles',29),...seq('2 Chronicles',36),...seq('Ezra',10),...seq('Nehemiah',13),
    ...seq('Esther',10),...seq('Job',42),...seq('Isaiah',66),...seq('Jeremiah',52),
    ...seq('Lamentations',5),...seq('Ezekiel',48),...seq('Daniel',12),...seq('Hosea',14),
    ...seq('Joel',3),...seq('Amos',9),...seq('Jonah',4),...seq('Micah',7),
    ...seq('Nahum',3),...seq('Habakkuk',3),...seq('Zephaniah',3),...seq('Haggai',2),
    ...seq('Zechariah',14),...seq('Malachi',4),
  ];
  const NT: PassageRef[] = [
    ...seq('Matthew',28),...seq('Mark',16),...seq('Luke',24),...seq('John',21),
    ...seq('Acts',28),...seq('Romans',16),...seq('1 Corinthians',16),...seq('2 Corinthians',13),
    ...seq('Galatians',6),...seq('Ephesians',6),...seq('Philippians',4),...seq('Colossians',4),
    ...seq('1 Thessalonians',5),...seq('2 Thessalonians',3),...seq('1 Timothy',6),
    ...seq('2 Timothy',4),...seq('Titus',3),...seq('Philemon',1),...seq('Hebrews',13),
    ...seq('James',5),...seq('1 Peter',5),...seq('2 Peter',3),...seq('1 John',5),
    ...seq('2 John',1),...seq('3 John',1),...seq('Jude',1),...seq('Revelation',22),
  ];
  const PS = seq('Psalms', 150);
  const PR = seq('Proverbs', 31);
  return Array.from({ length: 365 }, (_, i) => ({
    day: i + 1,
    ot:    OT[Math.floor((i * OT.length) / 365)],
    nt:    NT[Math.floor((i * NT.length) / 365)],
    psalm: PS[i % PS.length],
    prov:  PR[i % PR.length],
  }));
}

export const READING_PLAN: DayPlan[] = buildPlan();
