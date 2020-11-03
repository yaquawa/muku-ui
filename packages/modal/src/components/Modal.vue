<template>
  <teleport to="#modal-backdrop">
    <transition name="modal" @after-enter="emitAfterOpen" @after-leave="emitAfterClose">
      <div class="modal" ref="modal" v-show="show" v-bind="$attrs">
        <slot :close="close" :open="open" :closeAll="closeAll"></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { api as modalApi, currentCloseEventData, currentOpenEventData } from '../Api';
import { ModalRepository } from '../ModalRepository';
import { ModalComponentInternalInstance, ModalModel } from '../types';
import { getCurrentInstance, defineComponent, onMounted, ref } from 'vue';
import { usePlaceCenter } from '@muku-ui/shared';
import { AfterOpenEvent, AfterCloseEvent, EventData } from '../event';

function useModal(modalName: string) {
  const instance = getCurrentInstance() as ModalComponentInternalInstance;
  const show = ref(false);

  const close = (eventData: EventData = {}) => {
    modalApi.closeModal(modalName, eventData);
  };

  const closeAll = (eventData: EventData = {}) => {
    modalApi.closeAll(eventData);
  };

  const open = (modalName: string, eventData: EventData = {}) => {
    modalApi.openModal(modalName, eventData);
  };

  const ctx = { show, close, open, closeAll };

  ModalRepository.add(modalName, { instance, ctx });

  if (modalApi.config.get('placeCenter')) {
    onMounted(() => {
      usePlaceCenter(instance.refs.modal as HTMLElement, {
        allowOverflowX: false,
        allowOverflowY: false,
      });
    });
  }

  return ctx;
}

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
    const { show, close, open, closeAll } = useModal(props.name);
    const model = ModalRepository.get(props.name) as ModalModel;
    const emitAfterOpen = () =>
      model.instance.emit('after-open', new AfterOpenEvent(model, currentOpenEventData));
    const emitAfterClose = () =>
      model.instance.emit('after-close', new AfterCloseEvent(model, currentCloseEventData));

    return { show, close, open, closeAll, emitAfterClose, emitAfterOpen };
  },
});
</script>
