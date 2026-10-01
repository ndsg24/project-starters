#!/usr/bin/env node
import { cp, mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const templates = ['go-api', 'node-ts', 'nest-api', 'react-vite', 'next-app', 'expo-app'];
const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['node_modules', '.git', '.next', '.expo', 'dist', 'build', 'bin', 'coverage', 'out', 'web-build']);
export async function create(template, destination) {
  if (!templates.includes(template)) throw new Error(`Unknown template. Choose: ${templates.join(', ')}`);
  const target = resolve(destination);
  const name = basename(target);
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('Use a lowercase project name starting with a letter (letters, numbers, hyphens).');
  try { await stat(target); throw new Error('Destination already exists. Choose a new directory.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(target, { recursive: true });
  await cp(join(root, 'templates', template), target, { recursive: true, filter: (source) => {
    const part = basename(source);
    return !ignored.has(part) && !part.endsWith('.tsbuildinfo') && (!part.startsWith('.env') || part === '.env.example');
  }});
  if (template === 'go-api') {
    for (const file of ['go.mod', 'cmd/api/main.go']) {
      const path = join(target, file);
      await writeFile(path, (await readFile(path, 'utf8')).replaceAll('example.com/go-api', `example.com/${name}`));
    }
  } else {
    for (const file of ['package.json', 'package-lock.json']) {
      const path = join(target, file);
      const data = JSON.parse(await readFile(path, 'utf8'));
      data.name = name;
      if (data.packages?.['']) data.packages[''].name = name;
      await writeFile(path, JSON.stringify(data, null, 2) + '\n');
    }
    if (template === 'expo-app') {
      const path = join(target, 'app.json');
      const data = JSON.parse(await readFile(path, 'utf8'));
      data.expo.name = name; data.expo.slug = name; data.expo.scheme = name;
      await writeFile(path, JSON.stringify(data, null, 2) + '\n');
    }
  }
  try { await stat(join(target, 'LICENSE')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await cp(join(root, 'LICENSE'), join(target, 'LICENSE'));
  }
  return target;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values, positionals } = parseArgs({ allowPositionals: true, options: { list: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } });
    if (values.list) console.log(templates.join('\n'));
    else if (values.help || positionals.length !== 2) {
      console.log('Usage: npm run create -- <template> <destination>\n       npm run create -- --list');
      if (!values.help) process.exitCode = 1;
    } else {
      const target = await create(...positionals);
      console.log(`Created ${target}\nNext: cd ${JSON.stringify(target)}\n${positionals[0] === 'go-api' ? 'make check && make dev' : 'npm ci && npm run dev'}\nInitialize Git when ready: git init`);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
