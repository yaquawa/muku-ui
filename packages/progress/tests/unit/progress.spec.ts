import '@testing-library/jest-dom'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { install, InstallOptions, ProgressLinear } from '@muku-ui/progress'

/*
|---------------------------------------------------------------------------
| Arrange environment
|---------------------------------------------------------------------------
*/

const installOptions: Partial<InstallOptions> = {
  barStyle: { backgroundColor: 'red' },
  backgroundStyle: { backgroundColor: 'green' },
}

const appContainer = document.createElement('div')
document.body.append(appContainer)

const progressLinearValue = ref(0)
const AppComponent = {
  template: `
    <progress-linear v-model="value" max="60" @change="onChange" style="height: 4px;" />
  `,
  setup() {
    return { value: progressLinearValue }
  },
  components: { ProgressLinear },
}

const app = mount(AppComponent, {
  global: {
    plugins: [[install, installOptions]],
  },
  attachTo: appContainer,
})

const progressLinearElement = document.querySelector('.muku-progress-linear') as HTMLElement
const progressLinearBarElement = document.querySelector('.muku-progress-linear .__bar') as HTMLElement
const progressLinearBackgroundElement = document.querySelector(
  '.muku-progress-linear .__background'
) as HTMLElement

/*
|---------------------------------------------------------------------------
| Tests
|---------------------------------------------------------------------------
*/

test('Inline custom style of `progress-linear` element has been added', () => {
  expect(progressLinearElement.style.height).toBe('4px')
})

test('Inline custom style of `bar` and `background` element has been added', () => {
  expect(progressLinearBackgroundElement.style.backgroundColor).toBe('green')
  expect(progressLinearBarElement.style.backgroundColor).toBe('red')
})

test('Changes bar width when model changes', async () => {
  expect(progressLinearBarElement.style.width).toBe('0%')
  progressLinearValue.value = 30
  await nextTick()
  expect(progressLinearBarElement.style.width).toBe('50%')
})
