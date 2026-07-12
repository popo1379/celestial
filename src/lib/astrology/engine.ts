const PI = Math.PI;
const RAD = PI / 180;
const DEG = 180 / PI;

export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  latitude?: number;
  longitude?: number;
  timezoneOffset?: number;
  hasExactTime?: boolean;
}

export interface ZodiacInfo {
  signIndex: number;
  signName: string;
  symbol: string;
  degree: number;
  fullLongitude: number;
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  longitude: number;
  longitudeStr: string;
  signIndex?: number;
  signName?: string;
  degreeInSign?: number;
  minuteInSign?: number;
  house?: number;
}

export interface AxisPoint {
  name: string;
  symbol: string;
  longitude: number;
  longitudeStr: string;
  signIndex?: number;
  signName?: string;
  degreeInSign?: number;
  minuteInSign?: number;
  house?: number;
}

export interface HouseCusp {
  houseNumber: number;
  longitude: number;
  signIndex: number;
  signName: string;
  planetsInHouse?: { name: string; symbol: string; signName?: string; degreeInSign?: number }[];
  rulingPlanet?: { name: string; symbol: string };
}

export interface TransitDate {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

export interface AspectDef {
  type: string;
  englishName: string;
  symbol: string;
  exactAngle: number;
  maxOrb: number;
  friendly: boolean;
  baseScore: number;
}

export interface AspectResult {
  type: string;
  englishName: string;
  symbol: string;
  orb: number;
  exactAngle: number;
  friendly: boolean;
  score: number;
  transitPlanet?: { name: string; signName: string; longitude: number; house?: number };
  natalPlanet?: { name: string; signName: string; longitude: number; house?: number };
  planetA?: { name: string; symbol: string; signName: string; longitude: number; house?: number; side?: string };
  planetB?: { name: string; symbol: string; signName: string; longitude: number; house?: number; side?: string };
  intensity?: number;
}

export interface MoonPhaseResult {
  phaseName: string;
  phaseIndex: number;
  angle: number;
  age: number;
  illumination: number;
  sunLongitude: number;
  moonLongitude: number;
}

export interface AsteroidResult {
  name: string;
  symbol: string;
  longitude: number;
  signIndex: number;
  signName: string;
  degreeInSign: number;
  minuteInSign: number;
}

export interface TransitEvent {
  title: string;
  type: string;
  friendly: boolean;
  intensity: number;
  keywords: string[];
  domain: string;
  house?: number;
  natalPlanet?: { name: string; signName: string; longitude: number; house?: number };
  transitPlanet?: { name: string; signName: string; longitude?: number; house?: number };
  orb: number;
}

export interface DailyFortuneResult {
  score: number;
  starRating: number;
  luckyNumber: number;
  luckyColor: string;
  events: TransitEvent[];
  dominantTitle: string;
  dominantEvent: TransitEvent | null;
  natalSign: string;
  transitMoonSign: string;
  ascSign: string | null;
  natalPlanets: PlanetPosition[];
  houseCusps: number | null;
}

export interface ChartCoordinates {
  [planetName: string]: { x: number; y: number; angle: number };
}

export interface SynastryResult {
  aspects: AspectResult[];
  houseOverlay: {
    AintoB: HouseOverlayItem[];
    BintoA: HouseOverlayItem[];
  };
  compatibilityScore: number;
  positiveCount: number;
  challengeCount: number;
  totalAspects: number;
}

export interface HouseOverlayItem {
  planet: { name: string; symbol: string; signName: string };
  house: number;
}

export interface ChartResult {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  ascendant: AxisPoint | null;
  midheaven: AxisPoint | null;
  planets: PlanetPosition[];
  houses: number[] | null;
  houseCusps: HouseCusp[] | null;
  JD: number;
  descendant?: AxisPoint;
  imumCoeli?: AxisPoint;
  moonPhase?: MoonPhaseResult;
  asteroids?: AsteroidResult[];
  natalAspects?: AspectResult[];
  isComposite?: boolean;
}

export interface TransitChartResult {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  planets: PlanetPosition[];
  JD: number;
}

export interface CompositeChartResult {
  planets: PlanetPosition[];
  isComposite: boolean;
  sun?: PlanetPosition;
  moon?: PlanetPosition;
  mercury?: PlanetPosition;
  venus?: PlanetPosition;
  mars?: PlanetPosition;
  jupiter?: PlanetPosition;
  saturn?: PlanetPosition;
  uranus?: PlanetPosition;
  neptune?: PlanetPosition;
  pluto?: PlanetPosition;
  ascendant?: AxisPoint;
  midheaven?: AxisPoint;
  houseCusps?: HouseCusp[];
  moonPhase?: MoonPhaseResult;
  natalAspects?: AspectResult[];
}

function toRange360(deg: number): number {
  let r = deg % 360;
  if (r < 0) r += 360;
  return r;
}

function sinDeg(deg: number): number {
  return Math.sin(deg * RAD);
}

function cosDeg(deg: number): number {
  return Math.cos(deg * RAD);
}

function asinDeg(x: number): number {
  return Math.asin(x) * DEG;
}

function atan2Deg(y: number, x: number): number {
  return Math.atan2(y, x) * DEG;
}

function getJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  let Y = year;
  let M = month;
  const D = day + (hour + minute / 60) / 24;

  if (M < 3) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D + B - 1524.5;

  return JD;
}

function getJulianCentury(JD: number): number {
  return (JD - 2451545.0) / 36525.0;
}

function getGMST(JD: number): number {
  const T = getJulianCentury(JD);
  const theta = 280.46061837 +
    360.98564736629 * (JD - 2451545.0) +
    0.000387933 * T * T -
    T * T * T / 38710000.0;
  return toRange360(theta);
}

