import { ModalRepository } from './ModalRepository';
import { InstallOptions, ModalModel } from './types';
import { Backdrop } from './Backdrop';
import { MapStack } from 'mapstack';
import { BeforeCloseEvent, BeforeOpenEvent, EventData, EventType } from './event';
import { Config } from '@muku-ui/shared';

const currentOpenedModals = new MapStack<ModalModel>();

let currentOpenEventData: EventData;

let currentCloseEventData: EventData;

const defaultInstallOptions: InstallOptions = {
  backdropStyle: {},
  registerComponent: true,
  placeCenter: true,
};

class Api {
  public config: Config<InstallOptions> = new Config<InstallOptions>({}, defaultInstallOptions);

  openModal(modalName: string, eventData: EventData = {}): void {
    const modal = this.getModal(modalName);

    if (!modal) {
      return;
    }

    const event = new BeforeOpenEvent(modal, eventData);

    modal.instance.emit(EventType.BeforeOpen, event);

    if (event.cancelled()) {
      return;
    }

    currentOpenEventData = eventData;

    if (currentOpenedModals.isEmpty) {
      Backdrop.ctx.show.value = true;
      modal.ctx.show.value = true;
      currentOpenedModals.push(modalName, modal);
    } else {
      // replace current opened modal with the given one
      currentOpenedModals.last!.ctx.show.value = false;
      currentOpenedModals.push(modalName, modal);
      modal.ctx.show.value = true;
    }
  }

  closeModal(modalName: string, eventData: EventData = {}, reopenPrevModal = true) {
    const modal = this.getModal(modalName);

    if (!(currentOpenedModals.has(modalName) && modal)) {
      return;
    }

    const event = new BeforeCloseEvent(modal, eventData);

    modal.instance.emit(EventType.BeforeClose, event);

    if (event.cancelled()) {
      return;
    }

    currentCloseEventData = eventData;
    modal.ctx.show.value = false;
    currentOpenedModals.delete(modalName);

    if (currentOpenedModals.isEmpty) {
      // close all if no previously opened modals
      Backdrop.ctx.show.value = false;
    } else if (reopenPrevModal) {
      // reshow the previously closed modal
      const lastItem = currentOpenedModals.items[currentOpenedModals.length - 1];
      this.openModal(lastItem.key, lastItem.value);
    }
  }

  closeAll(eventData: EventData = {}) {
    if (currentOpenedModals.isEmpty) {
      return;
    }

    for (const item of [...currentOpenedModals.items]) {
      this.closeModal(item.key, eventData, false);
    }
  }

  getModal(modalName: string): ModalModel | undefined {
    return ModalRepository.get(modalName);
  }

  getCurrentOpenedModal(): ModalModel | undefined {
    return currentOpenedModals.last;
  }
}

export const api = new Api();
export { currentCloseEventData, currentOpenEventData };
