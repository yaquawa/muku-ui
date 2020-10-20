<template>
  <teleport to="body">
    <div class="options">
      <div>Options:</div>
      <label>
        <input type="checkbox" v-model="cancelEvent" />
        <span>Cancel Event</span>
      </label>
    </div>
  </teleport>

  <div class="container">
    <div class="row">
      <Modal
        name="modal-1"
        style="padding: 20px; border-radius: 6px; width: 400px"
        v-slot="{ closeAll, open, close }"
        @before-close="beforeClose"
        @before-open="beforeOpen"
        @after-open="afterOpen"
        @after-close="afterClose"
      >
        <div class="modal-content">Modal no.1</div>

        <div class="modal-footer">
          <button @click="closeAll">close all</button>
          <button @click="close">close me</button>
          <button @click="open('modal-2')">open modal-2</button>
        </div>
      </Modal>
      <button @click="openModal('modal-1')">Open Modal 1</button>
    </div>

    <div class="row">
      <Modal
        name="modal-2"
        style="padding: 20px; border-radius: 6px; width: 1000px"
        v-slot="{ close, open }"
        @before-close="beforeClose"
        @before-open="beforeOpen"
        @after-open="afterOpen"
        @after-close="afterClose"
      >
        <div class="modal-content">Modal no.2</div>

        <div class="modal-footer">
          <button @click="close">close me</button>
          <button @click="open('modal-1')">Open Modal no.1</button>
        </div>
      </Modal>
      <button @click="openModal('modal-2')">Open Modal 2</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  modalApi,
  Modal,
  AfterCloseEvent,
  AfterOpenEvent,
  BeforeCloseEvent,
  BeforeOpenEvent,
} from '@muku-ui/modal';

export default defineComponent({
  name: 'App',
  components: {
    Modal,
  },
  data() {
    return {
      cancelEvent: false,
    };
  },
  methods: {
    openModal(modelName: string) {
      modalApi.openModal(modelName);
    },

    beforeOpen(event: BeforeOpenEvent) {
      if (this.cancelEvent) {
        event.cancel();
        console.log('cancel event');
      }

      console.log(event.modal, 'before open');
    },

    beforeClose(event: BeforeCloseEvent) {
      if (this.cancelEvent) {
        event.cancel();
        console.log('cancel event');
      }

      console.log(event.modal, 'before close');
    },

    afterOpen(event: AfterOpenEvent) {
      console.log(event.modal, 'after open');
    },

    afterClose(event: AfterCloseEvent) {
      console.log(event.modal, 'after close');
    },
  },
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #31373a;
  margin: 0;
}

#app {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.options {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: #00000073;
  color: white;
  padding: 16px;
  border-radius: 4px;
  z-index: 2000;
  font-size: 0.9em;
  line-height: 1;
}

.options > * + * {
  margin-top: 10px;
  display: block;
}

.container {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-gap: 20px;
}

button {
  appearance: none;
  border: none;
  padding: 1em 3em;
  display: block;
  background: linear-gradient(-25deg, #ffcdd2, #90caf9);
  color: white;
  border-radius: 100px;
  outline: none;
  cursor: pointer;
  width: 100%;
}

.modal-footer {
  margin-top: 1em;
  text-align: center;
}

.modal-footer > * + * {
  margin-top: 10px;
}
</style>
