import { FILLER_WORDS, FillerDefinition } from '../constants/fillers';

export interface DetectedFillerInstance {
  word: string;
  index: number;
  category: 'vocal' | 'discourse' | 'hesitation';
}

export interface FillerDetectionResult {
  totalCount: number;
  fillerRate: number; // percentage of words that are fillers (0-100)
  instances: DetectedFillerInstance[];
  countsByWord: Record<string, number>;
  cleanText: string;
}

/**
 * Contextual validation for words that could be either grammatical or filler words (e.g. 'like', 'so', 'well')
 */
function isFalsePositiveLike(tokens: string[], index: number): boolean {
  const current = tokens[index]?.toLowerCase().replace(/[^\w]/g, '');
  if (current !== 'like') return false;

  const prev = index > 0 ? tokens[index - 1]?.toLowerCase().replace(/[^\w]/g, '') : '';
  const next = index < tokens.length - 1 ? tokens[index + 1]?.toLowerCase().replace(/[^\w]/g, '') : '';

  // "I like [noun/verb]", "would like", "feel like", "look like", "sounds like", "seems like", "act like", "more like"
  const verbSubjects = ['i', 'you', 'we', 'they', 'he', 'she', 'who', 'everyone', 'people'];
  const modalVerbs = ['would', 'do', 'did', 'does', 'might', 'will', 'to', 'feel', 'look', 'looks', 'sound', 'sounds', 'seem', 'seems', 'taste', 'tastes', 'act', 'acted'];

  if (modalVerbs.includes(prev)) return true;
  if (verbSubjects.includes(prev) && next && !['uh', 'um', 'you', 'i', 'like'].includes(next)) {
    // e.g. "I like coffee", "We like traveling"
    return true;
  }

  return false;
}

function isFalsePositiveSo(tokens: string[], index: number): boolean {
  const current = tokens[index]?.toLowerCase().replace(/[^\w]/g, '');
  if (current !== 'so') return false;

  const prev = index > 0 ? tokens[index - 1]?.toLowerCase().replace(/[^\w]/g, '') : '';
  const next = index < tokens.length - 1 ? tokens[index + 1]?.toLowerCase().replace(/[^\w]/g, '') : '';

  // "so that", "so much", "so good", "so far", "and so", "is so", "was so"
  const intensifierNext = ['much', 'many', 'good', 'bad', 'far', 'that', 'long', 'fast', 'slow', 'well', 'great', 'important', 'happy', 'sad'];
  if (intensifierNext.includes(next)) return true;
  if (['and', 'or', 'not', 'is', 'was', 'are', 'were'].includes(prev)) return true;

  return false;
}

function isFalsePositiveWell(tokens: string[], index: number): boolean {
  const current = tokens[index]?.toLowerCase().replace(/[^\w]/g, '');
  if (current !== 'well') return false;

  const prev = index > 0 ? tokens[index - 1]?.toLowerCase().replace(/[^\w]/g, '') : '';
  // "as well", "very well", "do well", "went well", "plays well"
  if (['as', 'very', 'doing', 'does', 'did', 'done', 'went', 'is', 'feeling', 'feels'].includes(prev)) return true;

  return false;
}

/**
 * Detects filler words in user speech transcript with contextual intelligence to avoid false positives.
 */
export function detectFillers(text: string): FillerDetectionResult {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      totalCount: 0,
      fillerRate: 0,
      instances: [],
      countsByWord: {},
      cleanText: '',
    };
  }

  const rawTokens = text.trim().split(/\s+/);
  const totalWordCount = rawTokens.length;
  const instances: DetectedFillerInstance[] = [];
  const countsByWord: Record<string, number> = {};

  const normalizedText = text.toLowerCase();

  // 1. Detect multi-word fillers first: "you know", "i mean", "sort of", "kind of"
  const multiWordFillers = FILLER_WORDS.filter((f) => f.word.includes(' '));
  let textForMultiWord = normalizedText;

  for (const filler of multiWordFillers) {
    const regex = new RegExp(`\\b${filler.word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(textForMultiWord)) !== null) {
      instances.push({
        word: filler.word,
        index: match.index,
        category: filler.category,
      });
      countsByWord[filler.word] = (countsByWord[filler.word] || 0) + 1;
    }
  }

  // 2. Detect single-word vocal and discourse fillers
  for (let i = 0; i < rawTokens.length; i++) {
    const rawWord = rawTokens[i];
    const cleanWord = rawWord.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    if (!cleanWord) continue;

    // Vocal hesitations (um, uh, erm, er, ah, hmm) are unconditional fillers
    if (['um', 'uh', 'erm', 'er', 'ah', 'hmm'].includes(cleanWord)) {
      instances.push({
        word: cleanWord,
        index: i,
        category: 'vocal',
      });
      countsByWord[cleanWord] = (countsByWord[cleanWord] || 0) + 1;
      continue;
    }

    // Actually, basically, literally
    if (['actually', 'basically', 'literally'].includes(cleanWord)) {
      // If used as isolated filler or sentence starter / interjection
      instances.push({
        word: cleanWord,
        index: i,
        category: 'discourse',
      });
      countsByWord[cleanWord] = (countsByWord[cleanWord] || 0) + 1;
      continue;
    }

    // Contextual 'like'
    if (cleanWord === 'like') {
      if (!isFalsePositiveLike(rawTokens, i)) {
        instances.push({
          word: 'like',
          index: i,
          category: 'discourse',
        });
        countsByWord['like'] = (countsByWord['like'] || 0) + 1;
      }
      continue;
    }

    // Contextual 'so' (only when used as standalone pause/starter)
    if (cleanWord === 'so' && i === 0 && rawTokens.length > 1 && !isFalsePositiveSo(rawTokens, i)) {
      instances.push({
        word: 'so',
        index: i,
        category: 'discourse',
      });
      countsByWord['so'] = (countsByWord['so'] || 0) + 1;
      continue;
    }

    // Contextual 'well' (as opening hesitation)
    if (cleanWord === 'well' && i === 0 && !isFalsePositiveWell(rawTokens, i)) {
      instances.push({
        word: 'well',
        index: i,
        category: 'discourse',
      });
      countsByWord['well'] = (countsByWord['well'] || 0) + 1;
      continue;
    }
  }

  const totalCount = instances.length;
  const fillerRate = totalWordCount > 0 ? Number(((totalCount / totalWordCount) * 100).toFixed(1)) : 0;

  return {
    totalCount,
    fillerRate,
    instances,
    countsByWord,
    cleanText: text,
  };
}

/**
 * Counts the total detected fillers in a string
 */
export function countFillers(text: string): number {
  return detectFillers(text).totalCount;
}

/**
 * Calculates filler rate percentage: (filler count / total words) * 100
 */
export function calculateFillerRate(text: string): number {
  return detectFillers(text).fillerRate;
}
