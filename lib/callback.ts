import { render as _render } from './index'

export const render = (container: Element) => (
	component: CallableFunction,
	props: object,
) => _render(component(props), container)

export const id = (selector: string, content: string) => {
	const element = document.getElementById(selector)
	if (element) element.innerHTML = content
	else console.error(`No element with id ${selector} found`)
}
