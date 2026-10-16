import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeRiverVelocityMs,
  degreesToCardinal,
  decodeWMOWeatherCode,
} from './hydroLogic.ts';

test('computeRiverVelocityMs calculates Seine velocity accurately', () => {
  const flow = 400; // m3/s
  const height = 1.5; // m
  const vMs = computeRiverVelocityMs(flow, height, true);
  // Dynamic area = 380 + (1.5 - 1.0) * 115 = 437.5 -> 400 / 437.5 = 0.9142... -> 0.91
  assert.equal(vMs, 0.91);
  assert.equal(computeRiverVelocityMs(null, 1.5), 0);
  assert.equal(computeRiverVelocityMs(0, 1.5), 0);
});

test('degreesToCardinal converts directions correctly', () => {
  assert.equal(degreesToCardinal(0), 'N');
  assert.equal(degreesToCardinal(90), 'E');
  assert.equal(degreesToCardinal(180), 'S');
  assert.equal(degreesToCardinal(270), 'O');
});

test('decodeWMOWeatherCode decodes codes to readable French', () => {
  assert.equal(decodeWMOWeatherCode(0), 'Ciel dégagé');
  assert.equal(decodeWMOWeatherCode(61), 'Pluie faible');
  assert.equal(decodeWMOWeatherCode(95), 'Orage');
});
