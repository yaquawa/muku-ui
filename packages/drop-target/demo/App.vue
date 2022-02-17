<template>
  <DropTarget
    @drop="onDrop"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    class="drop-target"
    active-class="drop-target--active"
    :accept="['image/*', '.json']"
    v-model="files"
  >
    <div class="drop-target__text">Drop file to here.</div>
  </DropTarget>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { DropTarget } from '@muku-ui/drop-target'

export default defineComponent({
  name: 'App',
  components: {
    DropTarget,
  },
  setup() {
    const onDrop = (event: DragEvent) => {
      console.log('[onDrop]', event.dataTransfer?.files)
    }

    const onDragEnter = (event: DragEvent) => {
      console.log('[onDragEnter]', event)
    }

    const onDragLeave = (event: DragEvent) => {
      console.log('[onDragLeave]', event)
    }

    const files = ref([])

    watch(
      () => files.value,
      () => {
        console.log('[files]', files.value)
      }
    )

    return { onDrop, onDragEnter, onDragLeave, files }
  },
})
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

.drop-target {
  width: 500px;
  height: 350px;
  border: 1px dashed lightgray;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  border-radius: 10px;
}

@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.drop-target--active {
  border-color: #c5e1a5;
  background-color: #dcedc8;
  animation-name: pulse;
  animation-timing-function: ease-in-out;
  animation-duration: 0.5s;
}

.drop-target__text {
  padding: 20px;
  border-radius: 100px;
  background-color: #414143;
  color: white;
}
</style>
