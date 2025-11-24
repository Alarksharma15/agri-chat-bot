/**
 * Extract location/city names from user queries
 * Supports both English and Japanese text
 */

// Common city names in English and Japanese
const cityMappings: Record<string, string> = {
  // Major Japanese cities
  '東京': 'Tokyo',
  'とうきょう': 'Tokyo',
  '大阪': 'Osaka',
  'おおさか': 'Osaka',
  '京都': 'Kyoto',
  'きょうと': 'Kyoto',
  '名古屋': 'Nagoya',
  'なごや': 'Nagoya',
  '札幌': 'Sapporo',
  'さっぽろ': 'Sapporo',
  '福岡': 'Fukuoka',
  'ふくおか': 'Fukuoka',
  '横浜': 'Yokohama',
  'よこはま': 'Yokohama',
  '神戸': 'Kobe',
  'こうべ': 'Kobe',
  '広島': 'Hiroshima',
  'ひろしま': 'Hiroshima',
  '仙台': 'Sendai',
  'せんだい': 'Sendai',
  '千葉': 'Chiba',
  'ちば': 'Chiba',
  '沖縄': 'Okinawa',
  'おきなわ': 'Okinawa',
  '那覇': 'Naha',
  'なは': 'Naha',
  '金沢': 'Kanazawa',
  'かなざわ': 'Kanazawa',
  '長崎': 'Nagasaki',
  'ながさき': 'Nagasaki',
  '熊本': 'Kumamoto',
  'くまもと': 'Kumamoto',
  '鹿児島': 'Kagoshima',
  'かごしま': 'Kagoshima',
  '新潟': 'Niigata',
  'にいがた': 'Niigata',
  '静岡': 'Shizuoka',
  'しずおか': 'Shizuoka',
  
  // English versions (already in English)
  'tokyo': 'Tokyo',
  'osaka': 'Osaka',
  'kyoto': 'Kyoto',
  'nagoya': 'Nagoya',
  'sapporo': 'Sapporo',
  'fukuoka': 'Fukuoka',
  'yokohama': 'Yokohama',
  'kobe': 'Kobe',
  'hiroshima': 'Hiroshima',
  'sendai': 'Sendai',
  
  // International cities
  'new york': 'New York',
  'london': 'London',
  'paris': 'Paris',
  'berlin': 'Berlin',
  'rome': 'Rome',
  'madrid': 'Madrid',
  'beijing': 'Beijing',
  'shanghai': 'Shanghai',
  'seoul': 'Seoul',
  'bangkok': 'Bangkok',
  'singapore': 'Singapore',
  'sydney': 'Sydney',
  'melbourne': 'Melbourne',
  'los angeles': 'Los Angeles',
  'san francisco': 'San Francisco',
  'chicago': 'Chicago',
  'toronto': 'Toronto',
  'vancouver': 'Vancouver',
};

/**
 * Extract location from user message
 * Returns the city name in English format suitable for OpenWeather API
 */
export function extractLocation(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact matches in our city mappings
  for (const [key, value] of Object.entries(cityMappings)) {
    if (message.includes(key) || lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Look for common patterns in English
  // Pattern: "in [City]", "at [City]", "[City]'s weather", "weather in [City]"
  const englishPatterns = [
    /(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)'s\s+weather/i,
    /weather\s+(?:in|at|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];
  
  for (const pattern of englishPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Look for capitalized words that might be cities (2-20 characters)
  const capitalizedWords = message.match(/\b[A-Z][a-z]{1,19}(?:\s+[A-Z][a-z]{1,19})?\b/g);
  if (capitalizedWords && capitalizedWords.length > 0) {
    // Return the first capitalized word(s) that's not a common word
    const commonWords = ['I', 'Is', 'The', 'What', 'Where', 'When', 'Should', 'Can', 'Do', 'Does', 'Today', 'Tomorrow'];
    for (const word of capitalizedWords) {
      if (!commonWords.includes(word)) {
        return word;
      }
    }
  }
  
  return null;
}

/**
 * Check if message is asking about weather or agriculture activities that need weather context
 */
export function isWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    // English - Weather
    'weather', 'temperature', 'rain', 'sunny', 'cloud', 'wind', 'forecast',
    'hot', 'cold', 'warm', 'humid', 'climate',
    // English - Agriculture (weather-dependent)
    'plant', 'planting', 'sow', 'sowing', 'harvest', 'harvesting',
    'irrigation', 'water', 'fertilize', 'spray', 'crop', 'farm', 'field',
    'grow', 'growing', 'outdoor', 'work outside',
    // Japanese - Weather
    '天気', '気温', '雨', '晴れ', '曇り', '風', '予報', '暑い', '寒い', '湿度', '気候',
    // Japanese - Agriculture (weather-dependent)
    '種', '種まき', '植え', '収穫', '灌漑', '水やり', '肥料', '農作業', '畑', '田んぼ',
    '栽培', '作物', '野菜', '稲', '米', '農業', '農家', '外作業', '屋外'
  ];
  
  const lowerMessage = message.toLowerCase();
  return weatherKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase()) || message.includes(keyword)
  );
}

