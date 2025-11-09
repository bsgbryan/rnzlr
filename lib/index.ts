import _render from "./render"

import {
  Callbacks as _Callbacks,
  DOMTree,
} from "./types"

export const render = _render

export const Component = (init: Function) => () => ({ context: init } as DOMTree)

export type Callbacks = _Callbacks
