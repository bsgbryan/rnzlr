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
		current = todo.shift()
		task 	 	=	current
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
	todo.push({
		container,
		attributes: input.attributes,
		children: [input],
		context: input.context,
		previous: current,
		tag: input.tag,
	})
}

const todo: Fiber[] = []
let current: Fiber | undefined

export const next = () => todo.length > 0

export const commit = () => {
	if (current) commit_root()
}

export const complete = () => {
	if (current?.child) commit_work(current.child)
	current = undefined
}
