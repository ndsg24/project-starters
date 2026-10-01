import assert from 'node:assert/strict';
import { test } from 'node:test';
import { greet } from './greet.js';

test('trims names and falls back for empty input', () => {
  assert.equal(greet(' Ada '), 'Hello, Ada!');
  assert.equal(greet('  '), 'Hello, world!');
});
