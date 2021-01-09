import { nextTick } from 'vue'

/**
 * wait for the given micro-seconds.
 * @param ms
 */
export function wait(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * click an element.
 * @param element
 */
export function click(element: HTMLElement): Promise<void>
export function click(selector: string): Promise<void>
export function click(elementOrSelector: HTMLElement | string): Promise<void> {
  if (elementOrSelector instanceof HTMLElement) {
    elementOrSelector.click()
  } else {
    qAll(elementOrSelector).forEach((el: HTMLElement) => {
      el.click()
    })
  }

  return nextTick()
}

/**
 * select a single element.
 * @param selector
 */
export function q(selector: string): HTMLElement {
  return document.body.querySelector(selector) as HTMLElement
}

/**
 * select all elements.
 * @param selector
 */
export function qAll(selector: string): HTMLElement[] {
  return Array.from(document.body.querySelectorAll(selector))
}
