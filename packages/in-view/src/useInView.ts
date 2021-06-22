import { MaybeRef } from '@muku-ui/shared'
import { reactive, Ref, watchEffect } from 'vue'

export function useInView(
  elem: Ref<Element | undefined>,
  {
    handler,
    once = false,
    loading = false,
    offsetX = '0px',
    offsetY = '0px',
  }: {
    handler: () => void
    once?: MaybeRef<boolean>
    loading?: MaybeRef<boolean>
    offsetX?: MaybeRef<string>
    offsetY?: MaybeRef<string>
  }
): void {
  const options = reactive({ once, loading, offsetX, offsetY })

  let observer = createObserver()

  watchEffect(() => {
    if (elem.value instanceof Element) {
      observer = createObserver()
      observer.observe(elem.value)
    } else {
      observer.disconnect()
    }
  })

  function createObserver() {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]

        if (!entry.isIntersecting || options.loading) {
          return
        }

        handler()

        if (options.once) {
          observer.disconnect()
        }
      },
      {
        rootMargin: `${options.offsetY} ${options.offsetX}`,
      }
    )

    return observer
  }
}
