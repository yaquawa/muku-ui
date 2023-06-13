<template>
  <div class="container">
    <div>
      <tooltip placement="bottom" class="tooltip" interactive>
        Tooltip
        <template #activator>
          <button>Button</button>
        </template>
      </tooltip>
    </div>

    <div>
      <tooltip :hide-events="[]" placement="top" class="tooltip" offset="10" :arrowPadding="20">
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>
        <div>Tooltip 2</div>

        <template #activator>
          <button>Button</button>
        </template>
      </tooltip>
    </div>

    <div>
      <tooltip
        activatorTag="section"
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

        <template #activator>
          <button>Button</button>
        </template>
      </tooltip>
    </div>

    <div>
      <tooltip placement="auto" class="tooltip" offset="10" :timeout="2000">
        <div>Tooltip 4</div>
        <div>Tooltip 4</div>
        <div>Tooltip 4</div>

        <template #activator>
          <button>Button</button>
        </template>
      </tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Tooltip } from '@muku-ui/tooltip'
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
