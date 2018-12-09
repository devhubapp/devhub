import { EventEmitter } from 'fbemitter'

import { initBugsnag } from './libs/bugsnag'

export const emitter = new EventEmitter()

export const bugsnagClient = initBugsnag('231f337f6090422c611017d3dab3d32e')
