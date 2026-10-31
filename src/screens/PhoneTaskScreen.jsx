import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, HelpCircle, Image, MessageCircle, Mic, Pause, Phone, Play, RotateCcw, Video, Volume2, Wallet, X } from 'lucide-react'
import { PRACTICE_CHATS } from '../data/whatsappChats'
import { getPhoneTask } from '../data/phoneTasks'
import { useLanguage } from '../hooks/useLanguage'
import { useSpeechCoach } from '../hooks/useSpeechCoach'
import { useVoicePreference } from '../hooks/usePreference'
import Language from '../components/journey/Language'
import ThemeToggle from '../components/journey/ThemeToggle'
import VoiceToggle from '../components/journey/VoiceToggle'
import PhoneFrame from '../components/simulator/PhoneFrame'
import GuideHighlight from '../components/simulator/GuideHighlight'
import ResultsScreen from './ResultsScreen'

const empty = {
  screen: 'home',
  step: 0,
  sent: false,
  nameOk: false,
  amountOk: false,
  pinRefused: false,
  errors: 0,
  help: 0,
  hint: null,
  hintId: 0,
  finished: false,
}

export default function PhoneTaskScreen({ lessonId, mode, onBack, onCompleted, onIndependent }) {
  const task = getPhoneTask(lessonId)
  const { ur, t } = useLanguage()
  const { supported, speaking, speak, stop } = useSpeechCoach()
  const { voice } = useVoicePreference()
  const [state, setState] = useState(empty)
  const [paused, setPaused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const started = useRef(Date.now())
  const sentResult = useRef(false)
  const guided = mode !== 'independent'
  const step = task?.steps[state.step]
  const bill = task?.kind === 'bill'
  const lang = ur ? 'ur-PK' : 'en-US'

  const instruction = bill ? billLine(task, state, ur) : (ur ? step?.textUr : step?.textEn)
  const result = state.finished ? buildResult(lessonId, mode, state, task, started.current) : null

  useEffect(() => {
    if (!result || sentResult.current) return
    sentResult.current = true
    onCompleted?.(result)
    stop()
  }, [result, onCompleted, stop])

  useEffect(() => {
    if (!voice || !supported || paused || showResults) return
    if (state.finished) {
      speak(ur ? 'بہت خوب! آپ نے کر دکھایا۔' : 'Well done! You did it.', lang)
      return
    }
    if (instruction) speak(instruction, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction, voice, supported, state.finished, paused])

  useEffect(() => {
    if (!voice || !supported || !state.hint) return
    speak(ur ? state.hint.ur : state.hint.en, lang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hintId])

  if (!task) {
    return (
      <main className="game-world practice-stage">
        <button className="lab-action" onClick={onBack}><ArrowLeft size={20} />{t('Lessons', 'اسباق')}</button>
      </main>
    )
  }

  const glow = (action) => guided && !state.finished && expectedAction(task, state) === action
  const miss = (copy) => setState((current) => ({
    ...current,
    errors: current.errors + 1,
    hint: copy,
    hintId: current.hintId + 1,
  }))

  const go = (action) => {
    if (state.finished || paused) return
    if (bill) {
      setState((current) => billAttempt(task, current, action))
      return
    }
    setState((current) => chatAttempt(task, current, action))
  }

  const showHelp = () => {
    const help = bill ? billHelp(task, state) : step
    if (!help) return
    setState((current) => ({
      ...current,
      help: current.help + 1,
      hint: { en: help.helpEn, ur: help.helpUr },
      hintId: current.hintId + 1,
    }))
  }

  const reset = () => {
    stop()
    sentResult.current = false
    started.current = Date.now()
    setShowResults(false)
    setPaused(false)
    setState(empty)
  }

  if (showResults && result) {
    return <ResultsScreen result={result} onPracticeAgain={reset} onBackToDashboard={onBack} />
  }

  const home = () => { if (!state.finished) setState((current) => ({ ...current, screen: 'home' })) }
  const back = () => {
    if (state.finished) return
    setState((current) => ({
      ...current,
      screen: current.screen === 'video' ? 'chat' : current.screen === 'chat' ? 'list' : 'home',
    }))
  }

  return (
    <main className="game-world practice-stage" dir={ur ? 'rtl' : 'ltr'}>
      <div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="game-grid" />
      <header className="practice-toolbar">
        <button onClick={() => { stop(); onBack() }} className="lab-action"><ArrowLeft size={20} />{t('Lessons', 'اسباق')}</button>
        <span className="font-semibold text-forest practice-brand">Digital Ustaad</span>
        <div className="toolbar-group"><ThemeToggle /><Language /></div>
      </header>
      <div className="practice-layout">
        <section className="practice-context" aria-label="Lesson instructions">
          <div className="flex items-center justify-between gap-2 text-sm text-forest-muted">
            <span>{guided ? t('Step by step', 'قدم بہ قدم') : t('Try it yourself', 'خود مشق کریں')}</span>
            <span>{Math.min(state.step, task.steps.length)} / {task.steps.length}</span>
          </div>
          <div className="lesson-progress" role="progressbar" aria-valuemin={0} aria-valuemax={task.steps.length} aria-valuenow={Math.min(state.step, task.steps.length)}>
            {task.steps.map((item, index) => <span key={item.action} className={index < state.step ? 'done' : ''} />)}
          </div>
          <h1 className="mt-3 text-xl font-semibold leading-relaxed text-forest" lang={ur ? 'ur' : 'en'} dir={ur ? 'rtl' : 'ltr'} aria-live="polite">
            {state.finished ? t('Well done! You did it.', 'بہت خوب! مشق مکمل ہوئی۔') : instruction}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {!state.finished && <button className="lab-action" onClick={showHelp}><HelpCircle size={19} />{t('Help me', 'مدد لیں')}</button>}
            {supported && !state.finished && (
              <button className="lab-action" onClick={() => { if (speaking) { stop(); return } speak(instruction, lang) }}>
                <Volume2 size={19} />{speaking ? t('Stop', 'روکیں') : t('Listen', 'سنیں')}
              </button>
            )}
            <VoiceToggle />
            <button className="lab-action" onClick={reset}><RotateCcw size={18} />{t('Restart', 'دوبارہ')}</button>
            {!state.finished && (
              <button className="lab-action" onClick={() => { stop(); setPaused(!paused) }}>
                {paused ? <Play size={18} /> : <Pause size={18} />}{paused ? t('Resume', 'جاری رکھیں') : t('Pause', 'وقفہ')}
              </button>
            )}
          </div>
          {state.hint && !state.finished && (
            <div className="context-hint mt-3" role="status">
              <p>{ur ? state.hint.ur : state.hint.en}</p>
              <button className="lab-action mt-1" onClick={() => setState((current) => ({ ...current, hint: null }))}>{t('Got it', 'ٹھیک ہے')}</button>
            </div>
          )}
          {state.finished && guided && <button className="lab-primary mt-4" onClick={onIndependent}>{t('Now try it yourself', 'اب خود کوشش کریں')} →</button>}
          {state.finished && <button className="lab-primary mt-4" onClick={() => setShowResults(true)}>{t('See my progress', 'اپنی پیش رفت دیکھیں')} →</button>}
          <p className="practice-safety"><span className="sim-badge">{t('PRACTICE ONLY', 'صرف مشق')}</span> {t('This is not a real phone. Nothing is sent or paid.', 'یہ اصلی فون نہیں ہے۔ کچھ بھی نہیں بھیجا یا ادا نہیں ہوتا۔')}</p>
        </section>
        <section className="practice-device" aria-label="Interactive practice phone">
          <div inert={paused ? '' : undefined}>
            <PhoneFrame onBack={back} onHome={state.finished ? reset : home}>
              {state.screen === 'home' && (
                <Home
                  bill={bill}
                  glow={glow}
                  onWhatsApp={() => go('open-whatsapp')}
                  onWallet={() => go('open-wallet')}
                  onWrong={() => miss(task.wrongApp)}
                />
              )}
              {state.screen === 'list' && (
                <ChatList
                  target={task.targetChat}
                  glow={glow(task.targetChat === 'beti' ? 'open-beti' : 'open-ammi')}
                  onOpen={(id) => go(id === 'ammi' ? 'open-ammi' : id === 'beti' ? 'open-beti' : 'wrong-chat')}
                  ur={ur}
                />
              )}
              {state.screen === 'chat' && (
                <Chat
                  task={task}
                  sent={state.sent}
                  glowReply={glow('send-reply')}
                  glowVideo={glow('start-video')}
                  onReply={() => go('send-reply')}
                  onVideo={() => go('start-video')}
                  onMic={() => miss(task.wrongMic || task.wrongChat)}
                  ur={ur}
                  t={t}
                />
              )}
              {state.screen === 'video' && (
                <VideoCall glow={glow('end-call')} onEnd={() => go('end-call')} t={t} />
              )}
              {state.screen === 'wallet' && (
                <Bill
                  state={state}
                  glow={glow}
                  ur={ur}
                  t={t}
                  onName={() => go('check-name')}
                  onAmount={() => go('check-amount')}
                  onRefuse={() => go('refuse-pin')}
                  onSharePin={() => miss(task.wrongPin)}
                  onPay={() => go('pay')}
                />
              )}
            </PhoneFrame>
          </div>
          {paused && (
            <div className="pause-overlay">
              <p className="text-2xl font-semibold">{t('Take a breath', 'وقفہ')}</p>
              <button className="lab-primary mt-4" onClick={() => setPaused(false)}>{t('Resume practice', 'جاری رکھیں')}</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function expectedAction(task, state) {
  if (task.kind === 'bill') {
    if (state.screen === 'home' || state.step === 0) return 'open-wallet'
    if (!state.nameOk) return 'check-name'
    if (!state.amountOk) return 'check-amount'
    if (!state.pinRefused) return 'refuse-pin'
    return 'pay'
  }
  return task.steps[state.step]?.action
}

function billLine(task, state, ur) {
  const action = expectedAction(task, state)
  const line = task.steps.find((item) => item.action === action) || task.steps[0]
  return ur ? line.textUr : line.textEn
}

function billHelp(task, state) {
  const action = expectedAction(task, state)
  return task.steps.find((item) => item.action === action) || task.steps[0]
}

function chatAttempt(task, current, action) {
  const index = task.steps.findIndex((item) => item.action === action)
  if (index < 0) {
    return { ...current, errors: current.errors + 1, hint: task.wrongChat || task.wrongApp, hintId: current.hintId + 1 }
  }
  if (index < current.step) return { ...current, screen: screenFor(action), hint: null }
  if (index !== current.step) {
    return { ...current, errors: current.errors + 1, hint: { en: task.steps[current.step].helpEn, ur: task.steps[current.step].helpUr }, hintId: current.hintId + 1 }
  }
  const next = current.step + 1
  const finished = next >= task.steps.length
  return {
    ...current,
    step: next,
    screen: screenFor(action, finished),
    sent: action === 'send-reply' ? true : current.sent,
    hint: null,
    finished,
  }
}

function billAttempt(task, current, action) {
  if (action === 'open-wallet') {
    if (current.step > 0) return { ...current, screen: 'wallet', hint: null }
    return { ...current, step: 1, screen: 'wallet', hint: null }
  }
  if (current.screen !== 'wallet') {
    return { ...current, errors: current.errors + 1, hint: task.steps[0] && { en: task.steps[0].helpEn, ur: task.steps[0].helpUr }, hintId: current.hintId + 1 }
  }
  if (action === 'check-name') return current.nameOk ? current : advanceBill(current, { nameOk: true })
  if (action === 'check-amount') return current.amountOk ? current : advanceBill(current, { amountOk: true })
  if (action === 'refuse-pin') return current.pinRefused ? current : advanceBill(current, { pinRefused: true })
  if (action === 'pay') {
    if (current.nameOk && current.amountOk && current.pinRefused) return { ...advanceBill(current, {}), finished: true }
    return { ...current, errors: current.errors + 1, hint: task.payEarly, hintId: current.hintId + 1 }
  }
  const expected = expectedAction(task, current)
  const line = task.steps.find((item) => item.action === expected)
  return { ...current, errors: current.errors + 1, hint: line ? { en: line.helpEn, ur: line.helpUr } : task.payEarly, hintId: current.hintId + 1 }
}

function advanceBill(current, patch) {
  return { ...current, ...patch, step: Math.min(current.step + 1, 5), hint: null }
}

function screenFor(action, finished) {
  if (finished && action === 'end-call') return 'video'
  if (action === 'open-whatsapp') return 'list'
  if (action === 'open-ammi' || action === 'open-beti' || action === 'send-reply') return 'chat'
  if (action === 'start-video' || action === 'end-call') return 'video'
  if (action === 'open-wallet') return 'wallet'
  return 'home'
}

function buildResult(lessonId, mode, state, task, startedAt) {
  return {
    completed: true,
    mode,
    lessonId,
    incorrectAttempts: state.errors,
    successfulActions: task.steps.length,
    durationMs: Math.max(0, Date.now() - startedAt),
    completedWithoutAssistance: mode === 'independent' && state.help === 0 && state.errors === 0,
    assistanceCount: state.help,
    completedSteps: task.steps.map((item) => item.action),
    finishedAt: new Date().toISOString(),
  }
}

function Home({ bill, glow, onWhatsApp, onWallet, onWrong }) {
  const apps = bill
    ? [
        { id: 'wallet', label: 'Wallet', icon: Wallet, tone: 'bg-[#2457c5] text-white', onClick: onWallet, active: glow('open-wallet') },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, tone: 'bg-[#25D366] text-white', onClick: onWrong },
        { id: 'gallery', label: 'Gallery', icon: Image, tone: 'bg-teal text-white', onClick: onWrong },
      ]
    : [
        { id: 'phone', label: 'Phone', icon: Phone, tone: 'bg-white text-forest', onClick: onWrong },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, tone: 'bg-[#25D366] text-white', onClick: onWhatsApp, active: glow('open-whatsapp') },
        { id: 'gallery', label: 'Gallery', icon: Image, tone: 'bg-teal text-white', onClick: onWrong },
      ]
  return (
    <div className="flex h-full flex-col bg-[#e5edf8] px-5 pt-8">
      <p className="text-center text-5xl font-light text-forest">10:10</p>
      <p className="mt-2 text-center text-sm text-forest-muted">Practice phone · مشق کا فون</p>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {apps.map((app) => {
          const Icon = app.icon
          const button = (
            <button type="button" onClick={app.onClick} className="flex flex-col items-center gap-2" aria-label={app.label}>
              <span className={`flex h-16 w-16 items-center justify-center rounded-[1.35rem] shadow-soft ${app.tone}`}><Icon className="h-7 w-7" /></span>
              <span className="text-sm font-medium text-forest">{app.label}</span>
            </button>
          )
          return app.active ? <GuideHighlight key={app.id} active className="rounded-[1.5rem]">{button}</GuideHighlight> : <div key={app.id}>{button}</div>
        })}
      </div>
    </div>
  )
}

function ChatList({ target, glow, onOpen, ur }) {
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="bg-[#075E54] px-4 py-4 text-lg font-semibold text-white">WhatsApp</div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {PRACTICE_CHATS.map((chat) => {
          const row = (
            <button type="button" onClick={() => onOpen(chat.id)} className="flex w-full items-center gap-3 border-b border-black/5 bg-white px-4 py-3 text-start">
              <span className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-white" style={{ background: chat.color }}>{chat.initials}</span>
              <span><b className="block text-forest">{chat.name}</b><small className="text-forest-muted">{ur ? 'مشق چیٹ' : 'Practice chat'}</small></span>
            </button>
          )
          return glow && chat.id === target ? <GuideHighlight key={chat.id} active>{row}</GuideHighlight> : <div key={chat.id}>{row}</div>
        })}
      </div>
    </div>
  )
}

function Chat({ task, sent, glowReply, glowVideo, onReply, onVideo, onMic, ur, t }) {
  const chat = PRACTICE_CHATS.find((item) => item.id === task.targetChat) || PRACTICE_CHATS[0]
  const prompt = task.targetChat === 'ammi'
    ? (ur ? 'بیٹا، کیا آپ ٹھیک ہیں؟' : 'Beta, are you well?')
    : (ur ? 'امی، ویڈیو کال کریں!' : 'Ammi, shall we video call?')
  return (
    <div className="flex h-full flex-col bg-[#efeae2]">
      <div className="flex items-center gap-2 bg-[#075E54] px-3 py-3 text-white">
        <span className="flex h-11 w-11 items-center justify-center rounded-full font-bold" style={{ background: chat.color }}>{chat.initials}</span>
        <div className="min-w-0 flex-1"><b className="block">{chat.name}</b><small className="text-white/80">{t('Practice chat', 'مشق چیٹ')}</small></div>
        {task.targetChat === 'beti' && (
          glowVideo
            ? <GuideHighlight active className="rounded-full"><button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15" onClick={onVideo} aria-label={t('Video call', 'ویڈیو کال')}><Video /></button></GuideHighlight>
            : <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15" onClick={onVideo} aria-label={t('Video call', 'ویڈیو کال')}><Video /></button>
        )}
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4">
        <div className="w-fit max-w-[88%] rounded-xl bg-white px-4 py-3 text-base text-forest shadow-sm">{prompt}</div>
        {sent && <div className="ml-auto w-fit max-w-[88%] rounded-xl bg-[#d9fdd3] px-4 py-3 text-base text-forest shadow-sm">جی، ٹھیک ہے</div>}
      </div>
      <div className="flex items-center gap-2 bg-[#f8faf8] px-3 py-3">
        {task.targetChat === 'ammi' ? (
          glowReply
            ? <GuideHighlight active className="flex-1 rounded-full"><button type="button" className="w-full rounded-full bg-[#128C7E] px-4 py-4 text-lg font-semibold text-white" onClick={onReply}>جی، ٹھیک ہے</button></GuideHighlight>
            : <button type="button" className="flex-1 rounded-full bg-[#128C7E] px-4 py-4 text-lg font-semibold text-white" onClick={onReply}>جی، ٹھیک ہے</button>
        ) : <div className="flex-1 rounded-full bg-white px-4 py-3 text-sm text-forest-muted">{t('Video call is at the top', 'ویڈیو کال اوپر ہے')}</div>}
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#008069] text-white" onClick={onMic} aria-label={t('Microphone', 'مائیک')}><Mic size={22} /></button>
      </div>
    </div>
  )
}

function VideoCall({ glow, onEnd, t }) {
  const button = (
    <button type="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d32f2f] text-white" onClick={onEnd} aria-label={t('End call', 'کال بند کریں')}><X size={28} /></button>
  )
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#10241c] px-6 text-center text-white">
      <span className="flex h-36 w-36 items-center justify-center rounded-full bg-[#2A524A] text-5xl font-bold">بے</span>
      <p className="mt-4 text-2xl font-semibold">Beti</p>
      <p className="mt-2 text-sm text-white/80">{t('Practice video. Beti can see you. This is not a real call.', 'مشق ویڈیو۔ بیٹی آپ کو دیکھ رہی ہیں۔ یہ اصل کال نہیں۔')}</p>
      <div className="mt-8">{glow ? <GuideHighlight active className="rounded-full">{button}</GuideHighlight> : button}</div>
    </div>
  )
}

function Bill({ state, glow, ur, t, onName, onAmount, onRefuse, onSharePin, onPay }) {
  const amount = ur ? '۲٬۴۵۰ روپے' : 'Rs 2,450'
  return (
    <div className="flex h-full flex-col bg-[#f4f7fb] text-forest">
      <div className="bg-[#2457c5] px-4 py-4 text-lg font-semibold text-white">{t('Practice Wallet', 'مشق والیٹ')}</div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <p className="text-sm text-forest-muted">{t('Electricity bill · practice only', 'بجلی کا بل · صرف مشق')}</p>
        <button type="button" onClick={onName} className="w-full rounded-2xl bg-white px-4 py-4 text-start shadow-sm">
          {glow('check-name') ? <GuideHighlight active><BillRow label={t('Name', 'نام')} value={ur ? 'فاطمہ بی بی' : 'Fatima Bibi'} ok={state.nameOk} t={t} /></GuideHighlight> : <BillRow label={t('Name', 'نام')} value={ur ? 'فاطمہ بی بی' : 'Fatima Bibi'} ok={state.nameOk} t={t} />}
        </button>
        <button type="button" onClick={onAmount} className="w-full rounded-2xl bg-white px-4 py-4 text-start shadow-sm">
          {glow('check-amount') ? <GuideHighlight active><BillRow label={t('Amount', 'رقم')} value={amount} ok={state.amountOk} t={t} /></GuideHighlight> : <BillRow label={t('Amount', 'رقم')} value={amount} ok={state.amountOk} t={t} />}
        </button>
        <div className="rounded-2xl border border-[#e7b3b3] bg-[#fff5f5] px-4 py-4">
          <p className="text-sm font-semibold">{t('Message', 'پیغام')}</p>
          <p className="mt-1">{t('Share PIN 4821 to pay faster.', 'جلدی ادائیگی کے لیے پن کوڈ ۴۸۲۱ بھیجیں۔')}</p>
          <div className="mt-3 grid gap-2">
            <button type="button" className="rounded-xl border border-[#d7b4b4] bg-white px-3 py-3 text-start" onClick={onSharePin}>{t('Send the PIN', 'پن کوڈ بھیجیں')}</button>
            {glow('refuse-pin')
              ? <GuideHighlight active><button type="button" className="w-full rounded-xl bg-[#154b3c] px-3 py-3 text-start font-semibold text-white" onClick={onRefuse}>{state.pinRefused ? '✓ ' : ''}{t('Do not share the PIN', 'پن کوڈ نہ بھیجیں')}</button></GuideHighlight>
              : <button type="button" className="rounded-xl bg-[#154b3c] px-3 py-3 text-start font-semibold text-white" onClick={onRefuse}>{state.pinRefused ? '✓ ' : ''}{t('Do not share the PIN', 'پن کوڈ نہ بھیجیں')}</button>}
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        {glow('pay')
          ? <GuideHighlight active className="rounded-full"><button type="button" className="w-full rounded-full bg-[#2457c5] px-4 py-4 text-lg font-semibold text-white" onClick={onPay}>{t('Pay in practice', 'مشق میں ادا کریں')}</button></GuideHighlight>
          : <button type="button" className="w-full rounded-full bg-[#2457c5] px-4 py-4 text-lg font-semibold text-white" onClick={onPay}>{t('Pay in practice', 'مشق میں ادا کریں')}</button>}
      </div>
    </div>
  )
}

function BillRow({ label, value, ok, t }) {
  return (
    <span className="block">
      <small className="text-forest-muted">{label}</small>
      <b className="mt-1 block text-lg">{value}</b>
      <small>{ok ? t('Checked', 'چیک ہو گیا') : t('Tap to check', 'چیک کرنے کے لیے دبائیں')}</small>
    </span>
  )
}
