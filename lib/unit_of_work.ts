import commit from './commit'

import { build } from './dom'
import { execute as execute_deletion } from './deletion'
import reconcile from './reconcile'

import {
	type Fiber,
	type JSX,
} from './types'

export const perform = (task?: Fiber) => {
	const is_root = !task

	if (!task) task = todo.shift()

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

	if (is_root && task) {
		execute_deletion()

		if (task?.child) commit(task.child)
	}
}

const todo: Fiber[] = []

export const generate = (
	input: 		 JSX.Element,
	container: Element,
) => {
	todo.push({
		container,
		attributes: input.attributes,
		children: [input],
		context: input.context,
		tag: input.tag,
	})
}

export const next = () => todo.length > 0
