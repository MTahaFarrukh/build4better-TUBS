// Practice-phone lessons. Urdu lines are spoken aloud, so do not reword them casually.
export const PHONE_TASKS = {
  'one-line-reply': {
    kind: 'chat',
    targetChat: 'ammi',
    steps: [
      {
        action: 'open-whatsapp',
        textEn: 'Tap WhatsApp on the practice home screen.',
        textUr: 'مشق ہوم اسکرین پر واٹس ایپ کھولیں۔',
        helpEn: 'Use the green WhatsApp icon.',
        helpUr: 'سبز واٹس ایپ آئیکن استعمال کریں۔',
      },
      {
        action: 'open-ammi',
        textEn: 'Open Ammi’s chat.',
        textUr: 'امی کی چیٹ کھولیں۔',
        helpEn: 'Ammi is in the chat list.',
        helpUr: 'امی کی چیٹ فہرست میں ہے۔',
      },
      {
        action: 'send-reply',
        textEn: 'Tap the button to send “جی، ٹھیک ہے”.',
        textUr: 'بٹن دبا کر «جی، ٹھیک ہے» بھیجیں۔',
        helpEn: 'The large button at the bottom says جی، ٹھیک ہے.',
        helpUr: 'نیچے بڑا بٹن «جی، ٹھیک ہے» ہے۔',
      },
    ],
    wrongApp: { en: 'For this lesson, open WhatsApp.', ur: 'اس سبق میں واٹس ایپ کھولیں۔' },
    wrongChat: { en: 'For this lesson, open Ammi’s chat.', ur: 'اس سبق میں امی کی چیٹ کھولیں۔' },
    wrongMic: { en: 'This lesson is a written reply, not a voice note.', ur: 'اس سبق میں آواز نہیں۔ لکھا ہوا جواب بھیجیں۔' },
  },
  'video-call-home': {
    kind: 'chat',
    targetChat: 'beti',
    steps: [
      {
        action: 'open-whatsapp',
        textEn: 'Tap WhatsApp on the practice home screen.',
        textUr: 'مشق ہوم اسکرین پر واٹس ایپ کھولیں۔',
        helpEn: 'Use the green WhatsApp icon.',
        helpUr: 'سبز واٹس ایپ آئیکن استعمال کریں۔',
      },
      {
        action: 'open-beti',
        textEn: 'Open Beti’s chat.',
        textUr: 'بیٹی کی چیٹ کھولیں۔',
        helpEn: 'Beti is in the chat list.',
        helpUr: 'بیٹی کی چیٹ فہرست میں ہے۔',
      },
      {
        action: 'start-video',
        textEn: 'Tap the video-call button.',
        textUr: 'ویڈیو کال کا بٹن دبائیں۔',
        helpEn: 'The camera button is at the top of the chat.',
        helpUr: 'کیمرے والا بٹن اوپر ہے۔',
      },
      {
        action: 'end-call',
        textEn: 'Tap the red button to end the call.',
        textUr: 'سرخ بٹن دبا کر کال بند کریں۔',
        helpEn: 'The red button ends the call. This is not a real call.',
        helpUr: 'لال بٹن کال بند کرتا ہے۔ یہ اصل کال نہیں۔',
      },
    ],
    wrongApp: { en: 'For this lesson, open WhatsApp.', ur: 'اس سبق میں واٹس ایپ کھولیں۔' },
    wrongChat: { en: 'For this lesson, open Beti’s chat.', ur: 'اس سبق میں بیٹی کی چیٹ کھولیں۔' },
    wrongMic: { en: 'This lesson is a video call. Tap the camera at the top.', ur: 'اس سبق میں ویڈیو کال ہے۔ اوپر کیمرہ دبائیں۔' },
  },
  'pay-bill-safely': {
    kind: 'bill',
    steps: [
      {
        action: 'open-wallet',
        textEn: 'Open the Wallet app.',
        textUr: 'والیٹ ایپ کھولیں۔',
        helpEn: 'Wallet is the blue icon on the practice home screen.',
        helpUr: 'والیٹ نیلا آئیکن ہے۔',
      },
      {
        action: 'check-name',
        textEn: 'Check the name on the bill.',
        textUr: 'بل پر نام چیک کریں۔',
        helpEn: 'The practice account name is Fatima Bibi.',
        helpUr: 'مشق والے اکاؤنٹ کا نام فاطمہ بی بی ہے۔',
      },
      {
        action: 'check-amount',
        textEn: 'Check the amount on the bill.',
        textUr: 'بل پر لکھی رقم چیک کریں۔',
        helpEn: 'The practice bill is Rs 2,450. No extra fee.',
        helpUr: 'مشق کا بل دو ہزار چار سو پچاس روپے ہے۔ اضافی فیس نہیں۔',
      },
      {
        action: 'refuse-pin',
        textEn: 'Do not share the PIN.',
        textUr: 'پن کوڈ نہ بھیجیں۔',
        helpEn: 'A message asking for your PIN is not part of paying. Keep it private.',
        helpUr: 'پن کوڈ مانگنے والا پیغام ادائیگی کا حصہ نہیں۔ اسے خفیہ رکھیں۔',
      },
      {
        action: 'pay',
        textEn: 'Pay inside this practice app. No real money moves.',
        textUr: 'مشق میں ادائیگی کریں۔ اصل پیسے نہیں جائیں گے۔',
        helpEn: 'The Pay in practice button is at the bottom.',
        helpUr: 'نیچے «مشق میں ادا کریں» بٹن ہے۔',
      },
    ],
    wrongApp: { en: 'For this lesson, open Wallet.', ur: 'اس سبق میں والیٹ کھولیں۔' },
    wrongPin: { en: 'Do not send the PIN to anyone. This is only practice.', ur: 'پن کوڈ کسی کو نہ بھیجیں۔ یہ صرف مشق ہے۔' },
    payEarly: { en: 'First check the name, the amount, and the PIN.', ur: 'پہلے نام، رقم، اور پن کوڈ چیک کریں۔' },
  },
}

export function getPhoneTask(id) {
  return PHONE_TASKS[id] ?? null
}
