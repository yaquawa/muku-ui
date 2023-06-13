export function isNuxt(): boolean {
  try {
    return process.server
  } catch (e) {
    return false
  }
}
