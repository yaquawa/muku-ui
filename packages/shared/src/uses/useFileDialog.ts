import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

interface PickOptions {
  accept: string[]
  multiple: boolean
}

export function useFileDialog() {
  const inputRef: Ref<HTMLInputElement | null> = ref(null)
  const files: Ref<File[]> = ref([])

  onMounted(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.hidden = true
    document.body.appendChild(input)
    inputRef.value = input
  })

  // make sure to remove the element if the component is unmounted.
  onBeforeUnmount(() => {
    inputRef.value?.remove()
  })

  function openDialog(opts?: Partial<PickOptions>) {
    // skip if the input wasn't mounted yet or was removed
    if (!inputRef.value) {
      files.value = []
      return
    }

    if (opts?.accept) {
      inputRef.value.accept = opts.accept.join(',')
    }

    inputRef.value.multiple = opts?.multiple ?? false

    // prepare event listener
    inputRef.value.onchange = (e) => {
      const fileList = (e.target as HTMLInputElement).files
      files.value = fileList ? Array.from(fileList) : []
      // clear the event listener
      if (inputRef.value) {
        inputRef.value.onchange = null
      }
    }

    inputRef.value.click()
  }

  return {
    openDialog,
    files,
  }
}
