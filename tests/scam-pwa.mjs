import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { scamScenarios, evaluateSafety } from '../src/data/scamScenarios.js'
assert.equal(scamScenarios.length, 3)
for (const scenario of scamScenarios) {
 assert.ok(scenario.ur && scenario.whyUr && scenario.clue)
 assert.equal(evaluateSafety('trust', false), 'retry')
 assert.equal(evaluateSafety('report', false), 'check-first')
 assert.equal(evaluateSafety('verify', false), 'verified')
 assert.equal(evaluateSafety('report', true), 'safe')
}
const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'))
assert.equal(manifest.display, 'standalone')
for (const icon of manifest.icons) assert.ok((await stat('dist'+icon.src)).size > 0)
const sw = await readFile('dist/sw.js', 'utf8')
assert.ok(sw.includes('index.html') && sw.includes('gallery/') && sw.includes('caches.delete'))
assert.ok(!sw.includes('skipWaiting'))
console.log('PASS three safety scenarios: wrong action, verify, report; manifest icons and offline asset list')
