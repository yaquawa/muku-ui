<template>
  <component :is="as" @click="copyToClipboard" ref="rootElement" style="position: relative">
    <slot></slot>
    <Tooltip :activator="rootElement" v-bind="mergedTooltipProps">
      {{ message }}
    </Tooltip>
  </component>
</template>

<script lang="ts">
import { Tooltip } from '@muku-ui/tooltip'
import { computed, defineComponent, ref } from 'vue'

const defaultTooltipProps = {
  offset: 10,
  placement: 'auto',
  showEvents: ['click'],
  hideEvents: [],
  timeout: 1500,
}

export default defineComponent({
  name: 'CopyToClipboard',
  components: {
    Tooltip,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    as: {
      type: String,
      default: 'div',
    },
    message: {
      type: String,
      default: 'Copied!',
    },
    tooltipProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const rootElement = ref<HTMLInputElement>()
    const mergedTooltipProps = computed(() => ({ ...defaultTooltipProps, ...props.tooltipProps }))

    async function copyToClipboard() {
      await navigator.clipboard.writeText(props.value)
    }

    return { copyToClipboard, rootElement, mergedTooltipProps }
  },
})
</script>
