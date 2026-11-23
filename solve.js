// solve.js: the entry's run(input), for the driver contract. It answers one
// site alone through the same native binary the driver uses: the input is
// written to a temporary file, the binary builds it, and the output tree is
// read back. (The driver main.ts calls the binary once for the whole set,
// so this path is the single-case equivalent, not the hot path.)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('./sitegen', import.meta.url));

export function run(input) {
  const dir = mkdtempSync(join(tmpdir(), 'sitegen-'));
  try {
    const inPath = join(dir, 'in.json');
    const outPath = join(dir, 'out.json');
    writeFileSync(inPath, JSON.stringify(input));
    const res = spawnSync(bin, [inPath, outPath], { stdio: 'inherit' });
    if (res.error) throw res.error;
    if (res.status !== 0) throw new Error(`sitegen exited ${res.status}`);
    return JSON.parse(readFileSync(outPath, 'utf8'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
