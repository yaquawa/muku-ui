import '@testing-library/jest-dom'
import { mount } from '@vue/test-utils'
import { install, Tooltip } from '@muku-ui/tooltip'
import { click, q } from '@muku-ui/shared/tests/utils'

/*
|---------------------------------------------------------------------------
| Arrange environment
|---------------------------------------------------------------------------
*/

const appContainer = document.createElement('div')
document.body.append(appContainer)

const AppComponent = {
  template: `
    <div id="activator-1">Activator</div>
    <tooltip id="tooltip-1" activator="#activator-1" placement="bottom" :show-events="['click']" :hide-events="['blur']">Tooltip</tooltip>
  `,
  components: { Tooltip: Tooltip },
}

const app = mount(AppComponent, {
  global: {
    plugins: [install],
  },
  attachTo: appContainer,
})

const tooltip_1 = q('#tooltip-1')
const activator_1 = q('#activator-1')

/*
|---------------------------------------------------------------------------
| Tests
|---------------------------------------------------------------------------
*/

test('Tooltip element appended to body after installation', () => {
  expect(tooltip_1).toBeInTheDocument()
  expect(tooltip_1).not.toBeVisible()
})

test('Show tooltip when click on the activator', async () => {
  expect(tooltip_1).not.toBeVisible()
  await click(activator_1)
  expect(q('#tooltip-1')).toBeVisible()
})
