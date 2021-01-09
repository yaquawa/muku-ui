<template>
  <rating v-model="value" :length="length" />
  <rating v-model="value" :length="length" icon="heart" readonly />
  <label>Value<input type="number" v-model.number="value" min="0" max="10" /></label>
  <label>Length<input type="number" v-model.number="length" min="0" max="10" /></label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Rating } from '@muku-ui/rating'

export default defineComponent({
  name: 'App',
  components: {
    Rating,
  },
  setup() {
    const value = ref(3.6)
    const length = ref(5)
    return { value, length }
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
