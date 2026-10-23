export interface StationData {
  id: string;
  river: string;
  riverLabel: string;
  name: string;
  shortName: string;
  location: string;
  subLocation: string;
  pk: string;
  codeStation: string;
  lat: number;
  lon: number;
  hasFlow: boolean;
  isTidal: boolean;
  flowM3s: number | null;
  flowTrend: string;
  heightM: number | null;
  heightTrendCm: number | null;
  obsTime: string;
  currentVelocityMs: number;
  currentVelocityKmh: number;
  baseHeightM?: number;
  biefDeltaCm?: number | null;
  isCanalBief?: boolean;
}

export interface WeatherData {
  airTemp: number | null;
  apparentTemp: number | null;
  estimatedWaterTemp: number | null;
  windSpeedKmh: number;
  windGustsKmh: number;
  windDirDeg: number;
  windDirCardinal: string;
  precipNow: number;
  precip3h: number;
  weatherCode: number;
  weatherDesc: string;
  sunrise: string;
  sunset: string;
}

export function computeRiverVelocityMs(
  flowM3s: number | null,
  heightM: number | null,
  stationId: string
): number {
  if (!flowM3s || flowM3s <= 0) return 0;
  if (stationId.startsWith('deule') || stationId.includes('deule') || stationId.includes('lille')) {
    // Gabarit canal de la Deûle à Lille : largeur moyenne ~45 m, tirant d'eau 3,5 m => section mouillée de base ~155 m²
    // Si heightM est la cote complète (~3.54m), on prend l'écart par rapport à 3.5m ; si c'est déjà l'écart (~0.04m), on l'utilise directement
    const deltaH = heightM !== null ? (heightM > 2.0 ? heightM - 3.5 : heightM) : 0;
    const dynamicArea = Math.max(100, 155 + deltaH * 45);
    return Number((flowM3s / dynamicArea).toFixed(2));
  }
  const isSeine = stationId.startsWith('seine');
  const h = heightM !== null && heightM > 0 ? heightM : isSeine ? 1.5 : 1.2;
  const dynamicArea = isSeine
    ? 380 + Math.max(0, h - 1.0) * 115
    : 125 + Math.max(0, h - 0.8) * 55;
  return Number((flowM3s / dynamicArea).toFixed(2));
}

export function degreesToCardinal(deg: number | null | undefined): string {
  if (deg === null || deg === undefined) return '---';
  const dirs = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'
  ];
  return dirs[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16];
}

export function getBeaufortScale(kmh: number | null | undefined): { force: number; description: string } {
  if (!kmh || kmh < 1) return { force: 0, description: 'Calme' };
  if (kmh <= 5) return { force: 1, description: 'Très légère brise' };
  if (kmh <= 11) return { force: 2, description: 'Légère brise' };
  if (kmh <= 19) return { force: 3, description: 'Petite brise' };
  if (kmh <= 28) return { force: 4, description: 'Jolie brise' };
  if (kmh <= 38) return { force: 5, description: 'Bonne brise' };
  if (kmh <= 49) return { force: 6, description: 'Vent frais' };
  if (kmh <= 61) return { force: 7, description: 'Grand frais' };
  if (kmh <= 74) return { force: 8, description: 'Coup de vent' };
  return { force: 9, description: 'Fort coup de vent' };
}

export function decodeWMOWeatherCode(code: number): string {
  const codes: Record<number, string> = {
    0: 'Ciel dégagé',
    1: 'Peu nuageux',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    51: 'Bruine légère',
    61: 'Pluie faible',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    71: 'Neige',
    80: 'Averses',
    95: 'Orage'
  };
  return codes[code] || 'Variable';
}

export function formatRelativeTime(dateStr: string, nowMs = Date.now()): string {
  if (!dateStr) return '';
  const parsed = new Date(dateStr).getTime();
  if (isNaN(parsed)) return '';
  const diffMs = Math.max(0, nowMs - parsed);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin === 1) return 'il y a 1 min';
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  return `il y a ${diffHours}h${remMin > 0 ? remMin.toString().padStart(2, '0') : ''}`;
}

export function generateBriefingText(
  cur: StationData,
  w: WeatherData,
  nowFormatted = '19/10/2026, 12:00'
): string {
  const lines = [
    `🚤 *POINT NAVIGATION NAUTIQUE PC*`,
    `📍 Point : ${cur.name} (${cur.pk})`,
    `📌 Cale/Détail : ${cur.location}`,
    `🕒 ${nowFormatted}`,
    ``,
    `🌡️ *MÉTÉO & TEMPÉRATURES LOCALES*`,
    `• Eau : ${w.estimatedWaterTemp !== null ? w.estimatedWaterTemp.toFixed(1) : '--'}°C`,
    `• Air : ${w.airTemp !== null ? w.airTemp.toFixed(1) : '--'}°C (Ressenti ${w.apparentTemp !== null ? w.apparentTemp.toFixed(1) : '--'}°C)`,
    `• Vent : ${Math.round(w.windSpeedKmh)} km/h (${w.windDirCardinal}) · Rafales ${Math.round(w.windGustsKmh)} km/h`,
    `• Pluie : ${w.precipNow.toFixed(1)} mm/h (Cumul +3h : ${w.precip3h.toFixed(1)} mm)`,
    ``,
    `🌊 *HYDROMÉTRIE VIGICRUES*`
  ];

  if (cur.isTidal) {
    lines.push(
      `• Régime : Marée maritime estuaire (HAROPA)`,
      `• Cote d'eau (H) : ${cur.heightM !== null ? cur.heightM.toFixed(2) : '--'} m (Var 6h : ${cur.heightTrendCm !== null ? cur.heightTrendCm : 0} cm)`
    );
  } else if (cur.isCanalBief || cur.river === 'deule') {
    const deltaSign = cur.biefDeltaCm && cur.biefDeltaCm > 0 ? '+' : '';
    const biefInfo = cur.biefDeltaCm !== null && cur.biefDeltaCm !== undefined ? ` (RN ${deltaSign}${cur.biefDeltaCm} cm)` : '';
    lines.push(
      `• Vitesse courant : ${cur.currentVelocityKmh.toFixed(1)} km/h (${cur.currentVelocityMs.toFixed(2)} m/s)`,
      `• Débit : ${cur.flowM3s !== null ? Math.round(cur.flowM3s) : '--'} m³/s (${cur.flowTrend})`,
      `• Hauteur / Bief : ${cur.heightM !== null ? cur.heightM.toFixed(2) : '--'} m${biefInfo} (Var 6h : ${cur.heightTrendCm !== null ? cur.heightTrendCm : 0} cm)`
    );
  } else {
    lines.push(
      `• Vitesse courant : ${cur.currentVelocityKmh.toFixed(1)} km/h (${cur.currentVelocityMs.toFixed(2)} m/s)`,
      `• Débit : ${cur.flowM3s !== null ? Math.round(cur.flowM3s) : '--'} m³/s (${cur.flowTrend})`,
      `• Hauteur d'eau : ${cur.heightM !== null ? cur.heightM.toFixed(2) : '--'} m (Var 6h : ${cur.heightTrendCm !== null ? cur.heightTrendCm : 0} cm)`
    );
  }

  return lines.join('\n');
}
