<template>
  <transition name="muku-modal-backdrop">
    <div id="muku-modal-backdrop" :style="backdropStyle" @mousedown.self="close" v-show="show"></div>
  </transition>
</template>

<script lang="ts">
import { setBackdrop } from '../Backdrop'
import { api as modalApi } from '../Api'
import { BackdropComponentInternalInstance } from '../types'
import { defineComponent, getCurrentInstance, ref } from 'vue'

export default defineComponent({
  name: 'Backdrop',
  setup() {
    const { show, close } = useBackdrop()
    const backdropStyle = modalApi.config.get('backdropStyle')

    return { show, close, backdropStyle }
  },
})

function useBackdrop() {
  const instance = getCurrentInstance() as BackdropComponentInternalInstance
  const show = ref(false)

  const close = () => {
    modalApi.closeAll({ closedBy: 'escape' })
  }

  const ctx = { show, close }

  setBackdrop({ instance, ctx })

  // support escape key to close
  window.addEventListener('keyup', (e) => {
    if (show.value && e.code === 'Escape') {
      close()
    }
  })

  return ctx
}
</script>
