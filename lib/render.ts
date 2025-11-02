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
