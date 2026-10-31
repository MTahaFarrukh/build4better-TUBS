import { WHATSAPP_VOICE_MESSAGE_LESSON } from './whatsappVoiceMessage'

/**
 * Catalog of Follow-Along lessons for real-phone practice.
 * Future lessons (video calls, Wi-Fi, QR, forms) can be added here.
 */
export const FOLLOW_ALONG_LESSONS = [
  WHATSAPP_VOICE_MESSAGE_LESSON,
]

export const FOLLOW_ALONG_LESSON_MAP = Object.fromEntries(
  FOLLOW_ALONG_LESSONS.map((lesson) => [lesson.id, lesson]),
)

export const DEFAULT_FOLLOW_ALONG_LESSON_ID = WHATSAPP_VOICE_MESSAGE_LESSON.id

export function getFollowAlongLesson(id) {
  return FOLLOW_ALONG_LESSON_MAP[id] ?? null
}

export { WHATSAPP_VOICE_MESSAGE_LESSON }