function getLST(JD: number, longitude: number): number {
  const gmst = getGMST(JD);
  return toRange360(gmst + longitude);
}

export const zodiacNames: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const zodiacSymbols: string[] = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export function getZodiacSign(longitude: number): ZodiacInfo {
  const lon = toRange360(longitude);
  const signIndex = Math.floor(lon / 30);
  const degreeInSign = lon - signIndex * 30;
  return {
    signIndex: signIndex,
    signName: zodiacNames[signIndex],
    symbol: zodiacSymbols[signIndex],
    degree: degreeInSign,
    fullLongitude: lon
  };
}

export function calculateSun(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const M_norm = toRange360(M);

  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const L0_norm = toRange360(L0);

  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M_norm) +
    (0.019993 - 0.000101 * T) * sinDeg(2 * M_norm) +
    0.000289 * sinDeg(3 * M_norm);

  const lambda = L0_norm + C;

  return {
    name: 'Sun',
    symbol: '☉',
    longitude: toRange360(lambda),
    longitudeStr: formatLongitude(lambda)
  };
}

export function calculateMoon(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 218.316 + 481267.8813 * T;
  const L_norm = toRange360(L);

  const M = 134.963 + 477198.8673 * T;
  const M_norm = toRange360(M);

  const F = 93.272 + 483202.0175 * T;
  const F_norm = toRange360(F);

  const Ms = 357.52911 + 35999.05029 * T;
  const Ms_norm = toRange360(Ms);

  const D = 297.8502 + 445267.1115 * T;
  const D_norm = toRange360(D);

  const lambda = L_norm +
    6.289 * sinDeg(M_norm) +
    (-1.274) * sinDeg(M_norm - 2 * D_norm) +
    0.658 * sinDeg(2 * D_norm) +
    (-0.186) * sinDeg(Ms_norm) +
    (-0.059) * sinDeg(2 * M_norm - 2 * D_norm) +
    (-0.057) * sinDeg(M_norm - 2 * D_norm + Ms_norm) +
    0.053 * sinDeg(M_norm + 2 * D_norm) +
    0.046 * sinDeg(2 * D_norm - Ms_norm) +
    0.041 * sinDeg(M_norm - Ms_norm) +
    (-0.035) * sinDeg(D_norm) +
    (-0.031) * sinDeg(M_norm + Ms_norm);

  return {
    name: 'Moon',
    symbol: '☽',
    longitude: toRange360(lambda),
    longitudeStr: formatLongitude(lambda)
  };
}

