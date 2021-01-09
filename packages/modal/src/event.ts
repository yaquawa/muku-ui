import { ModalModel } from './types'

export interface ModalEvent {
  type: string
  modal: ModalModel
}

export type EventData = Record<string, any>

export enum EventType {
  BeforeClose = 'before-close',
  AfterClose = 'after-close',
  BeforeOpen = 'before-open',
  AfterOpen = 'after-open',
}

export class Event {
  type: string

  constructor(type: string, data: Record<string, any> = {}) {
    this.type = type

    for (const key in data) {
      ;(this as any)[key] = data[key]
    }
  }
}

export class CancelableEvent extends Event {
  _cancelled = false

  cancel() {
    this._cancelled = true
  }

  cancelled(): boolean {
    return this._cancelled
  }
}

export class BeforeCloseEvent extends CancelableEvent implements ModalEvent {
  constructor(public modal: ModalModel, data: EventData = {}) {
    super('before-close', data)
  }
}

export class AfterCloseEvent extends Event implements ModalEvent {
  constructor(public modal: ModalModel, data: EventData = {}) {
    super('after-close', data)
  }
}

export class BeforeOpenEvent extends CancelableEvent implements ModalEvent {
  constructor(public modal: ModalModel, data: EventData = {}) {
    super('before-open', data)
  }
}

export class AfterOpenEvent extends Event implements ModalEvent {
  constructor(public modal: ModalModel, data: EventData = {}) {
    super('after-open', data)
  }
}
