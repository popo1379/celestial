// 验证带 chartData 的 natal prompt 路径
const url = 'http://localhost:3001/horoscope/api/ai-chat'

const chartData = {
  sun: { name: 'Sun', signName: 'Leo', degreeInSign: 12.34 },
  moon: { name: 'Moon', signName: 'Scorpio', degreeInSign: 4.2 },
  ascendant: { name: 'Ascendant', signName: 'Aquarius', degreeInSign: 8.0 },
  venus: { name: 'Venus', signName: 'Cancer', degreeInSign: 22.1 },
  mars: { name: 'Mars', signName: 'Aries', degreeInSign: 5.5 },
  planets: [
    { name: 'Sun', signName: 'Leo', degreeInSign: 12.34, house: 5 },
    { name: 'Moon', signName: 'Scorpio', degreeInSign: 4.2, house: 8 },
    { name: 'Mercury', signName: 'Virgo', degreeInSign: 1.1, house: 7 },
    { name: 'Venus', signName: 'Cancer', degreeInSign: 22.1, house: 4 },
    { name: 'Mars', signName: 'Aries', degreeInSign: 5.5, house: 1 },
  ],
  houseCusps: Array.from({ length: 12 }).map((_, i) => ({
    houseNumber: i + 1,
    signName: ['Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'][i],
  })),
  natalAspects: [
    { planetA: { name: 'Sun' }, planetB: { name: 'Moon' }, englishName: 'trine', orb: 2.1, friendly: true },
    { planetA: { name: 'Mars' }, planetB: { name: 'Saturn' }, englishName: 'square', orb: 1.8, friendly: false },
  ],
}

;(async () => {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: '请根据我的星盘简要分析我近期的感情走向，不超过120字',
      context: { type: 'natal', chartData },
      history: [],
    }),
  })
  console.log('STATUS', r.status)
  const j = await r.json()
  console.log('REPLY:', j.reply)
  if (j.error) console.log('ERR:', j.error)
})()
