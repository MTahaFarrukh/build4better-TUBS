/**
 * Follow-Along lesson shape (documentation helper).
 *
 * @typedef {Object} LocalizedText
 * @property {string} en
 * @property {string} ur
 *
 * @typedef {Object} FollowAlongStep
 * @property {string} id
 * @property {LocalizedText} title
 * @property {LocalizedText} instruction
 * @property {LocalizedText} help
 * @property {'launch-whatsapp'|null} [action]
 *
 * @typedef {Object} FollowAlongLesson
 * @property {string} id
 * @property {LocalizedText} title
 * @property {LocalizedText} description
 * @property {LocalizedText[]} safetyNotes
 * @property {LocalizedText} helpIntro
 * @property {LocalizedText} completionMessage
 * @property {LocalizedText} pauseMessage
 * @property {string|null} [visualHint]
 * @property {'whatsapp'|null} [launchTarget]
 * @property {FollowAlongStep[]} steps
 */

export {}
