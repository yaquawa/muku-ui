<template>
  <div role="progressbar" class="muku-progress-linear">
    <div class="__background" :style="backgroundStyle"></div>
    <div class="__bar" :style="{ ...barStyle, ...{ width: `${(modelValue / max) * 100}%` } }"></div>
  </div>
</template>

<script lang="ts">
import { api } from '../Api'
import { defineComponent, watch } from 'vue'

export default defineComponent({
  emits: ['change'],
  props: {
    backgroundStyle: {
      type: Object,
      default: () => {
        return api.config.get('backgroundStyle')
      },
    },
    barStyle: {
      type: Object,
      default: () => {
        return api.config.get('barStyle')
      },
    },
    modelValue: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: 100,
    },
  },

  setup(props, { emit }) {
    watch(
      () => props.modelValue,
      (percentage) => {
        emit('change', percentage)
      }
    )
  },
})
</script>
