import { isRef, onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue'

export function useEventListener<K extends keyof HTMLElementEventMap>(
  // the target could be reactive ref which adds flexibility
  target: Ref<HTMLElement | null | undefined> | HTMLElement,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => any
): void {
  // if it's a reactive ref, use a watcher
  if (isRef(target)) {
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(eventType, handler)
      value?.addEventListener(eventType, handler)
    })
  } else {
    // otherwise, use the mounted hook
    onMounted(() => {
      target.addEventListener(eventType, handler)
    })
  }

  // clean it up
  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(eventType, handler)
  })
}
