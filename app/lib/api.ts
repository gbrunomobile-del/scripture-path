export interface Verse { num: number; text: string; }
export interface Passage { reference: string; verses: Verse[]; text: string; offline?: boolean; }
export type QuestionType = 'mcq' | 'tf' | 'reflect';
export interface Question {
  type: QuestionType; q: string;
  opts?: string[]; answer?: number | boolean; insight: string;
}

export async function fetchPassage(book: string, chapter: number): Promise<Passage | null> {
  try {
    const ref = encodeURIComponent(`${book} ${chapter}`);
    const res = await fetch(`https://bible-api.com/${ref}?translation=kjv`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      reference: data.reference,
      verses: data.verses.map((v: { verse: number; text: string }) => ({
        num: v.verse, text: v.text.trim(),
      })),
      text: data.text,
    };
  } catch (err) {
    console.error('[passage] fetchPassage:', err);
    return null;
  }
}

export async function generateQuestions(
  reference: string, passageText: string, verseCount: number
): Promise<Question[]> {
  const count = verseCount <= 10 ? 3 : verseCount <= 20 ? 4 : verseCount <= 35 ? 5 : 6;
  const prompt = `You are a Bible study teacher for "Manna: Daily Word". Read this passage and generate ${count} questions.

PASSAGE: ${reference}
"${passageText.slice(0, 2500)}"

Generate exactly ${count} questions as a JSON array. Mix types:
- "mcq": 4 options, answer index 0-3
- "tf": true/false, answer true or false
- "reflect": open-ended reflection

Return ONLY valid JSON, no markdown:
[{"type":"mcq","q":"...","opts":["A","B","C","D"],"answer":0,"insight":"..."},
 {"type":"tf","q":"...","answer":true,"insight":"..."},
 {"type":"reflect","q":"...","insight":"..."}]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const raw = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '[]';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    return Array.isArray(parsed) ? parsed : getFallbackQuestions(reference);
  } catch (err) {
    console.error('[questions] generateQuestions:', err);
    return getFallbackQuestions(reference);
  }
}

export function getFallbackQuestions(reference: string): Question[] {
  return [
    { type:'reflect', q:`What stood out to you most in ${reference}?`, insight:'Personal engagement deepens understanding more than any commentary.' },
    { type:'reflect', q:'Is there a verse you would like to memorise? Why?', insight:'Memorisation is most effective when a verse has personal resonance.' },
    { type:'reflect', q:'How might the themes of this passage apply to your life today?', insight:'Application is the final step of true comprehension.' },
  ];
}
