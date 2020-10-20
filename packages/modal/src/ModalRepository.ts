import { ModalModel } from './types';

const modals = new Map<string, ModalModel>();

const ModalRepository = {
  add(modalName: string, modal: ModalModel) {
    modals.set(modalName, modal);
  },

  remove(modalName: string): boolean {
    const modalModel = this.get(modalName);

    if (!modalModel) {
      return false;
    }

    modalModel.ctx.close();

    return modals.delete(modalName);
  },

  get(modalName: string): ModalModel | undefined {
    return modals.get(modalName);
  }
};

export { ModalRepository };
