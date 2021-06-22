<template>
  <div ref="rootElement">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { useInView } from '../useInView'
import { defineComponent, ref, PropType } from 'vue'

export default defineComponent({
  name: 'InView',
  props: {
    handler: {
      type: Function as PropType<() => void>,
      required: true,
    },
    once: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    offsetY: {
      type: String,
      default: '0px',
    },
    offsetX: {
      type: String,
      default: '0px',
    },
  },
  setup(props) {
    const rootElement = ref<Element>()

    useInView(rootElement, props)

    return { rootElement }
  },
})
</script>
