export class Config<T extends Record<string, any>> {
  public config: T

  constructor(config: Partial<T>, defaultConfig: T) {
    this.config = { ...defaultConfig, ...config }
  }

  set(config: Partial<T>): this
  set<K extends keyof T>(key: K, value: T[K]): this
  set<K extends keyof T>(keyOrConfig: Partial<T> | K, value?: T[K]): this {
    if (arguments.length === 1 && typeof keyOrConfig === 'object') {
      this.config = { ...this.config, ...keyOrConfig }
    } else if (arguments.length === 2 && typeof keyOrConfig === 'string') {
      this.config[keyOrConfig as K] = value as T[K]
    }

    return this
  }

  get(): T
  get<K extends keyof T>(key: K): T[K]
  get<K extends keyof T>(key?: K): T | T[K] {
    if (key) {
      return this.config[key]
    }

    return this.config
  }
}
