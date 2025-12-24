import { type Fiber } from './types'

let fibers: Fiber[] = []

/**
 * Deletes the specified Fiber, finding the parent to use as a container first
 *
 * @remarks
 * If no parent can be found, this function will result in an infinite loop;
 * and, eventually, a stack overflow
 *
 * @param fiber The Fiber to delete
 */
const del = (fiber: Fiber) => {
	let parent = fiber.parent
	while (!parent?.container) parent = parent?.parent

	if (fiber.container && parent.container.contains(fiber.container))
		parent.container.removeChild(fiber.container)
	else if (fiber.child) del(fiber.child)
}

/**
 * Returns a read-only copy of the fibers to be deleted
 */
export const get = () => Object.freeze(Object.assign([], fibers))

/**
 * Adds the specified fiber to the list of fibes to delete
 */
export const add = (fiber: Fiber) => fibers.push(fiber)

/**
 * Delete all fibers marked for deletion
 */
export const execute = () => {
	for (const f of Object.assign([], fibers)) del(f)
	
	fibers = []
}
