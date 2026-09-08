// Run: node --test tests/mapa-focus.test.mjs
// Geometry regressions, not a certification of the source's historical accuracy.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import polygonClipping from '../research/atlas/mapa/history/vendor/polygon-clipping.cjs';

const historyDir = new URL('../research/atlas/mapa/history/', import.meta.url);
const readJSON = name => JSON.parse(readFileSync(new URL(name, historyDir), 'utf8'));
const reference = readJSON('belarus-reference.geojson').features[0].geometry.coordinates;
const years = [1492, 1600, 1700, 1914, 1938, 1945, 1994];
const layers = new Map(years.map(year => [year, readJSON(`focus_${year}.geojson`)]));
const epsilon = 1e-9;

// Planar area is used only for near-zero topology checks, never historical shares.
function coordinateArea(multi) {
  return multi.reduce((sum, polygon) => sum + polygon.reduce((subtotal, ring, i) => {
    const twiceArea = ring.slice(1).reduce((area, point, n) =>
      area + ring[n][0] * point[1] - point[0] * ring[n][1], 0);
    return subtotal + (i ? -1 : 1) * Math.abs(twiceArea) / 2;
  }, 0), 0);
}

function inRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) &&
      point[0] < (b[0] - a[0]) * (point[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

function contains(point, geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some(polygon => inRing(point, polygon[0]) &&
    !polygon.slice(1).some(hole => inRing(point, hole)));
}

for (const [year, data] of layers) {
  test(`${year}: license and fixed-reference provenance remain explicit`, () => {
    assert.equal(data.license, 'GPL-3.0-only');
    assert.equal(data.reference, 'belarus-reference.geojson');
    assert.match(data.accuracy, /NOT historical area estimates/);
  });
  test(`${year}: every colored source fragment stays within the same reference area`, () => {
    for (const feature of data.features) {
      assert.ok(coordinateArea(polygonClipping.difference(feature.geometry.coordinates, reference)) < epsilon,
        `${feature.properties.NAME} extends outside the fixed Belarus reference`);
    }
  });
  test(`${year}: unresolved geometry is preserved instead of silently discarded`, () => {
    assert.equal(data.unmatchedGeometry.type, 'MultiPolygon');
    const allAreas = polygonClipping.union(...data.features.map(feature => feature.geometry.coordinates),
      data.unmatchedGeometry.coordinates);
    assert.ok(coordinateArea(polygonClipping.difference(reference, allAreas)) < epsilon);
  });
}

for (const [city, point, expected] of [
  ['Brest', [23.6877, 52.0976], 'Poland'],
  ['Hrodna', [23.8258, 53.6694], 'Poland'],
  ['Minsk', [27.5615, 53.9023], 'USSR'],
  ['Viciebsk', [30.2049, 55.1904], 'USSR'],
  ['Homiel', [30.9878, 52.4345], 'USSR'],
]) {
  test(`1938: ${city} belongs to ${expected} in the vetted country-level geometry`, () => {
    const owners = layers.get(1938).features.filter(feature => contains(point, feature.geometry))
      .map(feature => feature.properties.NAME);
    assert.deepEqual(owners, [expected]);
  });
}

test('country-level Soviet geometry is not mislabeled as a digitized BSSR boundary', () => {
  assert.ok(layers.get(1938).features.some(feature => feature.properties.NAME === 'USSR'));
  assert.ok(layers.get(1945).features.some(feature => feature.properties.NAME === 'USSR'));
  assert.ok(![1938, 1945].some(year => layers.get(year).features.some(feature => /BSSR|Belarusian SSR/.test(feature.properties.NAME))));
});

test('source-alignment slivers remain in the downloadable data for transparent review', () => {
  // The renderer must mark these unvetted edges as unresolved, not historical enclaves.
  // Deliberately do not certify their political attribution or precise area.
  const data = layers.get(1994);
  assert.ok(data.features.some(feature => feature.properties.NAME === 'Byelarus'));
  assert.ok(data.features.some(feature => feature.properties.NAME !== 'Byelarus'));
  assert.ok(coordinateArea(data.unmatchedGeometry.coordinates) > 0);
});
