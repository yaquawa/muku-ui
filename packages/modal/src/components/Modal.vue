<template>
  <teleport to="#muku-modal-backdrop">
    <transition name="muku-modal" @after-enter="emitAfterOpen" @after-leave="emitAfterClose">
      <div class="muku-modal" ref="modalElement" v-show="show" v-bind="$attrs">
        <slot :close="close" :open="open" :closeAll="closeAll"></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { usePlaceCenter } from '@muku-ui/shared'
import { ModalRepository } from '../ModalRepository'
import { AfterOpenEvent, AfterCloseEvent, EventData } from '../event'
import { ModalComponentInternalInstance, ModalModel } from '../types'
import { getCurrentInstance, defineComponent, onMounted, ref } from 'vue'
import { api as modalApi, currentCloseEventData, currentOpenEventData } from '../Api'

export default defineComponent({
  name: 'Modal',

  props: {
    name: {
      type: String,
      required: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['before-close', 'after-close', 'before-open', 'after-open'],

  setup(props) {
    const { show, close, open, closeAll, modalElement } = useModal(props.name)
    const model = ModalRepository.get(props.name) as ModalModel
    const emitAfterOpen = () =>
      model.instance.emit('after-open', new AfterOpenEvent(model, currentOpenEventData))
    const emitAfterClose = () =>
      model.instance.emit('after-close', new AfterCloseEvent(model, currentCloseEventData))

    return { modalElement, show, close, open, closeAll, emitAfterClose, emitAfterOpen }
  },
})

function useModal(modalName: string) {
  const instance = getCurrentInstance() as ModalComponentInternalInstance
  const show = ref(false)
  const modalElement = ref<HTMLElement | undefined>()

  const close = (eventData: EventData = {}) => {
    modalApi.closeModal(modalName, eventData)
  }

  const closeAll = (eventData: EventData = {}) => {
    modalApi.closeAll(eventData)
  }

  const open = (modalName: string, eventData: EventData = {}) => {
    modalApi.openModal(modalName, eventData)
  }

  const ctx = { show, close, open, closeAll }

  ModalRepository.add(modalName, { instance, ctx })

  if (modalApi.config.get('placeCenter')) {
    onMounted(() => {
      usePlaceCenter(modalElement.value as HTMLElement, {
        allowOverflowX: false,
        allowOverflowY: false,
      })
    })
  }

  return { show, close, open, closeAll, modalElement }
}
</script>
