import { MaybeRef } from '@muku-ui/shared'
import { reactive, ref, Ref, watchEffect } from 'vue'

export function useInView(
  elem: Ref<Element | undefined>,
  {
    once = false,
    loading = false,
    offsetX = '0px',
    offsetY = '0px',
    threshold = [0],
  }: {
    once?: MaybeRef<boolean>
    loading?: MaybeRef<boolean>
    offsetX?: MaybeRef<string>
    offsetY?: MaybeRef<string>
    threshold?: MaybeRef<number | number[]>
  } = {}
) {
  const options = reactive({ once, loading, offsetX, offsetY, threshold })
  const inView = ref<boolean>()

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
          inView.value = false
          return
        }

        inView.value = true

        if (options.once) {
          observer.disconnect()
        }
      },
      {
        rootMargin: `${options.offsetY} ${options.offsetX}`,
        threshold: options.threshold,
      }
    )

    return observer
  }

  return { inView }
}
