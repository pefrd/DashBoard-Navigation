import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRIDGES,
  SECTORS,
  getBridgeById,
  getNextBridgeId,
  getPrevBridgeId,
  calculateViewBox,
  normalizeBridgeText,
  validateBridgeAnswer
} from './ponts-logic.ts';

test('BRIDGES contains exactly 37 bridges in order from upstream to downstream', () => {
  assert.equal(BRIDGES.length, 37);
  assert.equal(BRIDGES[0].name, 'Pont amont');
  assert.equal(BRIDGES[0].id, 1);
  assert.equal(BRIDGES[36].name, 'Pont aval');
  assert.equal(BRIDGES[36].id, 37);

  // Check unique IDs and continuous sequence 1..37
  for (let i = 0; i < 37; i++) {
    assert.equal(BRIDGES[i].id, i + 1);
    assert.ok(BRIDGES[i].sector >= 1 && BRIDGES[i].sector <= 5);
  }
});

test('SECTORS contains 5 valid sectors with color and bounding boxes', () => {
  assert.equal(Object.keys(SECTORS).length, 5);
  for (let s = 1; s <= 5; s++) {
    assert.ok(SECTORS[s]);
    assert.ok(SECTORS[s].color.startsWith('#'));
    assert.ok(SECTORS[s].box.length > 5);
  }
});

test('getNextBridgeId and getPrevBridgeId wrap circularly around 1 and 37', () => {
  assert.equal(getNextBridgeId(1), 2);
  assert.equal(getNextBridgeId(37), 1);
  assert.equal(getPrevBridgeId(37), 36);
  assert.equal(getPrevBridgeId(1), 37);
});

test('getBridgeById finds the bridge by numeric ID', () => {
  const b1 = getBridgeById(1);
  assert.equal(b1?.name, 'Pont amont');
  const b21 = getBridgeById(21);
  assert.equal(b21?.name, 'Pont Neuf');
  const b99 = getBridgeById(99);
  assert.equal(b99, undefined);
});

test('calculateViewBox returns correct bounds for follow, sector, and full modes', () => {
  const b = BRIDGES[0]; // Pont amont (sector 1)
  const fullVb = calculateViewBox('full', b);
  assert.equal(fullVb, '35 95 935 440');

  const sectorVb = calculateViewBox('sector', b);
  assert.equal(sectorVb, SECTORS[1].box);

  const followVb = calculateViewBox('follow', b);
  assert.ok(followVb.includes('250 155'));
});

test('normalizeBridgeText strips accents, lowercase, and trims', () => {
  assert.equal(normalizeBridgeText(' Pont d’Iéna '), "pont d'iena");
  assert.equal(normalizeBridgeText('Saint-Michel'), 'saint michel');
  assert.equal(normalizeBridgeText('Passerelle Léopold-Sédar-Senghor'), 'passerelle leopold sedar senghor');
});

test('validateBridgeAnswer handles partial and accented matches accurately', () => {
  assert.equal(validateBridgeAnswer('Sully', 'Pont de Sully'), true);
  assert.equal(validateBridgeAnswer('pont de sully', 'Pont de Sully'), true);
  assert.equal(validateBridgeAnswer('bir hakeim', 'Pont de Bir-Hakeim'), true);
  assert.equal(validateBridgeAnswer('alexandre', 'Pont Alexandre-III'), true);
  assert.equal(validateBridgeAnswer('neuf', 'Pont Neuf'), true);
  assert.equal(validateBridgeAnswer('ab', 'Pont Neuf'), false); // less than 3 chars
  assert.equal(validateBridgeAnswer('concorde', 'Pont Royal'), false);
});
