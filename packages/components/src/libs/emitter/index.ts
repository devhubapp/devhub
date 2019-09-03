import { EventEmitter, EventSubscription } from 'fbemitter'

export type EventEmitter = EventEmitter
export type EventSubscription = EventSubscription

export interface EmitterTypes {
  FOCUS_ON_COLUMN: {
    animated?: boolean
    columnId: string
    focusOnVisibleItem?: boolean
    highlight?: boolean
    scrollTo?: boolean
  }
  FOCUS_ON_PREVIOUS_COLUMN: {
    animated?: boolean
    focusOnVisibleItem?: boolean
    highlight?: boolean
    scrollTo?: boolean
  }
  FOCUS_ON_NEXT_COLUMN: {
    animated?: boolean
    focusOnVisibleItem?: boolean
    highlight?: boolean
    scrollTo?: boolean
  }
  FOCUS_ON_COLUMN_ITEM: {
    columnId: string
    itemId: string | number | null
    scrollTo?: boolean
  }
  PRESSED_KEYBOARD_SHORTCUT: { keys: string[] }
  SCROLL_DOWN_COLUMN: { columnId: string; columnIndex: number }
  SCROLL_UP_COLUMN: { columnId: string; columnIndex: number }
  TOGGLE_COLUMN_FILTERS: { columnId: string }
}

const _emitter = new EventEmitter()

export const emitter = {
  addListener<K extends keyof EmitterTypes>(
    key: K,
    listener: (payload: EmitterTypes[K]) => void,
  ) {
    return _emitter.addListener(key, listener)
  },
  emit<K extends keyof EmitterTypes>(key: K, payload: EmitterTypes[K]) {
    if (__DEV__) console.debug('[EMITTER]', key, payload) // tslint:disable-line no-console
    _emitter.emit(key, payload)
  },
}
