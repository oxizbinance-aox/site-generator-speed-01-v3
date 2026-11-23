// site-generator-speed-01 entry: a native Go engine.
// The harness runs `node /bot/main.ts` (node22). It reads every case from
// /input/cases.json (a JSON array of {id, input}) and writes
// /output/answers.json: a JSON array of the answers, one per case and in
// the cases' order. Outside a container MAKEFUN_INPUT_DIR and
// MAKEFUN_OUTPUT_DIR stand in for /input and /output.
//
// This driver hands the whole set to the native binary ./sitegen (a
// statically linked Go program) in one call, so no JSON is parsed or
// stringified in Node at all: the binary reads the cases, builds each site,
// and writes the answers. Its CPU is the entry's CPU; the Node driver adds
// only a process spawn.

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const INPUT_DIR = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const bin = fileURLToPath(new URL('./sitegen', import.meta.url));
const res = spawnSync(bin, [join(INPUT_DIR, 'cases.json'), join(OUTPUT_DIR, 'answers.json')], { stdio: 'inherit' });
if (res.error) throw res.error;
if (res.status !== 0) process.exit(res.status ?? 1);
