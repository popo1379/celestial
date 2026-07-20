import { calculateNatalChart, getSignElement } from './src/lib/astrology/engine';

const chart = calculateNatalChart({ 
  year: 1995, 
  month: 6, 
  day: 17, 
  hour: 10, 
  minute: 0, 
  latitude: 40.7128, 
  longitude: -74.006, 
  timezoneOffset: -4, 
  hasExactTime: true 
});

console.log('=== 1995-06-17 纽约 10:00 (EDT, UTC-4) ===');
console.log('预期: 太阳双子座, 月亮双子座, 水星双子座, 金星双子座, 火星处女座');
console.log('实际:');
console.log('Sun:', chart.sun.signName, chart.sun.degreeInSign + '°', '(' + chart.sun.longitude.toFixed(2) + '°)');
console.log('Moon:', chart.moon.signName, chart.moon.degreeInSign + '°', '(' + chart.moon.longitude.toFixed(2) + '°)');
console.log('Mercury:', chart.mercury.signName, chart.mercury.degreeInSign + '°', '(' + chart.mercury.longitude.toFixed(2) + '°)');
console.log('Venus:', chart.venus.signName, chart.venus.degreeInSign + '°', '(' + chart.venus.longitude.toFixed(2) + '°)');
console.log('Mars:', chart.mars.signName, chart.mars.degreeInSign + '°', '(' + chart.mars.longitude.toFixed(2) + '°)');

console.log('\n=== 元素分布 ===');
const elementCounts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
for (const p of chart.planets) {
  const el = getSignElement(p.signIndex ?? 0);
  if (elementCounts[el] !== undefined) elementCounts[el]++;
}
console.log('Fire:', elementCounts.Fire, 'Earth:', elementCounts.Earth, 'Air:', elementCounts.Air, 'Water:', elementCounts.Water);