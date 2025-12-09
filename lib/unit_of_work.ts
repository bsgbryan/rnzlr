import comit from "./commit"
import dom from "./dom"
import reconcile from "./reconcile"

import {
	Fiber,
	JSX,
} from "./types"

export const perform = () => {
	if (_next) {
		if (!_next.container) _next.container = dom.build(_next)

		reconcile(_next)

		if (_next.child) {
			_next = _next.child
			return
		}

		let next: Fiber | undefined = _next
		while (next) {
			if (next.sibling) {
				_next = next.sibling
				return
			}

			next = next.parent
		}

		_next = undefined
	}
}

export const generate = (
	input: 		 JSX.Element,
	container: Element,
) => {
	_wip = {
		container,
		attributes: input.attributes,
		children: [input],
		context: input.context,
		previous: _current,
		tag: input.tag,
	}

	_next = _wip
}

let _next: Fiber | undefined
let _wip: Fiber | undefined
let _current: Fiber | undefined

export const next = () => _next
export const root = () => _wip
export const commit = () => { if (!_next && _wip) comit.root() }
export const complete = () => {
	if (_wip?.child) {
		comit.work(_wip.child)
		_current = _wip
		_wip = undefined
	}
}
