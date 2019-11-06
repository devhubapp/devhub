import { EventEmitter, EventSubscription } from 'fbemitter'

export { EventEmitter, EventSubscription }

export interface EmitterTypes {
  DEEP_LINK: {
    url: string
  }
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
    itemNodeIdOrId: string | null | undefined
    scrollTo?: boolean
  }
  PRESSED_KEYBOARD_SHORTCUT: { keys: string[] }
  SCROLL_DOWN_COLUMN: { columnId: string; columnIndex: number }
  SCROLL_TOP_COLUMN: { columnId: string }
  SCROLL_UP_COLUMN: { columnId: string; columnIndex: number }
  SET_LAST_INPUT_TYPE: { type: 'keyboard' | 'mouse' | undefined }
  TOGGLE_COLUMN_FILTERS: { columnId: string; isOpen?: boolean }
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
    // if (__DEV__) console.debug('[EMITTER]', key, payload) // tslint:disable-line no-console
    _emitter.emit(key, payload)
  },
}
