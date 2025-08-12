import render from './render'

import {
  Callbacks as _Callbacks,
  DOMTree,
} from './types'

export default render

export const Component = (init: Function) =>
  (args: unknown) => {
    const result = init(args)

    return typeof result === 'function' ?
      {} as DOMTree
      :
      result
  }

export type Callbacks = _Callbacks
