import { render, id } from './callback'

import { generate as generate_unit_of_work } from './unit_of_work'

import work from './work'

import { type JSX } from './types'

requestAnimationFrame(work)

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const elem = typeof element.context === "function" ?
		element.context({ render: render(container), id })
		:
		element

	generate_unit_of_work(elem, container)
}

export default fun
