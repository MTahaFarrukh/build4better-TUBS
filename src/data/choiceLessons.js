// Short decision lessons. Every Urdu string here is spoken, so keep it stable.
export const CHOICE_LESSONS = {
  'call-saved-number': {
    titleEn: 'Call the saved number',
    titleUr: 'محفوظ نمبر پر کال کریں',
    ruleEn: 'Ustaad’s rule: do not trust a new number. Call the number already saved in your phone.',
    ruleUr: 'استاد کا اصول: نئے نمبر پر بھروسہ نہ کریں۔ محفوظ نمبر پر کال کریں۔',
    rounds: [
      {
        sender: 'New number',
        senderUr: 'نیا نمبر',
        text: 'Beta here. This is my new number. Send money now and do not call.',
        ur: 'بیٹا بول رہا ہوں۔ نیا نمبر ہے۔ ابھی پیسے بھیجیں اور کال نہ کریں۔',
        clueEn: 'A new number, urgency, and “do not call”. Call the saved number.',
        clueUr: 'نیا نمبر اور جلدی کا کہنا۔ محفوظ نمبر پر کال کریں۔',
        successEn: 'Well done. You used the number already saved in the phone. A new number is not proof.',
        successUr: 'شاباش۔ آپ نے وہ نمبر استعمال کیا جو فون میں پہلے سے محفوظ ہے۔ نیا نمبر ثبوت نہیں۔',
        choices: [
          { id: 'obey', en: 'Send the money', ur: 'پیسے بھیجیں', wrongEn: 'Nothing happened — this is only practice. Do not send money to a new number.', wrongUr: 'کچھ نہیں ہوا — یہ صرف مشق ہے۔ نئے نمبر پر پیسے نہ بھیجیں۔' },
          { id: 'reply', en: 'Reply in this new chat', ur: 'اسی نئی چیٹ میں جواب دیں', wrongEn: 'Replying in the new chat is not enough. Call the saved number first.', wrongUr: 'نئی چیٹ میں جواب کافی نہیں۔ پہلے محفوظ نمبر پر کال کریں۔' },
          { id: 'saved', en: 'Call the saved number', ur: 'محفوظ نمبر پر کال کریں', correct: true },
        ],
      },
      {
        sender: 'Bank alert',
        senderUr: 'بینک اطلاع',
        text: 'Your bank needs a code. Share the code with this new number.',
        ur: 'آپ کے بینک کو کوڈ چاہیے۔ یہ کوڈ نئے نمبر پر بھیجیں۔',
        clueEn: 'A code request from a message is a warning. Use the number you already saved.',
        clueUr: 'پیغام سے کوڈ مانگنا خطرے کی نشانی ہے۔ محفوظ نمبر استعمال کریں۔',
        successEn: 'Well done. You called the saved number and kept the code private.',
        successUr: 'شاباش۔ آپ نے محفوظ نمبر پر کال کی اور کوڈ خفیہ رکھا۔',
        choices: [
          { id: 'obey', en: 'Send the code', ur: 'کوڈ بھیجیں', wrongEn: 'Do not send the code. This is only practice.', wrongUr: 'کوڈ کسی کو نہ بھیجیں۔ یہ صرف مشق ہے۔' },
          { id: 'reply', en: 'Call the number in the message', ur: 'پیغام والے نمبر پر کال کریں', wrongEn: 'The number in the message is not your saved number. Call the saved one.', wrongUr: 'پیغام والا نمبر محفوظ نمبر نہیں۔ فون میں محفوظ نمبر پر کال کریں۔' },
          { id: 'saved', en: 'Call the number saved in your phone', ur: 'فون میں محفوظ نمبر پر کال کریں', correct: true },
        ],
      },
    ],
  },
  'spot-suspicious-link': {
    titleEn: 'Leave a suspicious link',
    titleUr: 'مشکوک لنک چھوڑ دیں',
    ruleEn: 'Ustaad’s rule: do not open a link that arrives in a message. Open the real app yourself.',
    ruleUr: 'استاد کا اصول: پیغام والا لنک نہ کھولیں۔ اصل ایپ خود کھولیں۔',
    rounds: [
      {
        sender: 'Account alert',
        senderUr: 'اکاؤنٹ اطلاع',
        text: 'Your account will close today. Open this link now: jazz-login.example',
        ur: 'آپ کا اکاؤنٹ آج بند ہو جائے گا۔ اس لنک کو ابھی کھولیں: jazz-login.example',
        clueEn: 'The message contains a link. Do not open it.',
        clueUr: 'پیغام میں لنک ہے۔ لنک نہ کھولیں۔',
        successEn: 'Well done. You left the link alone. Open the real app yourself, not the link in the message.',
        successUr: 'شاباش۔ آپ نے لنک نہیں کھولا۔ اصل ایپ خود کھولیں، پیغام والا لنک نہیں۔',
        choices: [
          { id: 'open', en: 'Open the link', ur: 'لنک کھولیں', wrongEn: 'Nothing happened — this is only practice. Do not open the link.', wrongUr: 'کچھ نہیں ہوا — یہ صرف مشق ہے۔ لنک نہ کھولیں۔' },
          { id: 'forward', en: 'Send the link to family', ur: 'لنک گھر والوں کو بھیجیں', wrongEn: 'Do not pass this link on. Just tell them a message arrived.', wrongUr: 'یہ لنک آگے نہ بھیجیں۔ صرف بتائیں کہ پیغام آیا تھا۔' },
          { id: 'leave', en: 'Leave the link and open the real app yourself', ur: 'لنک چھوڑ دیں اور اصل ایپ خود کھولیں', correct: true },
        ],
      },
      {
        sender: 'Unknown',
        senderUr: 'نامعلوم',
        text: 'Ammi, these are your photos. Open the link: photos-family.example',
        ur: 'امی، یہ آپ کی تصاویر ہیں۔ لنک کھولیں: photos-family.example',
        clueEn: 'A photo link from an unknown sender is still a link. Leave it.',
        clueUr: 'نامعلوم بھیجنے والے کا تصویری لنک بھی لنک ہے۔ اسے چھوڑ دیں۔',
        successEn: 'Well done. You did not open the photo link.',
        successUr: 'شاباش۔ آپ نے تصویری لنک نہیں کھولا۔',
        choices: [
          { id: 'open', en: 'Open the photos', ur: 'تصاویر کھولیں', wrongEn: 'Nothing happened — this is only practice. Do not open the link.', wrongUr: 'کچھ نہیں ہوا — یہ صرف مشق ہے۔ لنک نہ کھولیں۔' },
          { id: 'forward', en: 'Send the link to the family group', ur: 'لنک فیملی گروپ میں بھیجیں', wrongEn: 'Do not pass this link on. Just tell them a message arrived.', wrongUr: 'یہ لنک آگے نہ بھیجیں۔ صرف بتائیں کہ پیغام آیا تھا۔' },
          { id: 'leave', en: 'Leave the link', ur: 'لنک چھوڑ دیں', correct: true },
        ],
      },
    ],
  },
}

export function getChoiceLesson(id) {
  return CHOICE_LESSONS[id] ?? null
}
