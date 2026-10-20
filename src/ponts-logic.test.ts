import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BRIDGES,
  SECTORS,
  getBridgeById,
  getBridgesBySector,
  getNextBridgeId,
  getPrevBridgeId,
  parseViewBox,
  formatViewBox,
  zoomViewBox,
  panViewBox,
  calculateViewBox,
  calculateMasteryStats,
  normalizeBridgeText,
  validateBridgeAnswer
} from './ponts-logic.ts';

test('BRIDGES contains exactly 37 bridges in order from 1 to 37', () => {
  assert.equal(BRIDGES.length, 37);
  BRIDGES.forEach((b, idx) => {
    assert.equal(b.id, idx + 1);
    assert.ok(b.name && b.name.length > 0);
    assert.ok(b.sector >= 1 && b.sector <= 5);
    assert.ok(typeof b.x === 'number' && typeof b.y === 'number');
    assert.ok(typeof b.angle === 'number');
  });
});

test('SECTORS defines 5 canonical Seine sectors', () => {
  assert.equal(Object.keys(SECTORS).length, 5);
  assert.ok(SECTORS[1].name.includes('Est'));
  assert.ok(SECTORS[2].name.includes('St-Louis'));
  assert.ok(SECTORS[3].name.includes('Cité'));
  assert.ok(SECTORS[4].name.includes('Musées'));
  assert.ok(SECTORS[5].name.includes('Ouest'));
});

test('getBridgesBySector returns correct bridges for each sector', () => {
  const sec1 = getBridgesBySector(1);
  assert.equal(sec1.length, 8);
  assert.equal(sec1[0].name, 'Pont amont');
  assert.equal(sec1[7].name, "Pont d'Austerlitz");

  const sec2 = getBridgesBySector(2);
  assert.equal(sec2.length, 5); // 9 to 13

  const sec3 = getBridgesBySector(3);
  assert.equal(sec3.length, 8); // 14 to 21
});

test('getBridgeById finds bridge by ID or returns undefined', () => {
  const pont1 = getBridgeById(1);
  assert.ok(pont1);
  assert.equal(pont1?.name, 'Pont amont');

  const pont37 = getBridgeById(37);
  assert.ok(pont37);
  assert.equal(pont37?.name, 'Pont aval');

  const missing = getBridgeById(99);
  assert.equal(missing, undefined);
});

test('getNextBridgeId cycles cleanly 1 -> 2 -> ... 37 -> 1', () => {
  assert.equal(getNextBridgeId(1), 2);
  assert.equal(getNextBridgeId(36), 37);
  assert.equal(getNextBridgeId(37), 1);
});

test('getPrevBridgeId cycles cleanly 1 -> 37 -> 36', () => {
  assert.equal(getPrevBridgeId(1), 37);
  assert.equal(getPrevBridgeId(2), 1);
  assert.equal(getPrevBridgeId(37), 36);
});

test('parseViewBox and formatViewBox roundtrip coordinates correctly', () => {
  const parsed = parseViewBox('100 200 400 300');
  assert.deepEqual(parsed, { x: 100, y: 200, w: 400, h: 300 });
  assert.equal(formatViewBox(parsed), '100 200 400 300');
});

test('zoomViewBox zooms in when factor < 1 and zooms out when factor > 1', () => {
  const initial = { x: 100, y: 100, w: 400, h: 200 };
  const zoomedIn = zoomViewBox(initial, 0.8);
  assert.ok(zoomedIn.w < initial.w);
  assert.ok(zoomedIn.h < initial.h);

  const zoomedOut = zoomViewBox(initial, 1.25);
  assert.ok(zoomedOut.w > initial.w);
  assert.ok(zoomedOut.h > initial.h);
});

test('panViewBox shifts coordinates by delta', () => {
  const initial = { x: 50, y: 50, w: 200, h: 100 };
  const panned = panViewBox(initial, 25, -10);
  assert.deepEqual(panned, { x: 75, y: 40, w: 200, h: 100 });
});

test('calculateMasteryStats computes percentage and completion accurately', () => {
  const empty = calculateMasteryStats(new Set());
  assert.equal(empty.count, 0);
  assert.equal(empty.percent, 0);
  assert.equal(empty.isComplete, false);

  const partial = calculateMasteryStats([1, 2, 3, 4]);
  assert.equal(partial.count, 4);
  assert.equal(partial.percent, 11);
  assert.equal(partial.isComplete, false);

  const all37 = calculateMasteryStats(new Set(Array.from({ length: 37 }, (_, i) => i + 1)));
  assert.equal(all37.count, 37);
  assert.equal(all37.percent, 100);
  assert.equal(all37.isComplete, true);
});

test('calculateViewBox handles follow, sector, and full modes', () => {
  const bridge1 = BRIDGES[0];
  const followBox = calculateViewBox('follow', bridge1);
  assert.ok(followBox.includes('250 155'));

  const sectorBox = calculateViewBox('sector', bridge1);
  assert.equal(sectorBox, SECTORS[1].box);

  const fullBox = calculateViewBox('full', bridge1);
  assert.equal(fullBox, '35 95 935 440');
});

test('normalizeBridgeText strips accents, lowercase, and trims', () => {
  assert.equal(normalizeBridgeText(' Pont d’Iéna '), "pont d'iena");
  assert.equal(normalizeBridgeText('Saint-Michel'), 'saint michel');
  assert.equal(normalizeBridgeText('Écluse & Barrage'), 'ecluse & barrage');
});

test('validateBridgeAnswer permits partial and fuzzy answers', () => {
  assert.ok(validateBridgeAnswer('iena', "Pont d'Iéna"));
  assert.ok(validateBridgeAnswer('Pont Neuf', 'Pont Neuf'));
  assert.ok(validateBridgeAnswer('simone', 'Passerelle Simone-de-Beauvoir'));
  assert.ok(!validateBridgeAnswer('xyz', 'Pont Royal'));
});
