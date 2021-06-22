<template>
  <div style="width: 100%; height: 150vh; background-color: lightgray"></div>
  <InView :handler="onInView">
    <div style="width: 100px; height: 100px; background-color: yellowgreen" ref="elem"></div>
  </InView>
  <div style="width: 100%; height: 130vh; background-color: lightgray"></div>

  <div style="position: fixed; top: 100px; left: 100px">{{ inView ? 'in view' : 'out of view' }}</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { InView, useInView } from '@muku-ui/in-view'

export default defineComponent({
  name: 'App',
  components: {
    InView,
  },
  setup() {
    const elem = ref<Element>()
    const { inView } = useInView(elem)

    const onInView = () => {
      console.log('in view')
    }

    return { onInView, elem, inView }
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
