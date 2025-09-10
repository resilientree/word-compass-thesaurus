// Test data for model comparison
export const testWords = [
  // Basic words
  { word: "happy", category: "emotion", difficulty: "easy" },
  { word: "beautiful", category: "aesthetic", difficulty: "easy" },
  { word: "smart", category: "intelligence", difficulty: "easy" },
  { word: "big", category: "size", difficulty: "easy" },
  { word: "fast", category: "speed", difficulty: "easy" },
  
  // Medium complexity
  { word: "mysterious", category: "mystery", difficulty: "medium" },
  { word: "elegant", category: "style", difficulty: "medium" },
  { word: "courageous", category: "character", difficulty: "medium" },
  { word: "ancient", category: "time", difficulty: "medium" },
  { word: "magnificent", category: "grandeur", difficulty: "medium" },
  
  // Complex/abstract words
  { word: "ephemeral", category: "time", difficulty: "hard" },
  { word: "serendipitous", category: "luck", difficulty: "hard" },
  { word: "ubiquitous", category: "presence", difficulty: "hard" },
  { word: "perspicacious", category: "intelligence", difficulty: "hard" },
  { word: "mellifluous", category: "sound", difficulty: "hard" }
];

export const testScenarios = [
  {
    name: "Modern Casual",
    settings: { era: 0, region: 0, formality: 0, emotion: 50, rarity: 0, sentiment: 80 },
    description: "Modern, casual, positive words"
  },
  {
    name: "Historical Formal",
    settings: { era: 100, region: 50, formality: 100, emotion: 30, rarity: 50, sentiment: 50 },
    description: "Historical, formal, neutral words"
  },
  {
    name: "UK Academic",
    settings: { era: 20, region: 100, formality: 90, emotion: 20, rarity: 70, sentiment: 60 },
    description: "British English, academic style"
  },
  {
    name: "Creative Vivid",
    settings: { era: 30, region: 0, formality: 20, emotion: 90, rarity: 80, sentiment: 70 },
    description: "Creative, emotionally vivid words"
  },
  {
    name: "Rare Negative",
    settings: { era: 60, region: 30, formality: 40, emotion: 70, rarity: 90, sentiment: 20 },
    description: "Rare, negative sentiment words"
  }
];

export const expectedCriteria = {
  relevance: "Synonyms should be contextually appropriate",
  variety: "Should provide diverse alternatives",
  quality: "Words should be well-formed and meaningful",
  accuracy: "Should match the specified parameters (era, formality, etc.)",
  creativity: "Should balance common and creative alternatives"
};
