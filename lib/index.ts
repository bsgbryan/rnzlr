import _render from "./render"

import {
  type Callbacks as _Callbacks,
  type DOMTree,
} from "./types"

export const render = _render

export const Component = (init: Function) => () => ({ context: init } as DOMTree)

export type Callbacks = _Callbacks
