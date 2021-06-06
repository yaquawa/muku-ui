<template>
  <div
    ref="rootElement"
    @dragover.prevent
    @dragenter.prevent="onDragEnter"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    :class="rootElementClass"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { domUtils } from '@muku-ui/shared'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DropTarget',
  emits: ['drop', 'dragenter'],
  props: {
    accept: {
      type: String,
      default: '*/*',
    },
    activeClass: {
      type: [String, Array, Object],
    },
  },

  setup(props, { emit }) {
    const rootElement = ref<HTMLElement>()
    const rootElementClass = ref<any>()
    const accepts = computed(() => {
      return props.accept.split(',').map((contentType) => contentType.trim())
    })
    let isEntering = false

    function onDragEnter(event: DragEvent) {
      if (isEntering) {
        return
      }

      isEntering = true

      emit('dragenter', event)
      setActiveClass('add')
    }

    function onDragLeave(event: DragEvent) {
      if (!(event.relatedTarget && rootElement.value)) return

      const isInsideDragTarget = domUtils.hasClosestElement(event.relatedTarget as Element, rootElement.value)

      if (isInsideDragTarget) return

      setActiveClass('remove')
      isEntering = false
    }

    function onDrop(event: DragEvent) {
      const dataTransfer = event.dataTransfer

      if (!dataTransfer) return

      if (dataTransfer.files.length) {
        const matched = matchFileType(dataTransfer.files, accepts.value)

        if (matched) {
          finishDrop()
          return
        }
      }

      if (dataTransfer.types.length) {
        const matched = dataTransfer.types.every((type) => {
          return accepts.value.some((accept) => {
            return matchMimeType(type, accept)
          })
        })

        if (matched) {
          finishDrop()
          return
        }
      }

      setActiveClass('remove')

      function finishDrop() {
        emit('drop', event)
        setActiveClass('remove')
      }
    }

    function setActiveClass(method: 'add' | 'remove') {
      if (!(rootElement.value && props.activeClass)) return

      rootElementClass.value = {
        add: props.activeClass,
        remove: null,
      }[method]
    }

    return { onDragEnter, onDragLeave, onDrop, rootElement, rootElementClass }
  },
})

function matchFileType(files: FileList, accepts: string[]): boolean {
  return Array.from(files).every((file) => {
    return accepts.some((accept) => {
      const isMimeType = accept.indexOf('/') !== -1

      if (isMimeType) {
        // e.g. accept: image/png
        return matchMimeType(file.type, accept)
      }

      // e.g. accept: .png
      return `.${getExtension(file.name)}` === accept
    })
  })
}

function matchMimeType(targetType: string, acceptableType: string): boolean {
  if (acceptableType === '*/*') return true
  if (targetType === acceptableType) return true

  const [acceptableMainType, acceptableSubType] = acceptableType.split('/')
  const [targetMainType] = targetType.split('/')

  return acceptableMainType === targetMainType && acceptableSubType === '*'
}

function getExtension(filename: string): string {
  const parts = filename.split('.')
  const lastIndex = parts.length - 1

  return parts[lastIndex]
}
</script>
