<template>
  <div class="muku-rating">
    <div
      v-for="n in length"
      :key="n"
      class="__icon-container"
      @mouseenter="onMouseEnter(n)"
      @click="onClick(n)"
      @mouseleave="onMouseLeave"
    >
      <div v-html="iconObject.empty" class="__empty-icon"></div>
      <div v-html="iconObject.full" class="__full-icon" :style="getFullIconStyle(n)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { api } from '../Api'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  emits: ['change', 'update:modelValue'],
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      default: 5,
    },
    icon: {
      type: String,
      default: api.config.get('icon'),
    },
  },

  setup(props, { emit }) {
    watch(
      () => props.modelValue,
      (nth) => {
        emit('change', nth)
      }
    )

    const hoverValue = ref<null | number>(null)
    const iconObject = api.config.get('icons')[props.icon]

    function onMouseEnter(nth: number) {
      if (props.readonly) {
        return
      }
      hoverValue.value = nth
    }

    function onMouseLeave() {
      if (props.readonly) {
        return
      }
      hoverValue.value = null
    }

    function onClick(nth: number) {
      if (props.readonly) {
        return
      }
      emit('update:modelValue', nth)
    }

    function getFullIconStyle(nth: number) {
      const diff = (hoverValue.value || props.modelValue) - nth
      const width = diff >= 0 ? 100 : diff <= -1 ? 0 : (1 + diff) * 100
      return {
        width: `${width}%`,
      }
    }

    return { iconObject, onMouseEnter, onMouseLeave, onClick, getFullIconStyle }
  },
})
</script>
