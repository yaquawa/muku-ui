<template>
  <input type="text" v-model="text" />

  <CopyToClipboard :value="text" :tooltip-props="{ class: 'my-tooltip', timeout: 1000 }">
    <button>Click to copy</button>
  </CopyToClipboard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CopyToClipboard } from '@muku-ui/copy-to-clipboard'

export default defineComponent({
  name: 'App',
  components: {
    CopyToClipboard,
  },
  setup() {
    const text = ref('text')

    return { text }
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

.my-tooltip {
  background-color: black;
  color: white;
  padding: 5px 8px;
}
</style>
