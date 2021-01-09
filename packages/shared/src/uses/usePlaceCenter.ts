import { watchEffect } from 'vue'
import { useSize } from './useSize'
import { useViewportSize } from './useViewportSize'

interface Options {
  allowOverflowX: boolean
  allowOverflowY: boolean
}

const DefaultOptions: Options = {
  allowOverflowX: false,
  allowOverflowY: false,
}

export function usePlaceCenter(el: HTMLElement, options: Partial<Options> = {}) {
  options = { ...options, ...DefaultOptions }
  const { width: elWidth, height: elHeight } = useSize(el)
  const { width: viewWidth, height: viewHeight } = useViewportSize()

  el.style.position = 'absolute'

  watchEffect(() => {
    const left = (viewWidth.value - elWidth.value) / 2
    const top = (viewHeight.value - elHeight.value) / 2

    el.style.left = (!options.allowOverflowX && left < 0 ? 0 : left) + 'px'
    el.style.top = (!options.allowOverflowY && top < 0 ? 0 : top) + 'px'
  })
}
