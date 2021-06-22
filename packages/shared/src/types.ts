import { Ref, ComputedRef } from 'vue'

export type MaybeRef<T> = T | Ref<T> | ComputedRef<T>
