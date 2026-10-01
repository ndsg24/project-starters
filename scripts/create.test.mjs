import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { create, templates } from './create.mjs';

test('all templates are standalone, renamed, and omit generated files', async () => {
 const temporary = await mkdtemp(join(tmpdir(), 'starters-'));
 try {
  for (const template of templates) {
   const target = join(temporary, `test-${template}`);
   await create(template, target);
   await stat(join(target, 'LICENSE'));
   if (template === 'go-api') {
    assert.match(await readFile(join(target, 'go.mod'), 'utf8'), /example.com\/test-go-api/);
    assert.match(await readFile(join(target, 'cmd/api/main.go'), 'utf8'), /example.com\/test-go-api/);
   } else {
    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'));
    const lock = JSON.parse(await readFile(join(target, 'package-lock.json'), 'utf8'));
    assert.equal(pkg.name, `test-${template}`);
    assert.equal(lock.packages[''].name, pkg.name);
   }
   for (const excluded of ['node_modules', '.git', '.next', '.expo', 'bin', '.env']) {
    await assert.rejects(stat(join(target, excluded)), { code: 'ENOENT' });
   }
   await assert.rejects(create(template, target), /already exists/);
  }
  await assert.rejects(create('../bad', join(temporary, 'bad')), /Unknown template/);
  await assert.rejects(create('node-ts', join(temporary, 'bad name')), /lowercase/);
 } finally { await rm(temporary, { recursive: true, force: true }); }
});
