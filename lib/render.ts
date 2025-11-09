import { JSX } from "./types"

const generate = (input: JSX.Element, container: Element) => {
	const dom = document.createElement(input.tag as keyof HTMLElementTagNameMap)

  for (const [k, v] of Object.entries(input.attributes ?? {})) {
    if (k === 'text') dom.appendChild(document.createTextNode(v as string))
    else {
      const n = document.createAttribute(k === 'clazz' ? 'class' : k)
      if (k.startsWith('on') && typeof v === 'function')
       	dom.addEventListener(
			   	k.substring(2).toLocaleLowerCase() as keyof HTMLElementEventMap,
			   	v as EventListenerOrEventListenerObject,
			  )
      else if (typeof v === 'string') {
        n.value = v
			  dom.attributes.setNamedItem(n)
      }
    }
  }

  for (const c of input.children ?? []) fun(c, dom)

  container.appendChild(dom)
}

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	if (typeof element.context === 'function') {
		const callback = (markup: JSX.Element) => {
			fun(markup, container)
		}

		const initial = element.context({ callbacks: { render: callback }})
		
		generate(initial, container)
	}
	else if (typeof element.tag === 'string') {
    if (element.tag !== 'fragment') generate(element, container)
    else for (const c of element.children ?? []) fun(c, container)
	}
}

export default fun
