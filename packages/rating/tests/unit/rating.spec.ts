import { ref } from 'vue'
import '@testing-library/jest-dom'
import { mount } from '@vue/test-utils'
import { click, q } from '@muku-ui/shared/tests/utils'
import { install, InstallOptions, Rating } from '@muku-ui/rating'

/*
|---------------------------------------------------------------------------
| Arrange environment
|---------------------------------------------------------------------------
*/

const installOptions: Partial<InstallOptions> = {}
const appContainer = document.createElement('div')
document.body.append(appContainer)

const ratingValue = ref(3.6)
const ratingLength = ref(5)

const AppComponent = {
  template: `
    <rating v-model="ratingValue" :length="ratingLength"/>
  `,
  setup() {
    return { ratingValue, ratingLength }
  },
  components: { Rating },
}

const app = mount(AppComponent, {
  global: {
    plugins: [[install, installOptions]],
  },
  attachTo: appContainer,
})

/*
|---------------------------------------------------------------------------
| Tests
|---------------------------------------------------------------------------
*/

test('Has correct item length', () => {
  expect(document.querySelectorAll('.__icon-container').length).toBe(ratingLength.value)
})

test('Click event', async () => {
  expect(ratingValue.value).toBe(3.6)
  await click(q('.__icon-container:nth-child(3)'))
  expect(ratingValue.value).toBe(3)
})
