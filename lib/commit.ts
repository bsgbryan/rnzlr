import * as deletion from "./deletion"
import dom from "./dom"
import * as unit_of_work from "./unit_of_work"

import { Fiber } from "./types"

const root = () => {
	deletion.execute()
	unit_of_work.complete()
}

const work = (fiber: Fiber) => {
	if (!fiber.container) fiber.container = dom.build(fiber)

	if (fiber.effect === "CREATE" && fiber.parent?.container && fiber.container)
		fiber.parent.container.appendChild(fiber.container)
	else if (fiber.effect === "UPDATE" && fiber.parent?.container && fiber.container)
		dom.update(fiber.container, fiber.previous?.attributes, fiber.attributes)

	if (fiber.child) work(fiber.child)
	if (fiber.sibling) work(fiber.sibling)
}

const commit = {
	root,
	work,
}

export default commit
