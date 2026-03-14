import { execute as execute_deletion } from './deletion'

import {
	build  as build_dom,
	update as update_dom,
} from './dom'

import { type Fiber } from './types'

const fun = (fiber: Fiber) => {
	if (!fiber.container) fiber.container = build_dom(fiber)

	if (fiber.effect === "CREATE" && fiber.parent?.container && fiber.container)
		fiber.parent.container.appendChild(fiber.container)
	else if (fiber.effect === "UPDATE" && fiber.container)
		update_dom(fiber.container, fiber.previous?.attributes, fiber.attributes)

	if (fiber.child) fun(fiber.child)
	if (fiber.sibling) fun(fiber.sibling)
}

export default fun
