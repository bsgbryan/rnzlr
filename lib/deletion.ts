import { type Fiber } from './types'

const fibers: Fiber[] = []

const del = (fiber: Fiber) => {
	let parent = fiber.parent
	while (!parent?.container) parent = parent?.parent

	if (fiber.container && parent.container.contains(fiber.container))
		parent.container.removeChild(fiber.container)
	else if (fiber.child) del(fiber.child)
}

export const add = (fiber: Fiber) => fibers.push(fiber)

export const execute = () => { for (const f of fibers) del(f) }
