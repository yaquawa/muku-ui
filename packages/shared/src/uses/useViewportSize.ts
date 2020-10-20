import { ref } from 'vue';

export function useViewportSize() {
  const width = ref(document.documentElement.clientWidth);
  const height = ref(document.documentElement.clientHeight);

  window.addEventListener('resize', () => {
    width.value = document.documentElement.clientWidth;
    height.value = document.documentElement.clientHeight;
  });

  return { width, height };
}
