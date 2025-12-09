import callback from "./callback"
import * as unit_of_work from "./unit_of_work"
import work from "./work"

import { JSX } from "./types"

requestIdleCallback(work)

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const elem = typeof element.context === "function" ?
		element.context({ callbacks: { render: callback(container) }})
		:
		element

	unit_of_work.generate(elem, container)
}

export default fun
