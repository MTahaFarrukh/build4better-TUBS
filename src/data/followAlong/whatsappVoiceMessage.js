/** @type {import('./types.js').FollowAlongLesson} */
export const WHATSAPP_VOICE_MESSAGE_LESSON = {
  id: 'whatsapp-voice-message',
  title: {
    en: 'Send a WhatsApp Voice Message',
    ur: 'واٹس ایپ وائس میسج بھیجیں',
  },
  description: {
    en: 'Follow each step on your real phone. Ustaad guides you, but you control every tap.',
    ur: 'ہر قدم اپنے حقیقی فون پر خود کریں۔ استاد رہنمائی کرتا ہے، کنٹرول آپ کے پاس ہے۔',
  },
  safetyNotes: [
    {
      en: 'Ustaad guides you, but you control your phone.',
      ur: 'استاد رہنمائی کرتا ہے، فون آپ چلاتے ہیں۔',
    },
    {
      en: 'Digital Ustaad never reads your chats, contacts, or voice messages.',
      ur: 'ڈجیٹل استاد آپ کی چیٹس، رابطے یا وائس میسج نہیں پڑھتا۔',
    },
    {
      en: 'Only you can confirm that the intended message was sent.',
      ur: 'صرف آپ تصدیق کر سکتے ہیں کہ مطلوبہ پیغام بھیج دیا گیا۔',
    },
  ],
  helpIntro: {
    en: 'Take your time. You can pause, repeat a step, or ask for help anytime.',
    ur: 'آرام سے کریں۔ آپ رک سکتے ہیں، مرحلہ دہرا سکتے ہیں، یا مدد مانگ سکتے ہیں۔',
  },
  completionMessage: {
    en: 'You marked this practice complete. Digital Ustaad did not verify any real message.',
    ur: 'آپ نے اس مشق کو مکمل قرار دیا۔ ڈجیٹل استاد نے کوئی حقیقی پیغام چیک نہیں کیا۔',
  },
  pauseMessage: {
    en: 'Paused. Your place is saved on this screen until you continue or exit.',
    ur: 'رک گیا۔ جاری رکھنے یا باہر نکلنے تک یہ مرحلہ یہاں محفوظ ہے۔',
  },
  visualHint: null,
  launchTarget: 'whatsapp',
  steps: [
    {
      id: 'open-whatsapp',
      title: {
        en: 'Open WhatsApp',
        ur: 'واٹس ایپ کھولیں',
      },
      instruction: {
        en: 'Open WhatsApp on your phone yourself. Then return to this page and tap Continue.',
        ur: 'اپنے فون پر واٹس ایپ خود کھولیں۔ پھر اس صفحے پر واپس آ کر «آگے بڑھیں» دبائیں۔',
      },
      help: {
        en: 'Look for the green WhatsApp icon. WhatsApp Business also works if that is what your family uses.',
        ur: 'سبز واٹس ایپ آئیکن تلاش کریں۔ اگر گھر والے WhatsApp Business استعمال کرتے ہیں تو وہ بھی ٹھیک ہے۔',
      },
      action: 'launch-whatsapp',
    },
    {
      id: 'find-conversation',
      title: {
        en: 'Find the conversation',
        ur: 'بات چیت تلاش کریں',
      },
      instruction: {
        en: 'In WhatsApp, find the family member or group you want to message.',
        ur: 'واٹس ایپ میں وہ خاندانی رکن یا گروپ تلاش کریں جنہیں پیغام بھیجنا ہے۔',
      },
      help: {
        en: 'You can scroll your chat list or use the search icon at the top.',
        ur: 'چیٹ لسٹ اسکرول کریں یا اوپر سرچ آئیکن استعمال کریں۔',
      },
      action: null,
    },
    {
      id: 'open-conversation',
      title: {
        en: 'Open that conversation',
        ur: 'وہ بات چیت کھولیں',
      },
      instruction: {
        en: 'Tap the conversation to open it so you can see the message box.',
        ur: 'بات چیت پر ٹیپ کریں تاکہ پیغام باکس نظر آئے۔',
      },
      help: {
        en: 'When the chat is open, you should see a text field and a microphone icon near the bottom.',
        ur: 'چیٹ کھلنے پر نیچے لکھنے کی جگہ اور مائیکروفون آئیکن نظر آنا چاہیے۔',
      },
      action: null,
    },
    {
      id: 'find-microphone',
      title: {
        en: 'Find the microphone',
        ur: 'مائیکروفون تلاش کریں',
      },
      instruction: {
        en: 'Look at the bottom of the chat for the microphone button.',
        ur: 'چیٹ کے نیچے مائیکروفون بٹن تلاش کریں۔',
      },
      help: {
        en: 'If you see a send arrow instead, tap the empty message box first so the microphone returns.',
        ur: 'اگر بھیجنے کا تیر نظر آئے تو پہلے خالی پیغام باکس پر ٹیپ کریں تاکہ مائیک واپس آئے۔',
      },
      action: null,
    },
    {
      id: 'hold-to-record',
      title: {
        en: 'Hold to record',
        ur: 'دبا کر ریکارڈ کریں',
      },
      instruction: {
        en: 'Press and hold the microphone button to record a short voice message.',
        ur: 'مائیکروفون بٹن دبا کر تھامیں اور مختصر وائس میسج ریکارڈ کریں۔',
      },
      help: {
        en: 'Keep holding while you speak. A short greeting is enough for practice.',
        ur: 'بولتے وقت بٹن دبائے رکھیں۔ مشق کے لیے مختصر سلام کافی ہے۔',
      },
      action: null,
    },
    {
      id: 'release-to-send',
      title: {
        en: 'Release to send',
        ur: 'چھوڑ کر بھیجیں',
      },
      instruction: {
        en: 'Release your finger to send the voice message.',
        ur: 'انگلی ہٹا کر وائس میسج بھیج دیں۔',
      },
      help: {
        en: 'If you slide away to cancel by mistake, that is okay — record again when ready.',
        ur: 'اگر غلطی سے سلائیڈ کر کے کینسل ہو جائے تو کوئی بات نہیں — دوبارہ ریکارڈ کر لیں۔',
      },
      action: null,
    },
    {
      id: 'verify-yourself',
      title: {
        en: 'Check it yourself',
        ur: 'خود چیک کریں',
      },
      instruction: {
        en: 'Look in the chat and confirm for yourself that the voice message appears as you intended. Digital Ustaad cannot see or verify it.',
        ur: 'چیٹ میں دیکھ کر خود تصدیق کریں کہ وائس میسج درست گیا۔ ڈجیٹل استاد اسے دیکھ یا تصدیق نہیں کر سکتا۔',
      },
      help: {
        en: 'Only mark the lesson done when you are satisfied. You stay in control.',
        ur: 'جب آپ مطمئن ہوں تب ہی سبق مکمل قرار دیں۔ کنٹرول آپ کے پاس ہے۔',
      },
      action: null,
    },
  ],
}
