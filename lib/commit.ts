import { execute } from "./deletion"
import {
	build,
	update,
} from "./dom"
import { complete } from "./unit_of_work"

import { type Fiber } from "./types"

export const root = () => {
	execute()
	complete()
}

export const work = (fiber: Fiber) => {
	if (!fiber.container) fiber.container = build(fiber)

	if (fiber.effect === "CREATE" && fiber.parent?.container && fiber.container)
		fiber.parent.container.appendChild(fiber.container)
	else if (fiber.effect === "UPDATE" && fiber.container)
		update(fiber.container, fiber.previous?.attributes, fiber.attributes)

	if (fiber.child) work(fiber.child)
	if (fiber.sibling) work(fiber.sibling)
}
