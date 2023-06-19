export function isServer(): boolean {
  try {
    return process.server
  } catch (e) {
    return false
  }
}