export function calculateMercury(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 252.25 + 149474.0708 * T;
  const L_norm = toRange360(L);

  const a = 0.387098;
  const e = 0.205635 + 0.0000000559 * T;
  const i = 7.00487 - 0.00001871 * T;
  const omega = 48.33167 - 0.00001245 * T;
  const omegaP = 77.45645 + 0.00001514 * T;

  const M = L_norm - omegaP;
  const M_norm = toRange360(M);

  const E = solveKepler(M_norm, e);

  const nu = 2 * atan2Deg(Math.sqrt(1 + e) * sinDeg(E / 2), Math.sqrt(1 - e) * cosDeg(E / 2));

  const r = a * (1 - e * cosDeg(E));

  const lambda = omegaP + nu;
  const lambda_norm = toRange360(lambda);

  return {
    name: 'Mercury',
    symbol: '☿',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateVenus(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 181.9797 + 58517.81567 * T;
  const L_norm = toRange360(L);

  const e = 0.006772;
  const omegaP = 131.53298;

  const M = L_norm - omegaP;
  const M_norm = toRange360(M);

  const E = solveKepler(M_norm, e);
  const nu = 2 * atan2Deg(Math.sqrt(1 + e) * sinDeg(E / 2), Math.sqrt(1 - e) * cosDeg(E / 2));

  const lambda = omegaP + nu;
  const lambda_norm = toRange360(lambda);

  return {
    name: 'Venus',
    symbol: '♀',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateMars(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 355.4333 + 19140.29893 * T;
  const L_norm = toRange360(L);

  const e = 0.093403;
  const omegaP = 336.04084;

  const M = L_norm - omegaP;
  const M_norm = toRange360(M);

  const E = solveKepler(M_norm, e);
  const nu = 2 * atan2Deg(Math.sqrt(1 + e) * sinDeg(E / 2), Math.sqrt(1 - e) * cosDeg(E / 2));

  const lambda = omegaP + nu;
  const lambda_norm = toRange360(lambda);

  return {
    name: 'Mars',
    symbol: '♂',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateJupiter(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 34.4 + 3036.30277 * T;
  const L_norm = toRange360(L);

  const e = 0.048498;
  const omegaP = 14.75385;

  const M = L_norm - omegaP;
  const M_norm = toRange360(M);

  const E = solveKepler(M_norm, e);
  const nu = 2 * atan2Deg(Math.sqrt(1 + e) * sinDeg(E / 2), Math.sqrt(1 - e) * cosDeg(E / 2));

  const lambda = omegaP + nu;
  const lambda_norm = toRange360(lambda);

  return {
    name: 'Jupiter',
    symbol: '♃',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateSaturn(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);

  const L = 50.0774 + 1224.07466 * T;
  const L_norm = toRange360(L);

  const e = 0.055549;
  const omegaP = 93.05724;

  const M = L_norm - omegaP;
  const M_norm = toRange360(M);

  const E = solveKepler(M_norm, e);
  const nu = 2 * atan2Deg(Math.sqrt(1 + e) * sinDeg(E / 2), Math.sqrt(1 - e) * cosDeg(E / 2));

  const lambda = omegaP + nu;
  const lambda_norm = toRange360(lambda);

  return {
    name: 'Saturn',
    symbol: '♄',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateUranus(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);
  const lambda = 313.2 + 42.96 * T;
  const lambda_norm = toRange360(lambda);
  return {
    name: 'Uranus',
    symbol: '♅',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculateNeptune(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);
  const lambda = 304.88 + 21.83 * T;
  const lambda_norm = toRange360(lambda);
  return {
    name: 'Neptune',
    symbol: '♆',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

export function calculatePluto(JD: number): PlanetPosition {
  const T = getJulianCentury(JD);
  const lambda = 238.96 + 14.54 * T;
  const lambda_norm = toRange360(lambda);
  return {
    name: 'Pluto',
    symbol: '♇',
    longitude: lambda_norm,
    longitudeStr: formatLongitude(lambda_norm)
  };
}

function solveKepler(M: number, e: number): number {
  const M_rad = M * RAD;
  let E = M_rad;

  for (let i = 0; i < 10; i++) {
    const dE = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 0.0000001) break;
  }

  return E * DEG;
}

export function calculateAscendant(JD: number, latitude: number, longitude: number): AxisPoint {
  const T = getJulianCentury(JD);
  const LST = getLST(JD, longitude);

  const epsilon = 23.4392911 - 0.0130042 * T - 0.00000016 * T * T;

  const phi = latitude * RAD;
  const eps = epsilon * RAD;
  const lstRad = LST * RAD;

  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  const ascRad = Math.atan2(y, x);
  const asc = ascRad * DEG + 180;
  const asc_norm = toRange360(asc);

  return {
    name: 'Ascendant',
    symbol: 'ASC',
    longitude: asc_norm,
    longitudeStr: formatLongitude(asc_norm)
  };
}

export function calculateMidheaven(JD: number, latitude: number, longitude: number): AxisPoint {
  const T = getJulianCentury(JD);
  const LST = getLST(JD, longitude);
  const epsilon = 23.4392911 - 0.0130042 * T;

  const mc = atan2Deg(sinDeg(LST), cosDeg(LST) * cosDeg(epsilon));
  const mc_norm = toRange360(mc);

  return {
    name: 'Midheaven',
    symbol: 'MC',
    longitude: mc_norm,
    longitudeStr: formatLongitude(mc_norm)
  };
}

function formatLongitude(longitude: number): string {
  const info = getZodiacSign(longitude);
  const deg = Math.floor(info.degree);
  const min = Math.floor((info.degree - deg) * 60);
  return info.signName + ' ' + deg + '°' + min + "'";
}

export function calculateNatalChart(birthInfo: BirthInfo): ChartResult {
  const year = birthInfo.year;
  const month = birthInfo.month;
  const day = birthInfo.day;
  const hour = birthInfo.hour !== undefined && birthInfo.hour !== null ? birthInfo.hour : 12;
  const minute = birthInfo.minute !== undefined && birthInfo.minute !== null ? birthInfo.minute : 0;
  const latitude = birthInfo.latitude;
  const longitude = birthInfo.longitude;
  const hasExactTime = birthInfo.hasExactTime;

  let timezoneOffset = birthInfo.timezoneOffset;
  if (timezoneOffset === undefined || timezoneOffset === null) {
    if (longitude !== undefined && longitude !== null) {
      timezoneOffset = Math.round(longitude / 15);
    } else {
      timezoneOffset = 8;
    }
  }

  let utcHour = hour - timezoneOffset;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (utcHour < 0) {
    utcHour += 24;
    utcDay -= 1;
  } else if (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
  }

  if (utcDay < 1) {
    utcMonth -= 1;
    if (utcMonth < 1) {
      utcMonth = 12;
      utcYear -= 1;
    }
    const daysInPrevMonth = new Date(utcYear, utcMonth, 0).getDate();
    utcDay = daysInPrevMonth;
  } else {
    const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
    if (utcDay > daysInMonth) {
      utcDay = 1;
      utcMonth += 1;
      if (utcMonth > 12) {
        utcMonth = 1;
        utcYear += 1;
      }
    }
  }

  const JD = getJulianDay(utcYear, utcMonth, utcDay, utcHour, minute);

  const sun = calculateSun(JD);
  const moon = calculateMoon(JD);
  const mercury = calculateMercury(JD);
  const venus = calculateVenus(JD);
  const mars = calculateMars(JD);
  const jupiter = calculateJupiter(JD);
  const saturn = calculateSaturn(JD);
  const uranus = calculateUranus(JD);
  const neptune = calculateNeptune(JD);
  const pluto = calculatePluto(JD);

  let ascendant: AxisPoint | null = null;
  let midheaven: AxisPoint | null = null;

  if (hasExactTime) {
    ascendant = calculateAscendant(JD, latitude!, longitude!);
    midheaven = calculateMidheaven(JD, latitude!, longitude!);
  }

  const planets = [sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto];
  for (let i = 0; i < planets.length; i++) {
    const info = getZodiacSign(planets[i].longitude);
    planets[i].signIndex = info.signIndex;
    planets[i].signName = info.signName;
    planets[i].degreeInSign = Math.floor(info.degree);
    planets[i].minuteInSign = Math.floor((info.degree - planets[i].degreeInSign!) * 60);
  }

  if (ascendant) {
    const ascInfo = getZodiacSign(ascendant.longitude);
    ascendant.signIndex = ascInfo.signIndex;
    ascendant.signName = ascInfo.signName;
    ascendant.degreeInSign = Math.floor(ascInfo.degree);
    ascendant.minuteInSign = Math.floor((ascInfo.degree - ascendant.degreeInSign!) * 60);
  }

  if (midheaven) {
    const mcInfo = getZodiacSign(midheaven.longitude);
    midheaven.signIndex = mcInfo.signIndex;
    midheaven.signName = mcInfo.signName;
    midheaven.degreeInSign = Math.floor(mcInfo.degree);
    midheaven.minuteInSign = Math.floor((mcInfo.degree - midheaven.degreeInSign!) * 60);
  }

  let houses: number[] | null = null;
  let houseCusps: HouseCusp[] | null = null;

  if (hasExactTime && ascendant) {
    houses = [];
    houseCusps = [];
    const house1Cusp = ascendant.signIndex! * 30;

    for (let hi = 0; hi < 12; hi++) {
      const cuspLong = (house1Cusp + hi * 30) % 360;
      const cuspInfo = getZodiacSign(cuspLong);
      houseCusps.push({
        houseNumber: hi + 1,
        longitude: cuspLong,
        signIndex: cuspInfo.signIndex,
        signName: cuspInfo.signName
      });
    }

    for (let pi = 0; pi < planets.length; pi++) {
      const pl = planets[pi];
      const rel = ((pl.longitude - house1Cusp) % 360 + 360) % 360;
      const houseNum = Math.floor(rel / 30) + 1;
      pl.house = houseNum;
    }

    const ascRel = ((ascendant.longitude - house1Cusp) % 360 + 360) % 360;
    ascendant.house = Math.floor(ascRel / 30) + 1;

    const mcRel = ((midheaven!.longitude - house1Cusp) % 360 + 360) % 360;
    midheaven!.house = Math.floor(mcRel / 30) + 1;
  }

  return {
    sun: sun,
    moon: moon,
    mercury: mercury,
    venus: venus,
    mars: mars,
    jupiter: jupiter,
    saturn: saturn,
    uranus: uranus,
    neptune: neptune,
    pluto: pluto,
    ascendant: ascendant,
    midheaven: midheaven,
    planets: planets,
    houses: houses,
    houseCusps: houseCusps,
    JD: JD
  };
}

export function calculateTransitChart(year: number, month: number, day: number, hour?: number, minute?: number, natalAscSignIndex?: number, house1Cusp?: number): TransitChartResult {
  const JD = getJulianDay(year, month, day, hour || 12, minute || 0);

  const sun = calculateSun(JD);
  const moon = calculateMoon(JD);
  const mercury = calculateMercury(JD);
  const venus = calculateVenus(JD);
  const mars = calculateMars(JD);
  const jupiter = calculateJupiter(JD);
  const saturn = calculateSaturn(JD);
  const uranus = calculateUranus(JD);
  const neptune = calculateNeptune(JD);
  const pluto = calculatePluto(JD);

  const planets = [sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto];
  for (let i = 0; i < planets.length; i++) {
    const info = getZodiacSign(planets[i].longitude);
    planets[i].signIndex = info.signIndex;
    planets[i].signName = info.signName;
    planets[i].degreeInSign = Math.floor(info.degree);
    if (house1Cusp !== undefined && house1Cusp !== null) {
      const rel = ((planets[i].longitude - house1Cusp) % 360 + 360) % 360;
      planets[i].house = Math.floor(rel / 30) + 1;
    }
  }

  return {
    sun: sun,
    moon: moon,
    mercury: mercury,
    venus: venus,
    mars: mars,
    jupiter: jupiter,
    saturn: saturn,
    uranus: uranus,
    neptune: neptune,
    pluto: pluto,
    planets: planets,
    JD: JD
  };
}

export const aspectTypeDefs: AspectDef[] = [
  { type: 'Conjunction', englishName: 'conjunction', symbol: '☌', exactAngle: 0, maxOrb: 8, friendly: true, baseScore: 5 },
  { type: 'Sextile', englishName: 'sextile', symbol: '⚹', exactAngle: 60, maxOrb: 6, friendly: true, baseScore: 6 },
  { type: 'Square', englishName: 'square', symbol: '□', exactAngle: 90, maxOrb: 7, friendly: false, baseScore: -8 },
  { type: 'Trine', englishName: 'trine', symbol: '△', exactAngle: 120, maxOrb: 8, friendly: true, baseScore: 8 },
  { type: 'Opposition', englishName: 'opposition', symbol: '☍', exactAngle: 180, maxOrb: 8, friendly: false, baseScore: -7 }
];

export function calculateAspectsBetween(tp: { longitude: number; name?: string; signName?: string; house?: number }, np: { longitude: number; name?: string; signName?: string; house?: number }): AspectResult[] {
  let diff = Math.abs(tp.longitude - np.longitude);
  if (diff > 180) diff = 360 - diff;

  const found: AspectResult[] = [];
  for (let i = 0; i < aspectTypeDefs.length; i++) {
    const def = aspectTypeDefs[i];
    const orb = Math.abs(diff - def.exactAngle);
    if (orb <= def.maxOrb) {
      found.push({
        type: def.type,
        englishName: def.englishName,
        symbol: def.symbol,
        orb: orb,
        exactAngle: diff,
        friendly: def.friendly,
        score: def.friendly ? def.baseScore * (1 - orb / def.maxOrb) : def.baseScore * (1 - orb / def.maxOrb),
        transitPlanet: { name: tp.name!, signName: tp.signName!, longitude: tp.longitude, house: tp.house },
        natalPlanet: { name: np.name!, signName: np.signName!, longitude: np.longitude, house: np.house }
      });
    }
  }
  return found;
}

export function identifyAllTransitAspects(natalChart: ChartResult, transitChart: TransitChartResult): AspectResult[] {
  const allAspects: AspectResult[] = [];
  for (let i = 0; i < transitChart.planets.length; i++) {
    for (let j = 0; j < natalChart.planets.length; j++) {
      const found = calculateAspectsBetween(transitChart.planets[i], natalChart.planets[j]);
      for (let k = 0; k < found.length; k++) {
        allAspects.push(found[k]);
      }
    }
  }
  allAspects.sort(function (a, b) { return Math.abs(b.score) - Math.abs(a.score); });
  return allAspects;
}

export function getKeyTransitEvents(natalChart: ChartResult, transitChart: TransitChartResult, natalAscSignIndex?: number, house1Cusp?: number): TransitEvent[] {
  const events: TransitEvent[] = [];

  const allAspects = identifyAllTransitAspects(natalChart, transitChart);

  for (let idx = 0; idx < allAspects.length; idx++) {
    const aspect = allAspects[idx];
    const title = aspect.transitPlanet!.name + ' ' + aspect.type + ' natal ' + aspect.natalPlanet!.name;
    const domain = mapPlanetToDomain(aspect.transitPlanet!.name, aspect.natalPlanet!.name);
    const keywords = generateEventKeywords(aspect);
    const intensity = Math.round(Math.abs(aspect.score) * 10) / 10;

    events.push({
      title: title,
      type: aspect.type,
      friendly: aspect.friendly,
      intensity: intensity,
      keywords: keywords,
      domain: domain,
      house: aspect.transitPlanet!.house,
      natalPlanet: aspect.natalPlanet,
      transitPlanet: aspect.transitPlanet,
      orb: aspect.orb
    });
  }

  const specialPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  for (let idx = 0; idx < transitChart.planets.length; idx++) {
    const tp = transitChart.planets[idx];
    if (specialPlanets.indexOf(tp.name) >= 0 && tp.house) {
      const houseKeywords: Record<number, string[]> = {
        1: ['Self-expression', 'Personal image', 'New beginnings'],
        2: ['Finance', 'Values', 'Security'],
        3: ['Communication', 'Learning', 'Short travel'],
        4: ['Home', 'Roots', 'Inner world'],
        5: ['Creativity', 'Romance', 'Pleasure'],
        6: ['Work', 'Health', 'Daily routine'],
        7: ['Relationships', 'Partnership', 'Partner'],
        8: ['Deep transformation', 'Shared resources', 'Intimacy'],
        9: ['Travel', 'Philosophy', 'Higher learning'],
        10: ['Career', 'Achievement', 'Social status'],
        11: ['Friends', 'Social networks', 'Ideals'],
        12: ['Subconscious', 'Spiritual world', 'Solitude']
      };
      const hk = houseKeywords[tp.house] || ['Life', 'Daily', 'Feelings'];
      events.push({
        title: tp.name + ' in house ' + tp.house,
        type: 'house',
        friendly: true,
        intensity: 3,
        keywords: hk,
        domain: mapHouseToDomain(tp.house),
        house: tp.house,
        transitPlanet: { name: tp.name, signName: tp.signName! },
        orb: 0
      });
    }
  }

  events.sort(function (a, b) { return b.intensity - a.intensity; });

  return events;
}

function mapPlanetToDomain(transitName: string, natalName: string): string {
  const map: Record<string, string> = {
    'Sun': 'Self',
    'Moon': 'Emotion',
    'Mercury': 'Communication',
    'Venus': 'Love',
    'Mars': 'Action',
    'Jupiter': 'Growth',
    'Saturn': 'Responsibility',
    'Uranus': 'Change',
    'Neptune': 'Inspiration',
    'Pluto': 'Transformation'
  };
  return (map[transitName] || 'Life') + ' & ' + (map[natalName] || 'Inner');
}

function mapHouseToDomain(house: number): string {
  const map: Record<number, string> = {
    1: 'Self identity', 2: 'Finance & values', 3: 'Communication & learning', 4: 'Home & family',
    5: 'Creativity & romance', 6: 'Work & health', 7: 'Relationships & partnership',
    8: 'Deep transformation', 9: 'Travel & exploration',
    10: 'Career & achievement', 11: 'Social & ideals', 12: 'Spiritual world'
  };
  return map[house] || 'Daily life';
}

function generateEventKeywords(aspect: AspectResult): string[] {
  const positiveWords = ['Energy blend', 'Smooth flow', 'Natural expression', 'Talent display', 'Inspiration'];
  const challengeWords = ['Inner tension', 'Need balance', 'Deep issues', 'Need awareness', 'Transformation trigger'];
  const words = aspect.friendly ? positiveWords : challengeWords;
  const result: string[] = [];
  result.push(aspect.transitPlanet!.name + ' energy');
  result.push(words[0]);
  result.push(words[1]);
  return result;
}

export function calculateDailyFortune(natalChart: ChartResult, transitDate: TransitDate, house1Cusp?: number): DailyFortuneResult {
  const transitChart = calculateTransitChart(
    transitDate.year,
    transitDate.month,
    transitDate.day,
    12, 0,
    natalChart.ascendant ? natalChart.ascendant.signIndex : undefined,
    house1Cusp
  );

  const events = getKeyTransitEvents(natalChart, transitChart,
    natalChart.ascendant ? natalChart.ascendant.signIndex : undefined,
    house1Cusp);

  let posCount = 0;
  let chalCount = 0;
  for (let e2 = 0; e2 < events.length; e2++) {
    if (events[e2].type !== 'house') {
      if (events[e2].friendly) posCount++;
      else chalCount++;
    }
  }

  const score = Math.max(50, Math.min(98, 60 + posCount * 6 - chalCount * 7));

  let starRating: number;
  if (score >= 90) starRating = 5;
  else if (score >= 80) starRating = 4;
  else if (score >= 70) starRating = 3;
  else if (score >= 60) starRating = 2;
  else starRating = 1;

  const luckyNumber = Math.floor(Math.abs(transitChart.sun.longitude - natalChart.sun.longitude)) % 9 + 1;

  const colorMap: Record<string, string> = {
    'Aries': 'Red', 'Taurus': 'Green', 'Gemini': 'Yellow', 'Cancer': 'Silver',
    'Leo': 'Gold', 'Virgo': 'Dark blue', 'Libra': 'Pink', 'Scorpio': 'Dark purple',
    'Sagittarius': 'Purple', 'Capricorn': 'Dark brown', 'Aquarius': 'Teal', 'Pisces': 'Sea blue'
  };
  const luckyColor = colorMap[natalChart.sun.signName!] || 'White';

  let dominantTitle = '';
  let dominantEvent: TransitEvent | null = null;
  for (let z = 0; z < events.length; z++) {
    if (events[z].type !== 'house') {
      dominantEvent = events[z];
      dominantTitle = events[z].title;
      break;
    }
  }
  if (!dominantEvent && events.length > 0) dominantEvent = events[0];

  return {
    score: score,
    starRating: starRating,
    luckyNumber: luckyNumber,
    luckyColor: luckyColor,
    events: events,
    dominantTitle: dominantTitle,
    dominantEvent: dominantEvent,
    natalSign: natalChart.sun.signName!,
    transitMoonSign: transitChart.moon.signName!,
    ascSign: natalChart.ascendant ? natalChart.ascendant.signName! : null,
    natalPlanets: natalChart.planets,
    houseCusps: house1Cusp || null
  };
}

export function generateChartCoordinates(chart: ChartResult, radius: number): ChartCoordinates {
  const coords: ChartCoordinates = {};
  const planetList = chart.planets;

  for (let i = 0; i < planetList.length; i++) {
    const angle = 270 - planetList[i].longitude;
    const rad = angle * RAD;
    coords[planetList[i].name] = {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      angle: planetList[i].longitude
    };
  }

  if (chart.ascendant) {
    const ascAngle = 270 - chart.ascendant.longitude;
    const ascRad = ascAngle * RAD;
    coords['Ascendant'] = {
      x: (radius + 30) * Math.cos(ascRad),
      y: (radius + 30) * Math.sin(ascRad),
      angle: chart.ascendant.longitude
    };
  }

  return coords;
}

export function calculateMoonPhase(sunLongitude: number, moonLongitude: number): MoonPhaseResult {
  const angle = toRange360(moonLongitude - sunLongitude);
  const lunarMonth = 29.530588853;
  const age = (angle / 360) * lunarMonth;

  let phaseName = '';
  let phaseIndex = 0;

  if (angle < 45) {
    phaseName = 'New Moon';
    phaseIndex = 0;
  } else if (angle < 90) {
    phaseName = 'Waxing Crescent';
    phaseIndex = 1;
  } else if (angle < 135) {
    phaseName = 'First Quarter';
    phaseIndex = 2;
  } else if (angle < 180) {
    phaseName = 'Waxing Gibbous';
    phaseIndex = 3;
  } else if (angle < 225) {
    phaseName = 'Full Moon';
    phaseIndex = 4;
  } else if (angle < 270) {
    phaseName = 'Waning Gibbous';
    phaseIndex = 5;
  } else if (angle < 315) {
    phaseName = 'Last Quarter';
    phaseIndex = 6;
  } else {
    phaseName = 'Waning Crescent';
    phaseIndex = 7;
  }

  const illumination = (1 - Math.cos(angle * RAD)) / 2;

  return {
    phaseName: phaseName,
    phaseIndex: phaseIndex,
    angle: angle,
    age: Math.round(age * 10) / 10,
    illumination: Math.round(illumination * 100) / 100,
    sunLongitude: sunLongitude,
    moonLongitude: moonLongitude
  };
}

export function calculateNatalAspects(chart: ChartResult | CompositeChartResult): AspectResult[] {
  const planets = chart.planets || [];
  const aspects: AspectResult[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const found = calculateAspectsBetween(planets[i], planets[j]);
      for (let k = 0; k < found.length; k++) {
        const asp = found[k];
        asp.planetA = {
          name: planets[i].name,
          symbol: planets[i].symbol,
          signName: planets[i].signName!,
          longitude: planets[i].longitude,
          house: planets[i].house
        };
        asp.planetB = {
          name: planets[j].name,
          symbol: planets[j].symbol,
          signName: planets[j].signName!,
          longitude: planets[j].longitude,
          house: planets[j].house
        };
        asp.intensity = Math.abs(asp.score);
        aspects.push(asp);
      }
    }
  }

  aspects.sort(function (a, b) {
    return b.intensity! - a.intensity!;
  });

  return aspects;
}

export function extendNatalChart(chart: ChartResult): ChartResult {
  if (chart.ascendant) {
    const dscLon = toRange360(chart.ascendant.longitude + 180);
    const dscInfo = getZodiacSign(dscLon);
    chart.descendant = {
      name: 'Descendant',
      symbol: 'DSC',
      longitude: dscLon,
      longitudeStr: dscInfo.signName + ' ' + Math.floor(dscInfo.degree) + '°' + Math.floor((dscInfo.degree - Math.floor(dscInfo.degree)) * 60) + "'",
      signIndex: dscInfo.signIndex,
      signName: dscInfo.signName,
      degreeInSign: Math.floor(dscInfo.degree),
      minuteInSign: Math.floor((dscInfo.degree - Math.floor(dscInfo.degree)) * 60),
      house: 7
    };
  }

  if (chart.midheaven) {
    const icLon = toRange360(chart.midheaven.longitude + 180);
    const icInfo = getZodiacSign(icLon);
    chart.imumCoeli = {
      name: 'Imum Coeli',
      symbol: 'IC',
      longitude: icLon,
      longitudeStr: icInfo.signName + ' ' + Math.floor(icInfo.degree) + '°' + Math.floor((icInfo.degree - Math.floor(icInfo.degree)) * 60) + "'",
      signIndex: icInfo.signIndex,
      signName: icInfo.signName,
      degreeInSign: Math.floor(icInfo.degree),
      minuteInSign: Math.floor((icInfo.degree - Math.floor(icInfo.degree)) * 60),
      house: 4
    };
  }

  chart.moonPhase = calculateMoonPhase(chart.sun.longitude, chart.moon.longitude);

  chart.asteroids = calculateAsteroids(chart.JD);

  if (chart.houseCusps && chart.planets) {
    for (let hi = 0; hi < chart.houseCusps.length; hi++) {
      const cusp = chart.houseCusps[hi];
      const houseNum = cusp.houseNumber;
      cusp.planetsInHouse = [];
      cusp.rulingPlanet = getHouseRuler(cusp.signIndex);

      for (let pi = 0; pi < chart.planets.length; pi++) {
        if (chart.planets[pi].house === houseNum) {
          cusp.planetsInHouse.push({
            name: chart.planets[pi].name,
            symbol: chart.planets[pi].symbol,
            signName: chart.planets[pi].signName,
            degreeInSign: chart.planets[pi].degreeInSign
          });
        }
      }
    }
  }

  chart.natalAspects = calculateNatalAspects(chart);

  return chart;
}

export function getHouseRuler(signIndex: number): { name: string; symbol: string } {
  const rulers = [
    { name: 'Mars', symbol: '♂' },
    { name: 'Venus', symbol: '♀' },
    { name: 'Mercury', symbol: '☿' },
    { name: 'Moon', symbol: '☽' },
    { name: 'Sun', symbol: '☉' },
    { name: 'Mercury', symbol: '☿' },
    { name: 'Venus', symbol: '♀' },
    { name: 'Pluto', symbol: '♇' },
    { name: 'Jupiter', symbol: '♃' },
    { name: 'Saturn', symbol: '♄' },
    { name: 'Uranus', symbol: '♅' },
    { name: 'Neptune', symbol: '♆' }
  ];
  return rulers[signIndex] || { name: 'Unknown', symbol: '?' };
}

export function calculateAsteroids(JD: number): AsteroidResult[] {
  const T = getJulianCentury(JD);

  const asteroids = [
    {
      name: 'Ceres',
      symbol: '⚳',
      meanLongitude: 80.5 + 1532.13 * T,
      period: 4.6
    },
    {
      name: 'Pallas',
      symbol: '⚴',
      meanLongitude: 180 + 1342.2 * T,
      period: 4.62
    },
    {
      name: 'Juno',
      symbol: '⚵',
      meanLongitude: 280 + 1697.2 * T,
      period: 4.36
    },
    {
      name: 'Vesta',
      symbol: '⚶',
      meanLongitude: 150 + 1415.3 * T,
      period: 3.63
    }
  ];

  const result: AsteroidResult[] = [];
  for (let i = 0; i < asteroids.length; i++) {
    const ast = asteroids[i];
    const lon = toRange360(ast.meanLongitude + 10 * Math.sin(T * 3 + i));
    const info = getZodiacSign(lon);

    result.push({
      name: ast.name,
      symbol: ast.symbol,
      longitude: lon,
      signIndex: info.signIndex,
      signName: info.signName,
      degreeInSign: Math.floor(info.degree),
      minuteInSign: Math.floor((info.degree - Math.floor(info.degree)) * 60)
    });
  }

  return result;
}

export function calculateSynastryChart(chartA: ChartResult, chartB: ChartResult): SynastryResult {
  const aspects: AspectResult[] = [];
  const planetsA = chartA.planets || [];
  const planetsB = chartB.planets || [];

  for (let i = 0; i < planetsA.length; i++) {
    for (let j = 0; j < planetsB.length; j++) {
      const found = calculateAspectsBetween(planetsA[i], planetsB[j]);
      for (let k = 0; k < found.length; k++) {
        const asp = found[k];
        asp.planetA = {
          name: planetsA[i].name,
          symbol: planetsA[i].symbol,
          signName: planetsA[i].signName!,
          longitude: planetsA[i].longitude,
          house: planetsA[i].house,
          side: 'A'
        };
        asp.planetB = {
          name: planetsB[j].name,
          symbol: planetsB[j].symbol,
          signName: planetsB[j].signName!,
          longitude: planetsB[j].longitude,
          house: planetsB[j].house,
          side: 'B'
        };
        asp.intensity = Math.abs(asp.score);
        aspects.push(asp);
      }
    }
  }

  aspects.sort(function (a, b) {
    return b.intensity! - a.intensity!;
  });

  const houseOverlay = {
    AintoB: calculateHouseOverlay(chartA, chartB),
    BintoA: calculateHouseOverlay(chartB, chartA)
  };

  let positiveCount = 0;
  let challengeCount = 0;
  let totalScore = 0;
  for (let m = 0; m < aspects.length; m++) {
    totalScore += aspects[m].score;
    if (aspects[m].friendly) positiveCount++;
    else challengeCount++;
  }

  const maxPossible = aspects.length * 8;
  let compatibilityScore = Math.round(50 + (totalScore / maxPossible) * 50);
  compatibilityScore = Math.max(20, Math.min(95, compatibilityScore));

  return {
    aspects: aspects,
    houseOverlay: houseOverlay,
    compatibilityScore: compatibilityScore,
    positiveCount: positiveCount,
    challengeCount: challengeCount,
    totalAspects: aspects.length
  };
}

export function calculateHouseOverlay(fromChart: ChartResult, toChart: ChartResult): HouseOverlayItem[] {
  if (!toChart.houseCusps || !fromChart.planets) return [];

  const house1Cusp = toChart.houseCusps[0].longitude;
  const result: HouseOverlayItem[] = [];

  for (let i = 0; i < fromChart.planets.length; i++) {
    const p = fromChart.planets[i];
    const rel = ((p.longitude - house1Cusp) % 360 + 360) % 360;
    const houseNum = Math.floor(rel / 30) + 1;

    result.push({
      planet: {
        name: p.name,
        symbol: p.symbol,
        signName: p.signName!
      },
      house: houseNum
    });
  }

  return result;
}

export function calculateCompositeChart(chartA: ChartResult, chartB: ChartResult): CompositeChartResult {
  function midpoint(lon1: number, lon2: number): number {
    let diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return toRange360(lon1 + diff / 2);
  }

  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const composite: CompositeChartResult = {
    planets: [],
    isComposite: true
  };

  for (let i = 0; i < planetKeys.length; i++) {
    const key = planetKeys[i] as keyof ChartResult;
    if ((chartA as any)[key] && (chartB as any)[key]) {
      const midLon = midpoint((chartA as any)[key].longitude, (chartB as any)[key].longitude);
      const info = getZodiacSign(midLon);
      const planet: PlanetPosition = {
        name: (chartA as any)[key].name,
        symbol: (chartA as any)[key].symbol,
        longitude: midLon,
        longitudeStr: info.signName + ' ' + Math.floor(info.degree) + '°' + Math.floor((info.degree - Math.floor(info.degree)) * 60) + "'",
        signIndex: info.signIndex,
        signName: info.signName,
        degreeInSign: Math.floor(info.degree),
        minuteInSign: Math.floor((info.degree - Math.floor(info.degree)) * 60)
      };
      (composite as any)[key] = planet;
      composite.planets.push(planet);
    }
  }

  if (chartA.ascendant && chartB.ascendant) {
    const ascMid = midpoint(chartA.ascendant.longitude, chartB.ascendant.longitude);
    const ascInfo = getZodiacSign(ascMid);
    composite.ascendant = {
      name: 'Ascendant',
      symbol: 'ASC',
      longitude: ascMid,
      longitudeStr: ascInfo.signName + ' ' + Math.floor(ascInfo.degree) + '°' + Math.floor((ascInfo.degree - Math.floor(ascInfo.degree)) * 60) + "'",
      signIndex: ascInfo.signIndex,
      signName: ascInfo.signName,
      degreeInSign: Math.floor(ascInfo.degree),
      minuteInSign: Math.floor((ascInfo.degree - Math.floor(ascInfo.degree)) * 60)
    };
  }

  if (chartA.midheaven && chartB.midheaven) {
    const mcMid = midpoint(chartA.midheaven.longitude, chartB.midheaven.longitude);
    const mcInfo = getZodiacSign(mcMid);
    composite.midheaven = {
      name: 'Midheaven',
      symbol: 'MC',
      longitude: mcMid,
      longitudeStr: mcInfo.signName + ' ' + Math.floor(mcInfo.degree) + '°' + Math.floor((mcInfo.degree - Math.floor(mcInfo.degree)) * 60) + "'",
      signIndex: mcInfo.signIndex,
      signName: mcInfo.signName,
      degreeInSign: Math.floor(mcInfo.degree),
      minuteInSign: Math.floor((mcInfo.degree - Math.floor(mcInfo.degree)) * 60)
    };
  }

  if (composite.ascendant) {
    const houseCusps: HouseCusp[] = [];
    const house1Cusp = composite.ascendant.signIndex! * 30;

    for (let h = 0; h < 12; h++) {
      const cuspLong = (house1Cusp + h * 30) % 360;
      const cuspInfo = getZodiacSign(cuspLong);
      houseCusps.push({
        houseNumber: h + 1,
        longitude: cuspLong,
        signIndex: cuspInfo.signIndex,
        signName: cuspInfo.signName,
        planetsInHouse: []
      });
    }

    for (let p = 0; p < composite.planets.length; p++) {
      const pl = composite.planets[p];
      const rel = ((pl.longitude - house1Cusp) % 360 + 360) % 360;
      const houseNum = Math.floor(rel / 30) + 1;
      pl.house = houseNum;
      if (houseCusps[houseNum - 1]) {
        houseCusps[houseNum - 1].planetsInHouse!.push({
          name: pl.name,
          symbol: pl.symbol
        });
      }
    }

    composite.houseCusps = houseCusps;
  }

  if (composite.sun && composite.moon) {
    composite.moonPhase = calculateMoonPhase(composite.sun.longitude, composite.moon.longitude);
  }

  composite.natalAspects = calculateNatalAspects(composite);

  return composite;
}

export const signElements: string[] = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'];
export const signModes: string[] = ['Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable', 'Cardinal', 'Fixed', 'Mutable'];

export function getSignElement(signIndex: number): string {
  return signElements[signIndex] || '';
}

export function getSignMode(signIndex: number): string {
  return signModes[signIndex] || '';
}

export function calculateFullNatalChart(birthInfo: BirthInfo): ChartResult {
  const chart = calculateNatalChart(birthInfo);
  return extendNatalChart(chart);
}
