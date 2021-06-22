<template>
  <div style="width: 100%; height: 150vh; background-color: gray"></div>
  <InView :handler="onInView">
    <div style="width: 100px; height: 100px; background-color: yellowgreen"></div>
  </InView>
  <div style="width: 100%; height: 130vh; background-color: gray"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { InView } from '@muku-ui/in-view'

export default defineComponent({
  name: 'App',
  components: {
    InView,
  },
  setup() {
    const onInView = () => {
      console.log('in view')
    }

    return { onInView }
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
