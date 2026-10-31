import { Capacitor, registerPlugin } from '@capacitor/core'

const WhatsAppLauncher = registerPlugin('WhatsAppLauncher')

export function isNativeAndroid() {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
}

export function isNativeRuntime() {
  return Capacitor.isNativePlatform()
}

/**
 * @returns {Promise<{
 *   native: boolean,
 *   platform: string,
 *   whatsapp: boolean,
 *   whatsappBusiness: boolean,
 *   reason?: string
 * }>}
 */
export async function checkWhatsAppApps() {
  if (!isNativeRuntime()) {
    return {
      native: false,
      platform: 'web',
      whatsapp: false,
      whatsappBusiness: false,
      reason: 'Running in browser. Open WhatsApp manually on your phone.',
    }
  }

  try {
    const result = await WhatsAppLauncher.checkApps()
    return {
      native: true,
      platform: Capacitor.getPlatform(),
      whatsapp: Boolean(result?.whatsapp),
      whatsappBusiness: Boolean(result?.whatsappBusiness),
    }
  } catch (error) {
    return {
      native: true,
      platform: Capacitor.getPlatform(),
      whatsapp: false,
      whatsappBusiness: false,
      reason: error?.message || 'Could not check WhatsApp installation.',
    }
  }
}

/**
 * @returns {Promise<{
 *   opened: boolean,
 *   app: string|null,
 *   native: boolean,
 *   reason?: string
 * }>}
 */
export async function openWhatsAppApp({ preferBusiness = false } = {}) {
  if (!isNativeRuntime()) {
    return {
      opened: false,
      app: null,
      native: false,
      reason:
        'Browser mode cannot open WhatsApp for you. Please open WhatsApp manually on your phone.',
    }
  }

  try {
    const result = await WhatsAppLauncher.openWhatsApp({ preferBusiness })
    return {
      opened: Boolean(result?.opened),
      app: result?.app ? result.app : null,
      native: true,
      reason: result?.reason,
    }
  } catch (error) {
    return {
      opened: false,
      app: null,
      native: true,
      reason: error?.message || 'Could not open WhatsApp.',
    }
  }
}
