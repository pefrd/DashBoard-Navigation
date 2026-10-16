/**
 * Pure hydrological and meteorological calculations for BPI mission dashboard
 */

/**
 * Computes river current velocity in m/s based on flow (Q in m³/s) and water level (H in m)
 * Formula based on calibrated cross-sectional bathymetry for Seine (Austerlitz) and Marne (Créteil)
 */
export function computeRiverVelocityMs(
  flowM3s: number | null,
  heightM: number | null,
  isSeine: boolean = true
): number {
  if (flowM3s === null || flowM3s <= 0) return 0;
  const h = heightM !== null && heightM > 0 ? heightM : isSeine ? 1.5 : 1.2;
  const dynamicArea = isSeine
    ? 380 + Math.max(0, h - 1.0) * 115
    : 125 + Math.max(0, h - 0.8) * 55;
  return Number((flowM3s / dynamicArea).toFixed(2));
}

/**
 * Returns standard maritime Beaufort scale force & description from km/h
 */
export function getBeaufortScale(kmh: number | null): { force: number; description: string } {
  if (kmh === null || kmh < 1) return { force: 0, description: 'Calme' };
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

/**
 * Converts wind direction degrees to cardinal orientation
 */
export function degreesToCardinal(deg: number | null | undefined): string {
  if (deg === null || deg === undefined) return '---';
  const dirs = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO',
  ];
  return dirs[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16];
}

/**
 * Decodes WMO weather code into human French string
 */
export function decodeWMOWeatherCode(code: number | null | undefined): string {
  if (code === null || code === undefined) return 'Variable';
  const codes: Record<number, string> = {
    0: 'Ciel dégagé',
    1: 'Peu nuageux',
    2: 'Partiellement nuageux',
    3: 'Couvert',
    45: 'Brouillard',
    48: 'Brouillard givrant',
    51: 'Bruine légère',
    53: 'Bruine modérée',
    55: 'Bruine dense',
    61: 'Pluie faible',
    63: 'Pluie modérée',
    65: 'Pluie forte',
    71: 'Neige faible',
    73: 'Neige modérée',
    75: 'Neige forte',
    80: 'Averses faibles',
    81: 'Averses modérées',
    82: 'Averses violentes',
    95: 'Orage',
    96: 'Orage avec grêle',
    99: 'Orage fort',
  };
  return codes[code] || 'Variable';
}
