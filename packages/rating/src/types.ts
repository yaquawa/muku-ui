export interface Icon {
  empty: string
  full: string
}

export interface InstallOptions {
  registerComponent: boolean
  icons: Record<string, Icon>
  icon: keyof InstallOptions['icons']
}
