export const scamScenarios = [
 { sender: 'Prize desk', senderUr: 'انعام ڈیسک', text: 'Mubarak! You won a prize. Send your secret verification code to claim it now.', ur: 'مبارک! آپ انعام جیت گئے۔ ابھی اپنا خفیہ تصدیقی کوڈ بھیجیں۔', clue: 'A secret code is being requested.', clueUr: 'خفیہ کوڈ مانگا جا رہا ہے۔', why: 'Keep verification codes private. An unexpected prize does not justify sharing one.', whyUr: 'تصدیقی کوڈ خفیہ رکھیں۔ انعام کے لیے بھی کسی کو نہ دیں۔' },
 { sender: 'New number', senderUr: 'نیا نمبر', text: 'Ammi, my phone broke. Please send money urgently. Do not call me.', ur: 'امی، میرا فون خراب ہے۔ فوراً پیسے بھیجیں۔ مجھے کال نہ کریں۔', clue: 'Urgency, a new number, and a request not to call.', clueUr: 'جلدی، نیا نمبر، اور کال نہ کرنے کا کہنا۔', why: 'Call your family member using their saved number before acting. A familiar claim is not proof.', whyUr: 'فیصلہ کرنے سے پہلے محفوظ نمبر پر اپنے گھر والے کو کال کریں۔ دعویٰ ثبوت نہیں۔' },
 { sender: 'Parcel alert', senderUr: 'پارسل اطلاع', text: 'Your parcel is blocked. Pay a small fee using this message’s payment button today.', ur: 'آپ کا پارسل روک دیا گیا ہے۔ آج ہی اس پیغام کے بٹن سے فیس دیں۔', clue: 'An unexpected payment request inside a message.', clueUr: 'پیغام میں غیر متوقع ادائیگی کا مطالبہ۔', why: 'Check your order in the official service you already use. Do not pay through an unexpected message.', whyUr: 'اپنے استعمال والے اصل ادارے سے آرڈر کی تصدیق کریں۔ غیر متوقع پیغام سے ادائیگی نہ کریں۔' },
]
export function evaluateSafety(action, verified) {
 if (action === 'verify') return 'verified'
 if (action === 'report') return verified ? 'safe' : 'check-first'
 return 'retry'
}
