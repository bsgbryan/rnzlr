import { execute as execute_deletion } from './deletion'

import {
	build  as build_dom,
	update as update_dom,
} from './dom'

import { complete as complete_work } from './unit_of_work'

import { type Fiber } from './types'

export const root = () => {
	execute_deletion()
	complete_work()
}

export const work = (fiber: Fiber) => {
	if (!fiber.container) fiber.container = build_dom(fiber)

	if (fiber.effect === "CREATE" && fiber.parent?.container && fiber.container)
		fiber.parent.container.appendChild(fiber.container)
	else if (fiber.effect === "UPDATE" && fiber.container)
		update_dom(fiber.container, fiber.previous?.attributes, fiber.attributes)

	if (fiber.child) work(fiber.child)
	if (fiber.sibling) work(fiber.sibling)
}
