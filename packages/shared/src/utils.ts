declare const global: any

export function isServer(): boolean {
  try {
    return globalThis === global
  } catch (e) {
    return false
  }
}
