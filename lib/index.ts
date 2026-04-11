import { type JSX } from "@bsgbryan/rnzlr/jsx-runtime"
import _render from "./render"
import type { Callbacks } from "./types"

export type { Callbacks } from "./types"

export const render = _render

type Init = (callbacks: Callbacks) => JSX.Element

export default (init: Init) => () => ({
	attributes: {},
	callbacks: {
		after: {}
	},
	context: init,
})
