import { api as modalApi } from './Api'

export let Backdrop: {
  show(): void
  close(): void
}

const backDropId = 'muku-modal-backdrop'

export function createBackdrop() {
  let backDrop = document.getElementById(backDropId)

  if (!backDrop) {
    backDrop = document.createElement('div')
    backDrop.id = backDropId
  }

  backDrop.style.display = 'none'

  setBackdrop(backDrop)

  document.body.appendChild(backDrop)
}

function setBackdrop(backDrop: HTMLElement) {
  const backdropStyle = modalApi.config.get('backdropStyle')

  Object.assign(backDrop.style, backdropStyle)

  Backdrop = {
    show() {
      const enterFromClass = `${backDropId}-enter-from`
      const enterActiveClass = `${backDropId}-enter-active`
      const enterToClass = `${backDropId}-enter-to`

      backDrop.style.display = 'block'

      backDrop.classList.add(enterFromClass)
      backDrop.classList.add(enterActiveClass)

      nextFrame(() => {
        backDrop.classList.remove(enterFromClass)
        backDrop.classList.add(enterToClass)
      })

      backDrop.addEventListener('transitionend', function onEnd(event) {
        if (event.propertyName !== 'opacity') {
          return
        }

        backDrop.classList.remove(enterActiveClass)
        backDrop.classList.remove(enterToClass)
        backDrop.removeEventListener('transitionend', onEnd)
      })
    },
    close() {
      const leaveFromClass = `${backDropId}-leave-from`
      const leaveActiveClass = `${backDropId}-leave-active`
      const leaveToClass = `${backDropId}-leave-to`

      backDrop.classList.add(leaveFromClass)
      backDrop.classList.add(leaveActiveClass)

      nextFrame(() => {
        backDrop.classList.remove(leaveFromClass)
        backDrop.classList.add(leaveToClass)
      })

      backDrop.addEventListener('transitionend', function onEnd(event) {
        if (event.propertyName !== 'opacity') {
          return
        }

        backDrop.classList.remove(leaveActiveClass)
        backDrop.classList.remove(leaveToClass)
        backDrop.style.display = 'none'
        backDrop.removeEventListener('transitionend', onEnd)
      })
    },
  }

  backDrop.addEventListener('mousedown', function (event) {
    if (event.target === backDrop) {
      close()
    }
  })

  window.addEventListener('keyup', (e) => {
    if (backDrop.style.display !== 'none' && e.code === 'Escape') {
      close()
    }
  })

  function close() {
    modalApi.closeAll({ closedBy: 'escape' })
  }
}

function nextFrame(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}
