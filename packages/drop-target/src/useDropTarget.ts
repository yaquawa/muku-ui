import { isRef, ref, Ref, unref } from 'vue'
import { createEventHook } from '@vueuse/core'
import { useEventListener } from '@muku-ui/shared'

interface Options {
  accept: string | string[]
  activeClass: string | string[] | Record<string, boolean>
}

export function useDropTarget(
  dropTargetElement: Ref<HTMLElement | null | undefined> | HTMLElement,
  { accept = ['*/*'], activeClass }: Partial<Options> = {}
) {
  const elementClass = ref<Options['activeClass'] | null>()
  const files: Ref<File[]> = ref([])
  const dropEventHook = createEventHook<DragEvent>()
  const dragEnterEventHook = createEventHook<DragEvent>()
  const dragLeaveEventHook = createEventHook<DragEvent>()
  const acceptableTypes = (Array.isArray(accept) ? accept : accept!.split(',')).map((value) =>
    value.trim().toLowerCase()
  )
  let isEntering = false

  useEventListener(dropTargetElement, 'dragover', (event) => {
    event.preventDefault()
  })

  useEventListener(dropTargetElement, 'dragenter', (event) => {
    event.preventDefault()

    if (isEntering) {
      return
    }

    isEntering = true

    dragEnterEventHook.trigger(event)
    setActiveClass('add')
  })

  useEventListener(dropTargetElement, 'dragleave', (event) => {
    if (!(event.relatedTarget && isTargetElementMounted())) return

    const isInsideDropTarget = unref(dropTargetElement)!.contains(event.relatedTarget as Node)

    if (isInsideDropTarget) return

    dragLeaveEventHook.trigger(event)
    setActiveClass('remove')
    isEntering = false
  })

  useEventListener(dropTargetElement, 'drop', (event) => {
    event.preventDefault()

    const dataTransfer = event.dataTransfer

    if (!dataTransfer) return

    const finishDrop = () => {
      dropEventHook.trigger(event)
      setActiveClass('remove')
      isEntering = false

      files.value = Array.from(dataTransfer.files)
    }

    if (dataTransfer.files.length) {
      const matched = matchFileType(dataTransfer.files, acceptableTypes)

      if (matched) {
        finishDrop()
        return
      }
    }

    if (dataTransfer.types.length) {
      const matched = dataTransfer.types.every((type) => {
        return acceptableTypes.some((acceptableType) => {
          return matchMimeType(type, acceptableType)
        })
      })

      if (matched) {
        finishDrop()
        return
      }
    }

    setActiveClass('remove')
    isEntering = false
  })

  function setActiveClass(method: 'add' | 'remove') {
    if (!(isTargetElementMounted() && activeClass)) return

    elementClass.value = {
      add: activeClass,
      remove: null,
    }[method]
  }

  function isTargetElementMounted(): boolean {
    return !!(isRef(dropTargetElement) ? dropTargetElement.value : dropTargetElement)
  }

  return {
    onDragEnter: dragEnterEventHook.on,
    onDrop: dropEventHook.on,
    onDragLeave: dragLeaveEventHook.on,
    elementClass,
    files,
  }
}

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

  return parts[lastIndex].toLowerCase()
}
