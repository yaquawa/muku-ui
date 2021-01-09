import { ComponentInternalInstance, Ref } from 'vue'

export interface InstallOptions {
  backdropStyle: Record<string, any>
  registerComponent: boolean
  placeCenter: boolean
}

export interface Model<Instance extends ComponentInternalInstance, Context extends Record<string, any>> {
  instance: Instance
  ctx: Context
}

// Modal Interfaces
export interface ModalProps {
  [key: string]: unknown

  name: string
}

export interface ModalComponentInternalInstance extends ComponentInternalInstance {
  props: ModalProps
}

export interface ModalContext {
  show: Ref<boolean>

  close(): void

  open(modalName: string): void
}

export type ModalModel = Model<ModalComponentInternalInstance, ModalContext>

// Backdrop Interfaces
export interface BackdropProps {
  [key: string]: unknown
}

export interface BackdropComponentInternalInstance extends ComponentInternalInstance {
  props: BackdropProps
}

export interface BackdropContext {
  show: Ref<boolean>

  close(): void
}

export type BackdropModel = Model<BackdropComponentInternalInstance, BackdropContext>
