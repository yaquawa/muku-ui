import '@testing-library/jest-dom'
import { mount } from '@vue/test-utils'
import { wait, click, q } from '@muku-ui/shared/tests/utils'
import {
  api as modalApi,
  install,
  InstallOptions,
  Modal,
  AfterCloseEvent,
  AfterOpenEvent,
  BeforeCloseEvent,
  BeforeOpenEvent,
} from '@muku-ui/modal'

/*
|---------------------------------------------------------------------------
| Arrange environment
|---------------------------------------------------------------------------
*/

const installOptions: Partial<InstallOptions> = {
  placeCenter: false,
}
const appContainer = document.createElement('div')
document.body.append(appContainer)

let cancelEvent = false

const AppComponent = {
  template: `
    <modal name="modal-1" id="modal-1"
           v-slot="{ close, open }"
           @before-open="beforeOpen"
           @before-close="beforeClose"
           @after-open="afterOpen"
           @after-close="afterClose"
    >
    Modal 1
    <button id="close-button" @click="close">Close</button>
    <button id="open-another-button" @click="open('modal-2')">Open another</button>
    </modal>

    <modal name="modal-2" id="modal-2"
           style="width: 100px;"
           v-slot="{ close, closeAll }"
    >
    modal-2
    <button id="close-all-button" @click="closeAll">Close All Modals</button>
    <button id="close-current-modal-button" @click="close">Close This Modal</button>
    </modal>

    <div id="open-modal-button" @click="openModal">Open Modal</div>
  `,
  methods: {
    openModal() {
      modalApi.openModal('modal-1')
    },
    beforeOpen(e: BeforeOpenEvent) {
      expect(e).toBeInstanceOf(BeforeOpenEvent)
      if (cancelEvent) {
        e.cancel()
      }
      console.log('before open')
    },
    beforeClose(e: BeforeCloseEvent) {
      expect(e).toBeInstanceOf(BeforeCloseEvent)
      if (cancelEvent) {
        e.cancel()
      }
      console.log('before close')
    },
    afterOpen(e: AfterOpenEvent) {
      expect(e).toBeInstanceOf(AfterOpenEvent)
      console.log('after open')
    },
    afterClose(e: AfterCloseEvent) {
      expect(e).toBeInstanceOf(AfterCloseEvent)
      console.log('after close')
    },
  },
  components: { Modal: Modal as any },
}

const app = mount(AppComponent, {
  global: {
    plugins: [[install, installOptions]],
  },
  attachTo: appContainer,
})

const backdropElement = q('#muku-modal-backdrop')

const openModalButton = q('#open-modal-button')

const modals_1 = {
  close() {
    click('#close-button')
  },
  openAnother() {
    click('#open-another-button')
  },
  el: q('#modal-1'),
}

const modals_2 = {
  closeAll() {
    click('#close-all-button')
  },
  closeSelf() {
    click('#close-current-modal-button')
  },
  el: q('#modal-2'),
}

/*
|---------------------------------------------------------------------------
| Tests
|---------------------------------------------------------------------------
*/
beforeEach(async () => {
  // close all modals
  modals_2.closeAll()
  await wait()
})

test('Backdrop element appended to body after installation', () => {
  expect(backdropElement).toBeInTheDocument()
  expect(backdropElement).not.toBeVisible()
})

test('Modal elements teleported into backdrop element', () => {
  expect(backdropElement.querySelectorAll('.muku-modal').length).toEqual(2)
})

test('Modal elements are hidden by default', () => {
  backdropElement.querySelectorAll('.muku-modal').forEach((el) => {
    expect(el).not.toBeVisible()
  })
})

test('Delegate attributes to modal elements', () => {
  expect(modals_2.el.style.width).toEqual('100px')
})

test('Click to open modal', async () => {
  expect(modals_1.el).not.toBeVisible()
  await click(openModalButton)
  expect(modals_1.el).toBeVisible()
})

test('Click backdrop to close', async () => {
  await click(backdropElement)

  expect(modals_1.el).not.toBeVisible()
  expect(modals_2.el).not.toBeVisible()
  expect(backdropElement).not.toBeVisible()
})

test('Emit events', () => {
  const spy = jest.spyOn(console, 'log')

  click(openModalButton)
  expect(spy).toHaveBeenCalledWith('before open')

  modals_1.close()
  expect(spy).toHaveBeenCalledWith('before close')

  spy.mockRestore()
})

test('Open another modal', async () => {
  await click(openModalButton)

  expect(modals_1.el).toBeVisible()

  modals_1.openAnother()

  await wait()

  expect(modals_1.el).not.toBeVisible()
  expect(modals_2.el).toBeVisible()

  modals_2.closeSelf()

  await wait()

  expect(modals_2.el).not.toBeVisible()
  expect(modals_1.el).toBeVisible()

  modals_1.openAnother()

  await wait()

  modals_2.closeAll()

  await wait()

  expect(modals_1.el).not.toBeVisible()
  expect(modals_2.el).not.toBeVisible()
  expect(backdropElement).not.toBeVisible()
})

test('Cancel open or close', async () => {
  cancelEvent = true

  await click(openModalButton)

  expect(modals_1.el).not.toBeVisible()
  expect(modals_2.el).not.toBeVisible()
  expect(backdropElement).not.toBeVisible()

  cancelEvent = false

  await click(openModalButton)

  cancelEvent = true

  modals_1.close()

  await wait()

  expect(modals_1.el).toBeVisible()
  expect(modals_2.el).not.toBeVisible()
  expect(backdropElement).toBeVisible()

  expect(modals_1.el).toBeVisible()
  cancelEvent = false
})
