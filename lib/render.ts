import { after, id, render } from './callback'

import { generate as generate_unit_of_work } from './unit_of_work'

import work from './work'

import { type JSX } from './types'

requestAnimationFrame(work)

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const callbacks = {
		after,
		id,
		render: render(container),
	}

	const elem = typeof element.context === "function" ?
		element.context(callbacks)
		:
		element

	generate_unit_of_work(elem, container)
}

export default fun
