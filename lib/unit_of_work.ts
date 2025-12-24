import {
	root as commit_root,
	work as commit_work,
} from "./commit"
import { build } from "./dom"
import reconcile from "./reconcile"

import {
	type Fiber,
	type JSX,
} from "./types"

export const perform = () => {
	if (_next) {
		if (!_next.container) _next.container = build(_next)

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
export const commit = () => { if (!_next && _wip) commit_root() }
export const complete = () => {
	if (_wip?.child) {
		commit_work(_wip.child)
		_current = _wip
		_wip = undefined
	}
}
