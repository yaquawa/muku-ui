import { BasePlacement, Modifier, ModifierArguments } from '@popperjs/core'

export interface Options {
  offset: number
}

const placementReverseMap = {
  top: '0 0 n 0',
  bottom: 'n 0 0 0',
  left: '0 n 0 0',
  right: '0 0 0 n',
}

function offsetByPaddingFn({ state, options }: ModifierArguments<Options>) {
  if (!options.offset) {
    return
  }

  const basePlacement = state.placement.split('-')[0] as BasePlacement
  const padding = placementReverseMap[basePlacement].replace('n', `${options.offset}px`)

  if (!state.styles.popper) {
    state.styles.popper = {}
  }

  Object.assign(state.styles.popper, { padding })
}

export const offsetByPadding: Modifier<'offsetByPadding', Options> = {
  name: 'offsetByPadding',
  enabled: true,
  phase: 'main',
  fn: offsetByPaddingFn,
  requires: ['applyStyles'],
}
