<template>
  <div class="container">
    <div>
      <button id="my-button">Button</button>
      <tooltip activator="#my-button" placement="bottom" class="tooltip" interactive>Tooltip</tooltip>
    </div>

    <div>
      <button id="button-2">Button</button>
      <tooltip
        activator="#button-2"
        :hide-events="[]"
        placement="top"
        class="tooltip"
        offset="10"
        :arrowPadding="20"
      >
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
      </tooltip>
    </div>

    <div>
      <button id="button-3">Button</button>
      <tooltip
        activator="#button-3"
        placement="top-end"
        class="tooltip"
        offset="10"
        :show-events="['click']"
        :hide-events="['blur']"
        interactive
      >
        <div>Tooltip 3</div>
        <div>Tooltip 3</div>
        <div>Tooltip 3</div>
        <div>Tooltip 3</div>
        <div>Tooltip 3</div>
      </tooltip>
    </div>

    <div>
      <button id="button-4" ref="buttonElement">Button</button>
      <tooltip :activator="buttonElement" placement="auto" class="tooltip" offset="10" :timeout="2000">
        <div>Tooltip 4</div>
        <div>Tooltip 4</div>
        <div>Tooltip 4</div>
      </tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Tooltip } from '@muku-ui/tooltip'

export default defineComponent({
  name: 'App',
  components: {
    Tooltip,
  },
  setup() {
    const buttonElement = ref<HTMLElement>()

    return { buttonElement }
  },
})
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #31373a;
  margin: 0;
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
  height: 100px;
}
</style>
