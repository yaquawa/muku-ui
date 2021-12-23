<template>
  <teleport to="body">
    <div
      ref="tooltipElement"
      :style="tooltipStyle"
      tabindex="0"
      class="muku-clear-outline-on-focus"
      :data-tooltip-placement="currentPlacement"
    >
      <transition
        :name="transitionName"
        @before-enter="beforeEnter"
        @after-leave="afterLeave"
        @after-enter="afterEnter"
      >
        <div v-visible="show" style="position: relative">
          <div v-bind="$attrs">
            <slot></slot>
          </div>
          <div class="__arrow" v-if="arrow" ref="arrowElement"></div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style>
.muku-clear-outline-on-focus:focus {
  outline: none;
}
</style>

<script lang="ts">
import { api } from '../Api'
import { offsetByPadding } from '../popperModifiers'
import { hasClosestElement } from '@muku-ui/shared/src/dom/utils'
import { onUnmounted, onMounted, watch, defineComponent, PropType, ref, reactive } from 'vue'
import { createPopper, Placement, Padding, Instance as PopperInstance } from '@popperjs/core'

export default defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    transitionName: {
      type: String,
      default: 'tooltip',
    },
    activator: {
      type: [String, Object] as PropType<string | HTMLElement>,
      required: true,
    },
    placement: {
      type: String as PropType<Placement>,
      default: 'auto',
    },
    interactive: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: 0,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    arrowPadding: {
      type: [Number, Object] as PropType<Padding>,
      default: 5,
    },
    showEvents: {
      type: Array as PropType<Array<'mouseenter' | 'focus' | 'click'>>,
      default: () => (isTouchDevice() ? ['click'] : ['mouseenter', 'focus']),
    },
    hideEvents: {
      type: Array as PropType<Array<'mouseleave' | 'blur'>>,
      default: () => ['mouseleave', 'blur'],
    },
    zIndex: {
      type: Number,
      default: () => api.config.get('zIndex'),
    },
    timeout: {
      type: Number,
    },
  },

  directives: {
    visible: {
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue) {
          return
        }

        if (value) {
          transition!.beforeEnter(el)
          el.style.visibility = ''
          transition!.enter(el)
        } else {
          transition!.leave(el, () => {
            el.style.visibility = 'hidden'
          })
        }
      },
    },
  },

  setup(props) {
    const tooltipElement = ref<HTMLElement | undefined>()
    const arrowElement = ref<HTMLElement | undefined>()
    const show = ref(false)
    const currentPlacement = ref(props.placement)
    const tooltipStyle = reactive({
      display: 'none',
      zIndex: props.zIndex,
      pointerEvents: props.interactive ? '' : 'none',
    })
    let popper: PopperInstance | null

    if (isTouchDevice()) {
      document.addEventListener('touchend', () => {
        if (!show.value) return

        show.value = false
      })
    }

    onMounted(setupTooltip)

    onUnmounted(() => {
      destroyPopper()
    })

    watch(
      () => props.activator,
      () => {
        destroyPopper()
        setupTooltip()
      }
    )

    function setupTooltip() {
      if (!props.activator) return

      const tooltipElem = tooltipElement.value as HTMLElement

      if (!(props.activator instanceof HTMLElement) && typeof props.activator !== 'string') {
        throw new Error(
          `The 'activator' property should be either a string or HTMLElement, but the given value was '${props.activator}'.`
        )
      }

      const activator: HTMLElement | null =
        typeof props.activator === 'string' ? document.querySelector(props.activator) : props.activator

      if (!(activator instanceof HTMLElement)) {
        throw new Error(`The element for '${props.activator}' was not found.`)
      }

      props.showEvents.forEach((eventName) => {
        activator.addEventListener(eventName, showTooltip)
      })

      props.hideEvents.forEach((eventName) => {
        activator.addEventListener(eventName, hideTooltip)
        if (props.interactive) {
          tooltipElem.addEventListener(eventName, hideTooltip)
        }
      })

      /*------------------------------------*\
          # functions
      \*------------------------------------*/

      function createTooltip() {
        destroyPopper()

        popper = createPopper(activator as HTMLElement, tooltipElem, {
          placement: props.placement,
          modifiers: [
            {
              name: 'arrow',
              options: {
                element: arrowElement.value,
                padding: props.arrowPadding,
              },
            },
            {
              ...offsetByPadding,
              options: {
                offset: props.offset,
              },
            },
            {
              name: 'placementUpdater',
              enabled: true,
              phase: 'main',
              fn: ({ state }) => {
                currentPlacement.value = state.placement
              },
            },
          ],
        })
      }

      let timeoutId: number
      function showTooltip() {
        tooltipStyle.display = ''

        show.value = true

        createTooltip()

        if (props.timeout !== undefined) {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
            show.value = false
          }, props.timeout)
        }
      }

      function hideTooltip(e: MouseEvent | FocusEvent) {
        if (
          props.interactive &&
          e.relatedTarget instanceof Element &&
          e.currentTarget !== tooltipElem &&
          hasClosestElement(e.relatedTarget, tooltipElem)
        ) {
          return
        }

        show.value = false
      }
    }

    function beforeEnter() {
      tooltipStyle.pointerEvents = 'none'
    }

    function afterEnter() {
      if (props.interactive) {
        tooltipStyle.pointerEvents = ''
      }
    }

    function afterLeave() {
      tooltipStyle.display = 'none'
      destroyPopper()
    }

    function destroyPopper() {
      if (!popper) {
        return
      }
      popper.destroy()
      popper = null
    }

    return {
      show,
      currentPlacement,
      afterLeave,
      beforeEnter,
      afterEnter,
      tooltipStyle,
      tooltipElement,
      arrowElement,
    }
  },
})

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
</script>
