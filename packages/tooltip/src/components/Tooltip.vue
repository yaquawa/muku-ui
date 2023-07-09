<template>
  <component :is="activatorTag" v-bind="activatorAttrs" ref="activator">
    <slot name="activator"></slot>
  </component>

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
import { hasClosestElement } from '@muku-ui/shared/src/dom/utils'
import { onMounted, watch, defineComponent, ref, reactive, onUnmounted, type PropType } from 'vue'
import {
  autoPlacement,
  arrow,
  offset,
  autoUpdate,
  flip,
  computePosition,
  type Placement,
  type Middleware,
  type Padding,
} from '@floating-ui/dom'

export default defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    transitionName: {
      type: String,
      default: 'tooltip',
    },
    placement: {
      type: String as PropType<Placement | 'auto'>,
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
    activatorTag: {
      type: String,
      default: 'div',
    },
    activatorAttrs: {
      type: Object,
      default: () => ({}),
    },
  },

  directives: {
    visible: {
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue) {
          return
        }

        if (value) {
          transition?.beforeEnter(el)
          el.style.visibility = ''
          transition?.enter(el)
        } else {
          transition?.leave(el, () => {
            el.style.visibility = 'hidden'
          })
        }
      },
    },
  },

  setup(props) {
    const activator = ref<HTMLElement>()
    const tooltipElement = ref<HTMLElement | undefined>()
    const arrowElement = ref<HTMLElement | undefined>()
    const show = ref(false)
    const currentPlacement = ref(props.placement)
    const tooltipStyle = reactive({
      position: 'absolute',
      display: 'none',
      zIndex: props.zIndex,
      pointerEvents: props.interactive ? '' : 'none',
      left: '0px',
      top: '0px',
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let cleanup = () => {}

    if (isTouchDevice()) {
      document.addEventListener('touchend', () => {
        if (!show.value) return

        show.value = false
      })
    }

    onUnmounted(() => {
      cleanup()
    })

    const unwatch = watch(activator, () => {
      if (!(activator.value instanceof HTMLElement)) return

      unwatch()
      setupTooltip(activator.value)
    })

    function setupTooltip(activator: HTMLElement) {
      const middleware: Middleware[] = []

      if (props.offset) {
        middleware.push(
          offset(
            typeof props.offset === 'number'
              ? props.offset
              : { mainAxis: props.offset[0], crossAxis: props.offset[1] }
          )
        )
      }

      if (props.placement === 'auto') {
        middleware.push(autoPlacement())
      } else {
        middleware.push(flip())
      }

      if (props.arrow) {
        middleware.push(
          arrow({
            element: arrowElement.value!,
            padding: props.arrowPadding,
          })
        )
      }

      const update = () => {
        computePosition(activator, tooltipElement.value!, {
          middleware,
          ...(props.placement !== 'auto' ? { placement: props.placement } : {}),
        }).then(({ x, y, middlewareData, placement }) => {
          tooltipStyle.left = x ? x + 'px' : '0px'
          tooltipStyle.top = y ? y + 'px' : '0px'

          Object.assign(arrowElement.value!.style, {
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
            top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
          })

          currentPlacement.value = placement
        })
      }

      cleanup = autoUpdate(activator, tooltipElement.value!, update)

      props.showEvents.forEach((eventName) => {
        activator.addEventListener(eventName, showTooltip)
      })

      props.hideEvents.forEach((eventName) => {
        activator.addEventListener(eventName, hideTooltip)

        if (props.interactive) {
          tooltipElement.value!.addEventListener(eventName, hideTooltip)
        }
      })

      /*------------------------------------*\
          # functions
      \*------------------------------------*/

      let timeoutId: number
      function showTooltip() {
        tooltipStyle.display = ''

        show.value = true

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
          e.currentTarget !== tooltipElement.value &&
          hasClosestElement(e.relatedTarget, tooltipElement.value!)
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
    }

    return {
      activator,
      show,
      currentPlacement,
      tooltipStyle,
      tooltipElement,
      arrowElement,
      afterLeave,
      beforeEnter,
      afterEnter,
    }
  },
})

function isTouchDevice() {
  try {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  } catch (e) {
    return false
  }
}
</script>
