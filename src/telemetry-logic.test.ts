import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRiverVelocityMs,
  degreesToCardinal,
  getBeaufortScale,
  decodeWMOWeatherCode,
  formatRelativeTime,
  generateBriefingText,
  type StationData,
  type WeatherData
} from './telemetry-logic.ts';

test('computeRiverVelocityMs calculates velocity for Seine station', () => {
  const v = computeRiverVelocityMs(100, 0.97, 'seine_austerlitz');
  assert.ok(v > 0.2 && v < 0.35, `Expected velocity around 0.26 m/s, got ${v}`);
});

test('computeRiverVelocityMs returns 0 if flow is 0 or negative', () => {
  assert.equal(computeRiverVelocityMs(0, 1.0, 'seine_austerlitz'), 0);
  assert.equal(computeRiverVelocityMs(-10, 1.0, 'seine_austerlitz'), 0);
  assert.equal(computeRiverVelocityMs(null, 1.0, 'seine_austerlitz'), 0);
});

test('degreesToCardinal converts angles properly', () => {
  assert.equal(degreesToCardinal(0), 'N');
  assert.equal(degreesToCardinal(90), 'E');
  assert.equal(degreesToCardinal(180), 'S');
  assert.equal(degreesToCardinal(270), 'O');
  assert.equal(degreesToCardinal(282), 'ONO');
  assert.equal(degreesToCardinal(null), '---');
});

test('getBeaufortScale matches standard nautical forces', () => {
  assert.equal(getBeaufortScale(0).force, 0);
  assert.equal(getBeaufortScale(10).force, 2);
  assert.equal(getBeaufortScale(25).force, 4);
  assert.equal(getBeaufortScale(65).force, 8);
});

test('decodeWMOWeatherCode decodes known weather conditions', () => {
  assert.equal(decodeWMOWeatherCode(0), 'Ciel dégagé');
  assert.equal(decodeWMOWeatherCode(2), 'Partiellement nuageux');
  assert.equal(decodeWMOWeatherCode(61), 'Pluie faible');
  assert.equal(decodeWMOWeatherCode(999), 'Variable');
});

test('formatRelativeTime formats relative minutes and hours', () => {
  const now = 1700000000000;
  assert.equal(formatRelativeTime(new Date(now - 10000).toISOString(), now), "à l'instant");
  assert.equal(formatRelativeTime(new Date(now - 60000).toISOString(), now), 'il y a 1 min');
  assert.equal(formatRelativeTime(new Date(now - 15 * 60000).toISOString(), now), 'il y a 15 min');
  assert.equal(formatRelativeTime(new Date(now - 125 * 60000).toISOString(), now), 'il y a 2h05');
});

test('generateBriefingText constructs complete operational briefing', () => {
  const dummyStation: StationData = {
    id: 'seine_austerlitz',
    river: 'seine',
    riverLabel: 'Seine',
    name: "LA SEINE — Pont d'Austerlitz",
    shortName: "Pont d'Austerlitz",
    location: "Cale : Écluse Port de l'Arsenal (PK 167.5)",
    subLocation: 'Arsenal / Austerlitz',
    pk: 'PK 167.5',
    codeStation: 'F700000103',
    lat: 48.8447,
    lon: 2.3662,
    hasFlow: true,
    isTidal: false,
    flowM3s: 100,
    flowTrend: 'Stable (±3 m³/s)',
    heightM: 0.97,
    heightTrendCm: 1,
    obsTime: '2026-10-19T09:20:00Z',
    currentVelocityMs: 0.25,
    currentVelocityKmh: 0.9
  };

  const dummyWeather: WeatherData = {
    airTemp: 19.0,
    apparentTemp: 18.5,
    estimatedWaterTemp: 16.8,
    windSpeedKmh: 10,
    windGustsKmh: 23,
    windDirDeg: 282,
    windDirCardinal: 'ONO',
    precipNow: 0.0,
    precip3h: 0.0,
    weatherCode: 2,
    weatherDesc: 'Partiellement nuageux',
    sunrise: '08:01',
    sunset: '19:13'
  };

  const text = generateBriefingText(dummyStation, dummyWeather, '19/10/2026 12:00');
  assert.ok(text.includes('POINT NAVIGATION NAUTIQUE PC'));
  assert.ok(text.includes("Pont d'Austerlitz"));
  assert.ok(text.includes('0.9 km/h'));
  assert.ok(text.includes('16.8°C'));
  assert.ok(text.includes('ONO'));
});
