<template>
  <div ref="rootElement" :class="elementClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { useDropTarget } from '../useDropTarget'
import { defineComponent, PropType, ref, watch } from 'vue'

export default defineComponent({
  name: 'DropTarget',
  emits: ['drop', 'dragenter', 'dragleave', 'update:modelValue'],
  props: {
    modelValue: {
      type: Array as PropType<File[]>,
    },
    accept: {
      type: [String, Array] as PropType<string | string[]>,
      default: '*/*',
    },
    activeClass: {
      type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    },
  },

  setup(props, { emit }) {
    const rootElement = ref<HTMLElement>()

    const { files, elementClass, onDragEnter, onDragLeave, onDrop } = useDropTarget(rootElement, {
      accept: props.accept,
      activeClass: props.activeClass,
    })

    watch(
      () => files.value,
      () => {
        emit('update:modelValue', files.value)
      }
    )

    onDrop((event) => {
      emit('drop', event)
    })

    onDragLeave((event) => {
      emit('dragleave', event)
    })

    onDragEnter((event) => {
      emit('dragenter', event)
    })

    return { rootElement, elementClass }
  },
})
</script>
