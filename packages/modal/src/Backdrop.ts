import { BackdropModel } from './types';

export let Backdrop: BackdropModel;

export function setBackdrop(value: BackdropModel) {
  Backdrop = value;
}
