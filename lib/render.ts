import { JSX } from "./types"

const fun = (
  element: JSX.Element,
  container: Element,
) => {
	if (typeof element.tag === 'string') {
    if (element.tag !== 'fragment') {
      const dom = document.createElement(element.tag)
  
      for (const [k, v] of Object.entries(element.attributes ?? {})) {
        if (k === 'text') dom.appendChild(document.createTextNode(v as string))
        else {
          const n = document.createAttribute(k === 'clazz' ? 'class' : k)
          n.value = v
          dom.attributes.setNamedItem(n)
        }
      }

      for (const c of element.children ?? []) fun(c, dom)
  
      container.appendChild(dom)
    }
    else for (const c of element.children ?? []) fun(c, container)
	}
	else if (typeof element.context === 'function') {
		const callback = (markup: JSX.Element) => {
			fun(markup, container)
		}

		element.context({ callbacks: { render: callback }})
	}
}

export default fun
