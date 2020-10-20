import { ref } from 'vue';

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);

  disconnect: () => void;
  observe: (target: Element, options?: ResizeObserverObserveOptions) => void;
  unobserve: (target: Element) => void;
}

interface ResizeObserverObserveOptions {
  box?: 'content-box' | 'border-box';
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly borderBoxSize: ResizeObserverEntryBoxSize;
  readonly contentBoxSize: ResizeObserverEntryBoxSize;
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;
}

interface ResizeObserverEntryBoxSize {
  blockSize: number;
  inlineSize: number;
}

function getPaddingBorderSize(el: Element) {
  const computedStyle = window.getComputedStyle(el);

  return {
    width:
      parseInt(computedStyle.paddingLeft, 10) +
      parseInt(computedStyle.paddingRight, 10) +
      parseInt(computedStyle.borderLeft, 10) +
      parseInt(computedStyle.borderRight, 10),
    height:
      parseInt(computedStyle.paddingTop, 10) +
      parseInt(computedStyle.paddingBottom, 10) +
      parseInt(computedStyle.borderTop, 10) +
      parseInt(computedStyle.borderBottom, 10)
  };
}

function getExtraSize(el: Element, borderBox = true) {
  return borderBox ? getPaddingBorderSize(el) : { width: 0, height: 0 };
}

export function useSize(el: Element, borderBox = true) {
  const extraSize = getExtraSize(el, borderBox);
  const width = ref(el.clientWidth + extraSize.width);
  const height = ref(el.clientHeight + extraSize.height);

  const resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0];
    const extraSize = getExtraSize(entry.target, borderBox);
    const newWidth = entry.contentRect.width + extraSize.width;
    const newHeight = entry.contentRect.height + extraSize.height;

    if (width.value !== newWidth) {
      width.value = newWidth;
    }

    if (height.value !== newHeight) {
      height.value = newHeight;
    }
  });

  resizeObserver.observe(el);

  return { width, height };
}
