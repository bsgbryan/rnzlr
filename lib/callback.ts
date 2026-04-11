import { render as _render } from './index'
import { type JSX } from './types'

export const render = (container: Element) => (
	component: CallableFunction,
	props: object,
) => _render(component(props), container)

export const id = (selector: string, content: string) => {
	const element = document.getElementById(selector)
	if (element) element.innerHTML = content
	else console.error(`No element with id ${selector} found`)
}

export const after = (comp: JSX.Element) => Object.freeze({
	render: (fn: CallableFunction) => {
		comp.callbacks = { after: { render: fn } }
	}
})
