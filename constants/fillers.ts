export interface FillerDefinition {
  word: string;
  category: 'vocal' | 'discourse' | 'hesitation';
  isContextual?: boolean; // Requires syntactic context check (e.g., 'like', 'well', 'so')
}

export const FILLER_WORDS: FillerDefinition[] = [
  { word: 'um', category: 'vocal' },
  { word: 'uh', category: 'vocal' },
  { word: 'erm', category: 'vocal' },
  { word: 'er', category: 'vocal' },
  { word: 'ah', category: 'vocal' },
  { word: 'hmm', category: 'vocal' },
  { word: 'like', category: 'discourse', isContextual: true },
  { word: 'actually', category: 'discourse' },
  { word: 'basically', category: 'discourse' },
  { word: 'literally', category: 'discourse' },
  { word: 'you know', category: 'hesitation' },
  { word: 'i mean', category: 'hesitation' },
  { word: 'sort of', category: 'hesitation' },
  { word: 'kind of', category: 'hesitation' },
  { word: 'so', category: 'discourse', isContextual: true },
  { word: 'well', category: 'discourse', isContextual: true },
];

export const PRIMARY_TRACKED_FILLERS = ['um', 'like', 'actually', 'you know'] as const;
