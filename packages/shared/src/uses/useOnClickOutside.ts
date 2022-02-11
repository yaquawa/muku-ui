import { Ref } from 'vue'
import { useEventListener } from './useEventListener'

export function useOnClickOutside(rootEl: Ref<HTMLElement | null>, callback: () => any): void {
  // `mousedown` or `mouseup` is better than `click` here because it doesn't bubble up like `click`
  // if you've used `click` here, the callback will be run immediately.
  useEventListener(window, 'mouseup', (e: Event) => {
    const clickedEl = e.target as HTMLElement
    // skip if the root element contains the clicked element
    if (rootEl.value?.contains(clickedEl)) {
      return
    }

    // otherwise, execute the action
    callback()
  })
}
