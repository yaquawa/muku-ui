<template>
  <div style="width: 100%">
    <progress-linear v-model="value" max="60" @change="onChange" style="width: 50%" />

    <div>
      <strong>Percentage</strong>
      <input v-model.number="value" type="number" min="0" max="100" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ProgressLinear } from '@muku-ui/progress'

export default defineComponent({
  name: 'App',
  components: {
    ProgressLinear,
  },
  setup() {
    const value = ref(0)
    const onChange = (percentage: number) => {
      console.log('changed', percentage)
    }

    return { value, onChange }
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
</style>
