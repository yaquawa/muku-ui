import { MaybeRef } from '@muku-ui/shared'
import { reactive, ref, Ref, watchEffect } from 'vue'

export function useInView(
  elem: Ref<Element | undefined>,
  {
    once = false,
    loading = false,
    offsetX = '0px',
    offsetY = '0px',
  }: {
    once?: MaybeRef<boolean>
    loading?: MaybeRef<boolean>
    offsetX?: MaybeRef<string>
    offsetY?: MaybeRef<string>
  } = {}
) {
  const options = reactive({ once, loading, offsetX, offsetY })
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
      }
    )

    return observer
  }

  return { inView }
}
