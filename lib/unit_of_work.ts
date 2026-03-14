import {
	root as commit_root,
	work as commit_work,
} from './commit'

import { build } from './dom'

import reconcile from './reconcile'

import {
	type Fiber,
	type JSX,
} from './types'

export const perform = (task?: Fiber) => {
	if (!task) {
		_current = _wip.shift()
		 task 	 =_current
	}

	if (task) {
		if (!task.container) task.container = build(task)

		reconcile(task)

		if (task.child) perform(task.child)

		let next: Fiber | undefined = task
		while (next) {
			if (next.sibling) perform(next.sibling)
			next = next.parent
		}
	}
}

export const generate = (
	input: 		 JSX.Element,
	container: Element,
) => {
	_wip.push({
		container,
		attributes: input.attributes,
		children: [input],
		context: input.context,
		previous: _current,
		tag: input.tag,
	})
}

const _wip: Fiber[] = []
let _current: Fiber | undefined

export const next = () => _wip.length > 0

export const commit = () => {
	if (_current) commit_root()
}

export const complete = () => {
	if (_current?.child) commit_work(_current.child)
	_current = undefined
}
