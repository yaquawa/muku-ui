import { InstallOptions } from './types'
import { Config } from '@muku-ui/shared'

const defaultInstallOptions: InstallOptions = {
  registerComponent: true,
  zIndex: 1,
}

class Api {
  public config: Config<InstallOptions> = new Config<InstallOptions>({}, defaultInstallOptions)
}

export const api = new Api()
