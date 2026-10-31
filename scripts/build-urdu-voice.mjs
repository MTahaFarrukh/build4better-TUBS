import { mkdir, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { INTERACTIVE_LESSONS } from '../src/data/interactiveLessons.js'
import { scamScenarios } from '../src/data/scamScenarios.js'
import { WHATSAPP_VOICE_MESSAGE_LESSON } from '../src/data/followAlong/whatsappVoiceMessage.js'
import { CHOICE_LESSONS } from '../src/data/choiceLessons.js'
import { PHONE_TASKS } from '../src/data/phoneTasks.js'
import { voiceKey } from '../src/data/voiceKey.js'

const execFileAsync = promisify(execFile)
const outDir = path.resolve('public/voice/ur')

const extra = [
  'خوش آمدید۔ آئیے مل کر فون چلانا سیکھتے ہیں۔',
  'بہت خوب! آپ نے کر دکھایا۔',
  'دوبارہ کوشش کریں۔ نمایاں بٹن دیکھیں۔',
  'یہ عمل اس مشق کا حصہ نہیں۔ دوبارہ کوشش کریں یا مدد لیں۔',
  'یہ صرف دکھانے کے لیے ہے۔ اس سبق کا نمایاں ایپ استعمال کریں۔',
  'پہلے Gallery کھولیں۔',
  'پہلے تصویر منتخب کریں، پھر Share۔',
  'پہلے WhatsApp کھولیں۔',
  'پہلے چیٹ کھولیں۔',
  'پہلے مائیک دبائیں، پھر چھوڑ کر بھیجیں۔',
  'تھوڑی دیر دبائے رکھیں، پھر چھوڑیں۔ دوبارہ کوشش کریں۔',
  'اس سبق میں WhatsApp کھولیں — Gallery نہیں۔',
  'اس سبق میں Gallery کھولیں — WhatsApp نہیں۔',
  'نیا پیغام۔',
  'آپ کیا کریں گے؟',
  'شاباش۔ آپ نے معتبر ذریعے سے جانچا اور درخواست اصلی نہیں۔ اب فیصلہ کریں کہ اس پیغام کا کیا کرنا ہے۔',
  'قریب ہیں۔ پہلے معتبر ذریعے سے جانچیں، پھر بلاک کریں۔',
  'کچھ نہیں ہوا — یہ صرف مشق ہے۔ اصل زندگی میں یہ خطرناک ہوتا۔ پہلے رکیں اور جانچیں۔',
  'آپ نے سب کچھ خود کر دکھایا۔',
  'آپ بس تھوڑا سا دور ہیں۔',
  'ایک اچھا پہلا قدم۔',
  'اب آپ یہ کام اصلی فون پر کرنے کے لیے تیار ہیں۔ استاد کو آپ پر فخر ہے۔',
  'ایک بار اور خود کوشش کریں، پھر یہ بالکل آسان لگے گا۔',
  'استاد کے ساتھ ایک بار اور مشق کریں۔ ہر کوشش اسے آسان بناتی ہے۔',
]

function walk(value, found) {
  if (typeof value === 'string' && /[\u0600-\u06FF]/.test(value)) found.add(value.trim())
  else if (Array.isArray(value)) value.forEach((item) => walk(item, found))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => walk(item, found))
}

const lines = new Set(extra)
walk(INTERACTIVE_LESSONS, lines)
walk(scamScenarios, lines)
walk(WHATSAPP_VOICE_MESSAGE_LESSON, lines)
walk(CHOICE_LESSONS, lines)
walk(PHONE_TASKS, lines)

await mkdir(outDir, { recursive: true })

async function download(text) {
  const file = path.join(outDir, `${voiceKey(text)}.mp3`)
  try {
    const info = await stat(file)
    if (info.size > 800) return 'kept'
  } catch { /* missing */ }
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ur&q=${encodeURIComponent(text)}`
  await execFileAsync('curl.exe', ['-fsSL', '-A', 'Mozilla/5.0', '-o', file, url])
  const info = await stat(file)
  if (info.size < 800) throw new Error(`too small: ${text}`)
  return 'saved'
}

let saved = 0
for (const text of lines) {
  const result = await download(text)
  if (result === 'saved') saved += 1
  process.stdout.write(`${result} ${voiceKey(text)} ${text.slice(0, 42)}\n`)
}
process.stdout.write(`${lines.size} lines, ${saved} new files\n`)
