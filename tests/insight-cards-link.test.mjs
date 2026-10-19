import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const route = new URL('../insight-cards/index.html', import.meta.url);
const html = fs.existsSync(route) ? fs.readFileSync(route, 'utf8') : '';
const destination = 'https://aistudio.google.com/apps/400bce16-8b33-4f87-ab05-7ef756fff7ff?fullscreenApplet=true&showPreview=true';
const escapedDestination = destination.replaceAll('&', '&amp;');

test('Insight Cards short route redirects to the existing original app', () => {
  assert.ok(html.includes(`location.replace(${JSON.stringify(destination)})`), 'The short route must open the original Insight Cards app');
  assert.ok(html.includes(`http-equiv="refresh" content="0;url=${escapedDestination}"`));
});

test('Insight Cards short route provides an accessible fallback and describes Google hosting', () => {
  assert.ok(html.includes(`href="${escapedDestination}"`));
  assert.match(html, /<html lang="en">/);
  assert.match(html, /hosted in Google AI Studio/);
  assert.match(html, /not a self-hosted copy/);
});

test('Insight Cards short route does not forward incoming data or embed app credentials', () => {
  assert.ok(html.length > 0, 'The short route must exist');
  assert.doesNotMatch(html, /location\.(search|hash)|localStorage|sessionStorage|<iframe|<form|<script[^>]+src=|api[_-]?key|AIza[\w-]+/i);
  assert.match(html, /name="referrer" content="no-referrer"/);
});

test('Insight Cards redirect is excluded from search indexing', () => {
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.ok(html.includes(`rel="canonical" href="${escapedDestination}"`));
});
