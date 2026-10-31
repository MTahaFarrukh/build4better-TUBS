// Dependency-free runner beyond the existing Vite/esbuild toolchain: node tests/state.mjs
import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const source = await readFile(new URL('../src/hooks/usePracticePhone.js', import.meta.url), 'utf8')
const bundled = await build({ stdin: { contents: `${source}\nexport { reducer, createInitialState }`, resolveDir: new URL('../src/hooks', import.meta.url).pathname }, bundle: true, write: false, format: 'esm', platform: 'node' })
const { reducer, createInitialState } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`)
const progress = await import('../src/data/progress.js')
let clock = 1_000_000
const originalNow = Date.now
Date.now = () => clock
let count = 0
function run(name, fn) { fn(); count++; console.log(`PASS ${name}`) }
function session(lesson, mode = 'guided') {
  let state = createInitialState(lesson, mode)
  return { get state() { return state }, act(type, fields = {}) { state = reducer(state, { type, ...fields }); return state } }
}
const PHOTO = 'share-family-photo'
const VOICE = 'whatsapp-voice-message'
function photo(s) {
  s.act('OPEN_GALLERY'); s.act('SELECT_PHOTO', { photoId: 'rooftop-chai' }); s.act('OPEN_SHARE')
  s.act('SELECT_RECIPIENT', { recipientId: 'ammi' }); s.act('CONFIRM_SHARE')
  assert.equal(s.state.resultSummary.completed, true)
}
function voice(s) {
  s.act('OPEN_WHATSAPP'); s.act('OPEN_CHAT', { chatId: 'ammi' }); s.act('START_RECORDING')
  clock += 2300; s.act('SEND_VOICE')
  assert.equal(s.state.resultSummary.completed, true)
  assert.equal(s.state.chatMessages.ammi[0].durationSec, 2)
}
for (const mode of ['guided', 'independent']) {
  run(`${mode}: photo end-to-end`, () => { const s = session(PHOTO, mode); photo(s); assert.equal(s.state.resultSummary.completedWithoutAssistance, mode === 'independent') })
  run(`${mode}: voice end-to-end with actual duration`, () => { const s = session(VOICE, mode); voice(s); assert.equal(s.state.resultSummary.completedWithoutAssistance, mode === 'independent') })
}
run('photo: back navigation, share dismissal, recipient changes', () => {
  const s = session(PHOTO)
  s.act('OPEN_GALLERY'); s.act('SELECT_PHOTO', { photoId: 'rooftop-chai' }); s.act('BACK')
  assert.equal(s.state.guidedStep, 2)
  s.act('SELECT_PHOTO', { photoId: 'garden-flowers' }); s.act('OPEN_SHARE'); s.act('SELECT_RECIPIENT', { recipientId: 'ammi' })
  s.act('SELECT_RECIPIENT', { recipientId: 'abu' }); assert.equal(s.state.selectedRecipientId, 'abu')
  s.act('BACK'); assert.equal(s.state.guidedStep, 3)
  s.act('OPEN_SHARE'); s.act('SELECT_RECIPIENT', { recipientId: 'beti' }); s.act('CONFIRM_SHARE')
  assert.equal(s.state.resultSummary.completed, true)
})
run('voice: short tap, cancellation, retry, backtracking', () => {
  const s = session(VOICE)
  s.act('OPEN_WHATSAPP'); s.act('OPEN_CHAT', { chatId: 'ammi' }); s.act('BACK')
  s.act('OPEN_CHAT', { chatId: 'abu' }); s.act('START_RECORDING'); clock += 100; s.act('SEND_VOICE')
  assert.equal(s.state.resultSummary, null); assert.equal(s.state.isRecording, false)
  s.act('START_RECORDING'); s.act('CANCEL_RECORDING'); assert.equal(s.state.guidedStep, 3)
  s.act('START_RECORDING'); clock += 900; s.act('SEND_VOICE'); assert.equal(s.state.resultSummary.completed, true)
})
run('independent: help counted and preserved through navigation and storage normalization', () => {
  const s = session(PHOTO, 'independent')
  s.act('SHOW_HELP'); s.act('OPEN_GALLERY'); s.act('BACK'); s.act('GO_HOME'); photo(s)
  assert.equal(s.state.resultSummary.assistanceCount, 1)
  assert.equal(s.state.resultSummary.completedWithoutAssistance, false)
  const stored = progress.normalizeProgress(JSON.parse(JSON.stringify({ version: 4, latestResult: s.state.resultSummary })))
  assert.equal(stored.latestResult.assistanceCount, 1)
  assert.equal(stored.latestResult.completedWithoutAssistance, false)
})
run('wrong taps: progressive guided feedback, independent avoids answer disclosure', () => {
  const s = session(PHOTO)
  s.act('OPEN_WHATSAPP'); assert.match(s.state.hint.en, /another tap/)
  s.act('OPEN_WHATSAPP'); assert.match(s.state.hint.en, /Gallery/)
  const i = session(PHOTO, 'independent')
  i.act('OPEN_WHATSAPP'); i.act('OPEN_WHATSAPP'); assert.doesNotMatch(i.state.hint.en, /Gallery/)
})
run('restart clears attempt history, cancel does not change idle step', () => {
  const s = session(PHOTO)
  s.act('CANCEL_RECORDING'); assert.equal(s.state.guidedStep, 1)
  s.act('SHOW_HELP'); photo(s); s.act('RESET'); assert.equal(s.state.resultSummary, null); assert.equal(s.state.assistanceCount, 0)
  photo(s); assert.equal(s.state.resultSummary.completed, true)
})
run('legacy progress migration and accurate 4-session percentage', () => {
  const legacy = progress.normalizeProgress({ shareFamilyPhotoCompleted: true })
  assert.deepEqual(legacy.guidedCompletedIds, [PHOTO]); assert.equal(progress.getProgressPercent(legacy), 25)
  assert.equal(progress.getProgressPercent({ guidedCompletedIds: [PHOTO, VOICE], independentCompletedIds: [PHOTO, VOICE] }), 100)
})
Date.now = originalNow
console.log(`${count} checks passed`)
