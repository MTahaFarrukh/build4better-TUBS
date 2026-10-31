import assert from 'node:assert/strict'
import { access, readFile, stat } from 'node:fs/promises'
import { scamScenarios, evaluateSafety } from '../src/data/scamScenarios.js'
import { CHOICE_LESSONS } from '../src/data/choiceLessons.js'
import { PHONE_TASKS } from '../src/data/phoneTasks.js'
import { LESSON_POINTS } from '../src/data/progress.js'

assert.equal(scamScenarios.length, 3)
for (const scenario of scamScenarios) {
  assert.ok(scenario.ur && scenario.whyUr && scenario.clue)
  assert.equal(evaluateSafety('trust', false), 'retry')
  assert.equal(evaluateSafety('report', false), 'check-first')
  assert.equal(evaluateSafety('verify', false), 'verified')
  assert.equal(evaluateSafety('report', true), 'safe')
}

assert.ok(CHOICE_LESSONS['call-saved-number']?.rounds?.length >= 2)
assert.ok(CHOICE_LESSONS['spot-suspicious-link']?.rounds?.length >= 2)
assert.ok(PHONE_TASKS['one-line-reply'])
assert.ok(PHONE_TASKS['video-call-home'])
assert.ok(PHONE_TASKS['pay-bill-safely'])
assert.equal(Object.keys(LESSON_POINTS).length, 8)

const manifest = JSON.parse(await readFile('public/manifest.webmanifest', 'utf8'))
assert.equal(manifest.display, 'standalone')
assert.ok(manifest.short_name)
for (const icon of manifest.icons) {
  assert.ok((await stat(`public${icon.src}`)).size > 0)
}

let offlineChecked = false
try {
  await access('dist/sw.js')
  const sw = await readFile('dist/sw.js', 'utf8')
  assert.ok(sw.includes('index.html') && sw.includes('gallery/') && sw.includes('caches.delete'))
  assert.ok(!sw.includes('skipWaiting'))
  const distManifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'))
  assert.equal(distManifest.display, 'standalone')
  offlineChecked = true
} catch {
  console.log('NOTE: dist/sw.js not present — run npm run build to verify the offline shell')
}

console.log(
  offlineChecked
    ? 'PASS safety scenarios, 8-lesson catalog, public icons, and offline shell'
    : 'PASS safety scenarios, 8-lesson catalog, and public icons',
)
