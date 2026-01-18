import callback from './callback'

import { generate as generate_unit_of_work } from './unit_of_work'

import work from './work'

import { type JSX } from './types'

if (typeof requestIdleCallback !== 'undefined')
	requestIdleCallback(work)

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	const elem = typeof element.context === "function" ?
		element.context({ render: callback(container) })
		:
		element

	generate_unit_of_work(elem, container)
}

export default fun
