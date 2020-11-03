<template>
  <teleport to="body">
    <div
      ref="tooltip"
      style="display: none"
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
          <div class="__arrow" v-if="arrow" ref="arrow"></div>
          <div v-bind="$attrs">
            <slot></slot>
          </div>
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
import { createPopper, Placement, Padding, Instance as PopperInstance } from '@popperjs/core';
import { getCurrentInstance, onMounted, defineComponent, PropType, ref } from 'vue';
import { ComponentInternalInstance } from '@vue/runtime-core';
import { hasClosestElement } from '@muku-ui/shared/src/dom/utils';
import { offsetByPadding } from '../popperModifiers';

export default defineComponent({
  props: {
    transitionName: {
      type: String,
      default: 'tooltip',
    },
    activator: {
      type: [String, HTMLElement],
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
      default: () => ['mouseenter', 'focus'],
    },
    hideEvents: {
      type: Array as PropType<Array<'mouseleave' | 'blur'>>,
      default: () => ['mouseleave', 'blur'],
    },
  },

  directives: {
    visible: {
      updated(el, { value, oldValue }, { transition }) {
        if (!value === !oldValue) {
          return;
        }

        if (value) {
          transition!.beforeEnter(el);
          el.style.visibility = '';
          transition!.enter(el);
        } else {
          transition!.leave(el, () => {
            el.style.visibility = 'hidden';
          });
        }
      },
    },
  },

  setup(props) {
    const instance = getCurrentInstance() as ComponentInternalInstance;
    const show = ref(false);
    const currentPlacement = ref(props.placement);
    let popper: PopperInstance | null;

    const beforeEnter = () => {
      (instance.refs.tooltip as HTMLElement).style.pointerEvents = 'none';
    };

    const afterEnter = () => {
      if (props.interactive) {
        (instance.refs.tooltip as HTMLElement).style.pointerEvents = '';
      }
    };

    const afterLeave = () => {
      (instance.refs.tooltip as HTMLElement).style.display = 'none';
      destroyPopper();
    };

    const destroyPopper = () => {
      if (!popper) {
        return;
      }
      popper.destroy();
      popper = null;
    };

    onMounted(() => {
      const tooltipElem = instance.refs.tooltip as HTMLElement;

      if (!(props.activator instanceof HTMLElement) && typeof props.activator !== 'string') {
        throw new Error(
          `The 'activator' property should be either a string or HTMLElement, but the given value was '${props.activator.constructor}'.`
        );
      }

      const activator: HTMLElement | null =
        typeof props.activator === 'string' ? document.querySelector(props.activator) : props.activator;

      if (!(activator instanceof HTMLElement)) {
        throw new Error(`The element for '${props.activator}' was not found.`);
      }

      props.showEvents.forEach((eventName) => {
        activator.addEventListener(eventName, showTooltip);
      });

      props.hideEvents.forEach((eventName) => {
        activator.addEventListener(eventName, hideTooltip);
        if (props.interactive) {
          tooltipElem.addEventListener(eventName, hideTooltip);
        }
      });

      /*------------------------------------*\
          # functions
      \*------------------------------------*/

      function createTooltip() {
        destroyPopper();

        popper = createPopper(activator as HTMLElement, tooltipElem, {
          placement: props.placement,
          modifiers: [
            {
              name: 'arrow',
              options: {
                element: instance.refs.arrow,
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
                currentPlacement.value = state.placement;
              },
            },
          ],
        });

        if (!props.interactive) {
          tooltipElem.style.pointerEvents = 'none';
        }
      }

      function showTooltip() {
        tooltipElem.style.display = '';
        show.value = true;

        createTooltip();
      }

      function hideTooltip(e: MouseEvent | FocusEvent) {
        if (
          props.interactive &&
          e.relatedTarget instanceof Element &&
          e.currentTarget !== tooltipElem &&
          hasClosestElement(e.relatedTarget, tooltipElem)
        ) {
          return;
        }

        show.value = false;
      }
    });

    return { show, currentPlacement, afterLeave, beforeEnter, afterEnter };
  },
});
</script>
