export function voiceKey(text) {
  let hash = 5381
  const value = String(text).trim()
  for (let i = 0; i < value.length; i += 1) hash = ((hash * 33) ^ value.charCodeAt(i)) >>> 0
  return hash.toString(36)
}
